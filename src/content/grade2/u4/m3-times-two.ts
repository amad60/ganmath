import type { ContentModule } from '../../types';

export const timesTwo: ContentModule = {
  id: 'g2-u4-m3',
  unitId: 'g2-u4',
  grade: 2,
  title: 'Times Two',
  icon: '✌️',
  prereq: ['g2-u4-m2'],
  skills: ['times-2'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid'],
  vocab: ['times', 'multiply', 'does'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap eight dots.',
      visual: { kind: 'counter-objects', count: 8, icon: '🔵', columns: 4 },
      action: 'tap-count',
      target: 8,
      hint: 'Two groups of four.',
    },
    {
      stage: 'pictorial',
      prompt: 'Two rows of four is eight.',
      visual: { kind: 'array', rows: 2, cols: 4, still: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 2 × 4 = 8.',
      visual: { kind: 'array', rows: 2, cols: 4, still: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'times-2',
      params: { n: [1, 10] },
      answer: (p) => (p.n as number) * 2,
      text: (p) => `2 × ${p.n} = ?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) + 2, // menjumlahkan, bukan mengalikan
    },
    {
      type: 'keypad',
      skill: 'times-2',
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 2,
      text: (p) => `${p.n} × 2 = ?`,
    },
    {
      type: 'keypad',
      skill: 'times-2',
      story: true,
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 2,
      text: (p) => `${p.n} bags. 2 apples in each bag. How many apples?`,
    },
    {
      type: 'keypad',
      skill: 'times-2',
      story: true,
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 2,
      text: (p) => `Ana has ${p.n} books. Budi has 2 times as many. How many does Budi have?`,
    },
  ],
};
