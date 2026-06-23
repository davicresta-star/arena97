/* ui.js â€” menu DogPound, nav scrolled, reveal-on-scroll, drag-to-scroll */

/* â”€â”€ Menu DogPound con foto singola (no doppioni) â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const burger    = document.getElementById("burger");
const menu      = document.getElementById("menu");
const menuClose = document.getElementById("menuClose");
const menuPhoto  = document.getElementById("menuPhoto");
const menuPhotoA = document.getElementById("menuPhotoA");
const menuPhotoB = document.getElementById("menuPhotoB");

// Una sola immagine in scena: B resta sempre nascosta
if (menuPhotoB) menuPhotoB.style.display = "none";
const photoEl = menuPhotoA;

// Stato hover con debounce
let hoverTimer = null;
let currentSrc = null;
const HOVER_DELAY = 110; // ms di attesa prima di mostrare la foto

// Anti-cache: valore fisso per ogni caricamento pagina. Così quando sostituisci
// una foto del menu (stesso nome) e ricarichi, il browser scarica quella nuova
// invece di riproporre la vecchia dalla memoria.
const PHOTO_CB = Date.now();
const bust = src => src + (src.includes("?") ? "&" : "?") + "cb=" + PHOTO_CB;

function preloadMenuPhotos() {
  menu.querySelectorAll(".menu__links [data-photo]").forEach(a => {
    if (a.dataset.photo) new Image().src = bust(a.dataset.photo);
  });
}

function hidePhotoInstant() {
  photoEl.style.transition = "none";
  photoEl.classList.remove("is-active");
  // forza il reflow cosÃ¬ l'opacitÃ  va a 0 prima del prossimo fade-in
  void photoEl.offsetWidth;
}

export function setMenu(open) {
  if (open) {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add("is-open"));
    preloadMenuPhotos();
  } else {
    menu.classList.remove("is-open");
    clearTimeout(hoverTimer);
    currentSrc = null;
    hidePhotoInstant();
    menuPhoto.className = "menu__photo";
    setTimeout(() => { menu.hidden = true; }, 350);
  }
  document.body.classList.toggle("menu-open", open);
  burger.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
}

burger.addEventListener("click", () => setMenu(true));
menuClose.addEventListener("click", () => setMenu(false));
document.addEventListener("keydown", e => {
  if (!menu.hidden && e.key === "Escape") setMenu(false);
});

// Una sola foto + debounce: l'immagine parte solo quando il cursore si ferma
// su una voce, cosÃ¬ attraversando velocemente i link non lampeggiano foto.
function showPhoto(src, side) {
  if (src === currentSrc) return; // giÃ  in scena: nessun re-fade inutile
  currentSrc = src;

  // 1) immagine precedente sparisce all'istante (mai due foto insieme)
  hidePhotoInstant();

  // 2) cambio sorgente e lato mentre Ã¨ invisibile
  photoEl.src = bust(src);
  menuPhoto.classList.remove("menu__photo--left", "menu__photo--right");
  menuPhoto.classList.add(`menu__photo--${side}`);

  // 3) fade-in lento e pulito della sola nuova immagine
  requestAnimationFrame(() => {
    photoEl.style.transition = "";
    requestAnimationFrame(() => photoEl.classList.add("is-active"));
  });
}

menu.querySelectorAll(".menu__links [data-photo]").forEach(a => {
  a.addEventListener("mouseenter", () => {
    const src  = a.dataset.photo;
    const side = a.dataset.side || "right";
    if (!src) return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => showPhoto(src, side), HOVER_DELAY);
  });
});

// Fade-out quando si esce dall'intera area link
menu.querySelector(".menu__links").addEventListener("mouseleave", () => {
  clearTimeout(hoverTimer);
  currentSrc = null;
  photoEl.style.transition = "";
  photoEl.classList.remove("is-active");
});

/* â”€â”€ Scrolled nav â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
window.addEventListener("scroll", () => {
  document.getElementById("nav").classList.toggle("is-scrolled", window.scrollY > 40);
}, { passive: true });

/* â”€â”€ Reveal on scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

export function observeReveals(root = document) {
  root.querySelectorAll(".reveal:not(.is-visible)").forEach(el => observer.observe(el));
}
observeReveals(document);

/* â”€â”€ Drag-to-scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export function initDragScroll() {
  document.querySelectorAll(".dragscroll").forEach(strip => {
    if (strip.id === "csRoster") return;
    if (strip.dataset.dragReady) return;
    strip.dataset.dragReady = "1";
    let dragging = false, moved = false, startX = 0, startScroll = 0;
    strip.addEventListener("pointerdown", e => {
      dragging = true; moved = false;
      startX = e.clientX; startScroll = strip.scrollLeft;
      strip.classList.add("is-dragging");
    });
    strip.addEventListener("pointermove", e => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6) { moved = true; strip.setPointerCapture(e.pointerId); }
      strip.scrollLeft = startScroll - dx;
    });
    ["pointerup", "pointercancel"].forEach(ev =>
      strip.addEventListener(ev, () => {
        dragging = false; strip.classList.remove("is-dragging");
      })
    );
    strip.addEventListener("click", e => {
      if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; }
    }, true);
  });
}
