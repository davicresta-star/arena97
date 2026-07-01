/* core.js â€” utilitÃ  condivise + scoperta foto */
import { MAX_FOTO_PER_CARTELLA } from "../data.js?v=80";

export const PH_VARIANTS = ["ph--1", "ph--2", "ph--3"];
export const pad = n => String(n).padStart(2, "0");

/* Anti-cache foto legato alla VERSIONE del sito (il ?v=NN di questo file).
   Così le foto vengono messe in cache dal browser (caricamento veloce) e
   ricaricate solo quando cambia la versione — cioè quando modifichi il sito
   o usi gli script (che alzano la versione). Molto più veloce di riscaricare
   tutto ad ogni visita. */
export const PHOTO_CB = (() => {
  try { return new URL(import.meta.url).searchParams.get("v") || "1"; }
  catch { return "1"; }
})();
export const bust = src => src ? src + (src.includes("?") ? "&" : "?") + "cb=" + PHOTO_CB : src;

export function initialsOf(name) {
  return name.split(" ").filter(Boolean).map(w => w[0]).join("").toUpperCase();
}

export function phHTML(variant, init, num = "", hint = "") {
  return `
    <div class="ph ${variant}">
      ${num ? `<span class="ph__num">${num}</span>` : ""}
      <span class="ph__init">${init}</span>
      ${hint ? `<span class="ph__hint mono">aggiungi<br>${hint}</span>` : ""}
    </div>`;
}

/* Verifica l'esistenza di un file SENZA scaricarlo (richiesta HEAD).
   Su file:// la HEAD non funziona: in quel caso ricade sul probe via Image. */
export function probePhoto(src) {
  return fetch(src, { method: "HEAD" })
    .then(r => (r.ok ? src : null))
    .catch(() => new Promise(resolve => {
      const im = new Image();
      im.onload = () => resolve(src);
      im.onerror = () => resolve(null);
      im.src = src;
    }));
}

export async function discoverPhotos(folder, max = MAX_FOTO_PER_CARTELLA) {
  // Prova i numeri in sequenza (01, 02, 03…) e si ferma al primo mancante.
  // Poche richieste invece di 20 in parallelo: niente sovraccarico del server,
  // così non "spariscono" foto a caso quando ci sono molte cartelle.
  const found = [];
  for (let i = 1; i <= max; i++) {
    const src = await probePhoto(`photos/${folder}/${pad(i)}.jpg`);
    if (!src) break;
    found.push(bust(src));
  }
  return found;
}
