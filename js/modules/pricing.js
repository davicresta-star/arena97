/* pricing.js â€” toggle Mensile / Trimestrale (âˆ’15%) */
export function initPricing() {
  const opts = document.querySelectorAll(".pricing__bopt");
  if (!opts.length) return;
  const amounts = document.querySelectorAll(".pcard__amount");
  const bills = document.querySelectorAll("[data-bill]");

  function apply(mode) {
    const tri = mode === "tri";
    amounts.forEach(el => {
      const m = parseInt(el.dataset.m, 10);
      el.textContent = tri ? Math.round(m * 0.85) : m;
    });
    bills.forEach(el => { el.textContent = tri ? "al mese, fatturato ogni 3 mesi" : "fatturato mensile"; });
    opts.forEach(o => o.classList.toggle("is-active", o.dataset.mode === mode));
  }
  opts.forEach(o => o.addEventListener("click", () => apply(o.dataset.mode)));
}
