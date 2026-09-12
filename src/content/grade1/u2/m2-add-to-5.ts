import type { ContentModule } from '../../types';
import { pl } from '../../plural';

export const addTo5: ContentModule = {
  id: 'g1-u2-m2',
  unitId: 'g1-u2',
  grade: 1,
  title: 'Add to 5',
  icon: '🍏',
  prereq: ['g1-u2-m1'],
  skills: ['add-within-5'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['ten-frame', 'number-bond'],
  vocab: ['plus'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill two boxes. Fill three more.',
      visual: { kind: 'ten-frame', value: 0 },
      action: 'tap-fill',
      target: 5,
      hint: 'Two dots and three dots.',
    },
    {
      stage: 'pictorial',
      prompt: 'Two plus three is five.',
      visual: { kind: 'ten-frame', value: 5, split: 2 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 2 + 3 = 5.',
      visual: { kind: 'ten-frame', value: 5, split: 2 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'add-within-5',
      params: { a: [1, 4], b: [1, 4] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: (p) => `${p.a} + ${p.b} = ?`,
      exclude: (p) => (p.a as number) + (p.b as number) > 5,
      distractors: 'near',
      // miskonsepsi khas: anak mengurangi, bukan menjumlahkan
      misconception: (p) => Math.abs((p.a as number) - (p.b as number)),
    },
    {
      type: 'keypad',
      skill: 'add-within-5',
      params: { a: [1, 4], b: [1, 4] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: (p) => `${p.a} + ${p.b} = ?`,
      exclude: (p) => (p.a as number) + (p.b as number) > 5,
    },
    {
      type: 'keypad',
      skill: 'add-within-5',
      story: true,
      params: { a: [1, 4], b: [1, 4] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: (p) => `Ana has ${pl(p.a as number, 'apple')}. She gets ${p.b} more. How many now?`,
      exclude: (p) => (p.a as number) + (p.b as number) > 5,
    },
    {
      type: 'keypad',
      skill: 'add-within-5',
      story: true,
      params: { a: [1, 4], b: [1, 4] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: (p) => `Budi picks ${pl(p.a as number, 'flower')}. Then ${p.b} more. How many flowers?`,
      exclude: (p) => (p.a as number) + (p.b as number) > 5,
    },
  ],
};
