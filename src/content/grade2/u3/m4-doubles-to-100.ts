import type { ContentModule } from '../../types';

export const doublesTo100: ContentModule = {
  id: 'g2-u3-m4',
  unitId: 'g2-u3',
  grade: 2,
  title: 'Doubles to 100',
  icon: '👯',
  prereq: ['g2-u2-m4'],
  skills: ['doubles-100'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 25 on the line.',
      visual: { kind: 'number-line', min: 0, max: 100, value: null, step: 5 },
      action: 'drop-on-line',
      target: 25,
      hint: 'Two tens and five.',
    },
    {
      stage: 'pictorial',
      prompt: 'Double the tens, double the ones.',
      visual: { kind: 'base10', tens: 5, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Double 25 is 50.',
      visual: { kind: 'base10', tens: 5, ones: 0 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'doubles-100',
      params: { n: [11, 50] },
      answer: (p) => (p.n as number) * 2,
      text: (p) => `${p.n} + ${p.n} = ?`,
      distractors: 'near',
      misconception: (p) => p.n as number,
    },
    {
      type: 'keypad',
      skill: 'doubles-100',
      params: { n: [11, 49] },
      answer: (p) => (p.n as number) * 2,
      text: (p) => `Double ${p.n} = ?`,
    },
    {
      type: 'keypad',
      skill: 'doubles-100',
      story: true,
      params: { n: [11, 49] },
      answer: (p) => (p.n as number) * 2,
      text: (p) => `Ana has ${p.n} shells. Budi has the same. How many altogether?`,
    },
    {
      type: 'keypad',
      skill: 'doubles-100',
      story: true,
      params: { n: [11, 49] },
      answer: (p) => (p.n as number) * 2,
      text: (p) => `Two boxes. ${p.n} eggs in each box. How many eggs?`,
    },
  ],
};
