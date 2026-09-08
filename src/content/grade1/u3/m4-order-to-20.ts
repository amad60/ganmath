import type { ContentModule } from '../../types';

export const orderTo20: ContentModule = {
  id: 'g1-u3-m4',
  unitId: 'g1-u3',
  grade: 1,
  title: 'Order to 20',
  icon: '📏',
  prereq: ['g1-u3-m3'],
  skills: ['order-to-20'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['number-line-drop', 'choose-number'],
  visuals: ['number-line'],
  vocab: ['sixteen'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 14 on the line.',
      visual: { kind: 'number-line', min: 10, max: 20, value: null },
      action: 'drop-on-line',
      target: 14,
      hint: 'Count the jumps.',
    },
    {
      stage: 'pictorial',
      prompt: 'Sixteen comes after fifteen.',
      visual: { kind: 'number-line', min: 10, max: 20, value: 16 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Numbers grow to the right.',
      visual: { kind: 'number-line', min: 10, max: 20, value: 19 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'number-line-drop',
      skill: 'order-to-20',
      params: { n: [11, 20] },
      range: [10, 20],
      answer: (p) => p.n as number,
      text: (p) => `Put ${p.n} on the line.`,
    },
    {
      type: 'choose-number',
      skill: 'order-to-20',
      params: { n: [10, 19] },
      answer: (p) => (p.n as number) + 1,
      text: (p) => `What comes after ${p.n}?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) - 1,
    },
  ],
};
