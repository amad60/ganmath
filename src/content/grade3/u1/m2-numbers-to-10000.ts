import type { ContentModule } from '../../types';

export const numbersTo10000: ContentModule = {
  id: 'g3-u1-m2',
  unitId: 'g3-u1',
  grade: 3,
  title: 'Numbers to 10.000',
  icon: '🗄️',
  prereq: ['g3-u1-m1'],
  skills: ['place-value-10000'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 2000 on the line.',
      visual: { kind: 'number-line', min: 0, max: 10000, value: null },
      action: 'drop-on-line',
      target: 2000,
      hint: 'Two thousands.',
    },
    {
      stage: 'pictorial',
      prompt: 'Thousands, hundreds, tens, ones.',
      visual: { kind: 'base10', hundreds: 3, tens: 4, ones: 2 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 2342.',
      visual: { kind: 'base10', hundreds: 3, tens: 4, ones: 2 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      distractorUnit: 100,
      skill: 'place-value-10000',
      params: { th: [1, 9], h: [0, 9] },
      answer: (p) => (p.th as number) * 1000 + (p.h as number) * 100,
      text: (p) => `${p.th} thousands and ${p.h} hundreds = ?`,
      distractors: 'digit-swap',
      misconception: (p) => (p.th as number) * 100 + (p.h as number) * 10,
    },
    {
      type: 'keypad',
      skill: 'place-value-10000',
      params: { th: [1, 9], h: [0, 9], t: [0, 9] },
      answer: (p) => (p.th as number) * 1000 + (p.h as number) * 100 + (p.t as number) * 10,
      text: (p) => `${p.th} thousands ${p.h} hundreds ${p.t} tens = ?`,
    },
  ],
};
