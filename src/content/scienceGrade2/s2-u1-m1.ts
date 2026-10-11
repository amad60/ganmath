import type { ContentModule } from '../types';
import { at, bar, whatHappensNext } from '../scienceScene';

export const seedsGrow: ContentModule = {
  id: 's2-u1-m1',
  unitId: 's2-u1',
  grade: 2,
  title: 'Seeds Grow',
  icon: '🌱',
  prereq: [],
  skills: ['sci-seeds'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['look', 'seed', 'need', 'water', 'sun', 'sprout', 'soil', 'plant', 'stay', 'weak', 'dry', 'dries', 'hot', 'day', 'into', 'turn', 'ice'],

  learn: [
    {
      stage: 'concrete',
      // Satu variabel per tombol: air+matahari, tanpa air, tanpa matahari. Tanpa
      // matahari kecambahnya TETAP muncul tapi lemah — biji memang bisa berkecambah
      // di gelap, jadi adegan "tidak tumbuh sama sekali" akan mengajarkan hal salah.
      prompt: 'Tap one. Look at the seed.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [bar(50, 88, 100, 24, 'brown'), at('🌰', 50, 80, 9)],
        options: [
          {
            icon: '💧',
            label: 'Water and sun',
            caption: 'Water and sun: a sprout comes up.',
            result: [
              at('☀️', 84, 16, 16, { fx: 'pulse' }),
              at('💧', 36, 34, 10, { fx: 'fall' }),
              bar(50, 88, 100, 24, 'brown'),
              at('🌱', 50, 62, 26, { fx: 'grow' }),
            ],
          },
          {
            icon: '🚫',
            label: 'No water',
            caption: 'No water: the seed stays a seed.',
            result: [
              at('☀️', 84, 16, 16),
              bar(50, 88, 100, 24, 'brown'),
              at('🌰', 50, 80, 9, { fx: 'shake' }),
            ],
          },
          {
            icon: '🌑',
            label: 'No sun',
            caption: 'No sun: the sprout is weak.',
            bg: 'night',
            result: [
              at('💧', 36, 34, 10, { fx: 'fall' }),
              bar(50, 88, 100, 24, 'brown'),
              at('🌱', 50, 64, 20, { dim: true, fx: 'droop' }),
            ],
          },
        ],
      },
      action: 'explore',
      target: 3,
    },
    {
      stage: 'pictorial',
      prompt: 'Hot sun, no water for days. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('☀️', 82, 18, 20), bar(50, 88, 100, 24, 'brown'), at('🌱', 50, 64, 22)],
        options: [
          { icon: '🌳', label: 'It grows big', caption: 'It grows big.' },
          {
            icon: '🥀',
            label: 'It dries up',
            caption: 'No water. The sprout dries up.',
            result: [
              at('☀️', 82, 18, 20, { fx: 'pulse' }),
              bar(50, 88, 100, 24, 'brown'),
              at('🥀', 50, 62, 24, { fx: 'droop' }),
            ],
          },
          { icon: '🧊', label: 'It turns to ice', caption: 'It turns to ice.' },
        ],
        correct: 1,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A sprout grows from a seed.',
      visual: {
        kind: 'evidence-text',
        title: 'Next',
        sentences: ['With water and sun, a seed becomes a sprout.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-seeds', [
      {
        ask: 'The sprout dried up. What was missing?',
        bg: 'day',
        base: [at('☀️', 84, 16, 16), bar(50, 88, 100, 24, 'brown'), at('🥀', 50, 64, 24)],
        cards: [
          { icon: '💧', label: 'Water' },
          { icon: '🌑', label: 'Shade' },
          { icon: '🍯', label: 'Plant food' },
        ],
      },
      {
        ask: 'This seed did not sprout. Why?',
        bg: 'day',
        base: [bar(50, 88, 100, 24, 'brown'), at('🌰', 50, 78, 12)],
        cards: [
          { icon: '💧', label: 'No water' },
          { icon: '🌊', label: 'Too much water' },
          { icon: '🧊', label: 'It turned to ice' },
        ],
      },
      {
        ask: 'A sprout came up. What made it grow?',
        bg: 'day',
        base: [bar(50, 88, 100, 24, 'brown'), at('🌱', 50, 62, 26)],
        cards: [
          { icon: '☀️', label: 'Water and sun' },
          { icon: '🌑', label: 'Only darkness' },
          { icon: '🧊', label: 'Only ice' },
        ],
      },
      {
        ask: 'This sprout looks weak. What was missing?',
        bg: 'night',
        base: [at('💧', 32, 36, 12), bar(50, 88, 100, 24, 'brown'), at('🌱', 50, 66, 16, { dim: true })],
        cards: [
          { icon: '☀️', label: 'Sun' },
          { icon: '💧', label: 'More water' },
          { icon: '🌰', label: 'New soil' },
        ],
      },
      {
        ask: 'A bean sprouted in soil. What did it need?',
        bg: 'day',
        base: [bar(50, 88, 100, 24, 'brown'), at('🫘', 34, 78, 12), at('🌱', 56, 62, 22)],
        cards: [
          { icon: '💧', label: 'Water and sun' },
          { icon: '🪴', label: 'Only a pot' },
          { icon: '🧊', label: 'Ice on top' },
        ],
      },
      {
        ask: 'A bean sprout dried up. What was missing?',
        bg: 'day',
        base: [at('☀️', 84, 16, 16), bar(50, 88, 100, 24, 'brown'), at('🫘', 34, 78, 12), at('🥀', 58, 64, 22)],
        cards: [
          { icon: '💧', label: 'Water' },
          { icon: '☀️', label: 'More sun' },
          { icon: '🌑', label: 'A dark lid' },
        ],
      },
      {
        ask: 'A seed in a cup did not sprout. Why?',
        bg: 'room',
        base: [at('🥛', 50, 62, 30), at('🌰', 50, 56, 10)],
        cards: [
          { icon: '💧', label: 'No water' },
          { icon: '🥛', label: 'Cups block growth' },
          { icon: '🧊', label: 'It needed ice' },
        ],
      },
      {
        ask: 'This young plant grew. What keeps it going?',
        bg: 'day',
        base: [bar(50, 88, 100, 24, 'brown'), at('🌿', 50, 58, 28)],
        cards: [
          { icon: '☀️', label: 'Water and sun' },
          { icon: '📦', label: 'A dark box' },
          { icon: '❄️', label: 'Cold air only' },
        ],
      },
    ]),
  ],
};
