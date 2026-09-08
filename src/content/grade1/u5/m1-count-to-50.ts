import type { ContentModule } from '../../types';

export const countTo50: ContentModule = {
  id: 'g1-u5-m1',
  unitId: 'g1-u5',
  grade: 1,
  title: 'Count to 50',
  icon: '🐾',
  prereq: ['g1-u3-m4'],
  skills: ['count-to-50'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'number-line-drop'],
  visuals: ['number-line', 'base10-blocks'],
  vocab: ['fifty', 'thirty', 'forty', 'twenty', 'past'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 30 on the line.',
      visual: { kind: 'number-line', min: 0, max: 50, value: null },
      action: 'drop-on-line',
      target: 30,
      hint: 'Count by tens.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three tens make thirty.',
      visual: { kind: 'base10', tens: 3, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Numbers keep going past twenty.',
      visual: { kind: 'number-line', min: 0, max: 50, value: 44 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'count-to-50',
      params: { n: [21, 50] },
      answer: (p) => (p.n as number) + 1,
      text: (p) => `What comes after ${p.n}?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) - 1,
    },
    {
      type: 'number-line-drop',
      skill: 'count-to-50',
      params: { n: [5, 50] },
      range: [0, 50],
      answer: (p) => p.n as number,
      text: (p) => `Put ${p.n} on the line.`,
      exclude: (p) => (p.n as number) % 5 !== 0,
    },
  ],
};
