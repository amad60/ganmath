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
          { icon: '🐦', label: 'It flies', caption: 'It flies.' },
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
        bg: 'day',
        base: [bar(18, 70, 40, 6, 'brown'), at('🐦', 22, 58, 18)],
        cards: [
          { icon: '🪽', label: 'It flies' },
          { icon: '🏊', label: 'It swims' },
          { icon: '🐌', label: 'It crawls' },
        ],
      },
      {
        bg: 'water',
        base: [at('🐟', 50, 54, 24, { flip: true }), at('🫧', 72, 30, 10)],
        cards: [
          { icon: '🏊', label: 'It swims' },
          { icon: '🪽', label: 'It flies' },
          { icon: '🦘', label: 'It hops' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐸', 40, 72, 22), ground()],
        cards: [
          { icon: '🦘', label: 'It hops' },
          { icon: '🪽', label: 'It flies' },
          { icon: '🏊', label: 'It swims in the sky' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐛', 50, 78, 20), ground()],
        cards: [
          { icon: '🐌', label: 'It crawls' },
          { icon: '🪽', label: 'It flies' },
          { icon: '🦘', label: 'It hops high' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐇', 46, 72, 24), ground()],
        cards: [
          { icon: '🦘', label: 'It hops' },
          { icon: '🏊', label: 'It swims' },
          { icon: '🪽', label: 'It flies' },
        ],
      },
    
      {
        bg: 'day',
        base: [at('🐍', 50, 62, 30)],
        cards: [
          { icon: '🐛', label: 'It slides' },
          { icon: '🐦', label: 'It flies' },
          { icon: '🐠', label: 'It swims' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐴', 48, 58, 30)],
        cards: [
          { icon: '🏃', label: 'It runs' },
          { icon: '✈️', label: 'It flies' },
          { icon: '🐠', label: 'It swims' },
        ],
      },
      {
        bg: 'water',
        base: [at('🦆', 50, 58, 28)],
        cards: [
          { icon: '🏊', label: 'It swims' },
          { icon: '🐰', label: 'It hops' },
          { icon: '🎂', label: 'A cake comes' },
        ],
      },
    ]),
  ],
};
