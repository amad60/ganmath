import type { ContentModule } from '../../types';

export const countTo100: ContentModule = {
  id: 'g1-u5-m2',
  unitId: 'g1-u5',
  grade: 1,
  title: 'Count to 100',
  icon: '🏔️',
  prereq: ['g1-u5-m1'],
  skills: ['count-to-100'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'number-line-drop'],
  visuals: ['number-line', 'base10-blocks'],
  vocab: ['hundred', 'sixty', 'seventy', 'eighty', 'ninety'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 70 on the line.',
      visual: { kind: 'number-line', min: 0, max: 100, value: null },
      action: 'drop-on-line',
      target: 70,
      hint: 'Seven tens.',
    },
    {
      stage: 'pictorial',
      prompt: 'Ten tens make one hundred.',
      visual: { kind: 'base10', tens: 10, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'One hundred is the whole line.',
      visual: { kind: 'number-line', min: 0, max: 100, value: 100 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'count-to-100',
      params: { n: [50, 99] },
      answer: (p) => (p.n as number) + 1,
      text: (p) => `What comes after ${p.n}?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) - 1,
    },
    {
      type: 'number-line-drop',
      skill: 'count-to-100',
      params: { n: [10, 100] },
      range: [0, 100],
      answer: (p) => p.n as number,
      text: (p) => `Put ${p.n} on the line.`,
      exclude: (p) => (p.n as number) % 10 !== 0,
    },
  ],
};
