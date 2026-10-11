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
          { icon: '🧱', label: 'It stays hard', caption: 'It stays hard.' },
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
        ask: 'The ice became water. What made it melt?',
        bg: 'day',
        base: [at('💧', 58, 74, 16), at('🧊', 42, 68, 14, { dim: true }), ground('gray')],
        cards: [
          { icon: '☀️', label: 'The sun' },
          { icon: '🌙', label: 'The moon' },
          { icon: '💨', label: 'The wind' },
        ],
      },
      {
        ask: 'The chocolate got soft. What caused it?',
        bg: 'day',
        base: [at('🍫', 50, 66, 24, { dim: true }), ground('gray')],
        cards: [
          { icon: '☀️', label: 'The sun' },
          { icon: '❄️', label: 'The cold' },
          { icon: '🌥️', label: 'The shade' },
        ],
      },
      {
        ask: 'The ice stayed hard. What keeps it hard?',
        bg: 'room',
        base: [at('🧊', 50, 58, 28)],
        cards: [
          { icon: '❄️', label: 'The cold' },
          { icon: '☀️', label: 'The sun' },
          { icon: '📦', label: 'A box' },
        ],
      },
      {
        ask: 'The ice cream in the cup melted. Why?',
        bg: 'day',
        base: [at('🥤', 50, 64, 28), at('🍦', 50, 48, 18, { dim: true })],
        cards: [
          { icon: '☀️', label: 'The sun' },
          { icon: '🌙', label: 'The moon' },
          { icon: '🪨', label: 'A rock' },
        ],
      },
      {
        ask: 'The candle wax is soft. What made it soft?',
        bg: 'room',
        base: [at('🕯️', 50, 52, 28), at('🟤', 50, 78, 14)],
        cards: [
          { icon: '🔥', label: 'Heat' },
          { icon: '❄️', label: 'The cold' },
          { icon: '💨', label: 'The wind' },
        ],
      },
      {
        ask: 'The water turned hard. What caused that?',
        bg: 'room',
        base: [at('🥛', 50, 60, 26), at('🧊', 50, 52, 16)],
        cards: [
          { icon: '❄️', label: 'The cold' },
          { icon: '☀️', label: 'The sun' },
          { icon: '🌀', label: 'A fan' },
        ],
      },
      {
        ask: 'Ice in the jar became water. What did that?',
        bg: 'day',
        base: [at('🫙', 50, 58, 30), at('💧', 50, 62, 12)],
        cards: [
          { icon: '☀️', label: 'The sun' },
          { icon: '🧢', label: 'A lid' },
          { icon: '🧣', label: 'A cloth' },
        ],
      },
      {
        ask: 'The butter got soft. What helps it melt?',
        bg: 'day',
        base: [at('🧈', 50, 62, 26), ground('gray')],
        cards: [
          { icon: '☀️', label: 'The sun' },
          { icon: '🍽️', label: 'A plate' },
          { icon: '🌥️', label: 'The shade' },
        ],
      },
    ]),
  ],
};
