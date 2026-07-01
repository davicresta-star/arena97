/* coaches.js — master-detail: sidebar thumbnails + pannello sempre visibile */
import { COACHES, STAT_LABELS } from "../data.js?v=79";
import { PH_VARIANTS, pad, phHTML, initialsOf } from "./core.js?v=79";

const listEl  = document.getElementById("coachList");
const panelEl = document.getElementById("coachPanel");

let activeIdx  = -1;
let slideTimer = null;

/* ── Sidebar: thumbnail cards ──────────────────────────── */
function buildThumbs() {
  COACHES.forEach((coach, i) => {
    const name = `${coach.firstName} ${coach.lastName}`;
    const btn  = document.createElement("button");
    btn.type   = "button";
    btn.className = "cs-thumb";
    btn.setAttribute("aria-label", `Profilo ${name}`);

    const imgHtml = coach.photos.length
      ? `<img src="${coach.photos[0]}" alt="${name}" loading="${i < 3 ? "eager" : "lazy"}">`
      : phHTML(PH_VARIANTS[i % PH_VARIANTS.length], initialsOf(name), pad(i + 1), `photos/${coach.folder}/01.jpg`);

    btn.innerHTML = `
      <div class="cs-thumb__media">${imgHtml}</div>
      <div class="cs-thumb__veil"></div>
      <div class="cs-thumb__label">
        <span class="cs-thumb__num mono">${pad(i + 1)}</span>
        <span class="cs-thumb__name">${coach.firstName}</span>
      </div>`;

    btn.addEventListener("click", () => selectCoach(i));
    listEl.appendChild(btn);
  });
}

/* ── Pannello dettaglio ────────────────────────────────── */
function renderPanel(coach, idx) {
  clearInterval(slideTimer);

  const name       = `${coach.firstName} ${coach.lastName}`;
  const photos     = coach.photos; // tutte le foto della cartella (photos/<coach>/01.jpg, 02.jpg …)
  const statLabels = STAT_LABELS || {};

  const slidesHtml = photos.length
    ? photos.map((src, i) =>
        `<div class="cs-panel__slide${i === 0 ? " is-active" : ""}"
              style="background-image:url('${src}')"></div>`
      ).join("")
    : `<div class="cs-panel__slide is-active cs-panel__slide--ph">
         <span>${initialsOf(name)}</span>
       </div>`;

  const dotsHtml = photos.length > 1
    ? `<div class="cs-panel__dots">` +
      photos.map((_, i) =>
        `<span class="cs-panel__dot${i === 0 ? " is-active" : ""}"></span>`
      ).join("") + `</div>`
    : "";

  const certsHtml = (coach.certs && coach.certs.length)
    ? `<div class="cs-panel__certs">
         <span class="cs-panel__certs-title mono">Certificazioni</span>
         <ul class="cs-panel__certs-list">
           ${coach.certs.map(c => `<li>${c}</li>`).join("")}
         </ul>
       </div>`
    : "";

  const statsHtml = Object.entries(coach.stats || {}).map(([k, v]) => `
    <div class="cf-stat">
      <div class="cf-stat__bar"><div class="cf-stat__fill" data-pct="${v}" style="width:0%"></div></div>
      <div class="cf-stat__labels">
        <span class="mono">${statLabels[k] || k}</span>
        <span class="mono">${v}</span>
      </div>
    </div>`).join("");

  panelEl.innerHTML = `
    <div class="cs-panel__media">
      <div class="cs-panel__slides">${slidesHtml}</div>
      ${dotsHtml}
      <div class="cs-panel__veil"></div>
    </div>
    <div class="cs-panel__info">
      <div class="cs-panel__eyebrow mono">${pad(idx + 1)} · ${coach.tagline || ""}</div>
      <h2 class="cs-panel__name">${coach.firstName}<br>${coach.lastName}</h2>
      <p class="cs-panel__role">${coach.role}</p>
      <p class="cs-panel__bio">${coach.bio || ""}</p>
      ${certsHtml}
      ${statsHtml ? `<div class="cf-stats">${statsHtml}</div>` : ""}
      <div class="cs-panel__bottom-cta">
        <a class="btn btn--volt"
           href="mailto:staff@arena97.it?subject=Allena%20con%20${encodeURIComponent(name)}">
          Allena con ${coach.firstName}
        </a>
        <a class="btn btn--ghost"
           href="mailto:staff@arena97.it?subject=Prova%20Arena97">
          Prenota una prova
        </a>
        <a class="btn btn--outline cs-prezzi-link" href="#">
          Vedi i prezzi →
        </a>
      </div>
    </div>`;

  panelEl.querySelector('.cs-prezzi-link')?.addEventListener('click', e => {
    e.preventDefault();
    document.dispatchEvent(new CustomEvent('arena:nav', { detail: 'prezzi' }));
  });

  requestAnimationFrame(() => {
    panelEl.querySelectorAll(".cf-stat__fill").forEach(bar => {
      bar.style.width = bar.dataset.pct + "%";
    });
  });

  if (photos.length > 1) {
    let cur = 0;
    const slides = panelEl.querySelectorAll(".cs-panel__slide");
    const dots   = panelEl.querySelectorAll(".cs-panel__dot");
    slideTimer = setInterval(() => {
      slides[cur].classList.remove("is-active");
      dots[cur]?.classList.remove("is-active");
      cur = (cur + 1) % slides.length;
      slides[cur].classList.add("is-active");
      dots[cur]?.classList.add("is-active");
    }, 4000);
  }
}

/* ── Seleziona coach ───────────────────────────────────── */
function selectCoach(idx) {
  if (idx === activeIdx) return;
  activeIdx = idx;

  listEl.querySelectorAll(".cs-thumb").forEach((btn, i) => {
    btn.classList.toggle("is-active", i === idx);
  });

  renderPanel(COACHES[idx], idx);
}

/* ── Entry point ───────────────────────────────────────── */
export function buildCoachStrip() {
  if (!listEl || !panelEl) return;
  buildThumbs();
  selectCoach(0);
}
