import type { ContentModule } from '../../types';

/**
 * Tiga bacaan dari soal yang sama: yang benar, "atas dijumlah bawah dijumlah"
 * (kebiasaan dari penjumlahan pecahan), dan "dikali menyilang".
 *
 * Dipakai bersama oleh `options` dan `exclude` supaya kombinasi yang membuat dua
 * pilihan bertuliskan pecahan yang sama persis dibuang — pilihan kembar membuat
 * soal tidak punya jawaban tunggal.
 */
function readings(a: number, b: number, c: number, d: number): string[] {
  return [`${a * c}/${b * d}`, `${a + c}/${b + d}`, `${a * d}/${b * c}`];
}

/**
 * Pecahan dikali pecahan. Aturannya justru yang paling mudah di seluruh unit —
 * kali atas dengan atas, bawah dengan bawah, tanpa menyamakan apa pun — dan di
 * situlah bahayanya: anak yang baru saja belajar bahwa penjumlahan MENUNTUT
 * penyebut sama akan menyamakan penyebut di sini juga.
 *
 * Karena itu materi menyandarkannya pada kata "dari", bukan pada aturan: setengah
 * DARI sepertiga terlihat lebih kecil daripada dua-duanya. Hasil yang mengecil
 * adalah kejutan yang perlu dilihat, bukan dihafal.
 */
export const fractionTimesFraction: ContentModule = {
  id: 'g5-u1-m6',
  unitId: 'g5-u1',
  grade: 5,
  title: 'Fraction Times Fraction',
  icon: '🔢',
  prereq: ['g5-u1-m5'],
  skills: ['fraction-times-fraction'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'choose-text'],
  visuals: ['fraction-shape', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three parts.',
      visual: { kind: 'counter-objects', count: 6, icon: '🍫' },
      action: 'tap-count',
      target: 3,
      hint: 'Half of six is three.',
    },
    {
      stage: 'pictorial',
      prompt: 'One third is shaded.',
      visual: { kind: 'fraction', parts: 3, shaded: 1, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Half of one third is 1/6.',
      visual: { kind: 'fraction', parts: 6, shaded: 1, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Multiply the tops. Multiply the bottoms.',
      visual: { kind: 'fraction', parts: 6, shaded: 1, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'So 1/2 × 1/3 is 1/6.',
      visual: { kind: 'fraction', parts: 6, shaded: 1, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'keypad',
      skill: 'fraction-times-fraction',
      params: { a: [1, 5], b: [2, 6], c: [1, 5], d: [2, 6] },
      answer: (p) => (p.a as number) * (p.c as number),
      text: (p) => `${p.a}/${p.b} × ${p.c}/${p.d} = ?/${(p.b as number) * (p.d as number)}`,
      exclude: (p) => (p.a as number) >= (p.b as number) || (p.c as number) >= (p.d as number),
    },
    {
      type: 'choose-number',
      skill: 'fraction-times-fraction',
      params: { a: [1, 5], b: [2, 6], c: [1, 5], d: [2, 6] },
      answer: (p) => (p.b as number) * (p.d as number),
      text: (p) =>
        `${p.a}/${p.b} × ${p.c}/${p.d} = ${(p.a as number) * (p.c as number)}/?`,
      exclude: (p) => (p.a as number) >= (p.b as number) || (p.c as number) >= (p.d as number),
      distractors: 'near',
      // Miskonsepsi khas: penyebutnya dijumlah, seperti pada penjumlahan pecahan.
      misconception: (p) => (p.b as number) + (p.d as number),
    },
    {
      type: 'choose-text',
      skill: 'fraction-times-fraction',
      params: { a: [1, 5], b: [2, 6], c: [1, 5], d: [2, 6] },
      answer: () => 0,
      text: (p) => `What is ${p.a}/${p.b} of ${p.c}/${p.d}?`,
      exclude: (p) => {
        const a = p.a as number;
        const b = p.b as number;
        const c = p.c as number;
        const d = p.d as number;
        if (a >= b || c >= d) return true;
        return new Set(readings(a, b, c, d)).size < 3;
      },
      options: (p) =>
        readings(p.a as number, p.b as number, p.c as number, p.d as number),
    },
  ],
};
