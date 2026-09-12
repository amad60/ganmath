import type { ContentModule } from '../../types';

export const subtract3Digit: ContentModule = {
  id: 'g3-u4-m4',
  unitId: 'g3-u4',
  grade: 3,
  title: 'Subtract 3-Digit',
  icon: '➖',
  prereq: ['g3-u4-m3'],
  skills: ['sub-3-digit'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 460 on the line.',
      visual: { kind: 'number-line', min: 0, max: 1000, value: null, step: 20 },
      action: 'drop-on-line',
      target: 460,
      hint: 'Four hundreds and six tens.',
    },
    {
      stage: 'pictorial',
      prompt: 'Take away hundreds, then tens.',
      visual: { kind: 'base10', hundreds: 2, tens: 3, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '460 - 230 = 230.',
      visual: { kind: 'base10', hundreds: 2, tens: 3, ones: 0 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'sub-3-digit',
      distractorUnit: 10,
      params: { a: [30, 99], b: [11, 60] },
      answer: (p) => ((p.a as number) - (p.b as number)) * 10,
      text: (p) => `${(p.a as number) * 10} - ${(p.b as number) * 10} = ?`,
      exclude: (p) => (p.b as number) >= (p.a as number),
      distractors: 'near',
      misconception: (p) => ((p.a as number) + (p.b as number)) * 10, // menjumlah, bukan mengurang
    },
    {
      type: 'keypad',
      skill: 'sub-3-digit',
      params: { a: [30, 99], b: [11, 60] },
      answer: (p) => (p.a as number) * 10 - (p.b as number),
      text: (p) => `${(p.a as number) * 10} - ${p.b} = ?`,
      exclude: (p) => (p.b as number) >= (p.a as number),
    },
    {
      type: 'keypad',
      skill: 'sub-3-digit',
      story: true,
      params: { a: [30, 99], b: [11, 60] },
      answer: (p) => (p.a as number) * 10 - (p.b as number),
      text: (p) => `Ana has ${(p.a as number) * 10} stickers. She gives ${p.b} away. How many left?`,
      exclude: (p) => (p.b as number) >= (p.a as number),
    },
    {
      type: 'keypad',
      skill: 'sub-3-digit',
      story: true,
      params: { a: [30, 99], b: [11, 60] },
      answer: (p) => (p.a as number) * 10 - (p.b as number),
      text: (p) => `${(p.a as number) * 10} eggs in a shop. Budi buys ${p.b}. How many left?`,
      exclude: (p) => (p.b as number) >= (p.a as number),
    },
  ],
};
