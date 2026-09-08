import type { ContentModule } from '../../types';

export const addTo10: ContentModule = {
  id: 'g1-u2-m5',
  unitId: 'g1-u2',
  grade: 1,
  title: 'Add to 10',
  icon: '🔟',
  prereq: ['g1-u2-m4'],
  skills: ['add-within-10'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['ten-frame'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill four boxes. Fill five more.',
      visual: { kind: 'ten-frame', value: 0 },
      action: 'tap-fill',
      target: 9,
      hint: 'Count them all.',
    },
    {
      stage: 'pictorial',
      prompt: 'Four plus five is nine.',
      visual: { kind: 'ten-frame', value: 9, split: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 4 + 5 = 9.',
      visual: { kind: 'ten-frame', value: 9, split: 4 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'add-within-10',
      params: { a: [1, 9], b: [1, 9] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: (p) => `${p.a} + ${p.b} = ?`,
      exclude: (p) => (p.a as number) + (p.b as number) > 10,
      distractors: 'near',
      misconception: (p) => Math.abs((p.a as number) - (p.b as number)),
    },
    {
      type: 'keypad',
      skill: 'add-within-10',
      params: { a: [2, 8], b: [2, 8] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: (p) => `${p.a} + ${p.b} = ?`,
      exclude: (p) => (p.a as number) + (p.b as number) > 10,
    },
  ],
};
