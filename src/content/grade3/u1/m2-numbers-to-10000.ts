import type { ContentModule } from '../../types';
import { pl } from '../../plural';

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
      prompt: '2 thousands, 3 hundreds, 4 tens, 2 ones.',
      visual: { kind: 'number-line', min: 0, max: 3000, value: 2342, marks: [2000, 2300] },
      action: 'watch',
      caption: '2000 + 300 + 40 + 2',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 2342.',
      visual: { kind: 'number-line', min: 0, max: 3000, value: 2342, marks: [2000] },
      action: 'watch',
      caption: '2342',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      distractorUnit: 100,
      skill: 'place-value-10000',
      params: { th: [1, 9], h: [0, 9] },
      answer: (p) => (p.th as number) * 1000 + (p.h as number) * 100,
      text: (p) => `${pl(p.th as number, 'thousand')} and ${pl(p.h as number, 'hundred')} = ?`,
      distractors: 'digit-swap',
      misconception: (p) => (p.th as number) * 100 + (p.h as number) * 10,
    },
    {
      type: 'keypad',
      skill: 'place-value-10000',
      params: { th: [1, 9], h: [0, 9], t: [0, 9] },
      answer: (p) => (p.th as number) * 1000 + (p.h as number) * 100 + (p.t as number) * 10,
      text: (p) =>
        `${pl(p.th as number, 'thousand')} ${pl(p.h as number, 'hundred')} ${pl(p.t as number, 'ten')} = ?`,
    },
  ],
};
