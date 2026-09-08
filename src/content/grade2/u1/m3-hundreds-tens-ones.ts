import type { ContentModule } from '../../types';

export const hundredsTensOnes: ContentModule = {
  id: 'g2-u1-m3',
  unitId: 'g2-u1',
  grade: 2,
  title: 'Hundreds, Tens, Ones',
  icon: '🗄️',
  prereq: ['g2-u1-m2'],
  skills: ['place-value-1000'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'missing-number'],
  visuals: ['base10-blocks'],
  vocab: ['place', 'value'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 200 on the line.',
      visual: { kind: 'number-line', min: 0, max: 500, value: null },
      action: 'drop-on-line',
      target: 200,
      hint: 'Two hundreds.',
    },
    {
      stage: 'pictorial',
      prompt: 'Two hundreds, four tens, three ones.',
      visual: { kind: 'base10', hundreds: 2, tens: 4, ones: 3 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 243.',
      visual: { kind: 'base10', hundreds: 2, tens: 4, ones: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'place-value-1000',
      params: { h: [1, 4], t: [0, 9], o: [0, 9] },
      answer: (p) => (p.h as number) * 100 + (p.t as number) * 10 + (p.o as number),
      text: () => 'How many?',
      visual: (p) => ({
        kind: 'base10',
        hundreds: p.h as number,
        tens: p.t as number,
        ones: p.o as number,
      }),
      distractors: 'digit-swap',
      misconception: (p) =>
        (p.o as number) * 100 + (p.t as number) * 10 + (p.h as number), // urutan terbalik
    },
    {
      type: 'missing-number',
      skill: 'place-value-1000',
      params: { h: [1, 9], t: [1, 9] },
      answer: (p) => p.t as number,
      text: (p) => `${p.h} hundreds and ? tens = ${(p.h as number) * 100 + (p.t as number) * 10}`,
    },
  ],
};
