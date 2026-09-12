import type { ContentModule } from '../../types';

export const skipCount: ContentModule = {
  id: 'g1-u5-m3',
  unitId: 'g1-u5',
  grade: 1,
  title: 'Skip Count',
  icon: '🦘',
  prereq: ['g1-u5-m2'],
  skills: ['skip-count'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['number-line'],
  vocab: ['skip', 'twos', 'fives'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 10 on the line.',
      visual: { kind: 'number-line', min: 0, max: 50, value: null },
      action: 'drop-on-line',
      target: 10,
      hint: 'Jump by tens.',
    },
    {
      stage: 'pictorial',
      prompt: 'Skip by twos: 2, 4, 6.',
      visual: { kind: 'number-line', min: 0, max: 20, value: 6, marks: [2, 4] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Skip counting is faster counting.',
      visual: { kind: 'number-line', min: 0, max: 50, value: 30, marks: [10, 20] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'skip-count',
      params: { step: [2, 10], n: [1, 8] },
      answer: (p) => (p.step as number) * ((p.n as number) + 1),
      text: (p) => `${(p.step as number) * (p.n as number)} + ${p.step} = ?`,
      exclude: (p) => ![2, 5, 10].includes(p.step as number),
      distractors: 'near',
      misconception: (p) => (p.step as number) * (p.n as number) + 1,
    },
    {
      type: 'keypad',
      skill: 'skip-count',
      params: { step: [2, 10], n: [2, 9] },
      answer: (p) => (p.step as number) * (p.n as number),
      text: (p) => `Skip by ${p.step}, ${p.n} times. How many?`,
      exclude: (p) => ![2, 5, 10].includes(p.step as number),
    },
    {
      type: 'keypad',
      skill: 'skip-count',
      story: true,
      params: { step: [2, 10], n: [2, 9] },
      answer: (p) => (p.step as number) * (p.n as number),
      text: (p) => `${p.n} bags. ${p.step} apples in each bag. How many apples?`,
      exclude: (p) => ![2, 5, 10].includes(p.step as number),
    },
    {
      type: 'keypad',
      skill: 'skip-count',
      story: true,
      params: { step: [2, 10], n: [2, 9] },
      answer: (p) => (p.step as number) * (p.n as number),
      text: (p) => `${p.n} plates. ${p.step} cookies on each plate. How many cookies?`,
      exclude: (p) => ![2, 5, 10].includes(p.step as number),
    },
  ],
};
