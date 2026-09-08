import type { ContentModule } from '../../types';

export const gramsAndKilograms: ContentModule = {
  id: 'g2-u6-m3',
  unitId: 'g2-u6',
  grade: 2,
  title: 'Grams and Kilograms',
  icon: '🪨',
  prereq: ['g2-u6-m2'],
  skills: ['measure-mass'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['bar-model'],
  vocab: ['gram', 'grams', 'kilogram', 'kilograms', 'mass'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five heavy blocks.',
      visual: { kind: 'counter-objects', count: 7, icon: '🪨' },
      action: 'tap-count',
      target: 5,
      hint: 'More blocks means heavier.',
    },
    {
      stage: 'pictorial',
      prompt: 'This one is heavier.',
      visual: { kind: 'bars', lengths: [0.8, 0.3], labels: ['A', 'B'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'One kilogram is a thousand grams.',
      visual: { kind: 'bars', lengths: [1, 0.1], labels: ['A', 'B'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'measure-mass',
      params: { i: [0, 3] },
      answer: (p) => ((p.i as number) < 2 ? 0 : 1),
      text: (p) =>
        `Is ${(['an apple', 'a pencil', 'a bag of rice', 'a big dog'] as const)[p.i as number]} grams or kilograms?`,
      options: () => ['grams', 'kilograms', 'both', 'neither'],
    },
    {
      type: 'choose-number',
      skill: 'measure-mass',
      params: { k: [1, 9] },
      answer: (p) => (p.k as number) * 1000,
      text: (p) => `${p.k} kilograms = ? grams`,
      distractors: 'near',
      misconception: (p) => (p.k as number) * 100,
    },
  ],
};
