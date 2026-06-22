#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ottimizza-foto.py — Arena97
============================================================
Rende TUTTE le foto in photos/ leggere e perfette per il web,
con un solo comando. Ridimensiona, comprime e raddrizza i colori.

COME SI USA
-----------
1. Metti le tue foto (anche pesantissime, direttamente dal telefono
   o dal fotografo) nelle solite cartelle: photos/luca/01.jpg, ecc.
2. Doppio clic su  ottimizza-foto.bat   (oppure:  python ottimizza-foto.py)
3. Fine. Le foto vengono alleggerite sul posto.

SICUREZZA
---------
Prima di toccare una foto, ne salva l'originale in  photos/_originali/.
Puoi rilanciare lo script quante volte vuoi: le foto già ottimizzate
vengono saltate, quindi non perdi mai qualità.
Se sostituisci una foto con una nuova versione pesante, al rilancio
viene ri-ottimizzata (e il nuovo originale ri-salvato).
============================================================
"""

import sys
from pathlib import Path

# Console Windows: forza UTF-8 così l'output non va in errore
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

try:
    from PIL import Image, ImageOps
except ImportError:
    print("\n[ERRORE] Manca la libreria Pillow. Installala con:\n")
    print("    python -m pip install Pillow\n")
    sys.exit(1)

# ── Impostazioni ────────────────────────────────────────────
ROOT       = Path(__file__).resolve().parent / "photos"
BACKUP_DIR = ROOT / "_originali"

QUALITY      = 82       # qualità JPEG (82 = ottimo compromesso peso/qualità)
SIZE_LIMITKB = 400      # sopra questo peso (KB) la foto viene ri-ottimizzata
LONG_LANDSCAPE = 1920   # lato lungo per foto orizzontali (hero, arena)
LONG_PORTRAIT  = 1600   # lato lungo per tutto il resto (ritratti, prodotti)

# Cartelle con foto tendenzialmente orizzontali → lato lungo più ampio
LANDSCAPE_FOLDERS = {"hero", "arena"}

EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def target_long_edge(rel_path: Path) -> int:
    """Sceglie il lato lungo massimo in base alla cartella."""
    parts = rel_path.parts
    top = parts[0] if parts else ""
    return LONG_LANDSCAPE if top in LANDSCAPE_FOLDERS else LONG_PORTRAIT


def needs_work(path: Path, long_edge: int) -> bool:
    """True se la foto è troppo grande o troppo pesante."""
    if path.stat().st_size > SIZE_LIMITKB * 1024:
        return True
    try:
        with Image.open(path) as im:
            return max(im.size) > long_edge
    except Exception:
        return False


def human(n: int) -> str:
    return f"{n/1024:.0f} KB" if n < 1024 * 1024 else f"{n/1024/1024:.1f} MB"


def process(path: Path) -> tuple[int, int] | None:
    """Ottimizza una foto sul posto. Ritorna (peso_prima, peso_dopo)."""
    rel = path.relative_to(ROOT)
    long_edge = target_long_edge(rel)

    if not needs_work(path, long_edge):
        return None  # già a posto: salta

    before = path.stat().st_size

    # 1) Backup dell'originale (sovrascrive se è un nuovo master pesante)
    backup = BACKUP_DIR / rel
    backup.parent.mkdir(parents=True, exist_ok=True)
    backup.write_bytes(path.read_bytes())

    # 2) Apri, correggi l'orientamento EXIF, converti in RGB
    with Image.open(path) as im:
        im = ImageOps.exif_transpose(im)
        if im.mode in ("RGBA", "P", "LA"):
            bg = Image.new("RGB", im.size, (255, 255, 255))
            bg.paste(im, mask=im.split()[-1] if "A" in im.mode else None)
            im = bg
        elif im.mode != "RGB":
            im = im.convert("RGB")

        # 3) Ridimensiona se il lato lungo supera il target
        if max(im.size) > long_edge:
            im.thumbnail((long_edge, long_edge), Image.LANCZOS)

        # 4) Salva sempre come .jpg ottimizzato e progressivo
        out = path.with_suffix(".jpg")
        im.save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)

    # Se l'input era .png/.webp, rimuovi il vecchio file diverso da .jpg
    if path.suffix.lower() != ".jpg" and path.exists():
        path.unlink()

    after = out.stat().st_size
    return before, after


def main():
    if not ROOT.exists():
        print(f"[ERRORE] Cartella non trovata: {ROOT}")
        sys.exit(1)

    files = [
        p for p in ROOT.rglob("*")
        if p.suffix.lower() in EXTS and BACKUP_DIR not in p.parents
    ]

    if not files:
        print("Nessuna foto trovata in photos/.")
        return

    print(f"Trovate {len(files)} foto. Ottimizzo...\n")
    tot_before = tot_after = done = skipped = 0

    for p in sorted(files):
        rel = p.relative_to(ROOT)
        try:
            res = process(p)
        except Exception as e:
            print(f"  [!] {rel} — errore: {e}")
            continue
        if res is None:
            skipped += 1
            continue
        before, after = res
        tot_before += before
        tot_after += after
        done += 1
        saved = 100 * (1 - after / before) if before else 0
        print(f"  ok  {rel}  {human(before)} -> {human(after)}  (-{saved:.0f}%)")

    print("\n" + "-" * 48)
    print(f"Ottimizzate: {done}   |   Già a posto (saltate): {skipped}")
    if done:
        saved = 100 * (1 - tot_after / tot_before) if tot_before else 0
        print(f"Peso totale: {human(tot_before)} → {human(tot_after)}  (-{saved:.0f}%)")
    print(f"Originali salvati in: {BACKUP_DIR}")
    print("Ricarica il sito per vedere le foto leggere.")


if __name__ == "__main__":
    main()
