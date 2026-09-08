import type { ContentModule } from '../../types';

export const tensAndOnesTo100: ContentModule = {
  id: 'g1-u5-m4',
  unitId: 'g1-u5',
  grade: 1,
  title: 'Tens and Ones to 100',
  icon: '🧱',
  prereq: ['g1-u5-m2', 'g1-u3-m2'],
  skills: ['place-value-100'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'missing-number'],
  visuals: ['base10-blocks'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 40 on the line.',
      visual: { kind: 'number-line', min: 0, max: 100, value: null },
      action: 'drop-on-line',
      target: 40,
      hint: 'Four tens.',
    },
    {
      stage: 'pictorial',
      prompt: 'Four tens and three ones.',
      visual: { kind: 'base10', tens: 4, ones: 3 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 43.',
      visual: { kind: 'base10', tens: 4, ones: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'place-value-100',
      params: { t: [2, 9], o: [0, 9] },
      answer: (p) => (p.t as number) * 10 + (p.o as number),
      text: () => 'How many?',
      visual: (p) => ({ kind: 'base10', tens: p.t as number, ones: p.o as number }),
      distractors: 'digit-swap',
      misconception: (p) => (p.o as number) * 10 + (p.t as number),
    },
    {
      type: 'missing-number',
      skill: 'place-value-100',
      params: { t: [2, 9], o: [1, 9] },
      answer: (p) => p.o as number,
      text: (p) => `${p.t} tens and ? ones = ${(p.t as number) * 10 + (p.o as number)}`,
    },
  ],
};
