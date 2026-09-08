import type { ContentModule } from '../../types';

export const add3Digit: ContentModule = {
  id: 'g3-u4-m2',
  unitId: 'g3-u4',
  grade: 3,
  title: 'Add 3-Digit',
  icon: '➕',
  prereq: ['g3-u4-m1'],
  skills: ['add-3-digit'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 240 on the line.',
      visual: { kind: 'number-line', min: 0, max: 1000, value: null },
      action: 'drop-on-line',
      target: 240,
      hint: 'Two hundreds and four tens.',
    },
    {
      stage: 'pictorial',
      prompt: 'Add hundreds, then tens, then ones.',
      visual: { kind: 'base10', hundreds: 3, tens: 6, ones: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '240 + 124 = 364.',
      visual: { kind: 'base10', hundreds: 3, tens: 6, ones: 4 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'add-3-digit',
      // Disimpan sebagai PULUHAN supaya ruang kombinasinya tetap kecil.
      distractorUnit: 10,
      params: { a: [11, 49], b: [11, 40] },
      answer: (p) => ((p.a as number) + (p.b as number)) * 10,
      text: (p) => `${(p.a as number) * 10} + ${(p.b as number) * 10} = ?`,
      exclude: (p) => (p.a as number) + (p.b as number) > 99,
      distractors: 'near',
      misconception: (p) => ((p.a as number) + (p.b as number)) * 10 - 100,
    },
    {
      type: 'keypad',
      skill: 'add-3-digit',
      params: { a: [11, 49], b: [11, 40] },
      answer: (p) => (p.a as number) * 10 + (p.b as number),
      text: (p) => `${(p.a as number) * 10} + ${p.b} = ?`,
    },
  ],
};
