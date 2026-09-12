import type { ContentModule } from '../../types';

export const timesNine: ContentModule = {
  id: 'g3-u2-m7',
  unitId: 'g3-u2',
  grade: 3,
  title: 'Times Nine',
  icon: '9️⃣',
  prereq: ['g3-u2-m6'],
  skills: ['times-9'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap eighteen dots.',
      visual: { kind: 'counter-objects', count: 20, icon: '🟤' },
      action: 'tap-count',
      target: 18,
      hint: 'Nine groups of two.',
    },
    {
      stage: 'pictorial',
      prompt: 'Nine rows of three is twenty seven.',
      visual: { kind: 'array', rows: 9, cols: 3 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Times ten, then take one group away.',
      visual: { kind: 'array', rows: 9, cols: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'times-9',
      params: { n: [1, 10] },
      answer: (p) => (p.n as number) * 9,
      text: (p) => `9 × ${p.n} = ?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) * 10, // lupa mengambil satu kelompok
    },
    {
      type: 'keypad',
      skill: 'times-9',
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 9,
      text: (p) => `${p.n} × 9 = ?`,
    },
    {
      type: 'keypad',
      skill: 'times-9',
      story: true,
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 9,
      text: (p) => `${p.n} plates. 9 sweets on each plate. How many sweets?`,
    },
    {
      type: 'keypad',
      skill: 'times-9',
      story: true,
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 9,
      text: (p) => `Ana has ${p.n} bags. Each bag has 9 marbles. How many marbles?`,
    },
  ],
};
