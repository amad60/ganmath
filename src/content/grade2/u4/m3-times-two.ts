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
  vocab: ['times', 'multiply'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four dots.',
      visual: { kind: 'counter-objects', count: 8, icon: '🔵' },
      action: 'tap-count',
      target: 4,
      hint: 'Two groups of four.',
    },
    {
      stage: 'pictorial',
      prompt: 'Two rows of four is eight.',
      visual: { kind: 'array', rows: 2, cols: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 2 × 4 = 8.',
      visual: { kind: 'array', rows: 2, cols: 4 },
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
      text: (p) => `Ana has ${p.n} books. Budi has twice as many. How many?`,
    },
  ],
};
