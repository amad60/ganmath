import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const downToTheGround: ContentModule = {
  id: 's6-u7-m1',
  unitId: 's6-u7',
  grade: 6,
  title: 'Down to the Ground',
  icon: '⬇️',
  prereq: ['s6-u6-m1'],
  skills: ['sci-ground'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['let', 'ball', 'fall', 'ground', 'hold', 'stay', 'go'],

  learn: [
    // Dilepas, jatuh ke tanah. Dipegang, tetap di atas. Bulu dan batu sama-sama jatuh.
    {
      stage: 'concrete',
      prompt: 'Let the ball go, or hold it.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('⚽', 50, 36, 18), ground('green')],
        options: [
          {
            icon: '✋',
            label: 'Let go',
            caption: 'Let go. It falls to the ground.',
            result: [at('⚽', 50, 72, 16, { fx: 'fall' }), at('⬇️', 74, 40, 14), ground('green')],
          },
          {
            icon: '✊',
            label: 'Hold',
            caption: 'Hold it. It stays up.',
            result: [at('✊', 50, 32, 16), at('⚽', 50, 46, 16), at('🛑', 76, 28, 12), ground('green')],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'Let the ball go, or hold it.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('🪶', 34, 28, 14), at('🪨', 66, 26, 16), ground('green')],
        options: [
          {
            icon: '⬇️',
            label: 'They fall to the ground',
            caption: 'They fall to the ground.',
            result: [at('🪶', 34, 70, 12, { fx: 'fall' }), at('🪨', 66, 72, 14, { fx: 'fall' }), ground('green')],
          },
          { icon: '🛑', label: 'It stays up', caption: 'It stays up.' },
          { icon: '🪶', label: 'One stays up', caption: 'One stays up.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Let go. It falls to the ground.',
      visual: {
        kind: 'evidence-text',
        title: 'Ground',
        sentences: [
          'Let go, and it falls to the ground.',
          'A light one and a heavy one both fall.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-ground', [
      {
        ask: 'Why is the ball on the ground?',
        bg: 'day',
        base: [at('⚽', 50, 74, 16), ground('green')],
        cards: [
          { icon: '✋', label: 'You let it go' },
          { icon: '✊', label: 'You held it' },
          { icon: '🛑', label: 'Letting go holds it' },
        ],
      },
      {
        ask: 'What made the book fall?',
        bg: 'room',
        base: [at('📕', 50, 72, 16), ground('gray')],
        cards: [
          { icon: '✋', label: 'You let it go' },
          { icon: '✊', label: 'A hand holds it' },
          { icon: '🛑', label: 'It stays up' },
        ],
      },
      {
        ask: 'What keeps the ball up?',
        bg: 'day',
        base: [at('✊', 50, 30, 16), at('⚽', 50, 46, 14), ground('green')],
        cards: [
          { icon: '🤚', label: 'Hand holds it' },
          { icon: '⬇️', label: 'You let it go' },
          { icon: '🚫', label: 'Hold does nothing' },
        ],
      },
      {
        ask: 'What did the light one do?',
        bg: 'day',
        base: [at('🪶', 34, 72, 14), at('🪨', 66, 74, 16), ground('green')],
        cards: [
          { icon: '⬇️', label: 'It fell down' },
          { icon: '🪨', label: 'Only the rock fell' },
          { icon: '🛑', label: 'Light one stayed up' },
        ],
      },
      {
        ask: 'What caused the rock to fall?',
        bg: 'day',
        base: [at('🪨', 50, 72, 16), ground('brown')],
        cards: [
          { icon: '✋', label: 'You let it go' },
          { icon: '✊', label: 'You held it up' },
          { icon: '🛑', label: 'Letting go holds it' },
        ],
      },
      {
        ask: 'What helps the coat stay up?',
        bg: 'room',
        base: [at('🧥', 50, 36, 20)],
        cards: [
          { icon: '🪝', label: 'The hook holds it' },
          { icon: '⬇️', label: 'Letting go did this' },
          { icon: '🛑', label: 'It falls while held' },
        ],
      },
      {
        ask: 'What is missing from your hand?',
        bg: 'day',
        base: [at('✋', 50, 28, 16), at('🍎', 50, 74, 14), ground('green')],
        cards: [
          { icon: '✊', label: 'The hold' },
          { icon: '✋', label: 'Hand still holds it' },
          { icon: '🛑', label: 'It stayed up' },
        ],
      },
      {
        ask: 'Which part stays in the air?',
        bg: 'day',
        base: [at('🪶', 36, 70, 14), at('🪨', 64, 72, 16), ground('green')],
        cards: [
          { icon: '⬇️', label: 'Neither one stays up' },
          { icon: '🪶', label: 'Light one stays up' },
          { icon: '🪨', label: 'Only the rock falls' },
        ],
      },
    ]),
  ],
};
