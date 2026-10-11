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
      prompt: 'Many drips, or one drip.',
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
          { icon: '🚫', label: 'No hole', caption: 'No hole.' },
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
        // Lubangnya bukti. Banyak tetes yang membuatnya, bukan satu.
        ask: 'The rock has a hole. What made the hole?',
        bg: 'day',
        base: [at('🪨', 50, 62, 28), at('🕳️', 50, 56, 14), ground('gray')],
        cards: [
          { icon: '💦', label: 'Many drips made it' },
          { icon: '💧', label: 'One drip dug the hole' },
          { icon: '🪨', label: 'The rock opened by itself' },
        ],
      },
      {
        ask: 'One drip hit. Why does the rock stay?',
        bg: 'day',
        base: [at('💧', 50, 24, 12), at('🪨', 50, 64, 28), ground('gray')],
        cards: [
          { icon: '🛑', label: 'One drip is not enough' },
          { icon: '🕳️', label: 'One drip digs a hole' },
          { icon: '💦', label: 'Many drips do nothing' },
        ],
      },
      {
        // Ember penuh: banyak tetes yang mengisi, bukan satu tetes.
        ask: 'The bucket is full. What caused that?',
        bg: 'day',
        base: [at('💧', 34, 18, 8), at('💧', 50, 14, 8), at('💧', 66, 18, 8), at('🪣', 50, 64, 26)],
        cards: [
          { icon: '💦', label: 'Many drips filled it' },
          { icon: '🚫', label: 'One drip cannot fill a bucket' },
          { icon: '💧', label: 'One drip filled it' },
        ],
      },
      {
        ask: 'The soil has a hole. What keeps making it?',
        bg: 'day',
        base: [at('🟤', 50, 66, 24), at('🕳️', 50, 58, 12), ground('brown')],
        cards: [
          { icon: '💦', label: 'Many drips keep falling' },
          { icon: '💧', label: 'One drip made the hole' },
          { icon: '🟤', label: 'The soil opened alone' },
        ],
      },
      {
        ask: 'No hole is in the rock. What is missing?',
        bg: 'day',
        base: [at('🪨', 50, 60, 30), ground('gray')],
        cards: [
          { icon: '💦', label: 'Many drips are missing' },
          { icon: '💧', label: 'One drip is missing' },
          { icon: '🕳️', label: 'A hole needs no water' },
        ],
      },
      {
        ask: 'The brick has a hole. What did drips do?',
        bg: 'cloudy',
        base: [at('🧱', 50, 62, 28), at('🕳️', 50, 56, 12)],
        cards: [
          { icon: '💦', label: 'Many drips grew the hole' },
          { icon: '💧', label: 'One drip was enough' },
          { icon: '🚫', label: 'Drips cannot change brick' },
        ],
      },
      {
        ask: 'The cliff has a hole. Why did it grow?',
        bg: 'water',
        base: [at('🏔️', 62, 55, 30), at('🕳️', 58, 48, 12)],
        cards: [
          { icon: '🌊', label: 'Water hit many times' },
          { icon: '💧', label: 'One splash was enough' },
          { icon: '🏔️', label: 'The hole was always there' },
        ],
      },
      {
        ask: 'The sand has a hole. What helps it grow?',
        bg: 'day',
        base: [at('🏖️', 50, 66, 26), at('🕳️', 50, 58, 12)],
        cards: [
          { icon: '💦', label: 'Drip after drip' },
          { icon: '💧', label: 'Only one drip' },
          { icon: '🛑', label: 'Sand stops every drip' },
        ],
      },
    ]),
  ],
};
