import type { ContentModule } from '../../types';

/**
 * Fase A Kurikulum Merdeka: "memahami setengah dan seperempat".
 * Yang menentukan bukan jumlah potongan, tapi potongan yang SAMA BESAR — karena itu
 * ada soal dengan pembagian tidak sama besar sebagai pengecoh miskonsepsi.
 */
export const halvesAndFourths: ContentModule = {
  id: 'g1-u6-m4',
  unitId: 'g1-u6',
  grade: 1,
  title: 'Halves and Fourths',
  icon: '🍕',
  prereq: ['g1-u6-m3'],
  skills: ['halves-fourths'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['fraction-shape'],
  vocab: ['equal', 'fourth', 'fourths', 'quarter', 'whole', 'shaded'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap two equal parts.',
      visual: { kind: 'counter-objects', count: 4, icon: '🍕' },
      action: 'tap-count',
      target: 2,
      hint: 'Two equal parts make halves.',
    },
    {
      stage: 'pictorial',
      prompt: 'One of two equal parts is half.',
      visual: { kind: 'fraction', parts: 2, shaded: 1 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'One of four equal parts is a fourth.',
      visual: { kind: 'fraction', parts: 4, shaded: 1 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'halves-fourths',
      params: { p: [2, 4], s: [1, 3] },
      answer: (p) => {
        const parts = p.p as number;
        const shaded = p.s as number;
        if (shaded === parts) return 3; // whole
        if (parts === 2) return 0; // half
        return shaded === 1 ? 1 : 2; // one fourth / three fourths
      },
      text: () => 'How much is shaded?',
      visual: (p) => ({ kind: 'fraction', parts: p.p as number, shaded: p.s as number }),
      exclude: (p) => (p.s as number) > (p.p as number) || (p.p as number) === 3,
      options: () => ['half', 'one fourth', 'three fourths', 'whole'],
    },
    {
      type: 'choose-number',
      skill: 'halves-fourths',
      params: { p: [2, 4] },
      answer: (p) => p.p as number,
      text: () => 'How many equal parts?',
      visual: (p) => ({ kind: 'fraction', parts: p.p as number, shaded: 1, shape: 'square' }),
      distractors: 'near',
      misconception: (p) => (p.p as number) + 1,
    },
  ],
};
