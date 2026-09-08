import type { ContentModule } from '../../types';

export const countTo1000: ContentModule = {
  id: 'g2-u1-m2',
  unitId: 'g2-u1',
  grade: 2,
  title: 'Count to 1000',
  icon: '🏔️',
  prereq: ['g2-u1-m1'],
  skills: ['count-to-1000'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'number-line-drop'],
  visuals: ['number-line', 'base10-blocks'],
  vocab: ['thousand'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 300 on the line.',
      visual: { kind: 'number-line', min: 0, max: 1000, value: null },
      action: 'drop-on-line',
      target: 300,
      hint: 'Three hundreds.',
    },
    {
      stage: 'pictorial',
      prompt: 'Ten hundreds make one thousand.',
      visual: { kind: 'base10', hundreds: 5, tens: 0, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Count by hundreds to a thousand.',
      visual: { kind: 'number-line', min: 0, max: 1000, value: 700, marks: [100, 400] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'count-to-1000',
      params: { h: [1, 9] },
      answer: (p) => (p.h as number) * 100 + 100,
      text: (p) => `${(p.h as number) * 100} + 100 = ?`,
      distractors: 'near',
      misconception: (p) => (p.h as number) * 100 + 10,
    },
    {
      type: 'number-line-drop',
      skill: 'count-to-1000',
      params: { n: [100, 1000] },
      range: [0, 1000],
      answer: (p) => p.n as number,
      text: (p) => `Put ${p.n} on the line.`,
      exclude: (p) => (p.n as number) % 100 !== 0,
    },
  ],
};
