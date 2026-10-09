import type { ContentModule } from '../types';
import { at, whatHappensNext } from '../scienceScene';

export const coldMakesDrops: ContentModule = {
  id: 's4-u8-m1',
  unitId: 's4-u8',
  grade: 4,
  title: 'Cold Makes Drops',
  icon: '💧',
  prereq: ['s4-u7-m1'],
  skills: ['sci-drops'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['cold', 'cup', 'warm', 'drop', 'stay', 'dry'],

  learn: [
    // Gelasnya sama. Yang berubah suhunya: dingin dapat tetes, hangat tetap kering.
    {
      stage: 'concrete',
      prompt: 'A cold cup, or a warm one.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('🥛', 50, 58, 28)],
        options: [
          {
            icon: '❄️',
            label: 'Cold',
            caption: 'Drops on the cold cup.',
            result: [at('🥛', 50, 58, 28), at('💧', 38, 48, 12, { fx: 'pop' }), at('💧', 62, 52, 10, { fx: 'pop' })],
          },
          {
            icon: '☀️',
            label: 'Warm',
            caption: 'The warm cup stays dry.',
            result: [at('☀️', 78, 22, 14), at('🥛', 50, 58, 28), at('🚫', 34, 40, 12)],
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
        base: [at('🪟', 50, 48, 32), at('❄️', 78, 24, 14)],
        options: [
          {
            icon: '💧',
            label: 'Drops on it',
            caption: 'Drops on it.',
            result: [at('🪟', 50, 48, 32), at('💧', 40, 42, 12, { fx: 'pop' }), at('💧', 60, 56, 10, { fx: 'pop' })],
          },
          { icon: '☀️', label: 'It stays dry', caption: 'It stays dry.' },
          { icon: '🌳', label: 'It grows big', caption: 'It grows big.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Drops on a cold cup.',
      visual: {
        kind: 'evidence-text',
        title: 'Cold',
        sentences: [
          'Drops come on a cold cup. The water was in the air.',
          'A warm cup stays dry.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-drops', [
      {
        bg: 'room',
        base: [at('🥛', 50, 58, 28), at('❄️', 78, 22, 14)],
        cards: [
          { icon: '💧', label: 'Drops on the cup' },
          { icon: '☀️', label: 'It stays dry' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🥛', 50, 58, 28), at('☀️', 78, 22, 16)],
        cards: [
          { icon: '🚫', label: 'The cup stays dry' },
          { icon: '💧', label: 'Drops on the cup' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'room',
        base: [at('🥃', 50, 56, 26), at('🧊', 50, 48, 14)],
        cards: [
          { icon: '💦', label: 'Drops on the glass' },
          { icon: '☕', label: 'It stays dry' },
          { icon: '🌸', label: 'A flower comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('☕', 50, 56, 26), at('🔥', 78, 24, 14)],
        cards: [
          { icon: '🚫', label: 'The cup stays dry' },
          { icon: '💦', label: 'Drops on it' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'room',
        base: [at('🍼', 50, 56, 26), at('❄️', 76, 24, 14)],
        cards: [
          { icon: '💧', label: 'Drops on it' },
          { icon: '🌵', label: 'It stays dry' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'night',
        base: [at('🪟', 50, 48, 30), at('❄️', 80, 20, 14)],
        cards: [
          { icon: '💧', label: 'Drops on the window' },
          { icon: '☀️', label: 'It stays dry' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🪟', 50, 48, 30), at('☀️', 80, 18, 16)],
        cards: [
          { icon: '🌞', label: 'The window stays dry' },
          { icon: '💧', label: 'Drops on it' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
      {
        bg: 'room',
        base: [at('🥫', 50, 56, 24), at('❄️', 76, 22, 14)],
        cards: [
          { icon: '🥤', label: 'Drops on the can' },
          { icon: '☀️', label: 'It stays dry' },
          { icon: '🌺', label: 'A flower comes' },
        ],
      },
    ]),
  ],
};
