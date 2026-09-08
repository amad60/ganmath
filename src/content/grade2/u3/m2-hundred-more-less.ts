import type { ContentModule } from '../../types';

export const hundredMoreLess: ContentModule = {
  id: 'g2-u3-m2',
  unitId: 'g2-u3',
  grade: 2,
  title: 'Hundred More, Hundred Less',
  icon: '🏔️',
  prereq: ['g2-u3-m1', 'g2-u1-m3'],
  skills: ['mental-hundred'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 400 on the line.',
      visual: { kind: 'number-line', min: 0, max: 1000, value: null },
      action: 'drop-on-line',
      target: 400,
      hint: 'Four hundreds.',
    },
    {
      stage: 'pictorial',
      prompt: 'One more hundred, same tens.',
      visual: { kind: 'base10', hundreds: 4, tens: 3, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Only the hundreds change.',
      visual: { kind: 'base10', hundreds: 5, tens: 3, ones: 0 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'mental-hundred',
      params: { h: [1, 8], t: [0, 9] },
      answer: (p) => ((p.h as number) + 1) * 100 + (p.t as number) * 10,
      text: (p) => `Hundred more than ${(p.h as number) * 100 + (p.t as number) * 10} = ?`,
      distractors: 'near',
      misconception: (p) => (p.h as number) * 100 + (p.t as number) * 10 + 10,
    },
    {
      type: 'keypad',
      skill: 'mental-hundred',
      params: { h: [2, 9], t: [0, 9] },
      answer: (p) => ((p.h as number) - 1) * 100 + (p.t as number) * 10,
      text: (p) => `Hundred less than ${(p.h as number) * 100 + (p.t as number) * 10} = ?`,
    },
  ],
};
