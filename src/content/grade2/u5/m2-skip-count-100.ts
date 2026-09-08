import type { ContentModule } from '../../types';

export const skipCount100: ContentModule = {
  id: 'g2-u5-m2',
  unitId: 'g2-u5',
  grade: 2,
  title: 'Skip Count to 100',
  icon: '🦘',
  prereq: ['g2-u4-m5'],
  skills: ['skip-100'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['number-line'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 20 on the line.',
      visual: { kind: 'number-line', min: 0, max: 100, value: null },
      action: 'drop-on-line',
      target: 20,
      hint: 'Jump by tens.',
    },
    {
      stage: 'pictorial',
      prompt: 'Fives land on five or zero.',
      visual: { kind: 'number-line', min: 0, max: 50, value: 25, marks: [5, 15] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Skip counting is faster counting.',
      visual: { kind: 'number-line', min: 0, max: 100, value: 60, marks: [20, 40] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'skip-100',
      params: { s: [0, 2], n: [2, 9] },
      answer: (p) => [2, 5, 10][p.s as number]! * ((p.n as number) + 1),
      text: (p) =>
        `${[2, 5, 10][p.s as number]! * (p.n as number)} + ${[2, 5, 10][p.s as number]} = ?`,
      distractors: 'near',
      misconception: (p) => [2, 5, 10][p.s as number]! * (p.n as number) + 1,
    },
    {
      type: 'keypad',
      skill: 'skip-100',
      params: { s: [0, 2], n: [3, 10] },
      answer: (p) => [2, 5, 10][p.s as number]! * (p.n as number),
      text: (p) => `Count by ${[2, 5, 10][p.s as number]}, ${p.n} times. How far?`,
    },
  ],
};
