import type { ContentModule } from '../../types';

export const addNoRegroup: ContentModule = {
  id: 'g2-u2-m2',
  unitId: 'g2-u2',
  grade: 2,
  title: 'Add without Regrouping',
  icon: '🍏',
  prereq: ['g2-u2-m1'],
  skills: ['add-2digit'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks'],
  vocab: ['column', 'columns'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 34 on the line.',
      visual: { kind: 'number-line', min: 0, max: 100, value: null },
      action: 'drop-on-line',
      target: 30,
      hint: 'Three tens and four.',
    },
    {
      stage: 'pictorial',
      prompt: 'Add the ones, then the tens.',
      visual: { kind: 'base10', tens: 5, ones: 9 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 34 + 25 = 59.',
      visual: { kind: 'base10', tens: 5, ones: 9 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'add-2digit',
      params: { a: [11, 88], b: [11, 88] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: (p) => `${p.a} + ${p.b} = ?`,
      // tanpa menyimpan: satuan dan puluhan sama-sama tidak melebihi 9
      exclude: (p) =>
        ((p.a as number) % 10) + ((p.b as number) % 10) > 9 ||
        Math.floor((p.a as number) / 10) + Math.floor((p.b as number) / 10) > 9,
      distractors: 'near',
      misconception: (p) => Math.abs((p.a as number) - (p.b as number)),
    },
    {
      type: 'keypad',
      skill: 'add-2digit',
      params: { a: [12, 77], b: [11, 22] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: (p) => `${p.a} + ${p.b} = ?`,
      exclude: (p) =>
        ((p.a as number) % 10) + ((p.b as number) % 10) > 9 ||
        Math.floor((p.a as number) / 10) + Math.floor((p.b as number) / 10) > 9,
    },
  ],
};
