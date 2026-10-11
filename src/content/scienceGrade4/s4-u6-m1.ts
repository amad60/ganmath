import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const wheelsHelp: ContentModule = {
  id: 's4-u6-m1',
  unitId: 's4-u6',
  grade: 4,
  title: 'Wheels Help',
  icon: '🛞',
  prereq: ['s4-u5-m1'],
  skills: ['sci-wheel'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['heavy', 'wheel', 'roll', 'stay'],

  learn: [
    // Dorongannya sama. Yang berubah: ada roda atau tidak.
    {
      stage: 'concrete',
      prompt: 'A heavy box. Wheels, or not.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('🧒', 22, 58, 20), at('📦', 58, 56, 24), ground('gray')],
        options: [
          {
            icon: '🛞',
            label: 'Wheels',
            caption: 'The box rolls on wheels.',
            result: [
              at('🧒', 18, 58, 18),
              at('📦', 70, 50, 22, { fx: 'slide-right' }),
              at('🛞', 64, 68, 12),
              ground('gray'),
            ],
          },
          {
            icon: '📦',
            label: 'No wheels',
            caption: 'No wheels. The box stays.',
            result: [at('🧒', 22, 58, 20), at('📦', 58, 56, 24, { fx: 'shake' }), ground('gray')],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'A heavy box. Wheels, or not.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'room',
        base: [at('🧒', 20, 58, 18), at('🪨', 58, 48, 20), at('🛞', 62, 70, 12), ground('gray')],
        options: [
          {
            icon: '➡️',
            label: 'It rolls on wheels',
            caption: 'It rolls on wheels.',
            result: [at('🪨', 74, 46, 18, { fx: 'slide-right' }), at('🛞', 68, 66, 12), ground('gray')],
          },
          { icon: '🪨', label: 'It stays', caption: 'It stays.' },
          { icon: '🌳', label: 'It grows big', caption: 'It grows big.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A heavy box rolls on wheels.',
      visual: {
        kind: 'evidence-text',
        title: 'Wheels',
        sentences: [
          'A heavy box rolls on wheels.',
          'No wheels, and the heavy box stays.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-wheel', [
      {
        bg: 'room',
        ask: 'What helps this heavy box move?',
        base: [at('🧒', 16, 58, 16), at('📦', 76, 50, 22), ground('gray')],
        cards: [
          { icon: '🛞', label: 'Wheels under the box' },
          { icon: '⚖️', label: 'Weight rolls it' },
          { icon: '💪', label: 'A harder push' },
        ],
      },
      {
        bg: 'room',
        ask: 'Why did this heavy box stay?',
        base: [at('🧒', 30, 58, 16), at('📦', 52, 54, 22), ground('gray')],
        cards: [
          { icon: '🚫', label: 'No wheels' },
          { icon: '🛞', label: 'Wheels hide under' },
          { icon: '⚖️', label: 'Weight rolls it' },
        ],
      },
      {
        bg: 'room',
        ask: 'What made this suitcase move?',
        base: [at('🧒', 14, 58, 16), at('🧳', 78, 50, 22), ground('gray')],
        cards: [
          { icon: '🛞', label: 'Wheels under the suitcase' },
          { icon: '📦', label: 'Weight slid it' },
          { icon: '🚫', label: 'No wheels needed' },
        ],
      },
      {
        bg: 'room',
        ask: 'What was missing under this bag?',
        base: [at('🧒', 28, 58, 16), at('👜', 52, 54, 22), ground('gray')],
        cards: [
          { icon: '🛞', label: 'Wheels to roll on' },
          { icon: '💪', label: 'A harder push' },
          { icon: '📦', label: 'Weight rolls it' },
        ],
      },
      {
        bg: 'room',
        ask: 'What did the wheels do?',
        base: [at('🧒', 14, 58, 14), at('🎹', 78, 48, 24), ground('gray')],
        cards: [
          { icon: '➡️', label: 'Let the piano roll' },
          { icon: '📦', label: 'Its weight rolled it' },
          { icon: '🛑', label: 'Made it stay' },
        ],
      },
      {
        bg: 'room',
        ask: 'Why does this couch stay?',
        base: [at('🧒', 24, 58, 16), at('🛋️', 58, 52, 26), ground('gray')],
        cards: [
          { icon: '🚫', label: 'No wheels under' },
          { icon: '📦', label: 'Weight should roll' },
          { icon: '🛞', label: 'Wheels under it' },
        ],
      },
      {
        bg: 'day',
        ask: 'Which part lets a cart roll?',
        base: [at('🧒', 16, 58, 16), at('🛒', 76, 50, 24), ground('green')],
        cards: [
          { icon: '🛞', label: 'Wheels on the cart' },
          { icon: '📦', label: 'Weight of the cart' },
          { icon: '🚫', label: 'No wheels are needed' },
        ],
      },
      {
        bg: 'day',
        ask: 'What caused this cart to stay?',
        base: [at('🧒', 26, 58, 16), at('🛒', 52, 52, 22), at('❌', 70, 74, 12), ground('green')],
        cards: [
          { icon: '🛞', label: 'The wheels are broken' },
          { icon: '➡️', label: 'Broken wheels still roll' },
          { icon: '📦', label: 'Weight makes it roll' },
        ],
      },
    ]),
  ],
};
