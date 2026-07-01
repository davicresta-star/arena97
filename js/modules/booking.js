/* booking.js â€” form prenotazione prova (vanilla, invio via email) */
import { openCalendar } from "./calendar.js?v=78";

const EMAIL_DEST = "staff@arena97.it";

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function initBooking() {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  const first   = document.getElementById("bkFirst");
  const last    = document.getElementById("bkLast");
  const email   = document.getElementById("bkEmail");
  const phone   = document.getElementById("bkPhone");
  const note    = document.getElementById("bkNote");
  const consent = document.getElementById("bkConsent");
  const msg     = document.getElementById("bookingMsg");
  const submit  = document.getElementById("bkSubmit");
  const slots   = Array.from(form.querySelectorAll(".slot"));
  const chips   = Array.from(form.querySelectorAll("#bkDisc .chip"));

  const today = new Date().toISOString().split("T")[0];

  function setMsg(text, kind) {
    msg.textContent = text;
    msg.className = "booking__msg mono" + (kind ? " is-" + kind : "");
  }

  // Chip disciplina â€” selezione singola
  let disc = "";
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const on = chip.classList.contains("is-on");
      chips.forEach(c => c.classList.remove("is-on"));
      if (!on) { chip.classList.add("is-on"); disc = chip.dataset.val; }
      else disc = "";
    });
  });

  // Bottoni data â†’ calendario popover
  form.querySelectorAll(".bk-datebtn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      openCalendar(btn, {
        min: today,
        onPick: iso => {
          btn.dataset.iso = iso;
          btn.classList.add("has-val");
          btn.querySelector(".bk-datebtn__txt").textContent = formatDate(iso);
          // sincronizza l'input nascosto dello slot
          const hidden = btn.parentElement.querySelector(".slot__date");
          if (hidden) hidden.value = iso;
        },
      });
    });
  });

  [first, last, email].forEach(el =>
    el.addEventListener("input", () => el.classList.remove("is-invalid"))
  );

  form.addEventListener("submit", e => {
    e.preventDefault();

    const firstV = first.value.trim();
    const lastV  = last.value.trim();
    const emailV = email.value.trim();
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailV);

    // Slot scelti (serve la data)
    const chosen = [];
    slots.forEach((s, i) => {
      const date = s.querySelector(".slot__date").value;
      const band = s.querySelector(".slot__band").value;
      if (date) chosen.push(`  Slot ${i + 1}: ${formatDate(date)}${band ? " â€” " + band : ""}`);
    });

    first.classList.toggle("is-invalid", !firstV);
    last.classList.toggle("is-invalid", !lastV);
    email.classList.toggle("is-invalid", !emailOk);

    if (!firstV || !lastV) { setMsg("Inserisci nome e cognome.", "error"); (!firstV ? first : last).focus(); return; }
    if (!emailOk)          { setMsg("Inserisci un'email valida.", "error"); email.focus(); return; }
    if (chosen.length === 0) { setMsg("Scegli almeno uno slot (data).", "error"); return; }
    if (!consent.checked)  { setMsg("Spunta il consenso per essere ricontattato.", "error"); return; }

    const lines = [
      `Nome: ${firstV} ${lastV}`,
      `Email: ${emailV}`,
      phone.value.trim() ? `Telefono: ${phone.value.trim()}` : null,
      disc ? `Disciplina: ${disc}` : null,
      "",
      "Slot preferiti (in ordine di preferenza):",
      ...chosen,
      note.value.trim() ? `\nNote: ${note.value.trim()}` : null,
    ].filter(l => l !== null);

    const subject = `Prenotazione prova â€” ${firstV} ${lastV}`;
    window.location.href =
      `mailto:${EMAIL_DEST}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;

    setMsg("Perfetto! Si Ã¨ aperta la tua email con la richiesta giÃ  pronta: inviala e ti ricontattiamo.", "ok");
    submit.textContent = "Richiesta pronta âœ“";
  });
}
