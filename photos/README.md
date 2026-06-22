# Cartella foto — Arena97

## Regola unica
**Ogni cartella = una sezione del sito.**
Dentro metti foto **JPG numerate a due cifre**: `01.jpg`, `02.jpg`, `03.jpg` … (fino a 20).
Ricarica la pagina e il sito le trova da solo. In ogni cartella trovi un
`LEGGIMI.txt` che spiega cosa metterci (puoi lasciarlo, il sito lo ignora).

- **Sostituire** una foto → rimpiazza il file con lo stesso nome (`01.jpg`).
- **Aggiungere** → usa il primo numero libero.
- **Togliere** → cancella il file (le altre si rinumerano a video).

Finché una foto manca, al suo posto c'è un placeholder grafico che indica
il nome esatto del file da aggiungere.

## Tutte le cartelle

| Cartella      | Sezione del sito                         | Formato consigliato            |
|---------------|------------------------------------------|--------------------------------|
| `hero/`       | Sfondo della home (slideshow)            | 5-6 foto d'impatto             |
| `luca/`       | Coach Luca Rossetti                      | verticale 3:4 — 01.jpg = main  |
| `paolo/`      | Coach Paolo Rossetti                     | verticale 3:4 — 01.jpg = main  |
| `francesca/`  | Coach Francesca Toschi                   | verticale 3:4 — 01.jpg = main  |
| `erik/`       | Coach Erik Chiriaco                      | verticale 3:4 — 01.jpg = main  |
| `carlo/`      | Coach Carlo Perra                        | verticale 3:4 — 01.jpg = main  |
| `gianluca/`   | Coach Gianluca Segatto                   | verticale 3:4 — 01.jpg = main  |
| `fondatori/`  | Sezione "I Founder" + hero               | basta `01.jpg`                 |
| `crossfit/`   | Pagina disciplina CrossFit (slideshow)   | 3 foto: 01-03.jpg              |
| `hyrox/`      | Pagina disciplina Hyrox (slideshow)      | 3 foto: 01-03.jpg              |
| `personal/`   | Pagina Personal Training (slideshow)     | 3 foto: 01-03.jpg              |
| `gente/`      | "Arena Fam" — community                  | quante vuoi                    |
| `arena/`      | "L'Arena" — slideshow a schermo intero   | **orizzontali 16:9**           |

Per le pagine disciplina (`crossfit`, `hyrox`, `personal`): se la
cartella è vuota, la pagina usa in automatico foto di ripiego (coach/fondatori).

## Merch (negozio)

Ogni prodotto ha la sua sottocartella dentro `merch/`:

| Cartella               | Prodotto              |
|------------------------|-----------------------|
| `merch/tee/`           | Signature Tee         |
| `merch/hoodie/`        | Heavyweight Hoodie    |
| `merch/shorts/`        | Tech Training Shorts  |
| `merch/jacket/`        | Lightweight Jacket    |
| `merch/bra/`           | Triangle Sport Bra    |
| `merch/beltbag/`       | Everywhere Belt Bag   |

`01.jpg` = foto della griglia; `02.jpg`, `03.jpg` … = foto extra che si vedono
scrollando nella pagina del prodotto (salgono a colori).
Prezzi, descrizioni e taglie si modificano in `js/data.js` (sezione MERCH).

## Logo
Salva il logo (bianco) come `assets/logo.png`: la navbar lo usa da solo.
Finché manca, viene mostrata una versione vettoriale ricreata.

## Testi, ruoli, bio dei coach e nomi della community
Si modificano in **`js/data.js`** (istruzioni in cima al file).
Esempio nomi gente: `nomi: ["Marta", "", "Gigi"]` → Marta su 01.jpg, Gigi su 03.jpg.

## Formato consigliato (ritratti)
Verticale 3:4 (es. 1200×1600 px), JPG. Le foto restano **a colori**: il sito
applica solo una leggera desaturazione che sparisce al passaggio del mouse.
