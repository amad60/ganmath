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
          { icon: '😴', label: 'The kite sleeps', caption: 'The kite sleeps.' },
          { icon: '🌙', label: 'It is night', caption: 'It is night.' },
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
        bg: 'cloudy',
        base: [bar(50, 30, 84, 2, 'gray'), at('🌧️', 30, 14, 20), at('👕', 50, 46, 22), ground()],
        cards: [
          { icon: '💦', label: 'It gets wet' },
          { icon: '🏜️', label: 'It gets dry' },
          { icon: '🌙', label: 'It is night' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 82, 16, 18), bar(50, 80, 40, 8, 'blue'), ground()],
        cards: [
          { icon: '🏜️', label: 'The water dries up' },
          { icon: '🧊', label: 'It turns to ice' },
          { icon: '🌊', label: 'It gets big' },
        ],
      },
      {
        bg: 'day',
        base: [at('💨', 16, 44, 18), at('🍂', 56, 74, 16), ground()],
        cards: [
          { icon: '🍃', label: 'The leaf blows away' },
          { icon: '🪨', label: 'It turns to rock' },
          { icon: '🌱', label: 'It grows' },
        ],
      },
      {
        bg: 'day',
        base: [at('💨', 14, 36, 16), at('🪁', 54, 72, 18), at('🧒', 78, 76, 22), ground()],
        cards: [
          { icon: '🪁', label: 'The kite flies up' },
          { icon: '😴', label: 'The kite sleeps' },
          { icon: '🌙', label: 'It is night' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('🌧️', 40, 16, 22), at('🌱', 50, 70, 22), ground('brown')],
        cards: [
          { icon: '🌿', label: 'The plant grows' },
          { icon: '🔥', label: 'It burns' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
    
      {
        bg: 'cloudy',
        base: [at('☁️', 50, 28, 28), at('❄️', 50, 58, 16)],
        cards: [
          { icon: '❄️', label: 'Snow falls' },
          { icon: '☀️', label: 'The sun comes' },
          { icon: '🎂', label: 'A cake comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('💨', 24, 40, 18), at('🎩', 62, 58, 22)],
        cards: [
          { icon: '💨', label: 'The hat blows away' },
          { icon: '🌱', label: 'It grows' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('☁️', 50, 30, 36), at('🌞', 50, 30, 14)],
        cards: [
          { icon: '🌑', label: 'It gets dim' },
          { icon: '🌈', label: 'A rainbow comes' },
          { icon: '🌸', label: 'A flower comes' },
        ],
      },
    ]),
  ],
};
