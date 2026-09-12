import type { ContentModule } from '../../types';

export const divideBy34: ContentModule = {
  id: 'g3-u3-m4',
  unitId: 'g3-u3',
  grade: 3,
  title: 'Divide by 3 and 4',
  icon: '🍰',
  prereq: ['g3-u3-m3'],
  skills: ['divide-3-4'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twelve dots.',
      visual: { kind: 'counter-objects', count: 12, icon: '🍓' },
      action: 'tap-count',
      target: 12,
      hint: 'Three rows of four.',
    },
    {
      stage: 'pictorial',
      prompt: 'Twelve in three rows is four.',
      visual: { kind: 'array', rows: 3, cols: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Use the times table you know.',
      visual: { kind: 'array', rows: 4, cols: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'divide-3-4',
      params: { d: [3, 4], n: [1, 10] },
      answer: (p) => p.n as number,
      text: (p) => `${(p.n as number) * (p.d as number)} ÷ ${p.d} = ?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) * (p.d as number) - (p.d as number),
    },
    {
      type: 'keypad',
      skill: 'divide-3-4',
      params: { d: [3, 4], n: [2, 10] },
      answer: (p) => p.n as number,
      text: (p) => `Share ${(p.n as number) * (p.d as number)} between ${p.d}.`,
    },
    {
      type: 'keypad',
      skill: 'divide-3-4',
      story: true,
      params: { d: [3, 4], n: [2, 10] },
      answer: (p) => p.n as number,
      text: (p) => `Ana shares ${(p.n as number) * (p.d as number)} marbles between ${p.d} friends. How many each?`,
    },
    {
      type: 'keypad',
      skill: 'divide-3-4',
      story: true,
      params: { d: [3, 4], n: [2, 10] },
      answer: (p) => p.n as number,
      text: (p) => `${(p.n as number) * (p.d as number)} seats in ${p.d} equal rows. How many in each row?`,
    },
  ],
};
