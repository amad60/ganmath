import type { ContentModule } from '../../types';

export const timesFive: ContentModule = {
  id: 'g2-u4-m4',
  unitId: 'g2-u4',
  grade: 2,
  title: 'Times Five',
  icon: '🖐️',
  prereq: ['g2-u4-m3'],
  skills: ['times-5'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill five boxes.',
      visual: { kind: 'ten-frame', value: 0 },
      action: 'tap-fill',
      target: 5,
      hint: 'One group of five.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three rows of five is fifteen.',
      visual: { kind: 'array', rows: 3, cols: 5 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Fives end in five or zero.',
      visual: { kind: 'array', rows: 4, cols: 5 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'times-5',
      params: { n: [1, 10] },
      answer: (p) => (p.n as number) * 5,
      text: (p) => `5 × ${p.n} = ?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) + 5,
    },
    {
      type: 'keypad',
      skill: 'times-5',
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 5,
      text: (p) => `${p.n} × 5 = ?`,
    },
  ],
};
