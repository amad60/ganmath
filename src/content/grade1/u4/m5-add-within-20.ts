import type { ContentModule } from '../../types';

export const addWithin20: ContentModule = {
  id: 'g1-u4-m5',
  unitId: 'g1-u4',
  grade: 1,
  title: 'Add within 20',
  icon: '🍀',
  prereq: ['g1-u4-m4', 'g1-u4-m3'],
  skills: ['add-within-20'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['ten-frame'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill seven, then six more.',
      visual: { kind: 'ten-frame', value: 0, capacity: 20 },
      action: 'tap-fill',
      target: 13,
      hint: 'Make ten first.',
    },
    {
      stage: 'pictorial',
      prompt: 'Seven and six make thirteen.',
      visual: { kind: 'ten-frame', value: 13, capacity: 20, split: 7 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 7 + 6 = 13.',
      visual: { kind: 'ten-frame', value: 13, capacity: 20, split: 10 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'add-within-20',
      params: { a: [2, 9], b: [2, 9] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: (p) => `${p.a} + ${p.b} = ?`,
      exclude: (p) => (p.a as number) + (p.b as number) <= 10,
      distractors: 'near',
      misconception: (p) => Math.abs((p.a as number) - (p.b as number)),
    },
    {
      type: 'keypad',
      skill: 'add-within-20',
      params: { a: [3, 9], b: [3, 9] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: (p) => `${p.a} + ${p.b} = ?`,
      exclude: (p) => (p.a as number) + (p.b as number) <= 10,
    },
  ],
};
