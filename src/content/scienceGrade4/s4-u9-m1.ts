import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const longerDays: ContentModule = {
  id: 's4-u9-m1',
  unitId: 's4-u9',
  grade: 4,
  title: 'Longer Days',
  icon: '🌞',
  prereq: ['s4-u8-m1'],
  skills: ['sci-season'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['long', 'day', 'short', 'sun', 'plant', 'rest'],

  learn: [
    // Airnya ada di keduanya. Yang berubah panjang harinya.
    {
      stage: 'concrete',
      prompt: 'A long day, or a short day.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('🌱', 50, 62, 22), at('💧', 30, 70, 12), ground('green')],
        options: [
          {
            icon: '☀️',
            label: 'Long day',
            caption: 'More sun. The plant grows.',
            bg: 'day',
            result: [at('☀️', 80, 16, 16), at('🌿', 50, 50, 34, { fx: 'grow' }), ground('green')],
          },
          {
            icon: '🌙',
            label: 'Short day',
            caption: 'A short day. The plant rests.',
            bg: 'night',
            result: [at('🌙', 80, 16, 14), at('🌱', 50, 64, 20), at('😴', 26, 36, 14, { fx: 'pop' }), ground('green')],
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
        bg: 'night',
        base: [at('🌙', 78, 16, 14), at('💧', 28, 70, 12), at('🌱', 50, 60, 22), ground('green')],
        options: [
          {
            icon: '😴',
            label: 'The plant rests',
            caption: 'The plant rests.',
            result: [at('🌙', 78, 16, 14), at('🌱', 50, 64, 20), ground('green')],
          },
          { icon: '🌿', label: 'The plant grows', caption: 'The plant grows.' },
          { icon: '✈️', label: 'It goes away', caption: 'It goes away.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'More sun. The plant grows.',
      visual: {
        kind: 'evidence-text',
        title: 'Days',
        sentences: [
          'More sun, and the plant grows.',
          'A short day, and the plant rests.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-season', [
      {
        bg: 'day',
        base: [at('☀️', 80, 16, 18), at('🌱', 50, 64, 20), at('💧', 26, 74, 10), ground('green')],
        cards: [
          { icon: '🌿', label: 'The plant grows' },
          { icon: '😴', label: 'The plant rests' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'night',
        base: [at('🌙', 80, 16, 16), at('🌱', 50, 64, 20), at('💧', 26, 74, 10), ground('green')],
        cards: [
          { icon: '😴', label: 'The plant rests' },
          { icon: '🌱', label: 'The plant grows' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 18, 16, 14), at('☀️', 80, 18, 16), at('🌱', 50, 66, 18), ground('green')],
        cards: [
          { icon: '🌸', label: 'The plant grows' },
          { icon: '🍂', label: 'The plant rests' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'night',
        base: [at('🌙', 78, 16, 16), at('🌑', 22, 20, 12), at('🌱', 50, 66, 18), ground('brown')],
        cards: [
          { icon: '🍂', label: 'The plant rests' },
          { icon: '🌸', label: 'It gets a flower' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 82, 14, 18), at('🌳', 50, 56, 32), ground()],
        cards: [
          { icon: '🍎', label: 'The tree grows' },
          { icon: '🪵', label: 'The tree rests' },
          { icon: '❄️', label: 'It freezes' },
        ],
      },
      {
        bg: 'night',
        base: [at('🌙', 80, 16, 14), at('🌳', 50, 58, 28), ground()],
        cards: [
          { icon: '🪵', label: 'The tree rests' },
          { icon: '🌳', label: 'The tree grows' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 80, 16, 16), at('💧', 24, 40, 12), at('🌱', 50, 66, 18), ground('green')],
        cards: [
          { icon: '🌿', label: 'The plant grows' },
          { icon: '😴', label: 'The plant rests' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
      {
        bg: 'night',
        base: [at('🌙', 78, 16, 14), at('💧', 24, 42, 12), at('🌱', 50, 66, 18), ground('green')],
        cards: [
          { icon: '😴', label: 'The plant rests' },
          { icon: '🌿', label: 'The plant grows' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
    ]),
  ],
};
