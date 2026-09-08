import type { ContentModule } from '../../types';

export const timesCheck: ContentModule = {
  id: 'g2-u4-m6',
  unitId: 'g2-u4',
  grade: 2,
  title: 'Twos, Fives, Tens',
  icon: '🎯',
  prereq: ['g2-u4-m5'],
  skills: ['times-2', 'times-5', 'times-10'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid'],
  vocab: [],
  masteryOverride: { accuracy: 0.9 },

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill five boxes.',
      visual: { kind: 'ten-frame', value: 0 },
      action: 'tap-fill',
      target: 5,
      hint: 'Groups of five.',
    },
    {
      stage: 'pictorial',
      prompt: 'Twos, fives and tens together.',
      visual: { kind: 'array', rows: 5, cols: 5 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Know them without counting.',
      visual: { kind: 'array', rows: 2, cols: 10 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'times-2',
      params: { t: [0, 2], n: [2, 10] },
      answer: (p) => [2, 5, 10][p.t as number]! * (p.n as number),
      text: (p) => `${[2, 5, 10][p.t as number]} × ${p.n} = ?`,
      distractors: 'near',
      misconception: (p) => [2, 5, 10][p.t as number]! + (p.n as number),
    },
    {
      type: 'keypad',
      skill: 'times-5',
      params: { t: [0, 2], n: [3, 9] },
      answer: (p) => [2, 5, 10][p.t as number]! * (p.n as number),
      text: (p) => `${p.n} × ${[2, 5, 10][p.t as number]} = ?`,
    },
  ],
};
