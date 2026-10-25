import type { ContentModule } from '../../types';

export const compareTwoDigit: ContentModule = {
  id: 'g1-u5-m5',
  unitId: 'g1-u5',
  grade: 1,
  title: 'Compare Two-Digit',
  icon: '⚖️',
  prereq: ['g1-u5-m4'],
  skills: ['compare-100'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['compare-symbol', 'choose-number'],
  visuals: ['base10-blocks'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 60 on the line.',
      visual: { kind: 'number-line', min: 0, max: 100, value: null },
      action: 'drop-on-line',
      target: 60,
      hint: 'Six tens first.',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the tens first.',
      visual: { kind: 'bars', values: [62, 58], labels: ['62', '58'], showValues: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 62 > 58.',
      visual: { kind: 'bars', values: [62, 58], labels: ['62', '58'], showValues: true },
      action: 'watch',
    },
    {
      // Soal compare-symbol juga berjawaban < dan =.
      stage: 'abstract',
      prompt: 'Five tens is less: 58 < 62.',
      visual: { kind: 'bars', values: [58, 62], labels: ['58', '62'], showValues: true },
      action: 'watch',
      caption: '58 < 62',
    },
    {
      stage: 'abstract',
      prompt: 'Same tens, same ones: 47 = 47.',
      visual: { kind: 'bars', values: [47, 47], labels: ['47', '47'], showValues: true },
      action: 'watch',
      caption: '47 = 47',
    },
  ],

  rules: [
    {
      type: 'compare-symbol',
      skill: 'compare-100',
      params: { a: [20, 99], b: [20, 99] },
      answer: (p) => Math.sign((p.a as number) - (p.b as number)),
      text: (p) => `${p.a} ? ${p.b}`,
      exclude: (p) => Math.abs((p.a as number) - (p.b as number)) > 40,
    },
    {
      type: 'choose-number',
      skill: 'compare-100',
      params: { a: [21, 99], b: [20, 98] },
      answer: (p) => Math.max(p.a as number, p.b as number),
      text: (p) => `Which is bigger: ${p.a} or ${p.b}?`,
      exclude: (p) => p.a === p.b || Math.abs((p.a as number) - (p.b as number)) > 30,
      distractors: 'digit-swap',
      misconception: (p) => Math.min(p.a as number, p.b as number),
    },
  ],
};
