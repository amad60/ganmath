import type { ContentModule } from '../../types';

export const subtractWithin20: ContentModule = {
  id: 'g1-u4-m6',
  unitId: 'g1-u4',
  grade: 1,
  title: 'Subtract within 20',
  icon: '➖',
  prereq: ['g1-u4-m5', 'g1-u2-m6'],
  skills: ['sub-within-20'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['ten-frame', 'number-line'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill fourteen boxes.',
      visual: { kind: 'ten-frame', value: 0, capacity: 20 },
      action: 'tap-fill',
      target: 14,
      hint: 'Ten and four.',
    },
    {
      stage: 'pictorial',
      prompt: 'Take away six. Eight are left.',
      visual: { kind: 'ten-frame', value: 8, capacity: 20 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Take from the ten first.',
      visual: { kind: 'number-line', min: 0, max: 20, value: 8 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'sub-within-20',
      params: { a: [11, 20], b: [2, 9] },
      answer: (p) => (p.a as number) - (p.b as number),
      text: (p) => `${p.a} - ${p.b} = ?`,
      distractors: 'near',
      misconception: (p) => (p.a as number) + (p.b as number),
    },
    {
      type: 'keypad',
      skill: 'sub-within-20',
      params: { a: [12, 20], b: [3, 9] },
      answer: (p) => (p.a as number) - (p.b as number),
      text: (p) => `${p.a} - ${p.b} = ?`,
    },
  ],
};
