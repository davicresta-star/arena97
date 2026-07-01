/* lightbox.js â€” visualizzatore foto a schermo intero */
import { pad, phHTML } from "./core.js?v=79";

const lightbox = document.getElementById("lightbox");
const lbMedia = document.getElementById("lbMedia");
const lbName = document.getElementById("lbName");
const lbRole = document.getElementById("lbRole");
const lbCount = document.getElementById("lbCount");
const lbTags = document.getElementById("lbTags");
let lbItems = [];
let lbIndex = 0;

function renderLightbox() {
  const item = lbItems[lbIndex];
  lbMedia.style.aspectRatio = item.ratio || "3 / 4";
  lbMedia.innerHTML = item.src
    ? `<img src="${item.src}" alt="${item.title}">`
    : phHTML(item.ph.variant, item.ph.init, item.ph.num);
  lbName.textContent = item.title;
  lbRole.textContent = item.sub;
  lbCount.textContent = `${pad(lbIndex + 1)} / ${pad(lbItems.length)}`;
  lbTags.innerHTML = (item.tags || []).map(t => `<span>${t}</span>`).join("");
}

export function openLightbox(items, index = 0) {
  lbItems = items;
  lbIndex = Math.min(Math.max(index, 0), items.length - 1);
  renderLightbox();
  lightbox.hidden = false;
  requestAnimationFrame(() => lightbox.classList.add("is-open"));
  document.body.style.overflow = "hidden";
}

export function closeLightbox() {
  lightbox.classList.remove("is-open");
  document.body.style.overflow = "";
  setTimeout(() => { lightbox.hidden = true; }, 300);
}

export function stepLightbox(dir) {
  lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
  renderLightbox();
}

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", () => stepLightbox(-1));
document.getElementById("lbNext").addEventListener("click", () => stepLightbox(1));
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener("keydown", e => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") stepLightbox(-1);
  if (e.key === "ArrowRight") stepLightbox(1);
});
