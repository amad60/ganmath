import { pl } from '../../plural';
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
  visuals: ['bar-model', 'pictogram', 'base10-blocks'],
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
      // Berat = banyak balok, bukan batang panjang.
      prompt: 'This one is heavier.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'A', icon: '🪨', count: 5 },
          { label: 'B', icon: '🪨', count: 2 },
        ],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      // Sepuluh lempeng ratusan = 1000; batang 1 : 0,1 dulu berkata sepuluh kali, bukan seribu.
      prompt: 'One kilogram is a thousand grams.',
      visual: { kind: 'base10', hundreds: 10, tens: 0, ones: 0 },
      caption: '1 kilogram = 1000 grams',
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
        `Do we weigh ${(['an apple', 'a pencil', 'a bag of rice', 'a big dog'] as const)[p.i as number]} in grams or kilograms?`,
      options: () => ['grams', 'kilograms', 'both', 'neither'],
    },
    {
      type: 'choose-number',
      distractorUnit: 1000,
      skill: 'measure-mass',
      params: { k: [1, 9] },
      answer: (p) => (p.k as number) * 1000,
      text: (p) => `${pl(p.k as number, 'kilogram')} = ? grams`,
      distractors: 'near',
      misconception: (p) => (p.k as number) * 100,
    },
  ],
};
