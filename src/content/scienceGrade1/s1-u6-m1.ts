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
        ask: 'A nest is in the tree. What move fits here?',
        bg: 'day',
        base: [at('🌳', 50, 58, 42), at('🪺', 66, 32, 14)],
        cards: [
          { icon: '🪽', label: 'Flying' },
          { icon: '🏊', label: 'Swimming' },
          { icon: '🐌', label: 'Crawling' },
        ],
      },
      {
        ask: 'This place is water. What move fits here?',
        bg: 'water',
        base: [at('🫧', 28, 36, 12), at('🫧', 70, 58, 10)],
        cards: [
          { icon: '🏊', label: 'Swimming' },
          { icon: '🪽', label: 'Flying' },
          { icon: '🦘', label: 'Hopping' },
        ],
      },
      {
        ask: 'This place is soil. What move fits here?',
        bg: 'day',
        base: [ground('brown'), bar(50, 74, 36, 12, 'brown')],
        cards: [
          { icon: '🐌', label: 'Crawling' },
          { icon: '🪽', label: 'Flying' },
          { icon: '🏊', label: 'Swimming' },
        ],
      },
      {
        ask: 'Air and a flower are here. What move fits here?',
        bg: 'day',
        base: [at('☁️', 22, 20, 18), at('🌸', 62, 36, 22)],
        cards: [
          { icon: '🪽', label: 'Flying' },
          { icon: '🐌', label: 'Crawling' },
          { icon: '🏊', label: 'Swimming' },
        ],
      },
      {
        ask: 'A leaf is on the pond. What move fits here?',
        bg: 'day',
        base: [bar(50, 82, 100, 28, 'blue'), at('🍀', 48, 64, 22)],
        cards: [
          { icon: '🦘', label: 'Hopping' },
          { icon: '🪽', label: 'Flying' },
          { icon: '🐌', label: 'Crawling' },
        ],
      },
      {
        ask: 'This fish is on the land. What does it need?',
        bg: 'day',
        base: [at('🐟', 50, 72, 22, { rotate: 12 }), ground()],
        cards: [
          { icon: '💧', label: 'Needs water' },
          { icon: '🪽', label: 'Flying' },
          { icon: '🐌', label: 'Crawling' },
        ],
      },
      {
        ask: 'The pond is full of water. What move fits here?',
        bg: 'day',
        base: [bar(50, 68, 88, 40, 'blue')],
        cards: [
          { icon: '🏊', label: 'Swimming' },
          { icon: '🦘', label: 'Hopping' },
          { icon: '🐌', label: 'Crawling' },
        ],
      },
      {
        ask: 'A hole is in the soil. What move fits here?',
        bg: 'day',
        base: [ground('brown'), bar(50, 68, 16, 20, 'gray')],
        cards: [
          { icon: '🐌', label: 'Crawling' },
          { icon: '🦘', label: 'Hopping' },
          { icon: '🪽', label: 'Flying' },
        ],
      },
    ]),
  ],
};
