import type { ContentModule } from '../../types';

export const timesAndDivide: ContentModule = {
  id: 'g3-u3-m5',
  unitId: 'g3-u3',
  grade: 3,
  title: 'Times and Divide',
  icon: '🔗',
  prereq: ['g3-u3-m4'],
  skills: ['inverse-times'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['missing-number', 'keypad'],
  visuals: ['array-grid'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twenty dots.',
      visual: { kind: 'counter-objects', count: 20, icon: '🟡' },
      action: 'tap-count',
      target: 20,
      hint: 'Four rows of five.',
    },
    {
      stage: 'pictorial',
      prompt: 'One array makes four facts.',
      visual: { kind: 'array', rows: 4, cols: 5 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '4 × 5 = 20 so 20 ÷ 5 = 4.',
      visual: { kind: 'array', rows: 4, cols: 5 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'missing-number',
      skill: 'inverse-times',
      params: { a: [2, 9], b: [2, 9] },
      answer: (p) => p.b as number,
      text: (p) => `${p.a} × ? = ${(p.a as number) * (p.b as number)}`,
      distractors: 'near',
      misconception: (p) => (p.a as number) * (p.b as number) - (p.a as number),
    },
    {
      type: 'keypad',
      skill: 'inverse-times',
      params: { a: [2, 9], b: [2, 9] },
      answer: (p) => p.a as number,
      text: (p) => `${(p.a as number) * (p.b as number)} ÷ ${p.b} = ?`,
    },
  ],
};
