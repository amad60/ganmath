import type { ContentModule } from '../../types';

/**
 * Penutup unit: pecahan yang lebih dari satu utuh. Sengaja hanya PENGENALAN —
 * membaca 7/2 sebagai 3 dan 1/2 dan sebaliknya. Menjumlah atau mengurang pecahan
 * campuran (dengan meminjam dari bagian utuhnya) adalah materi Grade 5.
 */
export const mixedNumbers: ContentModule = {
  id: 'g4-u4-m7',
  unitId: 'g4-u4',
  grade: 4,
  title: 'Mixed Numbers',
  icon: '🥧',
  prereq: ['g4-u4-m6'],
  skills: ['mixed-number'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad', 'choose-text'],
  visuals: ['fraction-shape', 'number-line', 'counter-objects'],
  vocab: ['mixed'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five parts.',
      visual: { kind: 'counter-objects', count: 5, icon: '🍕' },
      action: 'tap-count',
      target: 5,
      hint: 'Five halves is more than two.',
    },
    {
      stage: 'pictorial',
      prompt: 'Two halves make one whole.',
      visual: { kind: 'fraction', parts: 2, shaded: 2, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'One half is left over.',
      visual: { kind: 'fraction', parts: 2, shaded: 1, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'So 3/2 is 1 and 1/2.',
      visual: { kind: 'fraction', parts: 2, shaded: 1, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '1 and 1/2 is a mixed number.',
      visual: { kind: 'number-line', min: 0, max: 3, value: 1, marks: [1] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'mixed-number',
      params: { d: [2, 6], w: [1, 3], r: [1, 5] },
      answer: (p) => p.w as number,
      text: (p) =>
        `How many wholes are in ${(p.w as number) * (p.d as number) + (p.r as number)}/${p.d}?`,
      exclude: (p) => (p.r as number) >= (p.d as number),
      distractors: 'near',
      // Miskonsepsi khas: menyebut sisa bagiannya, bukan banyak utuhnya.
      misconception: (p) => p.r as number,
    },
    {
      type: 'keypad',
      skill: 'mixed-number',
      params: { d: [2, 6], w: [1, 3], r: [1, 5] },
      answer: (p) => p.r as number,
      text: (p) =>
        `${(p.w as number) * (p.d as number) + (p.r as number)}/${p.d} = ${p.w} ${
          (p.w as number) === 1 ? 'whole' : 'wholes'
        } and ?/${p.d}`,
      exclude: (p) => (p.r as number) >= (p.d as number),
    },
    {
      // Arah sebaliknya: pecahan campuran kembali menjadi satu pecahan.
      type: 'keypad',
      skill: 'mixed-number',
      params: { d: [2, 6], w: [1, 3], r: [1, 5] },
      answer: (p) => (p.w as number) * (p.d as number) + (p.r as number),
      text: (p) => `${p.w} and ${p.r}/${p.d} = ?/${p.d}`,
      exclude: (p) => (p.r as number) >= (p.d as number),
    },
    {
      type: 'choose-text',
      skill: 'mixed-number',
      params: { d: [2, 6], w: [1, 3], r: [1, 5] },
      answer: () => 0,
      text: (p) =>
        `Which is the same as ${(p.w as number) * (p.d as number) + (p.r as number)}/${p.d}?`,
      exclude: (p) => (p.r as number) >= (p.d as number),
      options: (p) => [
        `${p.w} and ${p.r}/${p.d}`,
        `${(p.w as number) + 1} and ${p.r}/${p.d}`,
        `${p.w} and ${p.d}/${p.r}`,
        `${p.w} and ${p.r}/${(p.w as number) * (p.d as number) + (p.r as number)}`,
      ],
    },
  ],
};
