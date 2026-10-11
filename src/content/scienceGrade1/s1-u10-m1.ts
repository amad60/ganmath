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
          { icon: '🚫', label: 'Leave it', caption: 'Leave it.' },
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
        ask: 'The plant dried up. What was missing?',
        bg: 'day',
        base: [at('🥀', 50, 62, 28), ground('brown')],
        cards: [
          { icon: '💧', label: 'Water' },
          { icon: '🍎', label: 'Food' },
          { icon: '🧸', label: 'A toy' },
        ],
      },
      {
        ask: 'The cat bowl is empty. What does it need?',
        bg: 'room',
        base: [at('🐱', 36, 58, 26), at('🥣', 72, 74, 16)],
        cards: [
          { icon: '🍖', label: 'Food' },
          { icon: '💧', label: 'Water' },
          { icon: '🧸', label: 'A toy' },
        ],
      },
      {
        ask: 'The dog pulls away. Why does it do that?',
        bg: 'room',
        base: [at('🐶', 58, 60, 28, { rotate: -12 })],
        cards: [
          { icon: '✊', label: 'Rough hands' },
          { icon: '🤲', label: 'Gentle hands' },
          { icon: '🍖', label: 'Food' },
        ],
      },
      {
        ask: 'The fish looks well. What helps it live?',
        bg: 'water',
        base: [at('🐟', 50, 56, 26), at('🫧', 74, 34, 12)],
        cards: [
          { icon: '💧', label: 'Water' },
          { icon: '✊', label: 'Rough hands' },
          { icon: '🚫', label: 'Being left' },
        ],
      },
      {
        ask: 'The goat looks thin. What was missing?',
        bg: 'day',
        base: [at('🐐', 48, 60, 28), ground('yellow')],
        cards: [
          { icon: '🌾', label: 'Food' },
          { icon: '💧', label: 'Water' },
          { icon: '🪢', label: 'A rope' },
        ],
      },
      {
        ask: 'The seed did not sprout. What does it need?',
        bg: 'day',
        base: [ground('brown'), at('🌰', 50, 74, 14)],
        cards: [
          { icon: '💧', label: 'Water' },
          { icon: '🤲', label: 'Gentle hands' },
          { icon: '🪴', label: 'A pot' },
        ],
      },
      {
        ask: 'The bird cup is dry. What is missing?',
        bg: 'day',
        base: [at('🐦', 34, 52, 22), at('☕', 68, 70, 16), ground()],
        cards: [
          { icon: '💧', label: 'Water' },
          { icon: '⛱️', label: 'Shade' },
          { icon: '🏠', label: 'A cage' },
        ],
      },
      {
        ask: 'The rabbit turns away. What caused that?',
        bg: 'day',
        base: [at('🐰', 58, 64, 26), ground()],
        cards: [
          { icon: '✊', label: 'Rough hands' },
          { icon: '🍖', label: 'No food' },
          { icon: '☀️', label: 'The sun' },
        ],
      },
    ]),
  ],
};
