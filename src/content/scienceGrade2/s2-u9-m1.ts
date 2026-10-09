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
          { icon: '🔥', label: 'It burns', caption: 'It burns.' },
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
        bg: 'cloudy',
        base: [at('🌧️', 50, 16, 30), bar(50, 86, 100, 28, 'brown')],
        cards: [
          { icon: '🌊', label: 'The soil washes away' },
          { icon: '🌸', label: 'Flowers come up' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('🌦️', 50, 16, 26), bar(50, 86, 100, 28, 'brown'), at('🌱', 30, 66, 16), at('🌱', 70, 66, 16)],
        cards: [
          { icon: '🌿', label: 'The plants drink it' },
          { icon: '🔥', label: 'It burns' },
          { icon: '🪨', label: 'It turns to rock' },
        ],
      },
      {
        bg: 'cloudy',
        base: [
          at('🌧️', 50, 16, 30),
          bar(50, 86, 100, 28, 'brown'),
          at('🌾', 24, 64, 18),
          at('🌾', 50, 64, 18),
          at('🌾', 76, 64, 18),
        ],
        cards: [
          { icon: '🌾', label: 'Roots hold the soil' },
          { icon: '🌊', label: 'All the soil washes off' },
          { icon: '❄️', label: 'Snow comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 50, 18, 24), bar(50, 86, 100, 28, 'brown')],
        cards: [
          { icon: '🏜️', label: 'The soil gets dry' },
          { icon: '🌊', label: 'A river comes' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('🌧️', 50, 16, 30), bar(50, 90, 100, 20, 'gray'), at('🪨', 50, 68, 26)],
        cards: [
          { icon: '💦', label: 'It runs off the rock' },
          { icon: '⬇️', label: 'It soaks into the rock' },
          { icon: '🌱', label: 'A sprout grows' },
        ],
      },
    
      {
        bg: 'day',
        base: [at('⛰️', 50, 48, 36), at('🌧️', 50, 18, 16)],
        cards: [
          { icon: '💧', label: 'The soil washes away' },
          { icon: '🧊', label: 'It turns to ice' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌱', 36, 62, 18), at('🌱', 64, 62, 18), at('🌧️', 50, 20, 14)],
        cards: [
          { icon: '🌿', label: 'Roots hold the soil' },
          { icon: '💨', label: 'The soil blows away' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'day',
        base: [at('🏜️', 50, 62, 36), at('☀️', 78, 18, 16)],
        cards: [
          { icon: '💨', label: 'The soil gets dry' },
          { icon: '🌊', label: 'A sea comes' },
          { icon: '🎂', label: 'A cake comes' },
        ],
      },
    ]),
  ],
};
