import type { ContentModule } from '../../types';

export const takeAwayFrom10: ContentModule = {
  id: 'g1-u2-m6',
  unitId: 'g1-u2',
  grade: 1,
  title: 'Take Away from 10',
  icon: '🔻',
  prereq: ['g1-u2-m5', 'g1-u2-m3'],
  skills: ['sub-within-10'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['ten-frame'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill ten boxes.',
      visual: { kind: 'ten-frame', value: 0 },
      action: 'tap-fill',
      target: 10,
      hint: 'Start with ten.',
    },
    {
      stage: 'pictorial',
      prompt: 'Take away three. Seven are left.',
      visual: { kind: 'ten-frame', value: 7 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 10 - 3 = 7.',
      visual: { kind: 'ten-frame', value: 7 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'sub-within-10',
      params: { a: [5, 10], b: [1, 9] },
      answer: (p) => (p.a as number) - (p.b as number),
      text: (p) => `${p.a} - ${p.b} = ?`,
      exclude: (p) => (p.b as number) > (p.a as number),
      distractors: 'near',
      misconception: (p) => (p.a as number) + (p.b as number),
    },
    {
      type: 'keypad',
      skill: 'sub-within-10',
      params: { a: [6, 10], b: [1, 5] },
      answer: (p) => (p.a as number) - (p.b as number),
      text: (p) => `${p.a} - ${p.b} = ?`,
      exclude: (p) => (p.b as number) > (p.a as number),
    },
  ],
};
