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
      prompt: 'See this. See what changes.',
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
          { icon: '🌈', label: 'It grows big', caption: 'It grows big.' },
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
        bg: 'day',
        base: [at('🐇', 26, 58, 12), at('🐇', 46, 62, 12), at('🐇', 66, 56, 12), at('🌱', 50, 76, 10), ground('green')],
        cards: [
          { icon: '🏜️', label: 'The grass goes' },
          { icon: '🌿', label: 'The grass stays' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐇', 62, 60, 16), at('🌱', 34, 68, 14), ground('green')],
        cards: [
          { icon: '🌿', label: 'The grass stays' },
          { icon: '🏜️', label: 'The grass goes' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐐', 24, 58, 14), at('🐐', 48, 60, 14), at('🐐', 72, 56, 14), at('🌱', 50, 76, 10), ground('green')],
        cards: [
          { icon: '🏜️', label: 'The grass goes' },
          { icon: '🌿', label: 'The grass stays' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐐', 64, 58, 18), at('🌱', 32, 68, 14), ground('green')],
        cards: [
          { icon: '🌿', label: 'The grass stays' },
          { icon: '🏜️', label: 'The grass goes' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'water',
        base: [at('🐟', 28, 48, 12), at('🐟', 48, 58, 12), at('🐟', 70, 46, 12), at('🌿', 50, 74, 12)],
        cards: [
          { icon: '🏜️', label: 'The plants go' },
          { icon: '🌱', label: 'The plants stay' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'water',
        base: [at('🐟', 62, 50, 16), at('🌿', 32, 68, 14)],
        cards: [
          { icon: '🌱', label: 'The plants stay' },
          { icon: '🏜️', label: 'The plants go' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐑', 22, 58, 14), at('🐑', 46, 62, 14), at('🐑', 70, 56, 14), at('🌱', 50, 78, 10), ground('green')],
        cards: [
          { icon: '🏜️', label: 'The grass goes' },
          { icon: '🌿', label: 'The grass stays' },
          { icon: '🌸', label: 'A flower comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌱', 40, 66, 16), at('🌱', 64, 64, 14), ground('green')],
        cards: [
          { icon: '🌿', label: 'The grass stays' },
          { icon: '🏜️', label: 'The grass goes' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
    ]),
  ],
};
