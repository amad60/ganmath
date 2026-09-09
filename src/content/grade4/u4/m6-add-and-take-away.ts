import type { ContentModule } from '../../types';

/**
 * Menjumlah dan mengurang pecahan BERPENYEBUT SAMA — batas Grade 4. Penyebut
 * berbeda menuntut penyamaan dua arah dan menjadi materi Grade 5.
 *
 * Aturan kedua menyerang miskonsepsi terbesarnya secara langsung: anak yang
 * menjumlah penyebutnya juga (1/4 + 2/4 = 3/8) akan menemukan 8 di antara
 * pilihannya, jadi jawaban salahnya terbaca sebagai diagnosis.
 */
export const addAndTakeAway: ContentModule = {
  id: 'g4-u4-m6',
  unitId: 'g4-u4',
  grade: 4,
  title: 'Add and Take Away',
  icon: '➕',
  prereq: ['g4-u4-m5'],
  skills: ['add-same-bottom', 'subtract-same-bottom'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number'],
  visuals: ['fraction-shape', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap two parts.',
      visual: { kind: 'counter-objects', count: 8, icon: '🍕' },
      action: 'tap-count',
      target: 2,
      hint: 'Then tap three more parts.',
    },
    {
      stage: 'pictorial',
      prompt: 'Two of eight parts are shaded.',
      visual: { kind: 'fraction', parts: 8, shaded: 2, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Add three more parts: 5/8.',
      visual: { kind: 'fraction', parts: 8, shaded: 5, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Add the tops. Keep the same bottom.',
      visual: { kind: 'fraction', parts: 8, shaded: 5, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'keypad',
      skill: 'add-same-bottom',
      params: { d: [3, 10], a: [1, 8], b: [1, 8] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: (p) => `${p.a}/${p.d} + ${p.b}/${p.d} = ?/${p.d}`,
      // Hasilnya dijaga tidak melebihi satu utuh: pecahan tidak murni baru di m7.
      exclude: (p) => (p.a as number) + (p.b as number) > (p.d as number),
    },
    {
      type: 'choose-number',
      skill: 'add-same-bottom',
      params: { d: [3, 10], a: [1, 8], b: [1, 8] },
      answer: (p) => p.d as number,
      text: (p) =>
        `${p.a}/${p.d} + ${p.b}/${p.d} = ${(p.a as number) + (p.b as number)}/?`,
      exclude: (p) => (p.a as number) + (p.b as number) > (p.d as number),
      distractors: 'near',
      // Miskonsepsi khas: penyebutnya ikut dijumlahkan.
      misconception: (p) => 2 * (p.d as number),
    },
    {
      type: 'keypad',
      skill: 'subtract-same-bottom',
      params: { d: [3, 10], a: [2, 9], b: [1, 8] },
      answer: (p) => (p.a as number) - (p.b as number),
      text: (p) => `${p.a}/${p.d} − ${p.b}/${p.d} = ?/${p.d}`,
      exclude: (p) => (p.a as number) >= (p.d as number) || (p.b as number) >= (p.a as number),
    },
  ],
};
