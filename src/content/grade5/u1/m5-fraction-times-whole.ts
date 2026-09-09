import type { ContentModule } from '../../types';

/**
 * Perkalian dimulai dari arti yang sudah dipunyai anak sejak g3-u5-m6: "2/3 dari
 * 12". Yang baru hanyalah menuliskannya sebagai perkalian.
 *
 * Urutan langkahnya dijaga tetap "bagi dulu dengan bawahnya, baru kali dengan
 * atasnya" — bukan karena hasilnya berbeda, tapi karena angka yang dipegang anak
 * tetap kecil dan bisa dia gambar sebagai kelompok.
 */
export const fractionTimesWhole: ContentModule = {
  id: 'g5-u1-m5',
  unitId: 'g5-u1',
  grade: 5,
  title: 'Fraction Times Whole',
  icon: '✖️',
  prereq: ['g5-u1-m4'],
  skills: ['fraction-times-whole'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number'],
  visuals: ['array-grid', 'counter-objects', 'fraction-shape'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twelve apples.',
      visual: { kind: 'counter-objects', count: 12, icon: '🍎' },
      action: 'tap-count',
      target: 12,
      hint: 'Split them into three groups.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three groups of four.',
      visual: { kind: 'array', rows: 3, cols: 4 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'One group is 1/3 of 12.',
      visual: { kind: 'array', rows: 3, cols: 4, highlightRow: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'So 2/3 of 12 is 8.',
      visual: { kind: 'array', rows: 3, cols: 4, highlightRow: 1 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Divide by the bottom, times the top.',
      visual: { kind: 'fraction', parts: 3, shaded: 2, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Bilangannya habis dibagi penyebut, jadi hasilnya bilangan bulat.
      type: 'keypad',
      skill: 'fraction-times-whole',
      params: { b: [2, 6], m: [2, 8], a: [1, 5] },
      answer: (p) => (p.a as number) * (p.m as number),
      text: (p) => `${p.a}/${p.b} of ${(p.b as number) * (p.m as number)} = ?`,
      exclude: (p) => (p.a as number) >= (p.b as number),
    },
    {
      type: 'choose-number',
      skill: 'fraction-times-whole',
      params: { b: [2, 6], m: [2, 8], a: [1, 5] },
      answer: (p) => (p.a as number) * (p.m as number),
      text: (p) => `${(p.b as number) * (p.m as number)} × ${p.a}/${p.b} = ?`,
      exclude: (p) => (p.a as number) >= (p.b as number),
      distractors: 'near',
      // Miskonsepsi khas: berhenti setelah membagi, lupa mengali dengan atasnya.
      // Hilang sendiri saat pembilangnya 1, karena di sana ia memang jawabannya.
      misconception: (p) => p.m as number,
    },
    {
      // Bilangan yang TIDAK habis dibagi: hasilnya tetap pecahan, dan yang diketik
      // anak adalah pembilangnya. Ini yang menyiapkan m6.
      type: 'keypad',
      skill: 'fraction-times-whole',
      params: { b: [2, 6], n: [2, 9], a: [1, 5] },
      answer: (p) => (p.a as number) * (p.n as number),
      text: (p) => `${p.a}/${p.b} × ${p.n} = ?/${p.b}`,
      exclude: (p) => (p.a as number) >= (p.b as number),
    },
  ],
};
