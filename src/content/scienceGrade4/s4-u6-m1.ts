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
      prompt: 'See this. See what changes.',
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
        base: [at('🧒', 18, 58, 18), at('📦', 55, 52, 22), at('🛞', 56, 70, 12), ground('gray')],
        cards: [
          { icon: '➡️', label: 'The box rolls' },
          { icon: '🛑', label: 'The box stays' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🧒', 20, 58, 18), at('📦', 58, 54, 24), ground('gray')],
        cards: [
          { icon: '🛑', label: 'The box stays' },
          { icon: '➡️', label: 'The box rolls' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'day',
        base: [at('🧒', 16, 58, 16), at('🛒', 58, 52, 26), ground('green')],
        cards: [
          { icon: '➡️', label: 'The cart rolls' },
          { icon: '🛑', label: 'It stays' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🧒', 18, 58, 16), at('🛒', 60, 50, 24), at('❌', 74, 72, 12), ground('green')],
        cards: [
          { icon: '🛑', label: 'It stays' },
          { icon: '➡️', label: 'It rolls' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'room',
        base: [at('🧒', 18, 60, 16), at('📦', 55, 46, 20), at('🪵', 58, 70, 16), ground('gray')],
        cards: [
          { icon: '➡️', label: 'The box rolls' },
          { icon: '🛑', label: 'The box stays' },
          { icon: '❄️', label: 'It freezes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🧒', 20, 58, 16), at('🛷', 60, 56, 24), ground('green')],
        cards: [
          { icon: '🛑', label: 'It stays' },
          { icon: '➡️', label: 'It rolls' },
          { icon: '🌸', label: 'A flower comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🚲', 40, 55, 28), at('📦', 62, 42, 14), ground('green')],
        cards: [
          { icon: '➡️', label: 'It rolls' },
          { icon: '🛑', label: 'The box stays' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'day',
        base: [at('🧒', 18, 58, 16), at('🪨', 60, 52, 22), ground('yellow')],
        cards: [
          { icon: '🛑', label: 'The rock stays' },
          { icon: '➡️', label: 'It rolls' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
    ]),
  ],
};
