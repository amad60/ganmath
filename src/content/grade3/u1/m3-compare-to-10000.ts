import type { ContentModule } from '../../types';

export const compareTo10000: ContentModule = {
  id: 'g3-u1-m3',
  unitId: 'g3-u1',
  grade: 3,
  title: 'Compare to 10.000',
  icon: '⚖️',
  prereq: ['g3-u1-m2'],
  skills: ['compare-10000'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['compare-symbol', 'choose-number'],
  visuals: ['base10-blocks'],
  vocab: ['biggest'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 4000 on the line.',
      visual: { kind: 'number-line', min: 0, max: 10000, value: null },
      action: 'drop-on-line',
      target: 4000,
      hint: 'Four thousands.',
    },
    {
      stage: 'pictorial',
      prompt: 'Compare the biggest place first.',
      visual: { kind: 'number-line', min: 0, max: 10000, marks: [3800, 5200] },
      action: 'watch',
      caption: '5200 > 3800',
    },
    {
      stage: 'abstract',
      prompt: 'Same thousands? Compare hundreds.',
      visual: { kind: 'number-line', min: 4000, max: 5000, marks: [4200, 4700] },
      action: 'watch',
      caption: '4200 < 4700',
    },
  ],

  rules: [
    {
      type: 'compare-symbol',
      skill: 'compare-10000',
      // Parameter disimpan sebagai RATUSAN supaya ruang kombinasinya tetap kecil.
      params: { a: [11, 99], b: [11, 99] },
      answer: (p) => Math.sign((p.a as number) - (p.b as number)),
      text: (p) => `${(p.a as number) * 100} ? ${(p.b as number) * 100}`,
      exclude: (p) => Math.abs((p.a as number) - (p.b as number)) > 12,
    },
    {
      type: 'choose-number',
      distractorUnit: 100,
      skill: 'compare-10000',
      params: { a: [11, 99], b: [10, 98] },
      answer: (p) => Math.max(p.a as number, p.b as number) * 100,
      text: (p) => `Which is bigger: ${(p.a as number) * 100} or ${(p.b as number) * 100}?`,
      exclude: (p) => p.a === p.b || Math.abs((p.a as number) - (p.b as number)) > 9,
      distractors: 'near',
      misconception: (p) => Math.min(p.a as number, p.b as number) * 100,
    },
  ],
};
