import type { ContentModule } from '../../types';

export const timesSeven: ContentModule = {
  id: 'g3-u2-m5',
  unitId: 'g3-u2',
  grade: 3,
  title: 'Times Seven',
  icon: '7️⃣',
  prereq: ['g3-u2-m4'],
  skills: ['times-7'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap fourteen dots.',
      visual: { kind: 'counter-objects', count: 20, icon: '🟡' },
      action: 'tap-count',
      target: 14,
      hint: 'Seven groups of two.',
    },
    {
      stage: 'pictorial',
      prompt: 'Seven rows of three is twenty one.',
      visual: { kind: 'array', rows: 7, cols: 3 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Times seven is times six, add one more.',
      visual: { kind: 'array', rows: 7, cols: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'times-7',
      params: { n: [1, 10] },
      answer: (p) => (p.n as number) * 7,
      text: (p) => `7 × ${p.n} = ?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) * 6, // kurang satu baris
    },
    {
      type: 'keypad',
      skill: 'times-7',
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 7,
      text: (p) => `${p.n} × 7 = ?`,
    },
  ],
};
