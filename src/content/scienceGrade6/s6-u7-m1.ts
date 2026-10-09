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
      prompt: 'See this. See what changes.',
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
          { icon: '🌈', label: 'It grows big', caption: 'It grows big.' },
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
        bg: 'day',
        base: [at('⚽', 50, 28, 16), ground('green')],
        cards: [
          { icon: '⬇️', label: 'It falls to the ground' },
          { icon: '🛑', label: 'It stays up' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('📕', 50, 26, 16), ground('gray')],
        cards: [
          { icon: '⬇️', label: 'It falls to the ground' },
          { icon: '🛑', label: 'It stays up' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'day',
        base: [at('✊', 50, 30, 16), at('⚽', 50, 44, 14), ground('green')],
        cards: [
          { icon: '🛑', label: 'It stays up' },
          { icon: '⬇️', label: 'It falls' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'day',
        base: [at('🪶', 50, 24, 16), ground('green')],
        cards: [
          { icon: '⬇️', label: 'It falls to the ground' },
          { icon: '🛑', label: 'It stays up' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🪨', 50, 24, 18), ground('brown')],
        cards: [
          { icon: '⬇️', label: 'It falls to the ground' },
          { icon: '🛑', label: 'It stays up' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'day',
        base: [at('🪝', 50, 22, 14), at('🧥', 50, 42, 18)],
        cards: [
          { icon: '🛑', label: 'It stays up' },
          { icon: '⬇️', label: 'It falls' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🍎', 50, 26, 16), at('🌳', 50, 48, 28), ground('green')],
        cards: [
          { icon: '⬇️', label: 'It falls to the ground' },
          { icon: '🛑', label: 'It stays up' },
          { icon: '🌸', label: 'A flower comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🧵', 50, 18, 10), at('🖼️', 50, 42, 20)],
        cards: [
          { icon: '🛑', label: 'It stays up' },
          { icon: '⬇️', label: 'It falls' },
          { icon: '🧊', label: 'It turns to ice' },
        ],
      },
    ]),
  ],
};
