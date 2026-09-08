import type { ContentModule } from '../../types';

export const compareTo1000: ContentModule = {
  id: 'g2-u1-m5',
  unitId: 'g2-u1',
  grade: 2,
  title: 'Compare to 1000',
  icon: '⚖️',
  prereq: ['g2-u1-m4'],
  skills: ['compare-1000'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['compare-symbol', 'choose-number'],
  visuals: ['base10-blocks'],
  vocab: ['compare'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 320 on the line.',
      visual: { kind: 'number-line', min: 0, max: 500, value: null },
      action: 'drop-on-line',
      target: 300,
      hint: 'Three hundreds first.',
    },
    {
      stage: 'pictorial',
      prompt: 'Compare the hundreds first.',
      visual: { kind: 'base10', hundreds: 3, tens: 2, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 320 > 298.',
      visual: { kind: 'base10', hundreds: 2, tens: 9, ones: 8 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Parameter disimpan sebagai PULUHAN (11 → 110) supaya ruang kombinasinya tetap
      // kecil. Ruang parameter tiga digit penuh berisi 810.000 kombinasi — linter
      // menolaknya, dan memang benar: itu tanda aturan yang ditulis terlalu longgar.
      type: 'compare-symbol',
      skill: 'compare-1000',
      params: { a: [11, 99], b: [11, 99] },
      answer: (p) => Math.sign((p.a as number) - (p.b as number)),
      text: (p) => `${(p.a as number) * 10} ? ${(p.b as number) * 10}`,
      exclude: (p) => Math.abs((p.a as number) - (p.b as number)) > 12,
    },
    {
      type: 'choose-number',
      distractorUnit: 10,
      skill: 'compare-1000',
      params: { a: [11, 99], b: [10, 98] },
      answer: (p) => Math.max(p.a as number, p.b as number) * 10,
      text: (p) => `Which is bigger: ${(p.a as number) * 10} or ${(p.b as number) * 10}?`,
      exclude: (p) => p.a === p.b || Math.abs((p.a as number) - (p.b as number)) > 9,
      distractors: 'near',
      misconception: (p) => Math.min(p.a as number, p.b as number) * 10,
    },
  ],
};
