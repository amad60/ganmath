import type { ContentModule } from '../../types';

export const teenNumbers: ContentModule = {
  id: 'g1-u3-m1',
  unitId: 'g1-u3',
  grade: 1,
  title: 'Teen Numbers',
  icon: '1️⃣',
  prereq: ['g1-u2-m5'],
  skills: ['teen-numbers'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'missing-number'],
  visuals: ['ten-frame'],
  vocab: ['teen', 'eleven', 'twelve', 'thirteen'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill thirteen boxes.',
      visual: { kind: 'ten-frame', value: 0, capacity: 20 },
      action: 'tap-fill',
      target: 13,
      hint: 'One full frame and three.',
    },
    {
      stage: 'pictorial',
      prompt: 'Ten and three make thirteen.',
      visual: { kind: 'ten-frame', value: 13, capacity: 20, split: 10 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Teen numbers are ten and more.',
      visual: { kind: 'ten-frame', value: 16, capacity: 20, split: 10 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'teen-numbers',
      params: { n: [11, 20] },
      answer: (p) => p.n as number,
      text: () => 'How many?',
      visual: (p) => ({ kind: 'ten-frame', value: p.n as number, capacity: 20, split: 10 }),
      distractors: 'near',
      misconception: (p) => (p.n as number) - 10, // hanya menghitung sisanya
    },
    {
      type: 'missing-number',
      skill: 'teen-numbers',
      params: { n: [11, 19] },
      answer: (p) => (p.n as number) - 10,
      text: (p) => `10 + ? = ${p.n}`,
    },
  ],
};
