/* hero.js â€” sfondo foto B/N a tutto schermo con crossfade leggero */
const heroBg = document.getElementById("heroBg");
let heroBgTimer = null;

export function initHero(slides) {
  if (heroBgTimer) { clearInterval(heroBgTimer); heroBgTimer = null; }
  if (!heroBg || !slides || !slides.length) return;

  heroBg.innerHTML = '<div class="hero__layer"></div><div class="hero__layer"></div>';
  const layers = heroBg.querySelectorAll(".hero__layer");
  let cur = 0, idx = 0;
  layers[0].style.backgroundImage = `url("${slides[0]}")`;
  layers[0].classList.add("is-on");

  if (slides.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  heroBgTimer = setInterval(() => {
    idx = (idx + 1) % slides.length;
    const off = layers[(cur + 1) % 2];
    off.style.backgroundImage = `url("${slides[idx]}")`;
    off.classList.add("is-on");
    layers[cur].classList.remove("is-on");
    cur = (cur + 1) % 2;
  }, 4800);
}
