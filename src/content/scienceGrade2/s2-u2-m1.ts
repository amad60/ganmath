import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

export const animalHomes: ContentModule = {
  id: 's2-u2-m1',
  unitId: 's2-u2',
  grade: 2,
  title: 'Animal Homes',
  icon: '🪺',
  prereq: ['s2-u1-m1'],
  skills: ['sci-homes'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['home', 'fish', 'live', 'bird', 'nest', 'pond', 'swim', 'grass', 'cannot', 'breathe', 'move', 'stick', 'tree', 'dig', 'hole'],

  learn: [
    {
      stage: 'concrete',
      // Variabelnya tempat, hewannya tetap: ikan yang sama di kolam dan di rumput.
      // Kalau hewannya ikut berganti, anak tidak tahu mana yang membuat bedanya.
      prompt: 'Move the fish. Where can it live?',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [ground('green'), bar(72, 90, 44, 14, 'blue'), at('🐟', 50, 36, 16)],
        options: [
          {
            icon: '💧',
            label: 'Pond',
            caption: 'In the pond, the fish can swim.',
            result: [ground('green'), bar(72, 90, 44, 14, 'blue'), at('🐟', 74, 88, 11, { flip: true, fx: 'slide-right' })],
          },
          {
            icon: '🌿',
            label: 'Grass',
            caption: 'On grass, a fish cannot breathe.',
            result: [ground('green'), bar(72, 90, 44, 14, 'blue'), at('🐟', 22, 82, 12, { dim: true, fx: 'shake' })],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'The bird finds sticks. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [ground('green'), at('🌳', 56, 52, 54), at('🐦', 18, 30, 14, { flip: true }), at('🪵', 22, 46, 10)],
        options: [
          { icon: '🕳️', label: 'It digs a hole', caption: 'It digs a hole.' },
          {
            icon: '🪺',
            label: 'It makes a nest',
            caption: 'The bird makes a nest in the tree.',
            result: [
              ground('green'),
              at('🌳', 56, 52, 54),
              at('🪺', 58, 40, 14, { fx: 'pop' }),
              at('🐦', 58, 26, 12, { flip: true, fx: 'fall' }),
            ],
          },
          { icon: '🌊', label: 'It swims in the pond', caption: 'It swims in the pond.' },
        ],
        correct: 1,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A bird lives in a nest.',
      visual: {
        kind: 'evidence-text',
        title: 'A fit',
        sentences: ['Animals live where they find what they need.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-homes', [
      {
        ask: 'The fish is on the grass. What is missing?',
        bg: 'day',
        base: [ground('green'), at('🐟', 40, 78, 18, { dim: true, rotate: -20 })],
        cards: [
          { icon: '🌊', label: 'Pond water' },
          { icon: '🪺', label: 'A nest' },
          { icon: '🌿', label: 'More grass' },
        ],
      },
      {
        ask: 'This bird has no nest. What does it need?',
        bg: 'day',
        base: [ground('green'), at('🐦', 50, 70, 22)],
        cards: [
          { icon: '🌳', label: 'A tree nest' },
          { icon: '🌊', label: 'A deep pond' },
          { icon: '🧊', label: 'Thick ice' },
        ],
      },
      {
        ask: 'A camel stands on ice. What is missing?',
        bg: 'cloudy',
        base: [ground('white'), at('🐪', 50, 68, 28, { dim: true })],
        cards: [
          { icon: '🏜️', label: 'Dry land' },
          { icon: '🧊', label: 'More ice' },
          { icon: '🌊', label: 'A pond' },
        ],
      },
      {
        ask: 'A penguin is on hot sand. Why is this a bad home?',
        bg: 'day',
        base: [at('☀️', 84, 16, 16), bar(50, 88, 100, 24, 'yellow'), at('🐧', 48, 70, 26, { dim: true })],
        cards: [
          { icon: '🧊', label: 'It needs cold' },
          { icon: '🏜️', label: 'Sand is better' },
          { icon: '🌳', label: 'A tree nest' },
        ],
      },
      {
        ask: 'A goat is standing in a pond. What is missing?',
        bg: 'day',
        base: [ground('green'), bar(50, 86, 70, 22, 'blue'), at('🐐', 50, 74, 26, { dim: true })],
        cards: [
          { icon: '🌿', label: 'Grass land' },
          { icon: '🌊', label: 'Deeper water' },
          { icon: '🐟', label: 'Fish food' },
        ],
      },
      {
        ask: 'A horse is on the ice. What is missing?',
        bg: 'cloudy',
        base: [ground('white'), at('🐴', 50, 68, 28, { dim: true })],
        cards: [
          { icon: '🌾', label: 'A grass field' },
          { icon: '❄️', label: 'A frozen lake' },
          { icon: '🧊', label: 'Extra cold' },
        ],
      },
      {
        ask: 'This fish is well. What keeps it alive?',
        bg: 'day',
        base: [at('🐟', 50, 54, 32)],
        cards: [
          { icon: '🌊', label: 'Pond water' },
          { icon: '🏜️', label: 'Hot sand' },
          { icon: '🪵', label: 'A hollow log' },
        ],
      },
      {
        ask: 'This bird is well. What keeps it safe?',
        bg: 'day',
        base: [at('🐦', 50, 54, 32)],
        cards: [
          { icon: '🪺', label: 'A nest' },
          { icon: '💧', label: 'Pond water' },
          { icon: '🧊', label: 'A block of ice' },
        ],
      },
    ]),
  ],
};
