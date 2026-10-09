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
          { icon: '🌈', label: 'A rainbow comes', caption: 'A rainbow comes.' },
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
    whatHappensNext(
      'sci-shadow',
      [
        {
          bg: 'day',
          base: [ground('green'), at('☀️', 12, 20, 16), at('🌳', 52, 58, 40)],
          cards: [
            { icon: '➡️', label: 'On the right' },
            { icon: '⬅️', label: 'On the left' },
            { icon: '⬆️', label: 'Up in the sky' },
          ],
        },
        {
          bg: 'day',
          base: [ground('green'), at('☀️', 88, 20, 16), at('🧍', 50, 62, 32)],
          cards: [
            { icon: '⬅️', label: 'On the left' },
            { icon: '➡️', label: 'On the right' },
            { icon: '⬆️', label: 'Up in the sky' },
          ],
        },
        {
          bg: 'day',
          base: [ground('green'), at('☀️', 50, 12, 16), at('🌴', 50, 60, 40)],
          cards: [
            { icon: '⬇️', label: 'Under it' },
            { icon: '⬅️', label: 'On the left' },
            { icon: '➡️', label: 'On the right' },
          ],
        },
        {
          bg: 'room',
          base: [ground('white'), at('💡', 88, 32, 14), at('🐈', 48, 70, 24)],
          cards: [
            { icon: '⬅️', label: 'On the left' },
            { icon: '➡️', label: 'On the right' },
            { icon: '⬇️', label: 'Under it' },
          ],
        },
        {
          bg: 'room',
          base: [ground('white'), at('💡', 12, 32, 14), at('🪑', 52, 66, 26)],
          cards: [
            { icon: '➡️', label: 'On the right' },
            { icon: '⬅️', label: 'On the left' },
            { icon: '⬆️', label: 'Up on the lamp' },
          ],
        },
      
      {
        bg: 'room',
        base: [at('💡', 50, 24, 16), at('🧍', 50, 58, 28)],
        cards: [
          { icon: '⬛', label: 'A big dark shadow' },
          { icon: '🌈', label: 'A rainbow' },
          { icon: '🎂', label: 'A cake' },
        ],
      },
      {
        bg: 'room',
        base: [at('💡', 50, 18, 12), at('🧍', 50, 62, 22)],
        cards: [
          { icon: '▪️', label: 'A small shadow' },
          { icon: '🔥', label: 'A fire' },
          { icon: '🌧️', label: 'Rain' },
        ],
      },
      {
        bg: 'night',
        base: [at('🧍', 50, 58, 28)],
        cards: [
          { icon: '🌑', label: 'No shadow' },
          { icon: '💡', label: 'A bright lamp' },
          { icon: '🌸', label: 'A flower' },
        ],
      },
    ],
      // Pertanyaannya letak, bukan kejadian: arah cahaya → sisi bayangan.
      'Where is the shadow?',
    ),
  ],
};
