import type { ContentModule } from '../../types';

/**
 * Gerbang unit pecahan senilai. Yang dibangun di sini bukan aturannya, tapi
 * KEYAKINAN bahwa dua nama berbeda bisa menutup luas yang sama persis — kalau
 * anak belum percaya itu, "kali atas dan bawah" hanyalah ritual tanpa makna.
 *
 * Karena itu setiap soal di sini punya gambar: anak menyebut nama kedua dari
 * bentuk yang dilihatnya, bukan dari rumus.
 */
export const sameSizeFractions: ContentModule = {
  id: 'g4-u4-m1',
  unitId: 'g4-u4',
  grade: 4,
  title: 'Same Size Fractions',
  icon: '🧩',
  prereq: ['g4-u3-m6'],
  skills: ['equivalent-fraction-model'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['fraction-shape', 'bar-model', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap two parts.',
      visual: { kind: 'counter-objects', count: 4, icon: '🍫' },
      action: 'tap-count',
      target: 2,
      hint: 'Two of four parts.',
    },
    {
      stage: 'pictorial',
      prompt: 'Two of four parts are shaded.',
      visual: { kind: 'fraction', parts: 4, shaded: 2, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: '2/4 covers the same as 1/2.',
      visual: { kind: 'bars', lengths: [0.5, 0.5] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'So 2/4 and 1/2 are equal.',
      visual: { kind: 'fraction', parts: 2, shaded: 1, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Gambar memperlihatkan sk/pk; anak memilih nama sederhananya s/p.
      type: 'choose-text',
      skill: 'equivalent-fraction-model',
      params: { s: [1, 4], p: [2, 5], k: [2, 3] },
      answer: () => 0,
      text: () => 'Which one is the same?',
      visual: (p) => ({
        kind: 'fraction',
        parts: (p.p as number) * (p.k as number),
        shaded: (p.s as number) * (p.k as number),
        shape: 'square',
      }),
      exclude: (p) =>
        (p.s as number) >= (p.p as number) || (p.p as number) * (p.k as number) > 12,
      options: (p) => [
        `${p.s}/${p.p}`,
        `${p.p}/${p.s}`,
        `${p.s}/${(p.p as number) * (p.k as number)}`,
        `${(p.s as number) * (p.k as number)}/${p.p}`,
      ],
    },
    {
      type: 'choose-number',
      skill: 'equivalent-fraction-model',
      params: { s: [1, 4], p: [2, 6], k: [2, 3] },
      answer: (p) => (p.s as number) * (p.k as number),
      text: (p) => `${p.s}/${p.p} = ?/${(p.p as number) * (p.k as number)}`,
      visual: (p) => ({
        kind: 'fraction',
        parts: (p.p as number) * (p.k as number),
        shaded: (p.s as number) * (p.k as number),
        shape: 'square',
      }),
      exclude: (p) =>
        (p.s as number) >= (p.p as number) || (p.p as number) * (p.k as number) > 12,
      distractors: 'near',
      // Miskonsepsi khas: bawahnya berubah, atasnya disalin apa adanya.
      misconception: (p) => p.s as number,
    },
  ],
};
