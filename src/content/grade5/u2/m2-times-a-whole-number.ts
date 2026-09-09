import type { ContentModule } from '../../types';

/** 34 → "3.4". */
const t = (n: number) => String(n / 10);
/** 27 → "0.27". */
const h = (n: number) => String(n / 100);

/**
 * Desimal × bilangan bulat. Cara kerjanya sengaja diajarkan sebagai DUA LANGKAH
 * yang keduanya sudah dikuasai anak: kalikan seolah tidak ada titik (itu `g4-u2`),
 * lalu kembalikan titiknya ke tempat yang sama banyaknya.
 *
 * Karena itu ada satu aturan yang bekerja murni dalam persepuluhan
 * ("7 tenths × 4 = ? tenths"): itulah langkah pertama, dilatih terpisah, dengan
 * pengecoh miskonsepsi berupa a + b — anak yang membaca × sebagai + tertangkap
 * di sana. Aturan `choose-text` mengurus langkah kedua: dari empat pilihan yang
 * angkanya persis sama, hanya letak titiknya yang berbeda.
 */
export const timesAWholeNumber: ContentModule = {
  id: 'g5-u2-m2',
  unitId: 'g5-u2',
  grade: 5,
  title: 'Times a Whole Number',
  icon: '✖️',
  prereq: ['g5-u2-m1'],
  skills: ['multiply-decimal-whole'],
  kind: 'fact',
  fluencyTracked: true,
  // Perkalian lalu penempatan titik = dua langkah. Ambang hafalan 5 detik tidak
  // adil untuk itu; ini alasan yang sama persis dengan `g4-u2-m3` (CLAUDE.md §6).
  speedTargetMs: 9000,
  questionTypes: ['keypad', 'choose-number', 'choose-text'],
  visuals: ['counter-objects', 'array-grid', 'number-line'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twelve dots.',
      visual: { kind: 'counter-objects', count: 12, icon: '🔵' },
      action: 'tap-count',
      target: 12,
      hint: 'Four rows of three.',
    },
    {
      stage: 'pictorial',
      prompt: 'Four rows of three tenths.',
      visual: { kind: 'array', rows: 4, cols: 3 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Twelve tenths is 1.2.',
      visual: { kind: 'number-line', min: 0, max: 2, value: 1.2, marks: [1.2], step: 0.1 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Multiply, then put the point back.',
      visual: { kind: 'array', rows: 4, cols: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'keypad',
      skill: 'multiply-decimal-whole',
      params: { a: [11, 99], b: [2, 9] },
      answer: (p) => ((p.a as number) * (p.b as number)) / 10,
      text: (p) => `${t(p.a as number)} × ${p.b} = ?`,
      exclude: (p) => (p.a as number) % 10 === 0,
    },
    {
      // Perseratusan: titiknya harus mundur dua tempat, bukan satu.
      type: 'keypad',
      skill: 'multiply-decimal-whole',
      params: { a: [11, 99], b: [2, 9] },
      answer: (p) => ((p.a as number) * (p.b as number)) / 100,
      text: (p) => `${h(p.a as number)} × ${p.b} = ?`,
      exclude: (p) => (p.a as number) % 10 === 0,
    },
    {
      // Langkah pertama sendirian: satuannya tetap persepuluhan, jadi jawabannya
      // bilangan bulat dan soalnya bisa dipilih, bukan diketik.
      type: 'choose-number',
      skill: 'multiply-decimal-whole',
      params: { a: [2, 9], b: [2, 9] },
      answer: (p) => (p.a as number) * (p.b as number),
      text: (p) => `${p.a} tenths × ${p.b} = ? tenths`,
      distractors: 'near',
      // Miskonsepsi khas: tanda × dibaca sebagai +.
      misconception: (p) => (p.a as number) + (p.b as number),
    },
    {
      // Empat pilihan berangka sama, berbeda hanya letak titiknya. Anak yang
      // mengalikan benar tapi lupa menghitung tempat desimal akan memilih salah
      // satu dari tiga pengecoh itu — dan mana yang dia pilih memberi tahu
      // seberapa jauh titiknya meleset.
      type: 'choose-text',
      skill: 'multiply-decimal-whole',
      params: { a: [11, 99], b: [2, 9] },
      answer: () => 0,
      text: (p) => `Which is ${h(p.a as number)} × ${p.b}?`,
      exclude: (p) => (p.a as number) % 10 === 0,
      options: (p) => {
        const n = (p.a as number) * (p.b as number);
        return [String(n / 100), String(n / 10), String(n), String(n / 1000)];
      },
    },
  ],
};
