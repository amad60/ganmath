import type { ContentModule } from '../../types';

export const countTo5: ContentModule = {
  id: 'g1-u1-m1',
  unitId: 'g1-u1',
  grade: 1,
  title: 'Count to 5',
  icon: '🍎',
  prereq: [],
  skills: ['count-to-5'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['count-tap', 'choose-number'],
  visuals: ['counter-objects', 'ten-frame'],
  vocab: ['count', 'how many', 'apple', 'apples'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap each apple to count.',
      visual: { kind: 'counter-objects', count: 4, icon: '🍎' },
      action: 'tap-count',
      target: 4,
      hint: 'One tap, one number.',
    },
    {
      stage: 'pictorial',
      prompt: 'Fill the boxes. Count them.',
      visual: { kind: 'ten-frame', value: 0 },
      action: 'tap-fill',
      target: 5,
      hint: 'Fill 5 boxes.',
    },
    {
      stage: 'abstract',
      prompt: 'Five dots. The number is 5.',
      visual: { kind: 'ten-frame', value: 5 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'count-tap',
      skill: 'count-to-5',
      params: { n: [1, 5] },
      answer: (p) => p.n as number,
      text: (p) => `How many? ${'🍎'.repeat(p.n as number)}`,
    },
    {
      type: 'choose-number',
      skill: 'count-to-5',
      params: { n: [1, 5] },
      answer: (p) => p.n as number,
      text: (p) => `How many dots? ${'●'.repeat(p.n as number)}`,
      distractors: 'near',
      misconception: (p) => (p.n as number) + 1, // salah hitung satu lebih (off-by-one)
    },
  ],
};
