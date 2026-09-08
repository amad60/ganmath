import type { ContentModule } from '../../types';

export const tensAndOnes: ContentModule = {
  id: 'g1-u3-m2',
  unitId: 'g1-u3',
  grade: 1,
  title: 'Tens and Ones',
  icon: '🗄️',
  prereq: ['g1-u3-m1'],
  skills: ['place-value-20'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'missing-number'],
  visuals: ['base10-blocks', 'ten-frame'],
  vocab: ['tens', 'ones', 'digit', 'digits'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill twelve boxes.',
      visual: { kind: 'ten-frame', value: 0, capacity: 20 },
      action: 'tap-fill',
      target: 12,
      hint: 'Ten and two.',
    },
    {
      stage: 'pictorial',
      // Blok nilai tempat: batang puluhan dan kubus satuan.
      prompt: 'One ten and two ones.',
      visual: { kind: 'base10', tens: 1, ones: 2 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 12.',
      visual: { kind: 'base10', tens: 1, ones: 2 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'place-value-20',
      params: { t: [1, 2], o: [0, 9] },
      answer: (p) => (p.t as number) * 10 + (p.o as number),
      text: () => 'How many?',
      visual: (p) => ({ kind: 'base10', tens: p.t as number, ones: p.o as number }),
      exclude: (p) => (p.t as number) * 10 + (p.o as number) > 20,
      distractors: 'digit-swap',
      misconception: (p) => (p.o as number) * 10 + (p.t as number),
    },
    {
      type: 'missing-number',
      skill: 'place-value-20',
      params: { o: [1, 9] },
      answer: (p) => p.o as number,
      text: (p) => `1 ten and ? ones = ${10 + (p.o as number)}`,
    },
  ],
};
