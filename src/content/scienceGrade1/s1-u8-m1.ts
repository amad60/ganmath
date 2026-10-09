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
          { icon: '🎈', label: 'It flies up', caption: 'It flies up.' },
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
        bg: 'day',
        base: [at('👉', 20, 66, 16), at('⚽', 42, 70, 18), ground()],
        cards: [
          { icon: '💨', label: 'It rolls away' },
          { icon: '🛑', label: 'It stays' },
          { icon: '🎈', label: 'It flies up' },
        ],
      },
      {
        bg: 'room',
        base: [at('🧒', 20, 70, 22), bar(46, 72, 30, 2, 'brown'), at('🛷', 70, 74, 20), ground('gray')],
        cards: [
          { icon: '🤲', label: 'It comes to you' },
          { icon: '💨', label: 'It goes away' },
          { icon: '🌧️', label: 'It rains' },
        ],
      },
      {
        bg: 'room',
        base: [at('👉', 30, 54, 14), at('🚪', 58, 54, 34)],
        cards: [
          { icon: '➡️', label: 'It moves away' },
          { icon: '⬅️', label: 'It comes to you' },
          { icon: '🌙', label: 'It is night' },
        ],
      },
      {
        bg: 'day',
        base: [at('🧹', 30, 66, 22), at('🍂', 56, 80, 12), ground()],
        cards: [
          { icon: '➡️', label: 'The leaves move away' },
          { icon: '🌱', label: 'They grow' },
          { icon: '🔥', label: 'They burn' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐕', 70, 72, 22, { flip: true }), bar(46, 64, 30, 2, 'red'), at('🧒', 24, 70, 22), ground()],
        cards: [
          { icon: '🏃', label: 'The kid goes too' },
          { icon: '😴', label: 'The kid sleeps' },
          { icon: '🪽', label: 'The kid flies' },
        ],
      },
    
      {
        bg: 'room',
        base: [at('🚪', 50, 52, 32), at('👉', 24, 58, 16)],
        cards: [
          { icon: '🔓', label: 'It opens' },
          { icon: '💧', label: 'It melts' },
          { icon: '😴', label: 'It sleeps' },
        ],
      },
      {
        bg: 'day',
        base: [at('🚃', 58, 62, 26), at('✋', 28, 58, 16)],
        cards: [
          { icon: '🤗', label: 'It comes close' },
          { icon: '🌋', label: 'It erupts' },
          { icon: '🌧️', label: 'It rains' },
        ],
      },
      {
        bg: 'day',
        base: [at('⚽', 58, 62, 22), at('👟', 30, 64, 16)],
        cards: [
          { icon: '💨', label: 'It rolls away' },
          { icon: '🌱', label: 'It grows' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
    ]),
  ],
};
