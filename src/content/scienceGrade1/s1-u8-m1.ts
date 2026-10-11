import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

export const pushAndPull: ContentModule = {
  id: 's1-u8-m1',
  unitId: 's1-u8',
  grade: 1,
  title: 'Push and Pull',
  icon: '🚪',
  prereq: ['s1-u7-m1'],
  skills: ['sci-push-pull'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['move', 'pull', 'bring', 'cart', 'door', 'shut'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Push the cart, or pull it.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('🧒', 22, 70, 22), at('🛒', 50, 72, 22), ground('gray')],
        options: [
          {
            icon: '👉',
            label: 'Push',
            caption: 'A push moves it away.',
            result: [
              at('🧒', 34, 70, 22, { fx: 'slide-right' }),
              at('🛒', 76, 72, 22, { fx: 'slide-right' }),
              ground('gray'),
            ],
          },
          {
            icon: '👈',
            label: 'Pull',
            caption: 'A pull brings it to you.',
            result: [
              at('🧒', 16, 70, 22),
              at('🛒', 38, 72, 22, { fx: 'slide-left' }),
              ground('gray'),
            ],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'Pull the door. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'room',
        base: [at('🚪', 58, 54, 34), at('✋', 32, 54, 14)],
        options: [
          {
            icon: '🚪',
            label: 'It comes to you',
            caption: 'A pull brings the door to you.',
            result: [at('🚪', 44, 54, 34, { fx: 'slide-left' }), at('✋', 20, 54, 14, { fx: 'slide-left' })],
          },
          { icon: '🧱', label: 'It stays shut', caption: 'It stays shut.' },
          { icon: '👉', label: 'It moves away', caption: 'It moves away.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A pull brings it to you.',
      visual: {
        kind: 'evidence-text',
        title: 'Two moves',
        sentences: ['A push sends it away. A pull brings it closer.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-push-pull', [
      {
        ask: 'The ball rolled away. What made it go?',
        bg: 'day',
        base: [at('🧒', 22, 68, 22), at('⚽', 74, 74, 16), ground()],
        cards: [
          { icon: '👉', label: 'A push' },
          { icon: '👈', label: 'A pull' },
          { icon: '💨', label: 'The wind' },
        ],
      },
      {
        ask: 'What made the sled come close?',
        bg: 'room',
        base: [at('🧒', 22, 68, 22), bar(40, 70, 22, 2, 'brown'), at('🛷', 48, 74, 18), ground('gray')],
        cards: [
          { icon: '🤲', label: 'A pull' },
          { icon: '👉', label: 'A push' },
          { icon: '⛰️', label: 'A hill' },
        ],
      },
      {
        ask: 'The door swung away. What did that?',
        bg: 'room',
        base: [at('🧒', 24, 64, 22), at('🚪', 70, 52, 30)],
        cards: [
          { icon: '👉', label: 'A push' },
          { icon: '👈', label: 'A pull' },
          { icon: '💨', label: 'The wind' },
        ],
      },
      {
        ask: 'The leaves moved away. What caused that?',
        bg: 'day',
        base: [at('🧹', 26, 66, 20), at('🍂', 74, 78, 14), ground()],
        cards: [
          { icon: '👉', label: 'A push' },
          { icon: '⛰️', label: 'A hill' },
          { icon: '🌧️', label: 'The rain' },
        ],
      },
      {
        ask: 'The goat came closer. What made it come?',
        bg: 'day',
        base: [at('🧒', 24, 68, 22), bar(46, 64, 24, 2, 'brown'), at('🐐', 62, 68, 24), ground()],
        cards: [
          { icon: '🤲', label: 'A pull' },
          { icon: '👉', label: 'A push' },
          { icon: '🍖', label: 'Food' },
        ],
      },
      {
        ask: 'What made the cup come to your hand?',
        bg: 'room',
        base: [at('✋', 28, 62, 16), at('☕', 48, 66, 18)],
        cards: [
          { icon: '🤲', label: 'A pull' },
          { icon: '🌧️', label: 'The rain' },
          { icon: '💥', label: 'A bump' },
        ],
      },
      {
        ask: 'What made the jar move closer?',
        bg: 'room',
        base: [at('✋', 26, 60, 16), bar(44, 64, 20, 2, 'brown'), at('🫙', 56, 62, 22)],
        cards: [
          { icon: '🤲', label: 'A pull' },
          { icon: '💥', label: 'A bump' },
          { icon: '🦶', label: 'A kick' },
        ],
      },
      {
        ask: 'The box slid away. What caused that?',
        bg: 'room',
        base: [at('🧒', 24, 66, 22), at('📦', 74, 68, 20), ground('gray')],
        cards: [
          { icon: '👉', label: 'A push' },
          { icon: '🪢', label: 'A rope' },
          { icon: '🧊', label: 'Ice' },
        ],
      },
    ]),
  ],
};
