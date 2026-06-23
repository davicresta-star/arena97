/* merch.js â€” griglia prodotti + pagina prodotto (stile DogPound) */
import { MERCH, MERCH_COLLECTION } from "../data.js?v=74";
import { pad, phHTML, PH_VARIANTS, discoverPhotos } from "./core.js?v=74";

const grid        = document.getElementById("merchGrid");
const productView = document.getElementById("view-product");
const merchView   = document.getElementById("view-merch");

let revealObs = null;

function showOnly(view) {
  document.getElementById("home").hidden = true;
  document.querySelectorAll(".view").forEach(v => { v.hidden = true; });
  view.hidden = false;
  window.scrollTo(0, 0);
}

function openProduct(product) {
  const mediaEl = document.getElementById("productMedia");
  const photos  = (product.photos && product.photos.length) ? product.photos : [];

  // Immagini impilate (verticali) â€” "salgono a colori" entrando in vista
  if (photos.length) {
    mediaEl.innerHTML = photos.map((src, i) =>
      `<div class="product__media-item${i === 0 ? " is-visible" : ""}">
         <img src="${src}" alt="${product.name} â€” foto ${i + 1}" loading="${i < 2 ? "eager" : "lazy"}">
       </div>`
    ).join("");
  } else {
    mediaEl.innerHTML = [0, 1].map(i =>
      `<div class="product__media-item is-visible">
         ${phHTML(PH_VARIANTS[i % PH_VARIANTS.length], pad(i + 1), "", `photos/${product.folder}/${pad(i + 1)}.jpg`)}
       </div>`
    ).join("");
  }

  // Pannello info
  document.getElementById("productName").textContent  = product.name;
  document.getElementById("productPrice").textContent = `€${product.price}`;
  document.getElementById("productDesc").innerHTML    = product.desc.map(d => `<p>${d}</p>`).join("");
  const sizeSel = document.getElementById("productSize");
  sizeSel.innerHTML = product.sizes.map(s => `<option>${s}</option>`).join("");
  document.getElementById("productQty").value = "1";

  // Aggiungi al carrello â†’ email d'ordine + feedback
  const addBtn = document.getElementById("productAdd");
  addBtn.classList.remove("is-added");
  addBtn.textContent = "Aggiungi al carrello";
  addBtn.onclick = () => {
    const qty  = document.getElementById("productQty").value;
    const size = sizeSel.value;
    addBtn.classList.add("is-added");
    addBtn.textContent = "Aggiunto âœ“";
    const subj = encodeURIComponent(`Ordine â€” ${product.name}`);
    const body = encodeURIComponent(
      `Vorrei ordinare:\n${product.name}\nTaglia: ${size}\nQuantitÃ : ${qty}\nPrezzo: €${product.price}`
    );
    window.location.href = `mailto:staff@arena97.it?subject=${subj}&body=${body}`;
  };

  showOnly(productView);
  history.pushState({}, "", "#merch");

  // Reveal-on-scroll: le immagini salgono e si accendono a colori
  if (revealObs) revealObs.disconnect();
  revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  productView.querySelectorAll(".product__media-item:not(.is-visible)").forEach(el => revealObs.observe(el));
}

export async function buildMerchGrid() {
  if (!grid) return;
  const collEl = document.getElementById("merchCollection");
  if (collEl) collEl.textContent = MERCH_COLLECTION;

  // Scopre le foto di ogni prodotto
  await Promise.all(MERCH.map(async p => { p.photos = await discoverPhotos(p.folder); }));

  grid.innerHTML = "";
  MERCH.forEach(product => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "merch-card";
    card.setAttribute("aria-label", `${product.name} â€” €${product.price}`);

    const media = product.photos.length
      ? `<img src="${product.photos[0]}" alt="${product.name}" loading="lazy">`
      : phHTML(PH_VARIANTS[0], product.name.slice(0, 2).toUpperCase(), "", `photos/${product.folder}/01.jpg`);

    card.innerHTML = `
      <div class="merch-card__media">${media}</div>
      <div class="merch-card__shade"></div>
      <div class="merch-card__info">
        <h3 class="merch-card__name">${product.name}</h3>
        <span class="merch-card__price">€${product.price}</span>
      </div>`;
    card.addEventListener("click", () => openProduct(product));
    grid.appendChild(card);
  });

  // Back dalla pagina prodotto â†’ torna alla griglia
  const back = document.getElementById("productBack");
  if (back) back.addEventListener("click", () => {
    showOnly(merchView);
    history.pushState({}, "", "#merch");
  });
}
