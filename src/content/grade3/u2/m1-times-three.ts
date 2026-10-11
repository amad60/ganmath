import type { ContentModule } from '../../types';

export const timesThree: ContentModule = {
  id: 'g3-u2-m1',
  unitId: 'g3-u2',
  grade: 3,
  title: 'Times Three',
  icon: '3️⃣',
  prereq: ['g3-u1-m5'],
  skills: ['times-3'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid'],
  vocab: ['table'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Make three rows of four.',
      visual: { kind: 'array', rows: 3, cols: 4 },
      action: 'watch',
      hint: 'Four in each row.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three rows of four is twelve.',
      visual: { kind: 'array', rows: 3, cols: 4, still: true, highlightRow: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 3 × 4 = 12.',
      visual: { kind: 'array', rows: 3, cols: 4, still: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'times-3',
      params: { n: [1, 10] },
      answer: (p) => (p.n as number) * 3,
      text: (p) => `3 × ${p.n} = ?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) + 3, // menjumlahkan, bukan mengalikan
    },
    {
      type: 'keypad',
      skill: 'times-3',
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 3,
      text: (p) => `${p.n} × 3 = ?`,
    },
    {
      type: 'keypad',
      skill: 'times-3',
      story: true,
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 3,
      text: (p) => `${p.n} baskets. 3 eggs in each basket. How many eggs?`,
    },
    {
      type: 'keypad',
      skill: 'times-3',
      story: true,
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 3,
      text: (p) => `Ana buys ${p.n} bags. Each bag has 3 apples. How many apples?`,
    },
  ],
};
