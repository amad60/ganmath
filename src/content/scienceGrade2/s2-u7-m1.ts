import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

export const lightAndShadow: ContentModule = {
  id: 's2-u7-m1',
  unitId: 's2-u7',
  grade: 2,
  title: 'Light and Shadow',
  icon: '🔦',
  prereq: ['s2-u6-m1'],
  skills: ['sci-shadow'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['lamp', 'light', 'block', 'shadow', 'dark', 'move', 'watch', 'fall', 'short', 'high', 'turn', 'off', 'big', 'rainbow', 'goes'],

  learn: [
    {
      stage: 'concrete',
      // Hanya lampunya yang pindah; bayangan selalu jatuh di sisi SEBERANG lampu.
      // Bayangan digambar batang abu-abu di lantai putih supaya kontrasnya jelas.
      prompt: 'Move the lamp. Watch the shadow.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [ground('white'), at('💡', 50, 12, 14), at('🧸', 50, 72, 24)],
        options: [
          {
            icon: '⬅️',
            label: 'Left',
            caption: 'Lamp left, shadow right.',
            result: [
              ground('white'),
              at('💡', 12, 32, 14, { fx: 'slide-left' }),
              at('🧸', 50, 72, 24),
              bar(72, 91, 40, 6, 'gray', { fx: 'grow' }),
            ],
          },
          {
            icon: '➡️',
            label: 'Right',
            caption: 'Lamp right, shadow left.',
            result: [
              ground('white'),
              at('💡', 88, 32, 14, { fx: 'slide-right' }),
              at('🧸', 50, 72, 24),
              bar(28, 91, 40, 6, 'gray', { fx: 'grow' }),
            ],
          },
          {
            icon: '⬆️',
            label: 'Up high',
            caption: 'Lamp up high, short shadow.',
            result: [
              ground('white'),
              at('💡', 50, 12, 14, { fx: 'pulse' }),
              at('🧸', 50, 72, 24),
              bar(50, 91, 30, 6, 'gray', { fx: 'grow' }),
            ],
          },
        ],
      },
      action: 'explore',
      target: 3,
    },
    {
      stage: 'pictorial',
      prompt: 'Turn the lamp off. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'room',
        base: [ground('white'), at('💡', 12, 32, 14), at('🧸', 50, 72, 24), bar(72, 91, 40, 6, 'gray')],
        options: [
          { icon: '⬛', label: 'A big dark shadow', caption: 'A big dark shadow.' },
          { icon: '▪️', label: 'A short shadow', caption: 'A short shadow.' },
          {
            icon: '🚫',
            label: 'The shadow goes away',
            caption: 'No light, no shadow.',
            bg: 'night',
            result: [
              ground('gray'),
              at('💡', 12, 32, 14, { dim: true }),
              at('🧸', 50, 72, 24, { dim: true }),
              bar(72, 91, 40, 6, 'gray', { fx: 'fade' }),
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
      prompt: 'A block makes a shadow.',
      visual: {
        kind: 'evidence-text',
        title: 'Blocked',
        sentences: ['When something blocks the light, a shadow appears.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-shadow', [
      {
        ask: 'A dark patch is by the tree. What caused it?',
        bg: 'day',
        base: [ground('green'), at('💡', 16, 18, 16), at('🌳', 48, 58, 36), bar(74, 91, 28, 6, 'gray')],
        cards: [
          { icon: '🚫', label: 'Blocks light' },
          { icon: '❌', label: 'No lamp' },
          { icon: '🌑', label: 'Lamp is shadow' },
        ],
      },
      {
        ask: 'The toy has a dark patch. What made it?',
        bg: 'room',
        base: [ground('white'), at('💡', 16, 28, 14), at('🧸', 48, 68, 22), bar(72, 91, 26, 6, 'gray')],
        cards: [
          { icon: '🚫', label: 'Blocks light' },
          { icon: '❌', label: 'No lamp' },
          { icon: '🌑', label: 'Lamp is shadow' },
        ],
      },
      {
        ask: 'There is no dark patch. What is missing?',
        bg: 'night',
        base: [ground('gray'), at('🧸', 50, 68, 24)],
        cards: [
          { icon: '💡', label: 'Light' },
          { icon: '🧸', label: 'A bigger toy' },
          { icon: '🌑', label: 'A darker room' },
        ],
      },
      {
        ask: 'A chair has a dark patch. What did the chair do?',
        bg: 'room',
        base: [ground('white'), at('💡', 16, 28, 14), at('🪑', 48, 66, 24), bar(74, 91, 28, 6, 'gray')],
        cards: [
          { icon: '🚫', label: 'Blocks light' },
          { icon: '❌', label: 'No lamp' },
          { icon: '🌑', label: 'Lamp is shadow' },
        ],
      },
      {
        ask: 'A cup has a dark patch. What caused it?',
        bg: 'room',
        base: [ground('white'), at('💡', 16, 28, 14), at('🥛', 48, 68, 22), bar(72, 91, 22, 6, 'gray')],
        cards: [
          { icon: '🚫', label: 'Blocks light' },
          { icon: '❌', label: 'No lamp' },
          { icon: '🌑', label: 'Lamp is shadow' },
        ],
      },
      {
        ask: 'A nail has a thin dark patch. What made it?',
        bg: 'room',
        base: [ground('white'), at('💡', 16, 28, 14), at('🔩', 50, 68, 16), bar(64, 91, 12, 5, 'gray')],
        cards: [
          { icon: '🚫', label: 'Blocks light' },
          { icon: '❌', label: 'No lamp' },
          { icon: '🌑', label: 'Lamp is shadow' },
        ],
      },
      {
        ask: 'A hand shadow is on the wall. What helps make it?',
        bg: 'room',
        base: [at('💡', 18, 36, 14), at('✋', 46, 58, 22), bar(78, 58, 8, 36, 'gray')],
        cards: [
          { icon: '🚫', label: 'Blocks light' },
          { icon: '❌', label: 'No lamp' },
          { icon: '🌑', label: 'Lamp is shadow' },
        ],
      },
      {
        ask: 'The ball has a dark patch. Which part made it?',
        bg: 'day',
        base: [ground('green'), at('💡', 16, 18, 16), at('⚽', 48, 68, 22), bar(72, 91, 24, 6, 'gray')],
        cards: [
          { icon: '🚫', label: 'Blocks light' },
          { icon: '❌', label: 'No lamp' },
          { icon: '🌑', label: 'Lamp is shadow' },
        ],
      },
    ]),
  ],
};
