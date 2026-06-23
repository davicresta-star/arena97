/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   ARENA97 â€” Orchestratore (modulo ES)
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
import { COACHES, GENTE } from "./data.js?v=74";
import { pad, phHTML, PH_VARIANTS, discoverPhotos, PHOTO_CB } from "./modules/core.js?v=74";
import { openLightbox } from "./modules/lightbox.js?v=74";
import { observeReveals, initDragScroll, setMenu } from "./modules/ui.js?v=74";
import { buildCoachStrip } from "./modules/coaches.js?v=74";
import { initHero } from "./modules/hero.js?v=74";
import { initPricing } from "./modules/pricing.js?v=74";
import { buildMerchGrid } from "./modules/merch.js?v=74";
import { initBooking } from "./modules/booking.js?v=74";

/* â”€â”€ Discipline split slideshows â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const DISC_VIEWS = ["view-crossfit", "view-hyrox", "view-personal"];
const discTimers = {};

function startDiscSlideshow(viewId, interval = 5000) {
  const view = document.getElementById(viewId);
  if (!view) return;
  const slides = Array.from(view.querySelectorAll(".disc-split__slide:not([hidden])"));
  const dots   = Array.from(view.querySelectorAll(".disc-split__dots span:not([hidden])"));
  if (slides.length < 2) return;
  let idx = 0;
  clearInterval(discTimers[viewId]);
  discTimers[viewId] = setInterval(() => {
    slides[idx].classList.remove("is-active");
    dots[idx]?.classList.remove("is-active");
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add("is-active");
    dots[idx]?.classList.add("is-active");
  }, interval);
}

function stopAllDiscSlideshows() {
  DISC_VIEWS.forEach(id => clearInterval(discTimers[id]));
}

function resetDiscSlideshow(viewId) {
  clearInterval(discTimers[viewId]);
  const view = document.getElementById(viewId);
  if (!view) return;
  view.querySelectorAll(".disc-split__slide").forEach((s, i) => s.classList.toggle("is-active", i === 0));
  view.querySelectorAll(".disc-split__dots span").forEach((d, i) => d.classList.toggle("is-active", i === 0));
}

function updateDiscSlides(viewId, photos) {
  const view = document.getElementById(viewId);
  if (!view || !photos.length) return;
  const slides = view.querySelectorAll(".disc-split__slide");
  const dots   = view.querySelectorAll(".disc-split__dots span");
  slides.forEach((s, i) => {
    if (photos[i]) {
      s.style.backgroundImage = `url('${photos[i]}')`;
      s.hidden = false;
    } else {
      s.hidden = true;
    }
  });
  dots.forEach((d, i) => { d.hidden = !photos[i]; });
}

/* â”€â”€ View navigation (SPA semplice) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const home = document.getElementById("home");

function showView(id) {
  setMenu(false);
  stopAllDiscSlideshows();
  if (arenaCtl) arenaCtl.stop();

  // Nascondi tutto
  home.hidden = true;
  document.querySelectorAll(".view").forEach(v => { v.hidden = true; });

  if (!id || id === "home") {
    home.hidden = false;
    window.scrollTo(0, 0);
    history.pushState({}, "", location.pathname);
  } else {
    const view = document.getElementById("view-" + id);
    if (!view) { home.hidden = false; return; }
    view.hidden = false;
    window.scrollTo(0, 0);
    history.pushState({}, "", "#" + id);
    observeReveals(view);
    initDragScroll();
    // Avvia slideshow se Ã¨ una view disciplina
    if (DISC_VIEWS.includes("view-" + id)) {
      resetDiscSlideshow("view-" + id);
      startDiscSlideshow("view-" + id);
    }
    if (id === "arena" && arenaCtl) arenaCtl.reset();
  }
}

// Logo â†’ torna home
document.getElementById("navLogo").addEventListener("click", e => {
  e.preventDefault();
  showView("home");
});

// Link menu â†’ apre la view corrispondente
document.querySelectorAll(".menu__links a[data-view]").forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    showView(a.dataset.view);
  });
});

// Pulsanti back nelle view
document.querySelectorAll("[data-back]").forEach(btn => {
  btn.addEventListener("click", () => showView("home"));
});

// Flip card discipline â†’ view
document.querySelectorAll(".disc-card[data-view]").forEach(card => {
  card.addEventListener("click", () => showView(card.dataset.view));
  card.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showView(card.dataset.view); }
  });
});

// Link generici con data-view (quick-proof, hero CTA, founder btn, link in-view)
document.querySelectorAll("a[data-view]").forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    showView(a.dataset.view);
  });
});

// Browser back/forward
window.addEventListener("popstate", () => {
  const id = location.hash.replace("#", "");
  stopAllDiscSlideshows();
  if (arenaCtl) arenaCtl.stop();
  if (id && document.getElementById("view-" + id)) {
    home.hidden = true;
    document.querySelectorAll(".view").forEach(v => { v.hidden = true; });
    document.getElementById("view-" + id).hidden = false;
    window.scrollTo(0, 0);
    if (DISC_VIEWS.includes("view-" + id)) {
      resetDiscSlideshow("view-" + id);
      startDiscSlideshow("view-" + id);
    }
    if (id === "arena" && arenaCtl) arenaCtl.reset();
  } else {
    home.hidden = false;
    document.querySelectorAll(".view").forEach(v => { v.hidden = true; });
    window.scrollTo(0, 0);
  }
});

// Hash iniziale
const initHash = location.hash.replace("#", "");
if (initHash && document.getElementById("view-" + initHash)) {
  home.hidden = true;
  document.getElementById("view-" + initHash).hidden = false;
  if (DISC_VIEWS.includes("view-" + initHash)) {
    resetDiscSlideshow("view-" + initHash);
    startDiscSlideshow("view-" + initHash);
  }
}

/* â”€â”€ La Nostra Gente â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function genteItemsFrom(photos) {
  return photos.map((src, k) => ({
    src,
    title: (GENTE.nomi[k] || "").trim() || "La Nostra Gente",
    sub: `Community â€” scatto ${pad(k + 1)} di ${pad(photos.length)}`,
    tags: ["Arena97 Fam"],
  }));
}

function buildGenteCard(src, idx, items) {
  const nome = (GENTE.nomi[idx] || "").trim();
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
  card.setAttribute("aria-label", `Apri la foto ${pad(idx + 1)} della community`);
  card.innerHTML = `
    <img class="card__img" src="${src}" alt="${nome || "La community di Arena97"} â€” ritratto in studio" loading="lazy">
    <div class="card__shade"></div>
    <span class="card__num">${pad(idx + 1)}</span>
    <div class="card__meta">
      <h3 class="card__name">${nome || "Arena97 Fam"}</h3>
      <p class="card__role">Community</p>
    </div>`;
  card.addEventListener("click", () => openLightbox(items, idx));
  return card;
}

function buildGentePlaceholder(idx) {
  const div = document.createElement("div");
  div.className = "card card--empty";
  div.innerHTML = phHTML(PH_VARIANTS[idx % PH_VARIANTS.length], pad(idx + 1), "", `photos/gente/${pad(idx + 1)}.jpg`);
  return div;
}

/* â”€â”€ L'Arena â€” carosello orizzontale stile DogPound â”€â”€â”€â”€â”€â”€â”€â”€ */
let arenaCtl = null;

function buildArenaShow(photos) {
  const trackEl = document.getElementById("arenaSlides"); // .arena-dp__track
  const dotsEl  = document.getElementById("arenaDots");   // .arena-dp__bar
  const showEl  = document.getElementById("arenaShow");   // .arena-dp__stage
  if (!trackEl || !showEl) return;

  const list = photos.slice();
  const STEP = 88; // larghezza slide (86%) + gap (2%)

  // Nessuna foto: placeholder
  if (!list.length) {
    trackEl.innerHTML = `<div class="arena-dp__vslide is-current">${phHTML(PH_VARIANTS[0], "01", "", "photos/arena/01.jpg")}</div>`;
    return;
  }

  const items = list.map((src, k) => ({
    src,
    title: "L'Arena",
    sub: `Sessione â€” scatto ${pad(k + 1)} di ${pad(list.length)}`,
    tags: ["Arena97", "Scalo Porta Romana"],
  }));

  trackEl.innerHTML = list.map((src, i) =>
    `<div class="arena-dp__vslide${i === 0 ? " is-current" : ""}" style="background-image:url('${src}')"></div>`
  ).join("");
  dotsEl.innerHTML = list.map((_, i) =>
    `<span${i === 0 ? ' class="is-active"' : ""} data-i="${i}"></span>`
  ).join("");

  const slides = Array.from(trackEl.children);
  const dots   = Array.from(dotsEl.children);
  let idx = 0, timer = null;
  const INTERVAL = 3500;

  function paint() {
    trackEl.style.transform = `translateX(${-idx * STEP}%)`; // scorre in orizzontale
    slides.forEach((s, i) => s.classList.toggle("is-current", i === idx));
    dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
  }
  function go(i)  { idx = (i + list.length) % list.length; paint(); }
  function next() { go(idx + 1); }
  function stop() { clearInterval(timer); timer = null; }
  function start() { stop(); if (list.length > 1) timer = setInterval(next, INTERVAL); }

  dots.forEach(d => d.addEventListener("click", e => {
    e.stopPropagation(); go(+d.dataset.i); start();
  }));
  showEl.addEventListener("click", () => openLightbox(items, idx)); // zoom totale
  showEl.addEventListener("mouseenter", stop);
  showEl.addEventListener("mouseleave", start);

  paint();
  arenaCtl = { start, stop, reset() { go(0); start(); } };
}

/* â”€â”€ Render principale â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
async function renderAll() {
  // Coach: scopre le foto di ogni cartella
  const results = await Promise.all(COACHES.map(c => discoverPhotos(c.folder)));
  COACHES.forEach((c, i) => { c.photos = results[i]; });

  buildCoachStrip();

  // Discipline split view â€” scopre foto cartelle dedicate, fallback sui coach
  const [cfPhotos, hxPhotos, personalPhotos] = await Promise.all([
    discoverPhotos("crossfit"),
    discoverPhotos("hyrox"),
    discoverPhotos("personal"),
  ]);

  // Aggiorna solo slideshow interno (hero bg gestito da photos/header/)
  const cfFallback = COACHES.find(c => c.disciplines?.some(d => /cross/i.test(d)))?.photos || [];
  const hxFallback = COACHES.find(c => c.disciplines?.some(d => /hyrox/i.test(d)))?.photos || [];
  const firstCoachPhotos = COACHES.find(c => c.photos.length)?.photos || [];

  updateDiscSlides("view-crossfit", (cfPhotos.length   ? cfPhotos   : cfFallback).slice(0, 3));
  updateDiscSlides("view-hyrox",    (hxPhotos.length   ? hxPhotos   : hxFallback).slice(0, 3));
  updateDiscSlides("view-personal", (personalPhotos.length ? personalPhotos : firstCoachPhotos).slice(0, 3));

  // La Nostra Gente
  const gentePhotos = await discoverPhotos(GENTE.folder);
  const grid = document.getElementById("genteGrid");
  if (gentePhotos.length) {
    const items = genteItemsFrom(gentePhotos);
    gentePhotos.forEach((src, k) => grid.appendChild(buildGenteCard(src, k, items)));
  } else {
    for (let k = 0; k < 8; k++) grid.appendChild(buildGentePlaceholder(k));
  }

  // L'Arena â€” slideshow a schermo intero
  const arenaPhotos = await discoverPhotos("arena");
  buildArenaShow(arenaPhotos);

  // Hero slideshow
  let heroSlides = await discoverPhotos("hero");
  if (!heroSlides.length) heroSlides = arenaPhotos.slice();
  if (!heroSlides.length) heroSlides = COACHES.map(c => c.photos[0]).filter(Boolean);
  initHero(heroSlides.slice(0, 6));

  // Merch
  await buildMerchGrid();

  initDragScroll();
  observeReveals(document);
}

// Anti-cache per gli sfondi foto inseriti direttamente nell'HTML
// (header sezioni, card discipline, foto contatti). Riscrive url('photos/…')
// aggiungendo ?cb=… così le foto aggiornate compaiono al ricaricamento.
function bustInlineBackgrounds() {
  document.querySelectorAll('[style*="photos/"]').forEach(el => {
    const s = el.getAttribute('style');
    if (s && s.includes('url(') && !s.includes('cb=')) {
      el.setAttribute('style', s.replace(
        /url\((['"]?)([^'")]+?\.(?:jpg|jpeg|png|webp))\1\)/gi,
        (_, q, u) => `url(${q}${u}?cb=${PHOTO_CB}${q})`
      ));
    }
  });
}
bustInlineBackgrounds();

// Navigazione da pannelli dinamici (es. coaches.js)
document.addEventListener('arena:nav', e => showView(e.detail));

// Schede interattive "È fatto per te?" (CrossFit / Hyrox)
document.addEventListener('click', e => {
  const tab = e.target.closest('.disc-guide__tab');
  if (!tab) return;
  const guide = tab.closest('[data-guide]');
  if (!guide) return;
  const idx = tab.dataset.guideTab;
  guide.querySelectorAll('.disc-guide__tab').forEach(t => {
    const on = t === tab;
    t.classList.toggle('is-active', on);
    t.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  guide.querySelectorAll('.disc-guide__pane').forEach(p =>
    p.classList.toggle('is-active', p.dataset.guidePane === idx));
});

initPricing();
initBooking();
renderAll().catch(e => console.error("renderAll FAILED:", e && e.stack || e));
