(() => {
  const out = [], W = document.documentElement.clientWidth;
  if (document.documentElement.scrollWidth > W + 1) out.push(`page scrolls sideways (${document.documentElement.scrollWidth} > ${W})`);
  for (const el of document.querySelectorAll("body *")) {
    if (el.closest(".sr-only, .y2k-marquee span, dialog, script, [hidden], .sparkle")) continue;
    const cs = getComputedStyle(el); if (cs.display === "none" || cs.visibility === "hidden" || cs.position === "fixed") continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    if (r.right > W + 2 || r.left < -2) out.push(`off-screen: <${el.tagName.toLowerCase()} class="${(el.className.baseVal ?? el.className).slice(0,40)}"> ${Math.round(r.left)}–${Math.round(r.right)} "${el.textContent.trim().slice(0,30)}"`);
    else if (el.scrollWidth > el.clientWidth + 2 && cs.overflowX !== "visible" && !["auto","scroll"].includes(cs.overflowX) && !el.matches(".y2k-marquee")) out.push(`clipped: <${el.tagName.toLowerCase()} class="${String(el.className).slice(0,40)}">`);
  }
  for (const el of document.querySelectorAll("a[href], button, input, textarea")) {
    if (el.closest(".sr-only, [hidden]") || el.type === "hidden" || el.name === "_honey") continue;
    const r = el.getBoundingClientRect(); if (!r.width) continue;
    const inline = getComputedStyle(el).display === "inline" && el.closest("p, dd, li, figcaption");
    if (!inline && (r.width < 24 || r.height < 24)) out.push(`small target ${Math.round(r.width)}×${Math.round(r.height)}: "${(el.textContent || el.getAttribute('aria-label') || el.name).trim().slice(0,30)}"`);
  }
  return [...new Set(out)];
})()
