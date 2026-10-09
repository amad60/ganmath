import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const lookAfterThem: ContentModule = {
  id: 's1-u10-m1',
  unitId: 's1-u10',
  grade: 1,
  title: 'Look After Living Things',
  icon: '💚',
  prereq: ['s1-u9-m1'],
  skills: ['sci-care'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['help', 'pet', 'gentle', 'kind', 'hand', 'leave', 'cat', 'sad', 'glad'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Help the plant, or leave it.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('🪴', 50, 62, 30)],
        options: [
          {
            icon: '💚',
            label: 'Help it',
            caption: 'Water and sun help it grow.',
            result: [
              at('☀️', 82, 16, 14),
              at('💧', 34, 22, 9, { fx: 'fall' }),
              at('🌻', 50, 56, 36, { fx: 'grow' }),
            ],
          },
          {
            icon: '🚫',
            label: 'Leave it',
            caption: 'No help, so it dries up.',
            result: [at('🥀', 50, 62, 30, { fx: 'droop' }), at('🕸️', 80, 24, 12, { fx: 'pop' })],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'The cat has no food. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'room',
        base: [at('🐱', 40, 58, 26), at('🥣', 72, 76, 14)],
        options: [
          {
            icon: '😿',
            label: 'It is sad',
            caption: 'A pet needs food every day.',
            result: [at('😿', 40, 58, 26, { fx: 'shake' }), at('🥣', 72, 76, 14)],
          },
          { icon: '😸', label: 'It is glad', caption: 'It is glad.' },
          { icon: '🦁', label: 'It gets big', caption: 'It gets big.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Kind hands help a pet.',
      visual: {
        kind: 'evidence-text',
        title: 'Care',
        sentences: ['Give water, give food, and use gentle hands.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-care', [
      {
        bg: 'room',
        base: [at('🐱', 40, 58, 26), at('🥣', 72, 76, 14)],
        cards: [
          { icon: '😿', label: 'It is sad' },
          { icon: '😸', label: 'It is glad' },
          { icon: '🦁', label: 'It gets big' },
        ],
      },
      {
        bg: 'room',
        base: [at('🐶', 36, 60, 26), at('🦴', 70, 74, 16), at('✋', 70, 50, 12)],
        cards: [
          { icon: '😊', label: 'It is happy' },
          { icon: '😢', label: 'It is sad' },
          { icon: '🌧️', label: 'It rains' },
        ],
      },
      {
        bg: 'day',
        base: [at('🧒', 24, 62, 24), at('💧', 46, 40, 10), at('🌱', 64, 72, 20), ground('brown')],
        cards: [
          { icon: '🌻', label: 'It grows' },
          { icon: '🥀', label: 'It dries up' },
          { icon: '🪨', label: 'It turns to rock' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐰', 46, 66, 24), at('✋', 66, 46, 14), ground()],
        cards: [
          { icon: '😊', label: 'It feels safe' },
          { icon: '😱', label: 'It is scared' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐦', 40, 50, 20), at('💧', 66, 70, 14), ground()],
        cards: [
          { icon: '😋', label: 'The bird drinks' },
          { icon: '😢', label: 'The bird cries' },
          { icon: '❄️', label: 'It snows' },
        ],
      },
    
      {
        bg: 'day',
        base: [at('🌱', 50, 60, 26), at('💧', 30, 36, 14)],
        cards: [
          { icon: '😊', label: 'It is glad' },
          { icon: '🥀', label: 'It dries up' },
          { icon: '😨', label: 'It is scared' },
        ],
      },
      {
        bg: 'room',
        base: [at('🐶', 42, 58, 28), at('🍖', 74, 66, 16)],
        cards: [
          { icon: '😊', label: 'It is glad' },
          { icon: '😢', label: 'It is sad' },
          { icon: '❄️', label: 'It snows' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐈', 42, 58, 28), at('💧', 74, 40, 14)],
        cards: [
          { icon: '😊', label: 'It is glad' },
          { icon: '🥀', label: 'It dries up' },
          { icon: '😱', label: 'It is scared' },
        ],
      },
    ]),
  ],
};
