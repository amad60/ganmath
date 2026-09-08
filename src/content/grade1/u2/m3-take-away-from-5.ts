import type { ContentModule } from '../../types';

export const takeAwayFrom5: ContentModule = {
  id: 'g1-u2-m3',
  unitId: 'g1-u2',
  grade: 1,
  title: 'Take Away from 5',
  icon: '🥕',
  prereq: ['g1-u2-m2'],
  skills: ['sub-within-5'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['ten-frame', 'counter-objects'],
  vocab: ['gone'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill five boxes.',
      visual: { kind: 'ten-frame', value: 0 },
      action: 'tap-fill',
      target: 5,
      hint: 'Start with five.',
    },
    {
      stage: 'pictorial',
      prompt: 'Take away two. Three are left.',
      visual: { kind: 'ten-frame', value: 3 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 5 - 2 = 3.',
      visual: { kind: 'ten-frame', value: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'sub-within-5',
      params: { a: [2, 5], b: [1, 4] },
      answer: (p) => (p.a as number) - (p.b as number),
      text: (p) => `${p.a} - ${p.b} = ?`,
      exclude: (p) => (p.b as number) > (p.a as number),
      distractors: 'near',
      // miskonsepsi khas: anak menjumlahkan karena salah membaca tanda
      misconception: (p) => (p.a as number) + (p.b as number),
    },
    {
      type: 'keypad',
      skill: 'sub-within-5',
      params: { a: [2, 5], b: [1, 4] },
      answer: (p) => (p.a as number) - (p.b as number),
      text: (p) => `${p.a} - ${p.b} = ?`,
      exclude: (p) => (p.b as number) > (p.a as number),
    },
  ],
};
