import type { ContentModule } from '../../types';

/** Penyebut yang bisa disamakan menjadi seratus dengan satu langkah kali. */
const DENOMS = [2, 4, 5, 20, 25, 50];

/** 45 perseratusan → "0.45"; 50 → "0.5"; 4 → "0.04". */
function decimalOf(hundredths: number): string {
  if (hundredths % 10 === 0) return `0.${hundredths / 10}`;
  if (hundredths < 10) return `0.0${hundredths}`;
  return `0.${hundredths}`;
}

/**
 * Modul penutup unit, dan satu-satunya tempat kedua benang bertemu:
 * membandingkan desimal DAN menukar pecahan menjadi desimal.
 *
 * Miskonsepsi terbesar di seluruh unit ada di sini: "0.45 lebih besar daripada
 * 0.7 karena 45 lebih besar daripada 7". Karena itu satu aturan `compare-symbol`
 * dibuat khusus untuk pasangan persepuluhan lawan perseratusan — anak yang
 * membandingkan panjang deretan angka, bukan nilai tempatnya, akan tersandung
 * tepat di sana.
 *
 * Operasi desimal (+ − × ÷) TIDAK ada di sini; itu Grade 5 (`g5-u2`).
 */
export const compareDecimals: ContentModule = {
  id: 'g4-u5-m5',
  unitId: 'g4-u5',
  grade: 4,
  title: 'Compare Decimals',
  icon: '⚖️',
  prereq: ['g4-u5-m4'],
  skills: ['compare-decimal', 'fraction-to-decimal'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['compare-symbol', 'choose-text', 'keypad'],
  visuals: ['bar-model', 'counter-objects', 'fraction-shape'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four of ten parts.',
      visual: { kind: 'counter-objects', count: 10, icon: '🟣' },
      action: 'tap-count',
      target: 4,
      hint: 'Four tenths in all.',
    },
    {
      stage: 'pictorial',
      prompt: '0.7 is longer than 0.4.',
      visual: { kind: 'bars', lengths: [0.7, 0.4] },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: '0.7 is more than 0.45.',
      visual: { kind: 'bars', lengths: [0.7, 0.45] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Compare tenths first, then hundredths.',
      visual: { kind: 'fraction', parts: 10, shaded: 7, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'compare-symbol',
      skill: 'compare-decimal',
      params: { a: [1, 9], b: [1, 9] },
      answer: (p) => Math.sign((p.a as number) - (p.b as number)),
      text: (p) => `0.${p.a} ? 0.${p.b}`,
    },
    {
      // Persepuluhan lawan perseratusan: 0.4 dan 0.45 dibandingkan setelah
      // keduanya dibaca sebagai perseratusan (40 lawan 45).
      type: 'compare-symbol',
      skill: 'compare-decimal',
      params: { a: [1, 9], b: [11, 99] },
      answer: (p) => Math.sign((p.a as number) * 10 - (p.b as number)),
      text: (p) => `0.${p.a} ? 0.${p.b}`,
      exclude: (p) => (p.b as number) % 10 === 0,
    },
    {
      type: 'choose-text',
      skill: 'fraction-to-decimal',
      params: { i: [0, 5], s: [1, 9] },
      answer: () => 0,
      text: (p) => `Which one is the same as ${p.s}/${DENOMS[p.i as number]}?`,
      exclude: (p) => {
        const d = DENOMS[p.i as number] as number;
        return (p.s as number) >= d || ((p.s as number) * 100) % d !== 0;
      },
      options: (p) => {
        const d = DENOMS[p.i as number] as number;
        return [
          decimalOf(((p.s as number) * 100) / d),
          `0.${p.s}`,
          `0.0${p.s}`,
          `${p.s}.${d}`,
        ];
      },
    },
    {
      // Langkah kerjanya sendiri, diketik: berapa perseratusan pecahan itu.
      type: 'keypad',
      skill: 'fraction-to-decimal',
      params: { i: [0, 5], s: [1, 9] },
      answer: (p) => ((p.s as number) * 100) / (DENOMS[p.i as number] as number),
      text: (p) => `${p.s}/${DENOMS[p.i as number]} = ?/100`,
      exclude: (p) => {
        const d = DENOMS[p.i as number] as number;
        return (p.s as number) >= d || ((p.s as number) * 100) % d !== 0;
      },
    },
  ],
};
