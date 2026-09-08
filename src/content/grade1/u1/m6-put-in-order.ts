import type { ContentModule } from '../../types';

export const putInOrder: ContentModule = {
  id: 'g1-u1-m6',
  unitId: 'g1-u1',
  grade: 1,
  title: 'Put in Order',
  icon: '📏',
  prereq: ['g1-u1-m5'],
  skills: ['order-to-10'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['number-line-drop', 'choose-number'],
  visuals: ['number-line'],
  vocab: ['before', 'after', 'order', 'line'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 5 on the line.',
      visual: { kind: 'number-line', min: 0, max: 10, value: null },
      action: 'drop-on-line',
      target: 5,
      hint: 'Count the jumps.',
    },
    {
      stage: 'pictorial',
      prompt: 'Six comes after five.',
      visual: { kind: 'number-line', min: 0, max: 10, value: 6 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Numbers grow to the right.',
      visual: { kind: 'number-line', min: 0, max: 10, value: 9 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'number-line-drop',
      skill: 'order-to-10',
      params: { n: [1, 10] },
      range: [0, 10],
      answer: (p) => p.n as number,
      text: (p) => `Put ${p.n} on the line.`,
    },
    {
      type: 'choose-number',
      skill: 'order-to-10',
      params: { n: [0, 9] },
      answer: (p) => (p.n as number) + 1,
      text: (p) => `What comes after ${p.n}?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) - 1, // tertukar before/after
    },
  ],
};
