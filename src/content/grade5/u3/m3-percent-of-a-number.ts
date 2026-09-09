import type { ContentModule } from '../../types';

/** Persen yang benar-benar dipakai orang, dan semuanya membagi 100 dengan rapi. */
const PARTS = [10, 20, 25, 50, 75];
/** Sub-himpunan untuk soal pilihan: 50 dibuang karena pelengkapnya 50 juga. */
const PARTS_ASYM = [10, 20, 25, 75];

/**
 * Dari "persen itu apa" ke "persen itu untuk apa". Semua yang dibutuhkan sudah ada:
 * `m2` memberi jalur persen → desimal, dan mengalikan desimal dengan bilangan bulat
 * sudah dikuasai di `g5-u2-m2`. Modul ini hanya merangkai keduanya.
 *
 * Yang diajarkan bukan rumus tunggal, tapi **dua jalan yang bertemu di jawaban yang
 * sama** — dan itu disengaja:
 *  - 10% = bagi sepuluh (geser titiknya satu tempat) → aturan `Find 10% of ...`
 *    sengaja SELALU berjawaban desimal (`exclude` membuang kelipatan sepuluh),
 *    supaya anak menuliskan 4.5, bukan menghafal "buang satu nol";
 *  - 25%, 50%, 75% = bagian dari satu utuh yang dilihat pada bar model.
 *
 * Bar model (`bars`) adalah gambar utamanya: batang atas satu utuh, batang bawah
 * sepanjang persennya. Angka pastinya selalu ada di teks — `Bars` tidak punya sumbu
 * berangka, jadi ia tidak boleh jadi satu-satunya sumber jawaban.
 *
 * Satu aturan berjalan mundur (`50% of ? = 40`): tanpa itu anak hanya belajar satu
 * arah dan akan tersandung di `m4`, di mana yang diketahui justru harga akhirnya.
 *
 * Batas grade: tidak ada perbandingan senilai, tidak ada skala, tidak ada notasi
 * a : b. Itu `g6-u2`.
 */
export const percentOfANumber: ContentModule = {
  id: 'g5-u3-m3',
  unitId: 'g5-u3',
  grade: 5,
  title: 'Percent of a Number',
  icon: '🧮',
  prereq: ['g5-u3-m2'],
  skills: ['percent-of-number'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'missing-number', 'choose-number'],
  visuals: ['counter-objects', 'bar-model'],
  vocab: ['percent', 'bar', 'divide', 'times'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three of ten parts.',
      visual: { kind: 'counter-objects', count: 10, icon: '🟦' },
      action: 'tap-count',
      target: 3,
      hint: 'Three of ten is 30 percent.',
    },
    {
      stage: 'pictorial',
      prompt: 'Half of the bar is 50 percent.',
      visual: { kind: 'bars', lengths: [1, 0.5], labels: ['1', '?'] },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: '25 percent is one of four parts.',
      visual: { kind: 'bars', lengths: [1, 0.25], labels: ['1', '?'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '10 percent of 80 is 8.',
      visual: { kind: 'bars', lengths: [1, 0.1], labels: ['1', '?'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Divide by 100, then times the percent.',
      visual: { kind: 'bars', lengths: [1, 0.35], labels: ['1', '?'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Kelipatan 20 dipilih supaya 25% dan 75% pun selalu berjawaban bulat —
      // jawaban berkoma di sini akan menggeser fokus ke pembagian, bukan persen.
      type: 'keypad',
      skill: 'percent-of-number',
      params: { i: [0, 4], k: [1, 20] },
      answer: (p) => ((PARTS[p.i as number] as number) * (p.k as number) * 20) / 100,
      text: (p) => `What is ${PARTS[p.i as number]}% of ${(p.k as number) * 20}?`,
      visual: (p) => ({
        kind: 'bars',
        lengths: [1, (PARTS[p.i as number] as number) / 100],
        labels: ['1', '?'],
      }),
    },
    {
      // 10% = geser titiknya satu tempat. Kelipatan sepuluh dibuang, jadi jawabannya
      // SELALU desimal — inilah satu-satunya cara memaksa anak menuliskan 4.5
      // alih-alih menghafal "coret satu nol".
      type: 'keypad',
      skill: 'percent-of-number',
      params: { n: [11, 99] },
      answer: (p) => (p.n as number) / 10,
      text: (p) => `Find 10% of ${p.n}.`,
      exclude: (p) => (p.n as number) % 10 === 0,
    },
    {
      // Arah mundur: yang diketahui bagiannya, yang dicari keseluruhannya.
      // Jawaban selalu kelipatan 20, jadi pengecoh berjarak 1 akan mustahil —
      // `distractorUnit` menjaganya (aturan lint `distractor-scale`).
      type: 'missing-number',
      skill: 'percent-of-number',
      params: { k: [1, 20] },
      answer: (p) => (p.k as number) * 20,
      text: (p) => `50% of ? = ${(p.k as number) * 10}`,
      distractorUnit: 20,
    },
    {
      // Miskonsepsi yang dibidik: mengambil sisanya, bukan bagiannya —
      // "25% of 300" dijawab 225. Persis kesalahan yang akan menghantam anak
      // di m4 ("20% off" dijawab sebagai harga yang dibayar 20%).
      type: 'choose-number',
      skill: 'percent-of-number',
      params: { i: [0, 3], k: [1, 9] },
      answer: (p) => (PARTS_ASYM[p.i as number] as number) * (p.k as number),
      text: (p) => `${PARTS_ASYM[p.i as number]}% of ${(p.k as number) * 100} = ?`,
      distractors: 'near',
      distractorUnit: 5,
      misconception: (p) => (100 - (PARTS_ASYM[p.i as number] as number)) * (p.k as number),
    },
  ],
};
