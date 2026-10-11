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
      prompt: 'A cold cup, or a warm one.',
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
        ask: 'Why are there drops here?',
        base: [at('🥛', 50, 58, 28), at('💧', 36, 48, 11), at('💧', 64, 54, 10)],
        cards: [
          { icon: '❄️', label: 'Cold air made drops' },
          { icon: '💦', label: 'Cup made water' },
          { icon: '☀️', label: 'Warm cup makes drops' },
        ],
      },
      {
        bg: 'room',
        ask: 'Why does this cup stay dry?',
        base: [at('🥛', 50, 58, 28), at('☀️', 78, 22, 16)],
        cards: [
          { icon: '☕', label: 'The cup is warm' },
          { icon: '💦', label: 'Warm cups get drops' },
          { icon: '🥛', label: 'The drink leaked out' },
        ],
      },
      {
        bg: 'room',
        ask: 'What caused these drops?',
        base: [at('🥃', 50, 56, 26), at('🧊', 50, 44, 14), at('💧', 34, 58, 10)],
        cards: [
          { icon: '❄️', label: 'Cold made the drops' },
          { icon: '💦', label: 'The drink leaked out' },
          { icon: '☀️', label: 'Warm glass did it' },
        ],
      },
      {
        bg: 'room',
        ask: 'What keeps this mug dry?',
        base: [at('☕', 50, 56, 26), at('🔥', 78, 22, 14)],
        cards: [
          { icon: '☀️', label: 'Warm, not cold' },
          { icon: '💧', label: 'Heat pulls drops' },
          { icon: '💦', label: 'The mug makes water' },
        ],
      },
      {
        bg: 'room',
        ask: 'Why are drops on this bottle?',
        base: [at('🍼', 50, 56, 26), at('💧', 34, 48, 10), at('💧', 66, 58, 10)],
        cards: [
          { icon: '❄️', label: 'The bottle is cold' },
          { icon: '💦', label: 'It leaked from inside' },
          { icon: '☀️', label: 'Warm bottles drip' },
        ],
      },
      {
        bg: 'room',
        ask: 'What made drops on this can?',
        base: [at('🥫', 50, 56, 24), at('💧', 36, 48, 10), at('💧', 64, 58, 10)],
        cards: [
          { icon: '❄️', label: 'Cold air made drops' },
          { icon: '💦', label: 'Can leaked drink' },
          { icon: '🔥', label: 'Hot can gets drops' },
        ],
      },
      {
        bg: 'day',
        ask: 'What was missing on this window?',
        base: [at('🪟', 50, 48, 30), at('☀️', 80, 18, 16)],
        cards: [
          { icon: '❄️', label: 'Cold to make drops' },
          { icon: '💧', label: 'Warmth makes window drops' },
          { icon: '💦', label: 'The glass made water' },
        ],
      },
      {
        bg: 'night',
        ask: 'What did the cold do here?',
        base: [at('🪟', 50, 48, 30), at('💧', 40, 44, 11), at('💧', 62, 58, 10)],
        cards: [
          { icon: '💨', label: 'Drops from the air' },
          { icon: '💦', label: 'Window made water' },
          { icon: '☀️', label: 'Warm glass made drops' },
        ],
      },
    ]),
  ],
};
