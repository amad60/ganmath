import type { ContentModule } from '../../types';

export const equalFractions: ContentModule = {
  id: 'g3-u5-m5',
  unitId: 'g3-u5',
  grade: 3,
  title: 'Equal Fractions',
  icon: '🟰',
  prereq: ['g3-u5-m4'],
  skills: ['equivalent-fraction'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['fraction-shape'],
  vocab: ['covers'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap two parts.',
      visual: { kind: 'counter-objects', count: 4, icon: '🧀' },
      action: 'tap-count',
      target: 2,
      hint: 'Two of four parts.',
    },
    {
      stage: 'pictorial',
      prompt: 'Two fourths covers the same as half.',
      visual: { kind: 'fraction', parts: 4, shaded: 2, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'So 2/4 = 1/2.',
      visual: { kind: 'fraction', parts: 2, shaded: 1, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'equivalent-fraction',
      params: { s: [1, 4], p: [2, 5], k: [2, 4] },
      answer: (p) => (p.p as number) * (p.k as number),
      text: (p) => `${p.s}/${p.p} = ${(p.s as number) * (p.k as number)}/?`,
      exclude: (p) => (p.s as number) >= (p.p as number),
      distractors: 'near',
      misconception: (p) => p.p as number, // menyalin penyebut lama
    },
    {
      type: 'keypad',
      skill: 'equivalent-fraction',
      params: { s: [1, 4], p: [2, 5], k: [2, 4] },
      answer: (p) => (p.s as number) * (p.k as number),
      text: (p) => `${p.s}/${p.p} = ?/${(p.p as number) * (p.k as number)}`,
      exclude: (p) => (p.s as number) >= (p.p as number),
    },
  ],
};
