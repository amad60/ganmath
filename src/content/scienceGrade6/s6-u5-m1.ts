import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const tooManyEaters: ContentModule = {
  id: 's6-u5-m1',
  unitId: 's6-u5',
  grade: 6,
  title: 'Too Many Eaters',
  icon: '🐇',
  prereq: ['s6-u4-m1'],
  skills: ['sci-crowd'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['rabbit', 'grass', 'many', 'few', 'stay'],

  learn: [
    // Rumputnya sama di awal. Sedikit kelinci: rumput tetap. Banyak kelinci: rumput habis.
    {
      stage: 'concrete',
      prompt: 'A few rabbits, or many.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('🌱', 50, 66, 18), ground('green')],
        options: [
          {
            icon: '🐇',
            label: 'Few',
            caption: 'A few rabbits. Grass stays.',
            result: [at('🐇', 62, 60, 16), at('🌿', 36, 64, 18), ground('green')],
          },
          {
            icon: '🐰',
            label: 'Many',
            caption: 'Many rabbits. The grass goes.',
            result: [at('🐇', 30, 58, 14), at('🐇', 50, 62, 14), at('🐇', 70, 56, 14), at('🏜️', 50, 74, 20, { fx: 'fade' })],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'Many rabbits, or a few.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('🐇', 28, 58, 14), at('🐇', 48, 62, 14), at('🐇', 68, 56, 14), at('🌱', 50, 74, 12), ground('green')],
        options: [
          {
            icon: '🏜️',
            label: 'The grass goes',
            caption: 'The grass goes.',
            result: [at('🐇', 30, 56, 12), at('🐇', 50, 60, 12), at('🐇', 70, 56, 12), at('🏜️', 50, 76, 18, { fx: 'fade' })],
          },
          { icon: '🌿', label: 'Grass stays', caption: 'Grass stays.' },
          { icon: '🌾', label: 'Grass grows more', caption: 'Grass grows more.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Many rabbits. The grass goes.',
      visual: {
        kind: 'evidence-text',
        title: 'Many',
        sentences: [
          'A few rabbits, and the grass stays.',
          'Many rabbits, and the grass goes.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-crowd', [
      {
        ask: 'Why did the grass go?',
        bg: 'day',
        base: [at('🐇', 28, 56, 14), at('🐇', 48, 60, 14), at('🐇', 68, 56, 14), at('🏜️', 50, 76, 16), ground('brown')],
        cards: [
          { icon: '🐰', label: 'Many rabbits ate' },
          { icon: '🌿', label: 'Too few rabbits' },
          { icon: '🚫', label: 'Eaters make more grass' },
        ],
      },
      {
        ask: 'What keeps the grass here?',
        bg: 'day',
        base: [at('🐇', 64, 58, 16), at('🌿', 34, 64, 18), ground('green')],
        cards: [
          { icon: '🐰', label: 'Only a few ate' },
          { icon: '🏜️', label: 'Many rabbits ate it' },
          { icon: '🌾', label: 'Eaters grow grass' },
        ],
      },
      {
        ask: 'What caused the grass to go?',
        bg: 'day',
        base: [at('🐐', 26, 56, 14), at('🐐', 48, 60, 14), at('🐐', 70, 56, 14), at('🏜️', 50, 78, 14), ground('brown')],
        cards: [
          { icon: '🐏', label: 'Many goats ate' },
          { icon: '🌱', label: 'Too few goats' },
          { icon: '🚫', label: 'Eaters make more grass' },
        ],
      },
      {
        ask: 'What helps the grass stay?',
        bg: 'day',
        base: [at('🐐', 64, 56, 18), at('🌿', 32, 66, 16), ground('green')],
        cards: [
          { icon: '🐏', label: 'Only one goat' },
          { icon: '🏜️', label: 'Many goats ate it' },
          { icon: '🌾', label: 'Eating grows grass' },
        ],
      },
      {
        ask: 'What made the plants go?',
        bg: 'water',
        base: [at('🐟', 28, 48, 12), at('🐟', 50, 56, 12), at('🐟', 72, 46, 12), at('🏜️', 50, 74, 14)],
        cards: [
          { icon: '🐠', label: 'Many fish ate' },
          { icon: '🌿', label: 'Too few fish' },
          { icon: '🌱', label: 'Fish make more plants' },
        ],
      },
      {
        ask: 'What is missing from the field?',
        bg: 'day',
        base: [at('🐇', 28, 56, 12), at('🐇', 48, 60, 12), at('🐇', 68, 56, 12), ground('brown')],
        cards: [
          { icon: '🌿', label: 'The grass' },
          { icon: '🐇', label: 'Too few rabbits' },
          { icon: '🌾', label: 'New grass from eating' },
        ],
      },
      {
        ask: 'What did many sheep do?',
        bg: 'day',
        base: [at('🐑', 24, 56, 14), at('🐑', 46, 60, 14), at('🐑', 68, 56, 14), at('🏜️', 50, 78, 14), ground('brown')],
        cards: [
          { icon: '🍽️', label: 'They ate the grass' },
          { icon: '🌿', label: 'They left the grass' },
          { icon: '🌾', label: 'They made more grass' },
        ],
      },
      {
        ask: 'What do many rabbits need?',
        bg: 'day',
        base: [at('🐇', 30, 56, 14), at('🐇', 50, 60, 14), at('🐇', 70, 56, 14), at('🏜️', 50, 78, 12), ground('brown')],
        cards: [
          { icon: '🌱', label: 'Grass to eat' },
          { icon: '🏜️', label: 'Empty ground' },
          { icon: '🚫', label: 'They do not eat' },
        ],
      },
    ]),
  ],
};
