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
