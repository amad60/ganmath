import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const longerDays: ContentModule = {
  id: 's4-u9-m1',
  unitId: 's4-u9',
  grade: 4,
  title: 'Longer Days',
  icon: '🌞',
  prereq: ['s4-u8-m1'],
  skills: ['sci-season'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['long', 'day', 'short', 'sun', 'plant', 'rest'],

  learn: [
    // Airnya ada di keduanya. Yang berubah panjang harinya.
    {
      stage: 'concrete',
      prompt: 'A long day, or a short day.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('🌱', 50, 62, 22), at('💧', 30, 70, 12), ground('green')],
        options: [
          {
            icon: '☀️',
            label: 'Long day',
            caption: 'More sun. The plant grows.',
            bg: 'day',
            result: [at('☀️', 80, 16, 16), at('🌿', 50, 50, 34, { fx: 'grow' }), ground('green')],
          },
          {
            icon: '🌙',
            label: 'Short day',
            caption: 'A short day. The plant rests.',
            bg: 'night',
            result: [at('🌙', 80, 16, 14), at('🌱', 50, 64, 20), at('😴', 26, 36, 14, { fx: 'pop' }), ground('green')],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'A long day, or a short one.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'night',
        base: [at('🌙', 78, 16, 14), at('💧', 28, 70, 12), at('🌱', 50, 60, 22), ground('green')],
        options: [
          {
            icon: '😴',
            label: 'The plant rests',
            caption: 'The plant rests.',
            result: [at('🌙', 78, 16, 14), at('🌱', 50, 64, 20), ground('green')],
          },
          { icon: '🌿', label: 'The plant grows', caption: 'The plant grows.' },
          { icon: '✈️', label: 'It goes away', caption: 'It goes away.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'More sun. The plant grows.',
      visual: {
        kind: 'evidence-text',
        title: 'Days',
        sentences: [
          'More sun, and the plant grows.',
          'A short day, and the plant rests.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-season', [
      {
        bg: 'day',
        ask: 'Why did this plant grow?',
        base: [at('🌿', 50, 50, 34), ground('green')],
        cards: [
          { icon: '☀️', label: 'The day was long' },
          { icon: '🌙', label: 'A short day did it' },
          { icon: '💧', label: 'Water alone grew it' },
        ],
      },
      {
        bg: 'night',
        ask: 'Why does this plant rest?',
        base: [at('🌱', 50, 64, 20), ground('green')],
        cards: [
          { icon: '🌙', label: 'The day was short' },
          { icon: '☀️', label: 'A long day makes it rest' },
          { icon: '🚫', label: 'Day length does nothing' },
        ],
      },
      {
        bg: 'day',
        ask: 'What made this plant grow?',
        base: [at('🌿', 50, 48, 32), at('💧', 24, 72, 12), ground('green')],
        cards: [
          { icon: '☀️', label: 'A long sunny day' },
          { icon: '🌊', label: 'Only the water did it' },
          { icon: '🌙', label: 'The short night did it' },
        ],
      },
      {
        bg: 'night',
        ask: 'What keeps this plant resting?',
        base: [at('🌱', 50, 64, 20), at('💧', 26, 74, 12), ground('green')],
        cards: [
          { icon: '🌙', label: 'The day is short' },
          { icon: '💧', label: 'Water is why it rests' },
          { icon: '☀️', label: 'Longer days make it rest' },
        ],
      },
      {
        bg: 'day',
        ask: 'Why did this tree grow?',
        base: [at('🌳', 50, 50, 36), ground()],
        cards: [
          { icon: '☀️', label: 'More sun, a long day' },
          { icon: '🌙', label: 'A short day grew it' },
          { icon: '🚫', label: 'Day length does nothing' },
        ],
      },
      {
        bg: 'night',
        ask: 'Why does this tree rest?',
        base: [at('🌳', 50, 56, 30), ground()],
        cards: [
          { icon: '🌙', label: 'The day is short' },
          { icon: '🚫', label: 'The sun does nothing' },
          { icon: '💧', label: 'Water makes it grow now' },
        ],
      },
      {
        bg: 'day',
        ask: 'What helps this flower grow?',
        base: [at('🌷', 50, 54, 30), ground('green')],
        cards: [
          { icon: '☀️', label: 'A long day of sun' },
          { icon: '🌙', label: 'A short day of sun' },
          { icon: '🚫', label: 'The flower needs no sun' },
        ],
      },
      {
        bg: 'night',
        ask: 'What was missing for this bud?',
        base: [at('🌷', 50, 62, 22), ground('brown')],
        cards: [
          { icon: '☀️', label: 'A longer sunny day' },
          { icon: '💧', label: 'More water would open it' },
          { icon: '🌙', label: 'Darkness makes it grow' },
        ],
      },
    ]),
  ],
};
