import type { ContentModule } from '../../types';

export const timesTen: ContentModule = {
  id: 'g2-u4-m5',
  unitId: 'g2-u4',
  grade: 2,
  title: 'Times Ten',
  icon: '🔟',
  prereq: ['g2-u4-m4'],
  skills: ['times-10'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid', 'base10-blocks'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill ten boxes.',
      visual: { kind: 'ten-frame', value: 0 },
      action: 'tap-fill',
      target: 10,
      hint: 'One group of ten.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three rows of ten is thirty.',
      visual: { kind: 'base10', tens: 3, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Tens become the tens place.',
      visual: { kind: 'base10', tens: 6, ones: 0 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      distractorUnit: 10,
      skill: 'times-10',
      params: { n: [1, 10] },
      answer: (p) => (p.n as number) * 10,
      text: (p) => `10 × ${p.n} = ?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) + 10,
    },
    {
      type: 'keypad',
      skill: 'times-10',
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 10,
      text: (p) => `${p.n} × 10 = ?`,
    },
    {
      type: 'keypad',
      skill: 'times-10',
      story: true,
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 10,
      text: (p) => `${p.n} baskets. 10 apples in each basket. How many apples?`,
    },
    {
      type: 'keypad',
      skill: 'times-10',
      story: true,
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 10,
      text: (p) => `Ana has ${p.n} notes. Each note is 10 coins. How many coins?`,
    },
  ],
};
