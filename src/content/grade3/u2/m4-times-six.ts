import type { ContentModule } from '../../types';

export const timesSix: ContentModule = {
  id: 'g3-u2-m4',
  unitId: 'g3-u2',
  grade: 3,
  title: 'Times Six',
  icon: '6️⃣',
  prereq: ['g3-u2-m3'],
  skills: ['times-6'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid'],
  vocab: ['eighteen'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twelve dots.',
      visual: { kind: 'counter-objects', count: 18, icon: '🔴' },
      action: 'tap-count',
      target: 12,
      hint: 'Six groups of two.',
    },
    {
      stage: 'pictorial',
      prompt: 'Six rows of three is eighteen.',
      visual: { kind: 'array', rows: 6, cols: 3 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Times six is times five, add one more.',
      visual: { kind: 'array', rows: 6, cols: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'times-6',
      params: { n: [1, 10] },
      answer: (p) => (p.n as number) * 6,
      text: (p) => `6 × ${p.n} = ?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) * 5, // berhenti di tabel lima
    },
    {
      type: 'keypad',
      skill: 'times-6',
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 6,
      text: (p) => `${p.n} × 6 = ?`,
    },
    {
      type: 'keypad',
      skill: 'times-6',
      story: true,
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 6,
      text: (p) => `${p.n} boxes. 6 cookies in each box. How many cookies?`,
    },
    {
      type: 'keypad',
      skill: 'times-6',
      story: true,
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 6,
      text: (p) => `Ana reads 6 books each week for ${p.n} weeks. How many books?`,
    },
  ],
};
