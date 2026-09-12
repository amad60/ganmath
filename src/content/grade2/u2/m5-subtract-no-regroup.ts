import type { ContentModule } from '../../types';

export const subtractNoRegroup: ContentModule = {
  id: 'g2-u2-m5',
  unitId: 'g2-u2',
  grade: 2,
  title: 'Subtract without Regrouping',
  icon: '🥕',
  prereq: ['g2-u2-m2'],
  skills: ['sub-2digit'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 68 on the line.',
      visual: { kind: 'number-line', min: 0, max: 100, value: null },
      action: 'drop-on-line',
      target: 70,
      hint: 'Almost seventy.',
    },
    {
      stage: 'pictorial',
      prompt: 'Take the ones, then the tens.',
      visual: { kind: 'base10', tens: 4, ones: 5 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 68 - 23 = 45.',
      visual: { kind: 'base10', tens: 4, ones: 5 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'sub-2digit',
      params: { a: [21, 99], b: [11, 88] },
      answer: (p) => (p.a as number) - (p.b as number),
      text: (p) => `${p.a} - ${p.b} = ?`,
      exclude: (p) =>
        (p.b as number) > (p.a as number) || ((p.a as number) % 10) < ((p.b as number) % 10),
      distractors: 'near',
      misconception: (p) => (p.a as number) + (p.b as number),
    },
    {
      type: 'keypad',
      skill: 'sub-2digit',
      params: { a: [25, 99], b: [11, 44] },
      answer: (p) => (p.a as number) - (p.b as number),
      text: (p) => `${p.a} - ${p.b} = ?`,
      exclude: (p) =>
        (p.b as number) > (p.a as number) || ((p.a as number) % 10) < ((p.b as number) % 10),
    },
    {
      type: 'keypad',
      skill: 'sub-2digit',
      story: true,
      params: { a: [25, 99], b: [11, 44] },
      answer: (p) => (p.a as number) - (p.b as number),
      text: (p) => `Ana has ${p.a} stickers. She gives ${p.b} away. How many left?`,
      exclude: (p) =>
        (p.b as number) > (p.a as number) || ((p.a as number) % 10) < ((p.b as number) % 10),
    },
    {
      type: 'keypad',
      skill: 'sub-2digit',
      story: true,
      params: { a: [25, 99], b: [11, 44] },
      answer: (p) => (p.a as number) - (p.b as number),
      text: (p) => `${p.a} eggs in a shop. Budi buys ${p.b}. How many left?`,
      exclude: (p) =>
        (p.b as number) > (p.a as number) || ((p.a as number) % 10) < ((p.b as number) % 10),
    },
  ],
};
