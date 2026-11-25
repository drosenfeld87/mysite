/* =====================================================================
   Debbie Rosenfeld — site script (loaded with defer on every page)
     1. Sticky header
     2. Now / Y2K switch (remembered between pages)
     3. Image viewer
     4. Prototype videos
     5. Headline weight swap (home page)
     6. Y2K extras: sparkle trail, banner pause button
   ===================================================================== */

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* 1. Sticky header: slides away while scrolling down, returns when scrolling up */
(() => {
  const bar = document.querySelector(".masthead");
  if (!bar) return;
  let lastY = scrollY, ticking = false;
  const update = () => {
    const y = scrollY, h = bar.offsetHeight;
    bar.classList.toggle("is-floating", y > h);
    if (y > lastY && y > h * 2) bar.classList.add("is-hidden");            // scrolling down, past the top
    else if (y < lastY - 4 || y <= h) bar.classList.remove("is-hidden");    // scrolling up, or near the top
    lastY = y; ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  bar.addEventListener("focusin", () => bar.classList.remove("is-hidden")); // keyboard users always get the menu back
})();

/* 2. Remembered switch: a button group that sets a class on <html> and is remembered between pages */
function rememberedSwitch({ selector, key, values, onChange }) {
  const buttons = document.querySelectorAll(selector);
  if (!buttons.length) return;
  const set = value => {
    buttons.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.value === value)));
    onChange(value);
    try { localStorage.setItem(key, value); } catch {}
  };
  let saved = values[0];
  try { if (values.includes(localStorage.getItem(key))) saved = localStorage.getItem(key); } catch {}
  set(saved);
  buttons.forEach(b => b.addEventListener("click", () => set(b.dataset.value)));
}

// Now / Y2K: Y2K turns the site into a 2002 personal homepage (styles: tailwind.css, section 5)
rememberedSwitch({
  selector: ".era-switch [data-value]", key: "era", values: ["now", "y2k"],
  onChange: v => document.documentElement.classList.toggle("y2k", v === "y2k"),
});

/* 3. Image viewer: links with class="zoom" open the full image in a dialog.
   Close with ×, Esc, or a click outside the image. Tall screenshots open at readable size and scroll. */
(() => {
  const links = document.querySelectorAll("a.zoom");
  if (!links.length || typeof HTMLDialogElement !== "function") return;
  const dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.setAttribute("aria-label", "Image viewer");
  dlg.innerHTML = '<button type="button" class="lb-close" aria-label="Close image">&times;</button><img alt=""><p class="lb-cap"></p>';
  document.body.append(dlg);
  const img = dlg.querySelector("img"), cap = dlg.querySelector(".lb-cap"), closeBtn = dlg.querySelector(".lb-close");
  img.addEventListener("load", () => {
    // Too tall to read when fitted to the screen: switch to the scrolling view
    const fit = Math.min(1, (innerHeight - 140) / img.naturalHeight, (innerWidth - 48) / img.naturalWidth);
    dlg.classList.toggle("lb-tall", fit * img.naturalWidth < Math.min(img.naturalWidth, innerWidth - 48) * 0.6);
  });
  links.forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    dlg.classList.remove("lb-tall"); dlg.scrollTop = 0;
    img.src = a.href; img.alt = a.querySelector("img")?.alt || "";
    cap.textContent = a.parentElement.querySelector("p, figcaption p")?.textContent.trim() || "";
    cap.hidden = !cap.textContent;
    document.documentElement.classList.add("lb-open");
    dlg.showModal();
    closeBtn.focus();
  }));
  closeBtn.addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", e => { if (e.target === dlg || (e.target === img && !dlg.classList.contains("lb-tall"))) dlg.close(); });
  dlg.addEventListener("close", () => { document.documentElement.classList.remove("lb-open"); img.removeAttribute("src"); });
})();

/* 4. Prototype videos: play while on screen; never autoplay with "reduce motion". A pause the visitor chose sticks. */
(() => {
  const vids = document.querySelectorAll("video[data-autoplay]");
  if (!vids.length || reduceMotion || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(entries => entries.forEach(({ target: v, isIntersecting }) => {
    if (isIntersecting) { if (!v.dataset.userPaused) v.play().catch(() => {}); }
    else if (!v.paused) { v.dataset.autoPausing = "1"; v.pause(); }
  }), { threshold: 0.5 });
  vids.forEach(v => {
    v.addEventListener("pause", () => { if (v.dataset.autoPausing) delete v.dataset.autoPausing; else v.dataset.userPaused = "1"; });
    v.addEventListener("play", () => delete v.dataset.userPaused);
    io.observe(v);
  });
})();

/* 5. Headline weight swap: near the pointer, heavy letters go light and light letters go heavy.
   Each letter keeps a fixed width, so the line never shifts; positions are measured once, not on every move. */
(() => {
  const h1 = document.querySelector("h1[data-swap]");
  if (!h1 || reduceMotion || !matchMedia("(hover: hover)").matches) return;
  const WEIGHTS = [300, 500, 800];  // Barlow Condensed weights loaded in the page head
  const letters = [];
  h1.querySelectorAll("[data-weight]").forEach(part => {
    const weight = +part.dataset.weight;
    part.innerHTML = [...part.textContent].map(c => `<span class="ch">${c === " " ? "&nbsp;" : c}</span>`).join("");
    part.querySelectorAll(".ch").forEach(el => letters.push({ el, weight, x: 0, y: 0 }));
  });
  const measure = () => letters.forEach(l => {
    l.el.style.width = "";
    const r = l.el.getBoundingClientRect();
    l.el.style.width = r.width + "px";
    l.x = r.left + r.width / 2 + scrollX; l.y = r.top + r.height / 2 + scrollY;
  });
  document.fonts.ready.then(measure);
  addEventListener("resize", measure);
  let frame = 0, px = 0, py = 0;
  const paint = () => {
    frame = 0;
    for (const l of letters) {
      const k = Math.max(0, 1 - Math.hypot(px - l.x, py - l.y) / 240);     // 1 under the pointer, 0 far away
      const w = l.weight + ((l.weight === 800 ? 300 : 800) - l.weight) * k;
      l.el.style.fontWeight = k ? String(WEIGHTS.reduce((a, b) => Math.abs(b - w) < Math.abs(a - w) ? b : a)) : "";  // snap to a loaded weight
    }
  };
  h1.addEventListener("pointermove", e => {
    if (document.documentElement.classList.contains("y2k")) return;
    px = e.pageX; py = e.pageY;
    if (!frame) frame = requestAnimationFrame(paint);
  });
  h1.addEventListener("pointerleave", () => { px = py = -1e4; if (!frame) frame = requestAnimationFrame(paint); });
})();

/* 6. Y2K extras: a sparkle trail (a small reused pool of elements) and a pause button for the scrolling banner */
(() => {
  const root = document.documentElement;
  if (!reduceMotion) {
    let pool = null, i = 0, last = 0;
    addEventListener("pointermove", e => {
      if (!root.classList.contains("y2k") || e.pointerType === "touch") return;
      const now = performance.now(); if (now - last < 50) return; last = now;
      pool ??= Array.from({ length: 14 }, () => {  // created the first time it's needed, then reused
        const s = document.createElement("span");
        s.className = "sparkle"; s.setAttribute("aria-hidden", "true"); s.textContent = "\u2726";
        document.body.append(s); return s;
      });
      const s = pool[i++ % pool.length];
      s.style.left = e.clientX + 6 + "px"; s.style.top = e.clientY + 6 + "px";
      s.classList.remove("on"); void s.offsetWidth; s.classList.add("on");  // restart the animation
    }, { passive: true });
  }
  const pause = document.querySelector(".y2k-marquee button");
  pause?.addEventListener("click", () => {
    const paused = pause.getAttribute("aria-pressed") === "true";
    pause.setAttribute("aria-pressed", String(!paused));
    pause.closest(".y2k-marquee").classList.toggle("paused", !paused);
  });
})();
