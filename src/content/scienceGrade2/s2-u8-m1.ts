import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

export const whoEatsWhat: ContentModule = {
  id: 's2-u8-m1',
  unitId: 's2-u8',
  grade: 2,
  title: 'Who Eats What',
  icon: '🦊',
  prereq: ['s2-u7-m1'],
  skills: ['sci-food'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['rabbit', 'eat', 'grass', 'fox', 'give', 'some', 'food', 'carrot', 'meat', 'does', 'hungry', 'chase', 'sleep', 'they', 'go'],

  learn: [
    {
      stage: 'concrete',
      // Kelinci yang sama, makanannya yang berganti. Daging ditolak: "kelinci makan
      // tumbuhan" terlihat dari yang TIDAK dimakan, bukan cuma dari yang dimakan.
      prompt: 'Give the rabbit some food.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [ground('green'), at('🐇', 34, 72, 24, { flip: true })],
        options: [
          {
            icon: '🌿',
            label: 'Grass',
            caption: 'The rabbit eats the grass.',
            result: [ground('green'), at('🐇', 40, 72, 24, { flip: true, fx: 'slide-right' }), at('🌿', 68, 78, 16, { fx: 'shrink' })],
          },
          {
            icon: '🥕',
            label: 'Carrot',
            caption: 'The rabbit eats the carrot.',
            result: [ground('green'), at('🐇', 40, 72, 24, { flip: true, fx: 'slide-right' }), at('🥕', 68, 78, 16, { fx: 'shrink' })],
          },
          {
            icon: '🍖',
            label: 'Meat',
            caption: 'A rabbit does not eat meat.',
            result: [ground('green'), at('🐇', 28, 72, 24, { fx: 'shake' }), at('🍖', 68, 78, 16)],
          },
        ],
      },
      action: 'explore',
      target: 3,
    },
    {
      stage: 'pictorial',
      prompt: 'A hungry fox sees a rabbit. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [ground('green'), at('🦊', 20, 72, 22), at('🐇', 62, 72, 20, { flip: true })],
        options: [
          { icon: '🌿', label: 'The fox eats grass', caption: 'The fox eats grass.' },
          { icon: '💤', label: 'They go to sleep', caption: 'They go to sleep.' },
          {
            icon: '💨',
            label: 'The fox chases the rabbit',
            caption: 'A fox eats rabbits. It chases them.',
            result: [
              ground('green'),
              at('🦊', 52, 72, 22, { fx: 'slide-right' }),
              at('🐇', 86, 72, 20, { flip: true, fx: 'slide-right' }),
            ],
          },
        ],
        correct: 2,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A fox eats a rabbit.',
      visual: {
        kind: 'evidence-text',
        title: 'The chain',
        sentences: ['Grass feeds the rabbit. The rabbit feeds the fox.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-food', [
      {
        ask: 'This rabbit is fed. What did it eat?',
        bg: 'day',
        base: [ground('green'), at('🐇', 50, 68, 28)],
        cards: [
          { icon: '🌿', label: 'Grass' },
          { icon: '🍖', label: 'Meat' },
          { icon: '🦊', label: 'A fox' },
        ],
      },
      {
        ask: 'This fox is fed. What keeps it fed?',
        bg: 'day',
        base: [ground('green'), at('🦊', 50, 68, 28)],
        cards: [
          { icon: '🐇', label: 'Rabbits' },
          { icon: '🌿', label: 'Grass' },
          { icon: '🥕', label: 'Carrots' },
        ],
      },
      {
        ask: 'The rabbit looks hungry. What is missing?',
        bg: 'day',
        base: [bar(50, 90, 100, 16, 'brown'), at('🐇', 50, 70, 26, { dim: true })],
        cards: [
          { icon: '🌿', label: 'Grass' },
          { icon: '🦊', label: 'A fox to eat' },
          { icon: '🦴', label: 'Bones' },
        ],
      },
      {
        ask: 'The fox looks hungry. What is missing?',
        bg: 'day',
        base: [ground('green'), at('🌿', 24, 76, 16), at('🌿', 76, 76, 16), at('🦊', 50, 68, 26, { dim: true })],
        cards: [
          { icon: '🐇', label: 'Rabbits' },
          { icon: '🌿', label: 'Grass to eat' },
          { icon: '☀️', label: 'More sun' },
        ],
      },
      {
        ask: 'This goat is fed. What did it eat?',
        bg: 'day',
        base: [ground('green'), at('🐐', 50, 66, 30)],
        cards: [
          { icon: '🌿', label: 'Grass' },
          { icon: '🍖', label: 'A steak' },
          { icon: '🐟', label: 'Fish' },
        ],
      },
      {
        ask: 'This lion is fed. What helps feed it?',
        bg: 'day',
        base: [ground('green'), at('🦁', 50, 66, 30)],
        cards: [
          { icon: '🍖', label: 'Meat' },
          { icon: '🌿', label: 'Grass' },
          { icon: '🥬', label: 'Leaves' },
        ],
      },
      {
        ask: 'The rabbit is weak. Why?',
        bg: 'day',
        base: [bar(50, 90, 100, 16, 'brown'), at('🐇', 50, 70, 24, { dim: true })],
        cards: [
          { icon: '🌿', label: 'No grass to eat' },
          { icon: '🦊', label: 'Needs a fox' },
          { icon: '🍖', label: 'No meat' },
        ],
      },
      {
        ask: 'The fox has grass but no food. Why?',
        bg: 'day',
        base: [ground('green'), at('🌾', 28, 72, 18), at('🌾', 72, 72, 18), at('🦊', 50, 64, 26)],
        cards: [
          { icon: '🐇', label: 'Foxes eat rabbits' },
          { icon: '🌿', label: 'Foxes eat grass' },
          { icon: '🦊', label: 'Rabbits eat foxes' },
        ],
      },
    ]),
  ],
};
