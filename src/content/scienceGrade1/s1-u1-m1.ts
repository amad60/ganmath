import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

export const whatLivingThingsNeed: ContentModule = {
  id: 's1-u1-m1',
  unitId: 's1-u1',
  grade: 1,
  title: 'What Living Things Need',
  icon: '🌱',
  prereq: [],
  skills: ['sci-needs'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['living', 'need', 'water', 'food', 'plant', 'live', 'air', 'life', 'look', 'give', 'fish', 'sand', 'dry', 'dries', 'feel', 'great', 'bad', 'fly', 'flies'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Give the plant water, or not.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('☀️', 84, 16, 14), at('🌱', 50, 66, 24), ground('brown')],
        options: [
          {
            icon: '💧',
            label: 'Water',
            caption: 'With water, the plant grows.',
            result: [
              at('☀️', 84, 16, 14),
              at('💧', 34, 22, 9, { fx: 'fall' }),
              at('💧', 62, 16, 9, { fx: 'fall' }),
              at('🌿', 50, 58, 36, { fx: 'grow' }),
              ground('brown'),
            ],
          },
          {
            icon: '🚫',
            label: 'No water',
            caption: 'No water, so the plant dries up.',
            result: [at('☀️', 84, 16, 14), at('🥀', 50, 64, 28, { fx: 'droop' }), ground('brown')],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'A fish is on the sand.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [bar(50, 88, 100, 24, 'yellow'), at('🐟', 50, 66, 22, { rotate: -15 })],
        options: [
          { icon: '😄', label: 'It feels great', caption: 'It feels great.' },
          {
            icon: '😣',
            label: 'It feels bad',
            caption: 'A fish needs water to live.',
            result: [
              bar(50, 88, 100, 24, 'yellow'),
              at('🐟', 50, 70, 22, { dim: true, fx: 'droop' }),
              at('💧', 80, 30, 12, { fx: 'pop' }),
            ],
          },
          { icon: '🍎', label: 'It needs food', caption: 'It needs food.' },
        ],
        correct: 1,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Air water and food keep life.',
      visual: {
        kind: 'evidence-text',
        title: 'Three needs',
        sentences: ['Plants, animals, and people need water, food, and air.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-needs', [
      {
        ask: 'The plant dried up. What was missing?',
        bg: 'day',
        base: [at('☀️', 84, 16, 14), at('🥀', 50, 64, 26), ground('brown')],
        cards: [
          { icon: '💧', label: 'Water' },
          { icon: '🍎', label: 'Food' },
          { icon: '💨', label: 'Air' },
        ],
      },
      {
        ask: 'The fish is on dry sand. What does it need?',
        bg: 'day',
        base: [bar(50, 88, 100, 24, 'yellow'), at('🐟', 50, 66, 22, { rotate: -15 })],
        cards: [
          { icon: '💧', label: 'Water' },
          { icon: '🍖', label: 'Food' },
          { icon: '⛱️', label: 'Shade' },
        ],
      },
      {
        ask: 'The dog has an empty dish. What was missing?',
        bg: 'room',
        base: [at('🐶', 36, 60, 26), at('🦴', 72, 74, 16, { dim: true })],
        cards: [
          { icon: '🍖', label: 'Food' },
          { icon: '💨', label: 'Air' },
          { icon: '⛱️', label: 'Shade' },
        ],
      },
      {
        ask: 'The bug is shut in a jar. What is missing?',
        bg: 'room',
        base: [at('🫙', 50, 58, 32), at('🐜', 50, 54, 14)],
        cards: [
          { icon: '💨', label: 'Air' },
          { icon: '💧', label: 'Water' },
          { icon: '🌾', label: 'Grass' },
        ],
      },
      {
        ask: 'The goat stands by an empty dish. What does it need?',
        bg: 'day',
        base: [
          at('🐐', 36, 58, 28),
          bar(74, 80, 24, 10, 'white'),
          bar(74, 78, 16, 5, 'blue', { dim: true }),
          ground('yellow'),
        ],
        cards: [
          { icon: '💧', label: 'Water' },
          { icon: '🌾', label: 'Grass' },
          { icon: '⛱️', label: 'Shade' },
        ],
      },
      {
        ask: 'The seed did not grow. What was missing?',
        bg: 'day',
        base: [ground('brown'), at('🌰', 50, 72, 16)],
        cards: [
          { icon: '💧', label: 'Water' },
          { icon: '🪴', label: 'A pot' },
          { icon: '⛱️', label: 'Shade' },
        ],
      },
      {
        ask: 'The child is under the water. What is missing?',
        bg: 'water',
        base: [at('🧒', 46, 58, 26), at('🫧', 70, 36, 12)],
        cards: [
          { icon: '💨', label: 'Air' },
          { icon: '🍖', label: 'Food' },
          { icon: '⛱️', label: 'Shade' },
        ],
      },
      {
        ask: 'What caused the flower in the cup to dry?',
        bg: 'day',
        base: [at('☀️', 82, 16, 16), at('🥀', 50, 46, 22), at('☕', 50, 74, 18)],
        cards: [
          { icon: '💧', label: 'No water' },
          { icon: '☀️', label: 'No sun' },
          { icon: '🌰', label: 'No soil' },
        ],
      },
    ]),
  ],
};
