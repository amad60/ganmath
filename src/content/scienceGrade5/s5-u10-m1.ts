import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const manyDrips: ContentModule = {
  id: 's5-u10-m1',
  unitId: 's5-u10',
  grade: 5,
  title: 'Many Drips',
  icon: '💧',
  prereq: ['s5-u9-m1'],
  skills: ['sci-drip'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['drip', 'many', 'rock', 'hole', 'stay'],

  learn: [
    // Satu tetes tidak mengubah batu. Tetes yang banyak menggerus lubang.
    {
      stage: 'concrete',
      prompt: 'One drip, or many.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('🪨', 50, 64, 28), ground('gray')],
        options: [
          {
            icon: '💧',
            label: 'One',
            caption: 'One drip. The rock stays.',
            result: [at('💧', 50, 28, 12), at('🪨', 50, 64, 28), at('🛑', 78, 30, 12), ground('gray')],
          },
          {
            icon: '💦',
            label: 'Many',
            caption: 'Many drips. A hole grows.',
            result: [at('💦', 50, 22, 16), at('🪨', 50, 66, 26), at('🕳️', 50, 58, 14, { fx: 'pop' }), ground('gray')],
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
        bg: 'day',
        base: [at('💧', 36, 20, 10), at('💧', 50, 16, 10), at('💧', 64, 22, 10), at('🪨', 50, 66, 28), ground('gray')],
        options: [
          {
            icon: '🕳️',
            label: 'A hole grows',
            caption: 'A hole grows.',
            result: [at('💦', 50, 18, 14), at('🪨', 50, 68, 24), at('🕳️', 50, 58, 14, { fx: 'pop' }), ground('gray')],
          },
          { icon: '🛑', label: 'The rock stays', caption: 'The rock stays.' },
          { icon: '🌈', label: 'It grows big', caption: 'It grows big.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Many drips. A hole grows.',
      visual: {
        kind: 'evidence-text',
        title: 'Drips',
        sentences: [
          'One drip, and the rock stays.',
          'Many drips, and a hole grows in the rock.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-drip', [
      {
        bg: 'day',
        base: [at('💧', 34, 18, 8), at('💧', 50, 14, 8), at('💧', 66, 18, 8), at('🪨', 50, 66, 26), ground('gray')],
        cards: [
          { icon: '🕳️', label: 'A hole grows' },
          { icon: '🛑', label: 'The rock stays' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('💧', 50, 22, 12), at('🪨', 50, 66, 28), ground('gray')],
        cards: [
          { icon: '🛑', label: 'The rock stays' },
          { icon: '🕳️', label: 'A hole grows' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'day',
        base: [at('💦', 50, 18, 16), at('🟤', 50, 68, 22), ground('brown')],
        cards: [
          { icon: '🕳️', label: 'A hole grows' },
          { icon: '🛑', label: 'It stays' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'day',
        base: [at('💧', 50, 24, 10), at('🟤', 50, 68, 22), ground('brown')],
        cards: [
          { icon: '🛑', label: 'It stays' },
          { icon: '🕳️', label: 'A hole grows' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'water',
        base: [at('🌊', 20, 40, 16), at('🌊', 40, 28, 14), at('🏔️', 68, 55, 30)],
        cards: [
          { icon: '🕳️', label: 'A hole grows' },
          { icon: '🛑', label: 'The rock stays' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'day',
        base: [at('🪨', 50, 60, 30), ground('gray')],
        cards: [
          { icon: '🛑', label: 'The rock stays' },
          { icon: '🕳️', label: 'A hole grows' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('💦', 50, 20, 16), at('🏖️', 50, 68, 26)],
        cards: [
          { icon: '🕳️', label: 'A hole grows' },
          { icon: '🛑', label: 'The sand stays' },
          { icon: '🌸', label: 'A flower comes' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('💧', 30, 16, 8), at('💧', 50, 12, 8), at('💧', 70, 16, 8), at('🧱', 50, 62, 28)],
        cards: [
          { icon: '🕳️', label: 'A hole grows' },
          { icon: '🛑', label: 'It stays' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
    ]),
  ],
};
