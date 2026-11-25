// Sticky masthead: slides away while scrolling down, returns when scrolling up.
(() => {
  const bar = document.querySelector(".masthead");
  if (!bar) return;
  let lastY = window.scrollY, ticking = false;
  const update = () => {
    const y = window.scrollY, h = bar.offsetHeight;
    bar.classList.toggle("is-floating", y > h);
    if (y > lastY && y > h * 2) bar.classList.add("is-hidden");      // scrolling down, past the top
    else if (y < lastY - 4 || y <= h) bar.classList.remove("is-hidden"); // scrolling up (or near the top)
    lastY = y; ticking = false;
  };
  window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  // Keyboard users always get the menu back when they tab into it
  bar.addEventListener("focusin", () => bar.classList.remove("is-hidden"));
})();

// Image viewer: opens full-size images in the page; close with ×, Esc, or a click outside the image.
(() => {
  const links = document.querySelectorAll("a.zoom");
  if (!links.length || typeof HTMLDialogElement !== "function") return;
  const dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.setAttribute("aria-label", "Image viewer");
  dlg.innerHTML = '<button type="button" class="lb-close" aria-label="Close image">&times;</button><img alt=""><p class="lb-cap"></p>';
  document.body.append(dlg);
  const img = dlg.querySelector("img"), cap = dlg.querySelector(".lb-cap");
  const close = () => dlg.close();
  links.forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    const thumb = a.querySelector("img");
    dlg.classList.remove("lb-tall"); dlg.scrollTop = 0;
    img.onload = () => {
      // Taller than the screen can show legibly: switch to a scrolling view
      const fitScale = Math.min(1, (innerHeight - 140) / img.naturalHeight, (innerWidth - 48) / img.naturalWidth);
      dlg.classList.toggle("lb-tall", fitScale * img.naturalWidth < Math.min(img.naturalWidth, innerWidth - 48) * 0.6);
    };
    img.src = a.href; img.alt = thumb ? thumb.alt : "";
    const caption = a.parentElement.querySelector("p, figcaption p");
    cap.textContent = caption ? caption.textContent.trim() : "";
    cap.hidden = !cap.textContent;
    document.documentElement.classList.add("lb-open");
    dlg.showModal();
    dlg.querySelector(".lb-close").focus();
  }));
  dlg.querySelector(".lb-close").addEventListener("click", close);
  dlg.addEventListener("click", e => { if (e.target === dlg || (e.target === img && !dlg.classList.contains("lb-tall"))) close(); });
  dlg.addEventListener("close", () => { document.documentElement.classList.remove("lb-open"); img.removeAttribute("src"); });
})();

/* Prototype videos: play while on screen, never for reduced-motion users */
(() => {
  const vids = document.querySelectorAll("video[data-autoplay]");
  if (!vids.length || !("IntersectionObserver" in window)) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { if (!v.dataset.userPaused) v.play().catch(() => {}); }
    else if (!v.paused) { v.dataset.autoPausing = "1"; v.pause(); }
  }), { threshold: 0.5 });
  vids.forEach(v => {
    // A pause the visitor chose sticks; pauses from scrolling away don't
    v.addEventListener("pause", () => { if (v.dataset.autoPausing) delete v.dataset.autoPausing; else v.dataset.userPaused = "1"; });
    v.addEventListener("play", () => { delete v.dataset.userPaused; });
    io.observe(v);
  });
})();

/* Design / Code switch: Code view shows each labelled element's Tailwind classes,
   the column grid and redlines. The choice is remembered between pages. */
(() => {
  const buttons = document.querySelectorAll(".view-switch [data-view]");
  if (!buttons.length) return;
  const set = view => {
    document.documentElement.classList.toggle("spec", view === "code");
    buttons.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.view === view)));
    try { localStorage.setItem("view", view); } catch {}
  };
  let saved = "design";
  try { saved = localStorage.getItem("view") || "design"; } catch {}
  set(saved);
  buttons.forEach(b => b.addEventListener("click", () => set(b.dataset.view)));
})();

/* Now / Y2K switch: Y2K turns the site into a 2002 personal homepage (styles in tailwind.css, section 5).
   Remembered between pages. Adds a sparkle trail to the cursor unless "reduce motion" is on. */
(() => {
  const buttons = document.querySelectorAll(".era-switch [data-era]");
  if (!buttons.length) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let last = 0;
  const sparkle = e => {
    const now = performance.now(); if (now - last < 45) return; last = now;
    const s = document.createElement("span"); s.className = "sparkle"; s.textContent = Math.random() > .5 ? "✦" : "✧";
    s.setAttribute("aria-hidden", "true"); s.style.left = e.clientX + 6 + "px"; s.style.top = e.clientY + 6 + "px";
    document.body.append(s); setTimeout(() => s.remove(), 800);
  };
  const set = era => {
    const y2k = era === "y2k";
    document.documentElement.classList.toggle("y2k", y2k);
    buttons.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.era === era)));
    if (!reduce) (y2k ? addEventListener : removeEventListener)("pointermove", sparkle);
    try { localStorage.setItem("era", era); } catch {}
  };
  let saved = "now";
  try { saved = localStorage.getItem("era") || "now"; } catch {}
  set(saved);
  buttons.forEach(b => b.addEventListener("click", () => set(b.dataset.era)));
})();
