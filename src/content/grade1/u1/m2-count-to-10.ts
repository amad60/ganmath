import type { ContentModule } from '../../types';

export const countTo10: ContentModule = {
  id: 'g1-u1-m2',
  unitId: 'g1-u1',
  grade: 1,
  title: 'Count to 10',
  icon: '🔟',
  prereq: ['g1-u1-m1'],
  skills: ['count-to-10'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'count-tap'],
  visuals: ['ten-frame', 'number-line'],
  vocab: ['ten', 'frame'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill every box. That is ten.',
      visual: { kind: 'ten-frame', value: 0 },
      action: 'tap-fill',
      target: 10,
      hint: 'A full frame is 10.',
    },
    {
      stage: 'pictorial',
      prompt: 'Put 7 on the line.',
      visual: { kind: 'number-line', min: 0, max: 10, value: null },
      action: 'drop-on-line',
      target: 7,
      hint: 'Count the jumps.',
    },
    {
      stage: 'abstract',
      prompt: 'Numbers grow one by one.',
      visual: { kind: 'number-line', min: 0, max: 10, value: 10 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'count-to-10',
      params: { n: [4, 10] },
      answer: (p) => p.n as number,
      text: (p) => `How many dots? ${'●'.repeat(p.n as number)}`,
      distractors: 'near',
      misconception: (p) => (p.n as number) - 1,
    },
    {
      type: 'count-tap',
      skill: 'count-to-10',
      params: { n: [6, 10] },
      answer: (p) => p.n as number,
      text: (p) => `How many? ${'⭐'.repeat(p.n as number)}`,
    },
  ],
};
