import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const beakFitsFood: ContentModule = {
  id: 's6-u4-m1',
  unitId: 's6-u4',
  grade: 6,
  title: 'Beak Fits Food',
  icon: '🦢',
  prereq: ['s6-u3-m1'],
  skills: ['sci-beak'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['beak', 'long', 'short', 'flower', 'seed', 'eat', 'deep'],

  learn: [
    // Makanannya beda. Paruh panjang masuk bunga dalam. Paruh pendek makan biji.
    {
      stage: 'concrete',
      prompt: 'A long beak, or a short one.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('🌺', 28, 55, 22), at('🌰', 74, 68, 14), ground('green')],
        options: [
          {
            icon: '🦢',
            label: 'Long',
            caption: 'A long beak eats a deep flower.',
            result: [at('🦢', 40, 48, 26, { fx: 'pop' }), at('🌺', 24, 55, 18), ground('green')],
          },
          {
            icon: '🦜',
            label: 'Short',
            caption: 'A short beak eats a seed.',
            result: [at('🦜', 62, 50, 24, { fx: 'pop' }), at('🌰', 74, 70, 12), ground('green')],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'A long beak, or a short one.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('🌺', 50, 58, 28), ground('green')],
        options: [
          {
            icon: '🦢',
            label: 'The long beak eats',
            caption: 'The long beak eats.',
            result: [at('🦢', 58, 46, 28, { fx: 'pop' }), at('🌺', 36, 58, 20), ground('green')],
          },
          { icon: '🦜', label: 'The short beak eats', caption: 'The short beak eats.' },
          { icon: '🚫', label: 'No beak eats', caption: 'No beak eats.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A long beak eats a deep flower.',
      visual: {
        kind: 'evidence-text',
        title: 'Beak',
        sentences: [
          'A long beak eats a deep flower.',
          'A short beak eats a seed.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-beak', [
      {
        ask: 'Which part fits this flower?',
        bg: 'day',
        base: [at('🌺', 50, 56, 26), ground('green')],
        cards: [
          { icon: '🦢', label: 'The long beak' },
          { icon: '🦜', label: 'The short beak' },
          { icon: '🚫', label: 'Any beak fits' },
        ],
      },
      {
        ask: 'What helps eat this seed?',
        bg: 'day',
        base: [at('🌰', 50, 66, 18), ground('brown')],
        cards: [
          { icon: '🦜', label: 'A short beak' },
          { icon: '🦢', label: 'Only a long beak' },
          { icon: '🚫', label: 'Any beak fits' },
        ],
      },
      {
        ask: 'Why can the long beak eat?',
        bg: 'day',
        base: [at('🦢', 62, 48, 24), at('🌺', 34, 56, 22), ground('green')],
        cards: [
          { icon: '🌷', label: 'Flower is deep' },
          { icon: '🌰', label: 'Food is a seed' },
          { icon: '🚫', label: 'Beak shape does nothing' },
        ],
      },
      {
        ask: 'What made the short beak fit?',
        bg: 'day',
        base: [at('🐤', 60, 52, 22), at('🌾', 34, 64, 20), ground('green')],
        cards: [
          { icon: '🌰', label: 'Food is a seed' },
          { icon: '🌺', label: 'The food is deep' },
          { icon: '🚫', label: 'Shape does not matter' },
        ],
      },
      {
        ask: 'What is missing for this flower?',
        bg: 'day',
        base: [at('🌺', 40, 55, 24), at('🦜', 72, 50, 20), ground('green')],
        cards: [
          { icon: '🦢', label: 'A long beak' },
          { icon: '😋', label: 'Short beak eats it' },
          { icon: '🚫', label: 'Beaks are the same' },
        ],
      },
      {
        ask: 'What does a nut need?',
        bg: 'day',
        base: [at('🥜', 50, 66, 16), ground('brown')],
        cards: [
          { icon: '🦜', label: 'A short beak' },
          { icon: '🦢', label: 'A long beak only' },
          { icon: '🚫', label: 'No beak is needed' },
        ],
      },
      {
        ask: 'What keeps the long beak eating?',
        bg: 'day',
        base: [at('🦢', 58, 46, 24), at('🌺', 30, 54, 20), at('🌺', 42, 68, 16), ground('green')],
        cards: [
          { icon: '🌷', label: 'A deep flower' },
          { icon: '🌰', label: 'Only a seed' },
          { icon: '🚫', label: 'Food shape does nothing' },
        ],
      },
      {
        ask: 'What caused this beak to fit?',
        bg: 'day',
        base: [at('🦜', 58, 50, 22), at('🌰', 32, 66, 16), ground('brown')],
        cards: [
          { icon: '🌾', label: 'Food is a seed' },
          { icon: '🌺', label: 'A deep flower' },
          { icon: '🦢', label: 'Long beaks fit seeds' },
        ],
      },
    ]),
  ],
};
