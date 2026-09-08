import type { ContentModule } from '../../types';

export const doubles: ContentModule = {
  id: 'g1-u4-m2',
  unitId: 'g1-u4',
  grade: 1,
  title: 'Doubles',
  icon: '👯',
  prereq: ['g1-u2-m5'],
  skills: ['doubles'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['ten-frame'],
  vocab: ['double', 'doubles', 'twice'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill three, then three more.',
      visual: { kind: 'ten-frame', value: 0, capacity: 20 },
      action: 'tap-fill',
      target: 6,
      hint: 'The same number twice.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three and three make six.',
      visual: { kind: 'ten-frame', value: 6, capacity: 20, split: 3 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Double four is eight.',
      visual: { kind: 'ten-frame', value: 8, capacity: 20, split: 4 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'doubles',
      params: { n: [1, 10] },
      answer: (p) => (p.n as number) * 2,
      text: (p) => `${p.n} + ${p.n} = ?`,
      distractors: 'near',
      misconception: (p) => p.n as number, // menyebut angkanya sendiri
    },
    {
      type: 'keypad',
      skill: 'doubles',
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 2,
      text: (p) => `Double ${p.n} = ?`,
    },
  ],
};
