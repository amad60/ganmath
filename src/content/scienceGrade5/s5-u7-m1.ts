import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const evenPush: ContentModule = {
  id: 's5-u7-m1',
  unitId: 's5-u7',
  grade: 5,
  title: 'Even Push',
  icon: '📦',
  prereq: ['s5-u6-m1'],
  skills: ['sci-balance'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['push', 'stay'],

  learn: [
    // Kotaknya sama. Dorongan sama membuatnya diam. Satu sisi lebih kuat, kotak bergerak.
    {
      stage: 'concrete',
      prompt: 'Same push, or one more.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('📦', 50, 55, 22), ground('gray')],
        options: [
          {
            icon: '🤝',
            label: 'Same',
            caption: 'Same push. The box stays.',
            result: [at('🧒', 18, 55, 16), at('📦', 50, 55, 20), at('🧒', 82, 55, 16), at('🛑', 50, 28, 12), ground('gray')],
          },
          {
            icon: '💪',
            label: 'One more',
            caption: 'One push is more. It goes.',
            result: [at('🧒', 16, 55, 16), at('📦', 62, 52, 20, { fx: 'slide-right' }), at('➡️', 82, 40, 14), ground('gray')],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'Same push, or one more.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'room',
        base: [at('🧒', 16, 55, 16), at('📦', 48, 55, 20), at('💪', 82, 48, 18), ground('gray')],
        options: [
          {
            icon: '➡️',
            label: 'The box goes',
            caption: 'The box goes.',
            result: [at('📦', 68, 52, 20, { fx: 'slide-right' }), at('➡️', 86, 40, 12), ground('gray')],
          },
          { icon: '🛑', label: 'The box stays', caption: 'The box stays.' },
          { icon: '🚫', label: 'No push', caption: 'No push.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Same push. The box stays.',
      visual: {
        kind: 'evidence-text',
        title: 'Push',
        sentences: [
          'The same push on both sides, and the box stays.',
          'One push is more, and the box goes.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-balance', [
      {
        ask: 'The box stays put. Why does it stay?',
        bg: 'room',
        base: [at('🧒', 16, 55, 16), at('📦', 50, 55, 20), at('🧒', 84, 55, 16), ground('gray')],
        cards: [
          { icon: '⚖️', label: 'Pushes are the same' },
          { icon: '💪', label: 'One push is more' },
          { icon: '🚫', label: 'Pushes do not matter' },
        ],
      },
      {
        ask: 'The box slid away. What made it go?',
        bg: 'room',
        base: [at('💪', 16, 48, 18), at('📦', 68, 54, 20), at('🧒', 88, 58, 14), ground('gray')],
        cards: [
          { icon: '🏆', label: 'One side pushes harder' },
          { icon: '⚖️', label: 'Pushes are the same' },
          { icon: '🚫', label: 'Goes with no push' },
        ],
      },
      {
        ask: 'The ball stays put. What keeps it still?',
        bg: 'plain',
        base: [at('🧒', 18, 55, 16), at('⚽', 50, 55, 18), at('🧒', 82, 55, 16)],
        cards: [
          { icon: '🤝', label: 'Same push both sides' },
          { icon: '💪', label: 'One side pushes more' },
          { icon: '⚽', label: 'Ball moves by itself' },
        ],
      },
      {
        ask: 'The door swung. What caused that?',
        bg: 'room',
        base: [at('💪', 16, 48, 18), at('🚪', 58, 50, 26), at('🧒', 86, 58, 14)],
        cards: [
          { icon: '🏆', label: 'One side pushed harder' },
          { icon: '⚖️', label: 'Both pushes match' },
          { icon: '🚪', label: 'Equal pushes swing it' },
        ],
      },
      {
        ask: 'Nobody pushes the box. Why does it stay?',
        bg: 'room',
        base: [at('📦', 50, 55, 24), ground('gray')],
        cards: [
          { icon: '🛑', label: 'Nothing pushes it' },
          { icon: '➡️', label: 'It slides anyway' },
          { icon: '💪', label: 'Hidden push moves it' },
        ],
      },
      {
        ask: 'What did the bigger push do?',
        bg: 'room',
        base: [at('🧒', 12, 48, 12), at('🧒', 24, 62, 12), at('📦', 62, 54, 18), at('🧒', 86, 56, 14), ground('gray')],
        cards: [
          { icon: '➡️', label: 'It moved the box' },
          { icon: '🛑', label: 'Kept the box still' },
          { icon: '⚖️', label: 'Equal pushes moved it' },
        ],
      },
      {
        ask: 'The book stays put. What helps it stay?',
        bg: 'room',
        base: [at('🧒', 18, 55, 16), at('📕', 50, 55, 16), at('🧒', 82, 55, 16)],
        cards: [
          { icon: '🤝', label: 'Even push both sides' },
          { icon: '💪', label: 'One side pushes harder' },
          { icon: '📕', label: 'Matched pushes slide it' },
        ],
      },
      {
        ask: 'One side won. Why did that side win?',
        bg: 'room',
        base: [at('💪', 16, 48, 18), at('📦', 64, 54, 18), at('🧒', 88, 58, 14), ground('gray')],
        cards: [
          { icon: '🏆', label: 'That push was bigger' },
          { icon: '⚖️', label: 'The pushes were equal' },
          { icon: '🧒', label: 'The smaller push won' },
        ],
      },
    ]),
  ],
};
