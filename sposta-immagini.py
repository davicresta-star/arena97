#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
sposta-immagini.py — Arena97
============================================================
Sposta l'INQUADRATURA delle immagini di sfondo degli header
(la fascia con foto + titolo all'inizio di ogni sezione).

Per ogni sezione scegli un valore da 0 a 100:
    0   = si vede la parte ALTA della foto   (immagine spostata in basso)
    50  = centro
    100 = si vede la parte BASSA della foto   (immagine spostata in alto)

COME SI USA
-----------
1. Doppio clic su  sposta-immagini.bat   (oppure:  python sposta-immagini.py)
2. Scegli la sezione (numero) e poi la posizione (0-100).
3. Puoi sistemarne quante vuoi; premi Invio per finire.

Modifica il CSS (css/style.css) e aggiorna la "versione" del sito,
così il browser carica subito la modifica senza problemi di cache.
============================================================
"""

import re
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stdin.reconfigure(encoding="utf-8")
except Exception:
    pass

ROOT = Path(__file__).resolve().parent
CSS = ROOT / "css" / "style.css"
HTML = ROOT / "index.html"

# id CSS dell'header -> nome leggibile della sezione (in ordine di menu)
SEZIONI = [
    ("vbCoach", "I Coach"),
    ("vbCrossfit", "CrossFit"),
    ("vbHyrox", "Hyrox"),
    ("vbGente", "Arena Fam"),
    ("vbPersonal", "Personal Training"),
    ("vbArena", "L'Arena"),
    ("vbPrezzi", "Prezzi"),
]


def regola(vbid):
    # #vbHyrox { background-position: center 50%; }
    return re.compile(r"(#" + vbid + r"\s*\{\s*background-position:\s*center\s+)([\d.]+)(%\s*;?\s*\})")


def leggi_posizione(css, vbid):
    m = regola(vbid).search(css)
    return m.group(2) if m else None


def imposta(css, vbid, pct):
    return regola(vbid).sub(lambda m: f"{m.group(1)}{pct:g}{m.group(3)}", css, count=1)


def bump_versione():
    html = HTML.read_text(encoding="utf-8")
    m = re.search(r"style\.css\?v=(\d+)", html)
    if not m:
        return None
    vecchia = int(m.group(1)); nuova = vecchia + 1
    for f in [HTML] + list((ROOT / "js").rglob("*.js")):
        t = f.read_text(encoding="utf-8")
        t2 = t.replace(f"v={vecchia}", f"v={nuova}")
        if t2 != t:
            f.write_text(t2, encoding="utf-8")
    return vecchia, nuova


def chiedi_pct():
    while True:
        raw = input("    Posizione 0-100  (0=alto, 50=centro, 100=basso) [Invio = annulla]: ").strip().replace("%", "").replace(",", ".")
        if raw == "":
            return None
        try:
            v = float(raw)
        except ValueError:
            print("    [!] Scrivi un numero da 0 a 100.\n"); continue
        if not (0 <= v <= 100):
            print("    [!] Il valore deve stare tra 0 e 100.\n"); continue
        return v


def descrizione(pct):
    return "centro" if abs(pct - 50) < 0.001 else "parte alta" if pct < 50 else "parte bassa"


def main():
    print("\n=============================================")
    print("   ARENA97 - Sposta le immagini degli header")
    print("=============================================")
    print("  0   = parte ALTA della foto  (immagine in basso)")
    print("  50  = centro")
    print("  100 = parte BASSA della foto  (immagine in alto)\n")

    if not CSS.exists():
        print(f"[ERRORE] Non trovo {CSS}"); input("\nInvio per chiudere..."); return

    css = CSS.read_text(encoding="utf-8")

    # tieni solo le sezioni davvero presenti nel CSS
    presenti = [(vid, nome) for vid, nome in SEZIONI if leggi_posizione(css, vid) is not None]
    if not presenti:
        print("[ERRORE] Non trovo le regole di inquadratura nel CSS.")
        input("\nInvio per chiudere..."); return

    modificato = False
    while True:
        print("\nSezioni:")
        for i, (vid, nome) in enumerate(presenti, 1):
            pos = leggi_posizione(css, vid)
            print(f"  {i}) {nome:<20} (ora: {pos}%  -> {descrizione(float(pos))})")
        scelta = input("\nQuale sezione vuoi spostare? (numero, Invio per finire): ").strip()
        if scelta == "":
            break
        if not scelta.isdigit() or not (1 <= int(scelta) <= len(presenti)):
            print("  [!] Scegli un numero dell'elenco.")
            continue

        vid, nome = presenti[int(scelta) - 1]
        print(f"\n  Sezione: {nome}")
        pct = chiedi_pct()
        if pct is None:
            continue

        css = imposta(css, vid, pct)
        # SALVA SUBITO dopo ogni modifica: così anche chiudendo la finestra
        # la modifica resta scritta (niente piÃ¹ "non cambia nulla").
        CSS.write_text(css, encoding="utf-8")
        bumped = bump_versione()
        modificato = True
        ver = f"  (versione v{bumped[1]})" if bumped else ""
        print(f"  -> {nome}: {pct:g}% ({descrizione(pct)})   [SALVATO{ver}]")

    print("\n---------------------------------------------")
    if modificato:
        print("  Finito. Le modifiche sono GIA' salvate.")
        print("  Ricarica il sito con Ctrl+Shift+R per vederle.")
        print("  Per pubblicare online: GitHub Desktop -> Commit -> Push.")
    else:
        print("  Nessuna modifica.")
    print("---------------------------------------------")
    input("\nPremi Invio per chiudere...")


if __name__ == "__main__":
    main()
