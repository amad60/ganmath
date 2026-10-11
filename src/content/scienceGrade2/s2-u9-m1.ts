import type { ContentModule } from '../types';
import { at, bar, whatHappensNext } from '../scienceScene';

export const soilAndRain: ContentModule = {
  id: 's2-u9-m1',
  unitId: 's2-u9',
  grade: 2,
  title: 'Soil and Rain',
  icon: '🌧️',
  prereq: ['s2-u8-m1'],
  skills: ['sci-soil'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['rain', 'soak', 'soil', 'wash', 'try', 'soft', 'hard', 'washes', 'roots', 'hold', 'place', 'pour', 'dry', 'water', 'turn', 'ice', 'burns', 'plants'],

  learn: [
    {
      stage: 'concrete',
      // Tiga hujan di tanah yang sama: pelan, deras, deras-tapi-berakar. Pilihan
      // ketiga menunjukkan kenapa tanah berumput tidak hanyut — akarnya menahan.
      prompt: 'Make it rain. Try each one.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [bar(50, 86, 100, 28, 'brown')],
        options: [
          {
            icon: '💧',
            label: 'Soft rain',
            caption: 'Soft rain soaks into the soil.',
            bg: 'cloudy',
            result: [
              at('☁️', 50, 14, 24),
              at('💧', 34, 44, 8, { fx: 'fall' }),
              at('💧', 64, 52, 8, { fx: 'fall' }),
              bar(50, 86, 100, 28, 'brown'),
            ],
          },
          {
            icon: '🌧️',
            label: 'Hard rain',
            caption: 'Hard rain washes the soil away.',
            bg: 'cloudy',
            result: [
              at('🌧️', 50, 14, 28),
              at('💧', 30, 46, 10, { fx: 'fall' }),
              bar(50, 91, 100, 18, 'brown'),
              bar(80, 79, 34, 6, 'brown', { fx: 'slide-right' }),
              at('💦', 62, 72, 10, { fx: 'slide-right' }),
            ],
          },
          {
            icon: '🌿',
            label: 'Rain on plants',
            caption: 'Roots hold the soil in place.',
            bg: 'cloudy',
            result: [
              at('🌧️', 50, 14, 28),
              at('💧', 50, 46, 10, { fx: 'fall' }),
              bar(50, 86, 100, 28, 'brown'),
              bar(28, 84, 2, 14, 'yellow'),
              bar(72, 84, 2, 14, 'yellow'),
              at('🌿', 28, 64, 18, { fx: 'pulse' }),
              at('🌿', 72, 64, 18),
            ],
          },
        ],
      },
      action: 'explore',
      target: 3,
    },
    {
      stage: 'pictorial',
      prompt: 'Pour water on dry soil. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('🪣', 36, 30, 20, { rotate: 40 }), bar(50, 86, 100, 28, 'brown')],
        options: [
          { icon: '🧊', label: 'It turns to ice', caption: 'It turns to ice.' },
          {
            icon: '⬇️',
            label: 'It soaks in',
            caption: 'Water soaks into dry soil.',
            result: [
              at('🪣', 36, 30, 20, { rotate: 40 }),
              at('💧', 50, 52, 10, { fx: 'fall' }),
              bar(50, 86, 100, 28, 'brown'),
              bar(50, 74, 30, 4, 'blue', { fx: 'grow' }),
            ],
          },
          { icon: '🌊', label: 'The soil washes', caption: 'The soil washes.' },
        ],
        correct: 1,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Big rain can wash soil away.',
      visual: {
        kind: 'evidence-text',
        title: 'Hard rain',
        sentences: ['Soft rain soaks in. Hard rain can carry soil off.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-soil', [
      {
        ask: 'The soil stayed after soft rain. Why?',
        bg: 'cloudy',
        base: [at('🌦️', 50, 16, 24), at('💧', 40, 42, 8), bar(50, 86, 100, 28, 'brown')],
        cards: [
          { icon: '⬇️', label: 'Soft rain soaks in' },
          { icon: '🌊', label: 'Washes soil off' },
          { icon: '🧊', label: 'Froze the soil' },
        ],
      },
      {
        ask: 'Soil slid off the bare hill. What caused that?',
        bg: 'cloudy',
        base: [at('🌧️', 36, 16, 26), at('⛰️', 48, 52, 34), bar(78, 78, 30, 8, 'brown')],
        cards: [
          { icon: '🌊', label: 'Hard rain' },
          { icon: '🌦️', label: 'Soft rain' },
          { icon: '☀️', label: 'The sun' },
        ],
      },
      {
        ask: 'The soil stayed under the plants. What keeps it?',
        bg: 'cloudy',
        base: [at('🌧️', 50, 16, 24), bar(50, 86, 100, 28, 'brown'), at('🌿', 30, 64, 18), at('🌿', 70, 64, 18)],
        cards: [
          { icon: '🌱', label: 'Roots hold the soil' },
          { icon: '💨', label: 'Roots push soil away' },
          { icon: '🌊', label: 'Rain always removes soil' },
        ],
      },
      {
        ask: 'Bare soil is gone after hard rain. What did the rain do?',
        bg: 'cloudy',
        base: [at('🌧️', 50, 16, 28), bar(50, 92, 100, 14, 'brown'), bar(82, 78, 28, 6, 'brown')],
        cards: [
          { icon: '🌊', label: 'Carried soil off' },
          { icon: '💧', label: 'Soaked in and stayed' },
          { icon: '🧊', label: 'Froze the soil' },
        ],
      },
      {
        ask: 'Soil in the cup got wet. What did the water do?',
        bg: 'room',
        base: [at('🥛', 50, 62, 30), bar(50, 58, 16, 6, 'brown'), at('💧', 50, 28, 10)],
        cards: [
          { icon: '⬇️', label: 'It soaked in' },
          { icon: '🌊', label: 'Carried soil out' },
          { icon: '🧊', label: 'It froze the cup' },
        ],
      },
      {
        ask: 'Soil left the bean hill. What caused that?',
        bg: 'cloudy',
        base: [at('🌧️', 30, 16, 24), at('🫘', 46, 58, 16), bar(74, 80, 28, 7, 'brown')],
        cards: [
          { icon: '🌊', label: 'Hard rain' },
          { icon: '🌦️', label: 'Soft drizzle' },
          { icon: '☀️', label: 'Sun baked it' },
        ],
      },
      {
        ask: 'The puddle sank into the soil. What helps it sink?',
        bg: 'day',
        base: [bar(50, 86, 100, 28, 'brown'), bar(50, 74, 24, 5, 'blue')],
        cards: [
          { icon: '💧', label: 'Soft water soaks in' },
          { icon: '🌧️', label: 'Hard rain only' },
          { icon: '🌊', label: 'Soil always runs off' },
        ],
      },
      {
        ask: 'Water ran off the rock. Why did it not soak in?',
        bg: 'cloudy',
        base: [at('🪨', 42, 64, 28), bar(70, 86, 28, 5, 'blue'), at('💧', 62, 40, 10)],
        cards: [
          { icon: '🚫', label: 'Rock is not soil' },
          { icon: '🌊', label: 'Washes the rock' },
          { icon: '🌱', label: 'Rock drank it' },
        ],
      },
    ]),
  ],
};
