/* ══════════════════════════════════════════════════════════════
   ARENA97 — CONFIGURAZIONE CONTENUTI (modulo ES)
   Questo è l'UNICO file da modificare per testi e persone.

   ── COME AGGIUNGERE LE FOTO (non serve toccare il codice) ──
   Metti i JPG verticali (3:4) nelle cartelle, numerati a due cifre:
     photos/luca/01.jpg, 02.jpg …    photos/paolo/01.jpg …
     photos/francesca/…  photos/erik/…  photos/carlo/…  photos/gianluca/…
     photos/gente/…      → "La Nostra Gente"
     photos/fondatori/01.jpg → foto di coppia Paolo+Luca
     photos/arena/…      → "L'Arena"
     photos/hero/…       → sfondo hero

   NB: il campo `id` (= nome cartella) è pronto per la migrazione a
   React/Next: serve come chiave/route del coach (/coach/luca).
   ══════════════════════════════════════════════════════════════ */

export const MAX_FOTO_PER_CARTELLA = 20;

export const STAT_LABELS = {
  potenza: "Potenza",
  resistenza: "Resistenza",
  tecnica: "Tecnica",
  mobilita: "Mobilità",
  esperienza: "Esperienza",
  grinta: "Grinta",
};

export const COACHES = [
  {
    id: "luca", folder: "luca",
    firstName: "Luca", lastName: "Rossetti",
    role: "Co-Founder · Head Coach",
    disciplines: ["Hyrox", "CrossFit"],
    tagline: "Next gen",
    bio: "Co-founder e seconda generazione. Race pace, hybrid training e ossessione per i dettagli: Luca è il ponte tra la vecchia scuola e quella nuova.",
    stats: { potenza: 84, resistenza: 90, tecnica: 86, mobilita: 78, esperienza: 80, grinta: 95 },
    // ✏️ MODIFICA: certificazioni del coach (una per riga)
    certs: ["CrossFit Level 2 Trainer (CF-L2)", "Hyrox Certified Trainer", "Weightlifting Level 1", "BLSD · Primo soccorso"],
  },
  {
    id: "paolo", folder: "paolo",
    firstName: "Paolo", lastName: "Rossetti",
    role: "Co-Founder · Head Coach",
    disciplines: ["CrossFit", "Hyrox"],
    tagline: "Day one",
    bio: "Il fondatore. Programmazione, visione e una vita di sala sulle spalle: Paolo ha costruito Arena97 con un'idea semplice — l'allenamento fatto bene non passa mai di moda.",
    stats: { potenza: 86, resistenza: 78, tecnica: 95, mobilita: 70, esperienza: 99, grinta: 90 },
    // ✏️ MODIFICA: certificazioni del coach (una per riga)
    certs: ["CrossFit Level 3 Trainer (CF-L3)", "CrossFit Gymnastics", "CrossFit Weightlifting", "BLSD · Primo soccorso"],
  },
  {
    id: "francesca", folder: "francesca",
    firstName: "Francesca", lastName: "Toschi",
    role: "Hyrox Coach",
    disciplines: ["Hyrox"],
    tagline: "Race pace",
    bio: "Race pace nel sangue. Francesca prepara la sala alla gara — stazioni, transizioni e ritmo — finché il percorso non fa più paura a nessuno.",
    stats: { potenza: 72, resistenza: 94, tecnica: 88, mobilita: 86, esperienza: 76, grinta: 92 },
    // ✏️ MODIFICA: certificazioni del coach (una per riga)
    certs: ["Hyrox Certified Trainer", "CrossFit Level 1 Trainer (CF-L1)", "Running & Endurance Coach", "BLSD · Primo soccorso"],
  },
  {
    id: "erik", folder: "erik",
    firstName: "Erik", lastName: "Chiriaco",
    role: "CrossFit · Hyrox Coach",
    disciplines: ["CrossFit", "Hyrox"],
    tagline: "Full gas",
    bio: "Energia da vendere e standard altissimi. Tra un WOD e una simulazione di gara, Erik spinge ogni classe un metro oltre il limite — sempre con la faccia di chi se la gode.",
    stats: { potenza: 91, resistenza: 84, tecnica: 82, mobilita: 78, esperienza: 72, grinta: 96 },
    // ✏️ MODIFICA: certificazioni del coach (una per riga)
    certs: ["CrossFit Level 2 Trainer (CF-L2)", "Hyrox Certified Trainer", "Weightlifting Level 1", "BLSD · Primo soccorso"],
  },
  {
    id: "carlo", folder: "carlo",
    firstName: "Carlo", lastName: "Perra",
    role: "Adaptive Coach",
    disciplines: ["Adaptive Training"],
    tagline: "No limits",
    bio: "L'allenamento è di tutti. Carlo costruisce percorsi su misura dove non esistono barriere né scuse — solo progressi, misurati uno per uno.",
    stats: { potenza: 76, resistenza: 80, tecnica: 93, mobilita: 88, esperienza: 85, grinta: 89 },
    // ✏️ MODIFICA: certificazioni del coach (una per riga)
    certs: ["CrossFit Adaptive Trainer", "CrossFit Level 1 Trainer (CF-L1)", "Laurea in Scienze Motorie", "BLSD · Primo soccorso"],
  },
  {
    id: "gianluca", folder: "gianluca",
    firstName: "Gianluca", lastName: "Segatto",
    role: "Hyrox Coach",
    disciplines: ["Hyrox"],
    tagline: "Finish line",
    bio: "Motore diesel e testa fredda. Gianluca macina chilometri e sled push, e porta la sua classe alla finish line un secondo più veloce a settimana.",
    stats: { potenza: 78, resistenza: 96, tecnica: 80, mobilita: 74, esperienza: 78, grinta: 93 },
    // ✏️ MODIFICA: certificazioni del coach (una per riga)
    certs: ["Hyrox Certified Trainer", "Endurance & Conditioning Coach", "CrossFit Level 1 Trainer (CF-L1)", "BLSD · Primo soccorso"],
  },
];

export const GENTE = {
  folder: "gente",
  nomi: [],
};

/* ══════════════════════════════════════════════════════════════
   MERCH — collezione Arena97
   Ogni prodotto ha la sua cartella foto: photos/merch/<id>/01.jpg …
   La 01.jpg è quella della griglia; le altre si vedono scrollando
   nella pagina del prodotto.
   ══════════════════════════════════════════════════════════════ */
export const MERCH_COLLECTION = "Arena97 Collection";

export const MERCH = [
  {
    id: "tee", folder: "merch/tee",
    name: "Signature Tee",
    price: 42,
    desc: [
      "La t-shirt Arena97 di tutti i giorni, dentro e fuori dalla sala.",
      "Cotone pesante 220 g/m², vestibilità regular.",
      "Logo DP stampato fronte cuore, lettering Arena97 sul retro.",
      "Pre-ristretta: non si deforma in lavaggio.",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "hoodie", folder: "merch/hoodie",
    name: "Heavyweight Hoodie",
    price: 89,
    desc: [
      "Felpa pesante con cappuccio, taglio oversize.",
      "Felpa garzata 450 g/m², interno spazzolato.",
      "Cappuccio doppio strato, tasca a marsupio.",
      "Polsini e fondo a costine elastiche.",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "shorts", folder: "merch/shorts",
    name: "Tech Training Shorts",
    price: 58,
    desc: [
      "Short tecnico da allenamento, leggero e traspirante.",
      "Tessuto a quattro vie, asciugatura rapida.",
      "Slip interno integrato, vita elastica con coulisse.",
      "Tasche laterali con zip.",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "jacket", folder: "merch/jacket",
    name: "Lightweight Jacket",
    price: 148,
    desc: [
      "Giacca leggera dal mood tracksuit, dettagli funzionali.",
      "Tessuto crinkle abrasion-resistant e idrorepellente.",
      "Tasche con zip e taschino porta-card nascosto.",
      "Fondo regolabile con coulisse, vestibilità relaxed.",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "bra", folder: "merch/bra",
    name: "Triangle Sport Bra",
    price: 48,
    desc: [
      "Bralette a triangolo, supporto leggero A/B.",
      "Tessuto morbido a compressione, coppe removibili.",
      "Fascia sottoseno elastica, schiena a vogatore.",
      "Logo DP stampato.",
    ],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "beltbag", folder: "merch/beltbag",
    name: "Everywhere Belt Bag",
    price: 38,
    desc: [
      "Il marsupio Arena97 da portare ovunque.",
      "Tessuto idrorepellente, tasca interna con zip.",
      "Cinghia regolabile, fibbia a sgancio rapido.",
      "Logo DP sul davanti.",
    ],
    sizes: ["Unica"],
  },
];
