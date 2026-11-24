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
    img.src = a.href; img.alt = thumb ? thumb.alt : "";
    const caption = a.parentElement.querySelector("p, figcaption p");
    cap.textContent = caption ? caption.textContent.trim() : "";
    cap.hidden = !cap.textContent;
    document.documentElement.classList.add("lb-open");
    dlg.showModal();
    dlg.querySelector(".lb-close").focus();
  }));
  dlg.querySelector(".lb-close").addEventListener("click", close);
  dlg.addEventListener("click", e => { if (e.target === dlg || e.target === img) close(); });
  dlg.addEventListener("close", () => { document.documentElement.classList.remove("lb-open"); img.removeAttribute("src"); });
})();
