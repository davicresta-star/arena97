/* calendar.js â€” calendario popover su misura (vanilla) */

const MONTHS = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
const DOW = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

let cal, titleEl, daysEl;
let viewY, viewM, minDate, activeTarget, onPick;

function build() {
  cal = document.createElement("div");
  cal.className = "cal";
  cal.setAttribute("role", "dialog");
  cal.setAttribute("aria-label", "Scegli una data");
  cal.innerHTML = `
    <div class="cal__head">
      <button type="button" class="cal__nav cal__prev" aria-label="Mese precedente">&#10094;</button>
      <span class="cal__title"></span>
      <button type="button" class="cal__nav cal__next" aria-label="Mese successivo">&#10095;</button>
    </div>
    <div class="cal__grid cal__dow">${DOW.map(d => `<span>${d}</span>`).join("")}</div>
    <div class="cal__grid cal__days"></div>`;
  document.body.appendChild(cal);
  titleEl = cal.querySelector(".cal__title");
  daysEl  = cal.querySelector(".cal__days");

  cal.querySelector(".cal__prev").addEventListener("click", e => { e.stopPropagation(); shift(-1); });
  cal.querySelector(".cal__next").addEventListener("click", e => { e.stopPropagation(); shift(1); });
  cal.addEventListener("click", e => e.stopPropagation());
  document.addEventListener("click", () => close());
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  window.addEventListener("scroll", () => { if (cal.classList.contains("is-open")) position(); }, true);
  window.addEventListener("resize", () => close());
}

function shift(d) {
  viewM += d;
  if (viewM < 0) { viewM = 11; viewY--; }
  if (viewM > 11) { viewM = 0; viewY++; }
  render();
}

function render() {
  titleEl.textContent = `${MONTHS[viewM]} ${viewY}`;
  const first = new Date(viewY, viewM, 1);
  const startDow = (first.getDay() + 6) % 7; // lunedÃ¬ = 0
  const daysInMonth = new Date(viewY, viewM + 1, 0).getDate();
  const sel = activeTarget && activeTarget.dataset.iso;

  let html = "";
  for (let i = 0; i < startDow; i++) html += `<span class="cal__day is-empty"></span>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${viewY}-${String(viewM + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const disabled = minDate && iso < minDate;
    const selected = sel === iso;
    html += `<button type="button" class="cal__day${selected ? " is-selected" : ""}" data-iso="${iso}"${disabled ? " disabled" : ""}>${d}</button>`;
  }
  daysEl.innerHTML = html;

  daysEl.querySelectorAll(".cal__day[data-iso]:not(:disabled)").forEach(b => {
    b.addEventListener("click", e => {
      e.stopPropagation();
      onPick(b.dataset.iso);
      close();
    });
  });
}

function position() {
  const r = activeTarget.getBoundingClientRect();
  const top = r.bottom + window.scrollY + 6;
  let left = r.left + window.scrollX;
  const w = cal.offsetWidth || 304;
  const maxLeft = window.scrollX + document.documentElement.clientWidth - w - 8;
  if (left > maxLeft) left = maxLeft;
  cal.style.top = top + "px";
  cal.style.left = left + "px";
}

function close() {
  if (!cal) return;
  cal.classList.remove("is-open");
  if (activeTarget) { activeTarget.classList.remove("is-open"); activeTarget = null; }
}

export function openCalendar(triggerEl, opts = {}) {
  if (!cal) build();
  activeTarget = triggerEl;
  onPick = opts.onPick || (() => {});
  minDate = opts.min || null;

  const base = triggerEl.dataset.iso ? new Date(triggerEl.dataset.iso) : new Date();
  viewY = base.getFullYear();
  viewM = base.getMonth();
  render();

  triggerEl.classList.add("is-open");
  cal.classList.add("is-open");
  position();
}
