# Arena97 — sito

Sito statico (HTML/CSS/JavaScript) della palestra **Arena97 Training Club**.
Non serve installare niente per modificarlo: si aprono i file con un editor di
testo (va benissimo **VS Code**, gratis) e si salvano.

---

## 1) Come modificare i TESTI

I testi sono in due posti, a seconda di cosa vuoi cambiare.

### a) Testi delle sezioni (hero, manifesto, ecc.) → `index.html`
Apri `index.html` e cerca i segnaposto **`✏️ MODIFICA`** (menu Cerca, o `Ctrl+F`):
ogni testo modificabile è preceduto da un commento che spiega cos'è.
Esempio:
```html
<!-- ✏️ MODIFICA: titolo grande della home -->
<h1 class="hero__claim">Dedication. Workout.<br><span class="u-volt">Discipline.</span></h1>
```
Cambia **solo** il testo tra i tag (`Dedication. Workout.` ecc.), non le parti
tra `<` e `>`. Salva e ricarica la pagina.

### b) Coach, prezzi e prodotti → `js/data.js`
Apri `js/data.js`: in cima ci sono le istruzioni. Lì trovi:
- **Coach**: nome, ruolo, discipline, biografia (`bio`) e statistiche.
- **Merch**: nome prodotto, prezzo, descrizione e taglie.
- **Community**: i nomi sotto le foto di "Arena Fam".

> I prezzi degli **abbonamenti** (Hyrox/CrossFit) sono invece in
> `index.html`, cerca `✏️ MODIFICA: prezzi`.

**Regola d'oro:** modifica solo il testo tra virgolette `"..."`, lasciando
intatte virgole, parentesi e nomi dei campi. Se qualcosa si rompe, annulla con
`Ctrl+Z`.

---

## 2) Come modificare o aggiungere le FOTO

Tutte le foto stanno in **`photos/`**, una cartella per sezione. In ogni
cartella c'è un file `LEGGIMI.txt` che spiega cosa metterci.

- Le foto vanno numerate: `01.jpg`, `02.jpg`, `03.jpg`…
- Per **sostituire** una foto: rimpiazza il file con lo stesso nome.
- Per **aggiungere**: usa il numero successivo libero.

**Alleggerire le foto (consigliato):** doppio clic su **`ottimizza-foto.bat`**:
ridimensiona e comprime in automatico tutte le foto pesanti (gli originali
restano salvati in `photos/_originali/`).

---

## 3) Come PUBBLICARE il sito su GitHub (gratis, con GitHub Pages)

Non serve essere tecnici: si fa tutto dal sito di GitHub, trascinando i file.

### Primo caricamento
1. Crea un account su **github.com** (gratis).
2. In alto a destra: **+ → New repository**.
   - Name: `arena97` (o quello che preferisci)
   - Imposta **Public** → **Create repository**.
3. Nella pagina del repository vuoto clicca **"uploading an existing file"**.
4. **Trascina dentro tutto il contenuto** della cartella del sito
   (i file `index.html`, `css/`, `js/`, `photos/`, `assets/` …).
   > Suggerimento: trascina le cartelle, non la cartella che le contiene.
5. In fondo clicca **Commit changes**.

### Attivare il sito
6. Nel repository vai su **Settings → Pages**.
7. Alla voce **Source** scegli **Deploy from a branch**, branch **main**,
   cartella **/ (root)** → **Save**.
8. Dopo 1-2 minuti, in cima alla stessa pagina comparirà il link pubblico tipo:
   `https://tuonome.github.io/arena97/` — quello è il tuo sito online. 🎉

### Aggiornare il sito in futuro
- Vai nel repository, apri il file da cambiare, clicca l'icona della **matita**
  (✏️ in alto a destra), modifica, **Commit changes**.
- Per cambiare foto: entra nella cartella giusta, **Add file → Upload files**,
  trascina le nuove immagini (stesso nome per sostituire), **Commit**.
- Il sito online si aggiorna da solo dopo 1-2 minuti.

> Le foto originali pesanti in `photos/_originali/` **non** servono online: per
> tenere il repository leggero puoi non caricarle (sono già escluse dal file
> `.gitignore` se usi Git da computer).

---

## Struttura delle cartelle

```
index.html          → la pagina (tutti i testi delle sezioni)
css/style.css       → grafica e stili
js/
  data.js           → coach, prodotti, nomi community  ← testi "facili"
  main.js           → logica del sito (non serve toccarlo)
  modules/          → funzioni del sito (non serve toccarle)
photos/             → tutte le foto, una cartella per sezione
  _originali/       → backup automatico delle foto originali
assets/             → logo (logo.png) e marchio (mark.png)
ottimizza-foto.bat  → doppio clic per alleggerire le foto
README.md           → questa guida
```

Per qualsiasi dubbio: `staff@arena97.it`.
