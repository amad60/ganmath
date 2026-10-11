import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

export const sunRainWind: ContentModule = {
  id: 's1-u4-m1',
  unitId: 's1-u4',
  grade: 1,
  title: 'Sun, Rain, and Wind',
  icon: '🌤️',
  prereq: ['s1-u3-m1'],
  skills: ['sci-weather'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['sun', 'day', 'warm', 'rain', 'fall', 'cloud', 'wind', 'push', 'sky', 'look', 'pick', 'strong', 'kite', 'shirt', 'wet', 'pushes', 'high', 'sleep', 'night'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Pick the sun, rain, or wind.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'plain',
        base: [bar(50, 30, 84, 2, 'gray'), at('👕', 36, 44, 18), at('🧦', 66, 44, 14), ground()],
        options: [
          {
            icon: '☀️',
            label: 'Sun',
            caption: 'The sun makes the shirt dry.',
            bg: 'day',
            result: [
              bar(50, 30, 84, 2, 'gray'),
              at('☀️', 84, 14, 16, { fx: 'rise' }),
              at('👕', 36, 44, 18),
              at('🧦', 66, 44, 14),
              at('✨', 20, 56, 10, { fx: 'pop' }),
              ground(),
            ],
          },
          {
            icon: '🌧️',
            label: 'Rain',
            caption: 'Rain makes the shirt wet.',
            bg: 'cloudy',
            result: [
              bar(50, 30, 84, 2, 'gray'),
              at('☁️', 30, 12, 20),
              at('💧', 30, 24, 8, { fx: 'fall' }),
              at('💧', 62, 20, 8, { fx: 'fall' }),
              at('👕', 36, 44, 18, { dim: true }),
              at('🧦', 66, 44, 14, { dim: true }),
              ground(),
            ],
          },
          {
            icon: '💨',
            label: 'Wind',
            caption: 'Wind pushes the shirt.',
            bg: 'day',
            result: [
              bar(50, 30, 84, 2, 'gray'),
              at('💨', 12, 44, 16, { fx: 'slide-right' }),
              at('👕', 40, 44, 18, { rotate: -15, fx: 'shake' }),
              at('🧦', 70, 44, 14, { rotate: -20, fx: 'shake' }),
              ground(),
            ],
          },
        ],
      },
      action: 'explore',
      target: 3,
    },
    {
      stage: 'pictorial',
      prompt: 'Strong wind and a kite. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('💨', 14, 36, 16), at('🪁', 54, 72, 18), at('🧒', 78, 76, 22), ground()],
        options: [
          {
            icon: '🪁',
            label: 'The kite flies up',
            caption: 'Wind pushes the kite up high.',
            result: [
              at('💨', 20, 36, 16, { fx: 'slide-right' }),
              at('🪁', 60, 20, 18, { fx: 'rise' }),
              at('🧒', 78, 76, 22),
              ground(),
            ],
          },
          { icon: '🛑', label: 'The kite stays', caption: 'The kite stays.' },
          { icon: '🌧️', label: 'Rain wets it', caption: 'Rain wets it.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Wind can push a leaf.',
      visual: {
        kind: 'evidence-text',
        title: 'Moving air',
        sentences: ['Rain falls, the sun warms, and wind pushes.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-weather', [
      {
        ask: 'The shirt is wet. What made it wet?',
        bg: 'day',
        base: [bar(50, 30, 84, 2, 'gray'), at('👕', 50, 48, 22), at('💦', 62, 62, 12), ground()],
        cards: [
          { icon: '🌧️', label: 'Rain' },
          { icon: '☀️', label: 'The sun' },
          { icon: '💨', label: 'Wind' },
        ],
      },
      {
        ask: 'The shirt got warm. What caused that?',
        bg: 'day',
        base: [bar(50, 30, 84, 2, 'gray'), at('👕', 50, 48, 22), ground()],
        cards: [
          { icon: '☀️', label: 'The sun' },
          { icon: '💨', label: 'Wind' },
          { icon: '☁️', label: 'A cloud' },
        ],
      },
      {
        ask: 'What made the kite go up high?',
        bg: 'day',
        base: [at('🪁', 58, 22, 18), at('🧒', 78, 76, 22), ground()],
        cards: [
          { icon: '💨', label: 'Wind' },
          { icon: '☀️', label: 'The sun' },
          { icon: '🌧️', label: 'The rain' },
        ],
      },
      {
        ask: 'The sand feels warm. What keeps it warm?',
        bg: 'day',
        base: [bar(50, 78, 100, 28, 'yellow'), at('🏖️', 50, 62, 28)],
        cards: [
          { icon: '☀️', label: 'The sun' },
          { icon: '🌧️', label: 'The rain' },
          { icon: '🌙', label: 'Night' },
        ],
      },
      {
        ask: 'What made the hat move away?',
        bg: 'day',
        base: [at('🎩', 72, 58, 22), ground()],
        cards: [
          { icon: '💨', label: 'Wind' },
          { icon: '☁️', label: 'A cloud' },
          { icon: '🌙', label: 'Night' },
        ],
      },
      {
        ask: 'The cup fell over. What caused that?',
        bg: 'day',
        base: [at('☕', 58, 70, 22, { rotate: 80 }), ground()],
        cards: [
          { icon: '💨', label: 'Wind' },
          { icon: '❄️', label: 'The cold' },
          { icon: '🔥', label: 'Heat' },
        ],
      },
      {
        ask: 'The goat is wet. What made it wet?',
        bg: 'day',
        base: [at('🐐', 48, 60, 28), at('💦', 72, 70, 12), ground()],
        cards: [
          { icon: '🌧️', label: 'Rain' },
          { icon: '❄️', label: 'The cold' },
          { icon: '🔥', label: 'Heat' },
        ],
      },
      {
        ask: 'The jar of water is warm. Why?',
        bg: 'day',
        base: [at('🫙', 50, 58, 30), ground()],
        cards: [
          { icon: '☀️', label: 'The sun' },
          { icon: '🍳', label: 'A stove' },
          { icon: '💡', label: 'A lamp' },
        ],
      },
    ]),
  ],
};
