import type { ContentModule } from '../../types';

export const addHundreds: ContentModule = {
  id: 'g3-u4-m1',
  unitId: 'g3-u4',
  grade: 3,
  title: 'Add Hundreds',
  icon: '💯',
  prereq: ['g3-u3-m6'],
  skills: ['add-hundreds'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 300 on the line.',
      visual: { kind: 'number-line', min: 0, max: 1000, value: null },
      action: 'drop-on-line',
      target: 300,
      hint: 'Three hundreds.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three flats and two flats.',
      visual: { kind: 'base10', hundreds: 5, tens: 0, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '300 + 200 = 500.',
      visual: { kind: 'base10', hundreds: 5, tens: 0, ones: 0 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'add-hundreds',
      distractorUnit: 100,
      params: { a: [1, 8], b: [1, 8] },
      answer: (p) => ((p.a as number) + (p.b as number)) * 100,
      text: (p) => `${(p.a as number) * 100} + ${(p.b as number) * 100} = ?`,
      exclude: (p) => (p.a as number) + (p.b as number) > 9,
      distractors: 'near',
      misconception: (p) => (p.a as number) + (p.b as number),
    },
    {
      type: 'keypad',
      skill: 'add-hundreds',
      params: { a: [2, 8], b: [1, 7] },
      answer: (p) => ((p.a as number) - (p.b as number)) * 100,
      text: (p) => `${(p.a as number) * 100} - ${(p.b as number) * 100} = ?`,
      exclude: (p) => (p.b as number) >= (p.a as number),
    },
  ],
};
