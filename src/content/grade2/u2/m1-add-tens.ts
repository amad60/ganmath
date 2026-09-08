import type { ContentModule } from '../../types';

export const addTens: ContentModule = {
  id: 'g2-u2-m1',
  unitId: 'g2-u2',
  grade: 2,
  title: 'Add Tens',
  icon: '📦',
  prereq: ['g2-u1-m3'],
  skills: ['add-tens'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 50 on the line.',
      visual: { kind: 'number-line', min: 0, max: 100, value: null },
      action: 'drop-on-line',
      target: 50,
      hint: 'Five tens.',
    },
    {
      stage: 'pictorial',
      prompt: 'Two tens and three tens.',
      visual: { kind: 'base10', tens: 5, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Only the tens change.',
      visual: { kind: 'base10', tens: 5, ones: 0 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      distractorUnit: 10,
      skill: 'add-tens',
      params: { a: [1, 9], b: [1, 9] },
      answer: (p) => ((p.a as number) + (p.b as number)) * 10,
      text: (p) => `${(p.a as number) * 10} + ${(p.b as number) * 10} = ?`,
      exclude: (p) => (p.a as number) + (p.b as number) > 10,
      distractors: 'near',
      misconception: (p) => (p.a as number) + (p.b as number), // lupa puluhannya
    },
    {
      type: 'keypad',
      skill: 'add-tens',
      params: { a: [2, 8], b: [2, 8] },
      answer: (p) => ((p.a as number) + (p.b as number)) * 10,
      text: (p) => `${(p.a as number) * 10} + ${(p.b as number) * 10} = ?`,
      exclude: (p) => (p.a as number) + (p.b as number) > 10,
    },
  ],
};
