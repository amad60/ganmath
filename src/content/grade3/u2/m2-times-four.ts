import type { ContentModule } from '../../types';

export const timesFour: ContentModule = {
  id: 'g3-u2-m2',
  unitId: 'g3-u2',
  grade: 3,
  title: 'Times Four',
  icon: '4️⃣',
  prereq: ['g3-u2-m1'],
  skills: ['times-4'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid'],
  vocab: ['double'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap eight dots.',
      visual: { kind: 'counter-objects', count: 12, icon: '🟣' },
      action: 'tap-count',
      target: 8,
      hint: 'Four groups of two.',
    },
    {
      stage: 'pictorial',
      prompt: 'Four rows of three is twelve.',
      visual: { kind: 'array', rows: 4, cols: 3 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Times four is double, double.',
      visual: { kind: 'array', rows: 4, cols: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'times-4',
      params: { n: [1, 10] },
      answer: (p) => (p.n as number) * 4,
      text: (p) => `4 × ${p.n} = ?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) * 2, // baru sekali menggandakan
    },
    {
      type: 'keypad',
      skill: 'times-4',
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 4,
      text: (p) => `${p.n} × 4 = ?`,
    },
  ],
};
