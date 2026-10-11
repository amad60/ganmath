import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

export const howAnimalsMove: ContentModule = {
  id: 's1-u6-m1',
  unitId: 's1-u6',
  grade: 1,
  title: 'How Animals Move',
  icon: '🐦',
  prereq: ['s1-u5-m1'],
  skills: ['sci-move'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['bird', 'fly', 'fish', 'swim', 'hop', 'crawl', 'frog'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Pick air, water, or land.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'plain',
        base: [at('🐦', 22, 50, 18), at('🐟', 50, 50, 18), at('🐸', 78, 50, 18)],
        options: [
          {
            icon: '☁️',
            label: 'Air',
            caption: 'A bird flies in the air.',
            bg: 'day',
            result: [at('☁️', 76, 20, 18), at('🐦', 40, 42, 22, { fx: 'slide-right' })],
          },
          {
            icon: '🌊',
            label: 'Water',
            caption: 'A fish swims in the water.',
            bg: 'water',
            result: [
              at('🐟', 44, 56, 22, { flip: true, fx: 'slide-right' }),
              at('🫧', 66, 34, 10, { fx: 'rise' }),
            ],
          },
          {
            icon: '🌳',
            label: 'Land',
            caption: 'A frog hops on the land.',
            bg: 'day',
            result: [at('🐸', 40, 70, 22, { fx: 'rise' }), at('🐛', 76, 84, 12, { fx: 'slide-left' }), ground()],
          },
        ],
      },
      action: 'explore',
      target: 3,
    },
    {
      stage: 'pictorial',
      prompt: 'A fish is on the land.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('🐟', 50, 76, 20, { rotate: 10 }), ground()],
        options: [
          { icon: '🐇', label: 'It hops away', caption: 'It hops away.' },
          {
            icon: '😣',
            label: 'It can not swim',
            caption: 'A fish needs water to swim.',
            result: [at('🐟', 50, 76, 20, { rotate: 10, fx: 'shake' }), at('💧', 80, 30, 12, { fx: 'pop' }), ground()],
          },
          { icon: '🐛', label: 'It crawls', caption: 'It crawls.' },
        ],
        correct: 1,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A fish can swim.',
      visual: {
        kind: 'evidence-text',
        title: 'Many ways',
        sentences: ['Birds fly, fish swim, frogs hop, and worms crawl.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-move', [
      {
        ask: 'What helps this bird reach its nest?',
        bg: 'day',
        base: [at('🪺', 70, 28, 16), bar(24, 72, 36, 6, 'brown'), at('🐦', 28, 58, 18)],
        cards: [
          { icon: '🪽', label: 'It flies' },
          { icon: '🏊', label: 'It swims' },
          { icon: '🐌', label: 'It crawls' },
        ],
      },
      {
        ask: 'This fish is on land. What does it need?',
        bg: 'day',
        base: [at('🐟', 50, 74, 20, { rotate: 12 }), ground()],
        cards: [
          { icon: '💧', label: 'Water' },
          { icon: '🪽', label: 'Wings' },
          { icon: '🦵', label: 'Legs' },
        ],
      },
      {
        ask: 'What helps a frog move on land?',
        bg: 'day',
        base: [at('🐸', 46, 70, 24), ground()],
        cards: [
          { icon: '🦘', label: 'It hops' },
          { icon: '🐦', label: 'It flies' },
          { icon: '🐠', label: 'It swims' },
        ],
      },
      {
        ask: 'What helps this worm move on soil?',
        bg: 'day',
        base: [at('🐛', 50, 76, 18), ground('brown')],
        cards: [
          { icon: '🐌', label: 'It crawls' },
          { icon: '🪽', label: 'It flies' },
          { icon: '🦘', label: 'It hops' },
        ],
      },
      {
        ask: 'What helps the goat move on rocks?',
        bg: 'day',
        base: [at('🐐', 42, 62, 26), at('🪨', 72, 74, 16), ground('gray')],
        cards: [
          { icon: '🧗', label: 'It climbs' },
          { icon: '🐌', label: 'It crawls' },
          { icon: '🐸', label: 'It hops' },
        ],
      },
      {
        ask: 'The duck is in water. What helps it move?',
        bg: 'water',
        base: [at('🦆', 50, 58, 28)],
        cards: [
          { icon: '🏊', label: 'It swims' },
          { icon: '🪽', label: 'Wings' },
          { icon: '🏃', label: 'It runs' },
        ],
      },
      {
        ask: 'What helps the fish move in the jar?',
        bg: 'room',
        base: [at('🫙', 50, 56, 32), at('🐟', 50, 58, 14)],
        cards: [
          { icon: '🏊', label: 'It swims' },
          { icon: '🧗', label: 'It climbs' },
          { icon: '🏃', label: 'It runs' },
        ],
      },
      {
        ask: 'What helps the bee move in the air?',
        bg: 'day',
        base: [at('🐝', 48, 42, 22), at('🌸', 74, 68, 16)],
        cards: [
          { icon: '🪽', label: 'It flies' },
          { icon: '🧗', label: 'It climbs' },
          { icon: '🦵', label: 'Legs' },
        ],
      },
    ]),
  ],
};
