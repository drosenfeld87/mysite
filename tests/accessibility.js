(() => {
  const issues = [];
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 }; };
  const lum = ({ r, g, b }) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
  const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const bodyBg = parse(getComputedStyle(document.body).backgroundColor);
  const bgOf = el => { const layers = []; for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.backgroundImage.includes("gradient") && e !== document.body && !cs.backgroundClip.includes("text")) return "gradient"; const c = parse(cs.backgroundColor); if (c && c.a > 0) { layers.push(c); if (c.a === 1) break; } } let bg = bodyBg; for (const l of layers.reverse()) bg = blend(l, bg); return bg; };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const t = walker.currentNode; if (!t.textContent.trim()) continue;
    const el = t.parentElement; if (seen.has(el)) continue; seen.add(el);
    if (el.closest('[aria-hidden="true"], .sr-only, script, style, [hidden]') ) continue;
    const cs = getComputedStyle(el); if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0) continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    let fg = parse(cs.color); if (!fg) continue;
    if (fg.a === 0 || cs.webkitTextFillColor === "rgba(0, 0, 0, 0)") continue; // gradient-clipped headline text, checked separately
    const bg = bgOf(el); if (bg === "gradient") continue;
    fg = blend(fg, bg);
    const L1 = lum(fg), L2 = lum(bg), ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
    const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
    const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
    if (ratio < need) issues.push(`contrast ${ratio.toFixed(2)} < ${need}: "${t.textContent.trim().slice(0, 40)}" (${cs.color} on rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)}))`);
  }
  document.querySelectorAll("img").forEach(i => { if (!i.hasAttribute("alt") && !i.closest("dialog")) issues.push("img without alt: " + i.src.split("/").pop()); });
  document.querySelectorAll("button, a[href]").forEach(b => { if (b.closest("[hidden]")) return; const name = (b.getAttribute("aria-label") || b.textContent).trim(); if (!name && !b.querySelector("img[alt]:not([alt=''])")) issues.push("unnamed " + b.tagName + " " + (b.className || b.href)); });
  document.querySelectorAll("input:not([type=hidden]), textarea, select").forEach(i => { if (i.name === "_honey") return; if (!i.labels?.length && !i.getAttribute("aria-label")) issues.push("unlabelled field " + i.name); });
  let prev = 0; document.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(h => { const l = +h.tagName[1]; if (prev && l > prev + 1) issues.push(`heading jump h${prev} -> h${l}: ${h.textContent.trim().slice(0, 30)}`); prev = l; });
  if (document.querySelectorAll("h1").length !== 1) issues.push("h1 count " + document.querySelectorAll("h1").length);
  const ids = {}; document.querySelectorAll("[id]").forEach(e => ids[e.id] = (ids[e.id] || 0) + 1); Object.entries(ids).forEach(([k, v]) => v > 1 && issues.push("duplicate id " + k));
  if (document.documentElement.scrollWidth > innerWidth) issues.push("horizontal scroll");
  if (!document.documentElement.lang) issues.push("no lang");
  return issues;
})()
