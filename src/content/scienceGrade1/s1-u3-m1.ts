import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const materialsChange: ContentModule = {
  id: 's1-u3-m1',
  unitId: 's1-u3',
  grade: 1,
  title: 'Hard, Soft, and Change',
  icon: '🪨',
  prereq: ['s1-u2-m1'],
  skills: ['sci-materials'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['rock', 'hard', 'heavy', 'leaf', 'soft', 'light', 'ice', 'melt', 'watch', 'object', 'look', 'sun', 'chocolate', 'stay', 'get'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put the ice in the sun, or cold.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('🧊', 50, 62, 24), ground('gray')],
        options: [
          {
            icon: '☀️',
            label: 'Sun',
            caption: 'The ice melts into water.',
            bg: 'day',
            result: [
              at('☀️', 82, 18, 16, { fx: 'pop' }),
              at('🧊', 50, 70, 12, { dim: true, fx: 'shrink' }),
              at('💧', 66, 80, 12, { fx: 'pop' }),
              ground('gray'),
            ],
          },
          {
            icon: '❄️',
            label: 'Cold',
            caption: 'In the cold, ice stays hard.',
            result: [
              at('❄️', 20, 20, 12),
              at('❄️', 80, 24, 10),
              at('🧊', 50, 62, 24, { fx: 'pulse' }),
              ground('gray'),
            ],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'Chocolate in the sun. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('☀️', 82, 18, 16), at('🍫', 50, 64, 24), ground('gray')],
        options: [
          { icon: '🧊', label: 'It gets hard', caption: 'It gets hard.' },
          {
            icon: '🫠',
            label: 'It melts',
            caption: 'The sun melts the chocolate.',
            result: [
              at('☀️', 82, 18, 16),
              at('🍫', 50, 70, 22, { dim: true, fx: 'droop' }),
              at('🫠', 24, 40, 14, { fx: 'pop' }),
              ground('gray'),
            ],
          },
          { icon: '🌱', label: 'It grows', caption: 'It grows.' },
        ],
        correct: 1,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Ice melts into water.',
      visual: {
        kind: 'evidence-text',
        title: 'A change',
        sentences: ['Hard ice in the sun becomes water.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-materials', [
      {
        bg: 'day',
        base: [at('☀️', 82, 18, 16), at('🧊', 50, 64, 24), ground('gray')],
        cards: [
          { icon: '💧', label: 'It melts into water' },
          { icon: '🪨', label: 'It turns to rock' },
          { icon: '🌱', label: 'It grows' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 82, 18, 16), at('🍫', 50, 64, 24), ground('gray')],
        cards: [
          { icon: '🫠', label: 'It melts' },
          { icon: '🧊', label: 'It gets cold' },
          { icon: '🎈', label: 'It flies' },
        ],
      },
      {
        bg: 'room',
        base: [at('❄️', 24, 22, 14), at('❄️', 78, 26, 12), at('💧', 50, 64, 24)],
        cards: [
          { icon: '🧊', label: 'It turns to ice' },
          { icon: '🔥', label: 'It gets hot' },
          { icon: '🌱', label: 'It grows' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 82, 18, 16), at('🍦', 50, 62, 26), ground('gray')],
        cards: [
          { icon: '🫠', label: 'It melts' },
          { icon: '🪨', label: 'It gets hard' },
          { icon: '🌳', label: 'It grows' },
        ],
      },
      {
        bg: 'room',
        base: [at('🔥', 30, 62, 20), at('🕯️', 62, 60, 26)],
        cards: [
          { icon: '🫠', label: 'It melts' },
          { icon: '❄️', label: 'It freezes' },
          { icon: '🌱', label: 'It grows' },
        ],
      },
    
      {
        bg: 'day',
        base: [at('🍦', 46, 58, 28), at('☀️', 80, 18, 16)],
        cards: [
          { icon: '💧', label: 'It melts' },
          { icon: '❄️', label: 'It freezes' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'room',
        base: [at('🥛', 46, 58, 26), at('❄️', 76, 28, 18)],
        cards: [
          { icon: '🧊', label: 'It turns to ice' },
          { icon: '🌱', label: 'It grows' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'day',
        base: [at('🧈', 48, 60, 26), at('☀️', 80, 18, 16)],
        cards: [
          { icon: '🫠', label: 'It gets soft' },
          { icon: '🪨', label: 'It gets hard' },
          { icon: '🐦', label: 'It flies' },
        ],
      },
    ]),
  ],
};
