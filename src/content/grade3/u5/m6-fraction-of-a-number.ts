import type { ContentModule } from '../../types';

/**
 * Tempat pecahan bertemu pembagian di U3: "sepertiga dari 12" adalah 12 : 3.
 * Diletakkan paling akhir supaya anak sudah punya kedua alatnya.
 */
export const fractionOfANumber: ContentModule = {
  id: 'g3-u5-m6',
  unitId: 'g3-u5',
  grade: 3,
  title: 'Fraction of a Number',
  icon: '🍎',
  prereq: ['g3-u5-m5'],
  skills: ['fraction-of'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twelve dots.',
      visual: { kind: 'counter-objects', count: 12, icon: '🍎' },
      action: 'tap-count',
      target: 12,
      hint: 'Count them all.',
    },
    {
      stage: 'pictorial',
      prompt: 'Twelve in three equal rows.',
      visual: { kind: 'array', rows: 3, cols: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'One third of 12 is 12 ÷ 3.',
      visual: { kind: 'array', rows: 3, cols: 4, highlightRow: 0 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'fraction-of',
      params: { d: [2, 5], n: [2, 9] },
      answer: (p) => p.n as number,
      text: (p) => `1/${p.d} of ${(p.d as number) * (p.n as number)} = ?`,
      visual: (p) => ({ kind: 'array', rows: p.d as number, cols: p.n as number, highlightRow: 0 }),
      distractors: 'near',
      misconception: (p) => p.d as number, // menyebut angka penyebutnya
    },
    {
      type: 'keypad',
      skill: 'fraction-of',
      params: { d: [2, 5], n: [2, 9], s: [2, 4] },
      answer: (p) => (p.n as number) * (p.s as number),
      text: (p) => `${p.s}/${p.d} of ${(p.d as number) * (p.n as number)} = ?`,
      exclude: (p) => (p.s as number) >= (p.d as number),
    },
    {
      type: 'keypad',
      skill: 'fraction-of',
      story: true,
      params: { d: [2, 5], n: [2, 9], s: [2, 4] },
      answer: (p) => (p.n as number) * (p.s as number),
      text: (p) => `Ana has ${(p.d as number) * (p.n as number)} sweets. She eats ${p.s}/${p.d} of them. How many?`,
      exclude: (p) => (p.s as number) >= (p.d as number),
    },
    {
      type: 'keypad',
      skill: 'fraction-of',
      story: true,
      params: { d: [2, 5], n: [2, 9], s: [2, 4] },
      answer: (p) => (p.n as number) * (p.s as number),
      text: (p) => `${(p.d as number) * (p.n as number)} books on a shelf. ${p.s}/${p.d} are red. How many are red?`,
      exclude: (p) => (p.s as number) >= (p.d as number),
    },
  ],
};
