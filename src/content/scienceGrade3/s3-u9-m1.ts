import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

export const waterGoesAround: ContentModule = {
  id: 's3-u9-m1',
  unitId: 's3-u9',
  grade: 3,
  title: 'Water Goes Around',
  icon: '☁️',
  prereq: ['s3-u8-m1'],
  skills: ['sci-water-cycle'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['sun', 'heat', 'water', 'rain', 'cloud', 'heats', 'rise', 'rises', 'drop', 'drops', 'back', 'sea', 'up', 'puddle', 'road', 'go', 'goes', 'ice', 'shines', 'come'],

  learn: [
    // Siklus ditunjukkan sebagai tiga tahap yang anak putar sendiri, urut atau acak.
    // Lautnya selalu ada di bawah: air yang naik, jadi awan, lalu turun lagi adalah
    // air YANG SAMA — itulah arti "berputar".
    {
      stage: 'concrete',
      prompt: 'Tap sun, cloud, and rain.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [bar(50, 90, 100, 20, 'blue')],
        options: [
          {
            icon: '☀️',
            label: 'Sun',
            caption: 'The sun heats the water. It rises.',
            result: [
              bar(50, 90, 100, 20, 'blue'),
              at('☀️', 82, 16, 18, { fx: 'pop' }),
              at('💧', 50, 52, 9, { fx: 'rise' }),
              at('💧', 66, 58, 9, { fx: 'rise' }),
            ],
          },
          {
            icon: '☁️',
            label: 'Cloud',
            caption: 'The drops make a cloud.',
            bg: 'cloudy',
            result: [
              bar(50, 90, 100, 20, 'blue'),
              at('☁️', 42, 20, 26, { fx: 'pop' }),
              at('☁️', 66, 24, 20, { fx: 'pop' }),
            ],
          },
          {
            icon: '🌧️',
            label: 'Rain',
            caption: 'Rain falls back down.',
            bg: 'cloudy',
            result: [
              bar(50, 90, 100, 20, 'blue'),
              at('🌧️', 46, 18, 28),
              at('💧', 36, 52, 9, { fx: 'fall' }),
              at('💧', 58, 60, 9, { fx: 'fall' }),
            ],
          },
        ],
      },
      action: 'explore',
      target: 3,
    },
    // Genangan di jalan mengering: tahap "naik" yang sama, tapi di tempat yang anak
    // kenal. Airnya tidak hilang — tetesnya terlihat naik saat genangannya memudar.
    {
      stage: 'pictorial',
      prompt: 'Sun shines on a puddle. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('☀️', 82, 16, 18), bar(50, 82, 44, 6, 'blue'), ground('gray')],
        options: [
          {
            icon: '☁️',
            label: 'It goes up',
            caption: 'The sun takes the water up.',
            result: [
              at('☀️', 82, 16, 18),
              bar(50, 82, 44, 6, 'blue', { fx: 'fade' }),
              at('💧', 44, 48, 9, { fx: 'rise' }),
              at('💧', 58, 54, 9, { fx: 'rise' }),
              ground('gray'),
            ],
          },
          { icon: '🧊', label: 'It turns to ice', caption: 'It turns to ice.' },
          { icon: '🐟', label: 'Fish come', caption: 'Fish come.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Rain falls from a cloud.',
      visual: {
        kind: 'evidence-text',
        title: 'Around again',
        sentences: ['Heated water rises, drops make a cloud, and rain falls back down.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-water-cycle', [
      {
        bg: 'day',
        base: [at('☀️', 80, 16, 20), bar(50, 88, 100, 24, 'blue')],
        cards: [
          { icon: '⬆️', label: 'Water goes up' },
          { icon: '🧊', label: 'It freezes' },
          { icon: '🌸', label: 'A flower grows' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('☁️', 36, 20, 26), at('☁️', 62, 22, 26), bar(50, 92, 100, 16, 'green')],
        cards: [
          { icon: '🌧️', label: 'Rain falls' },
          { icon: '🔥', label: 'It burns' },
          { icon: '🪨', label: 'Rocks fall' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('🌧️', 36, 16, 22), at('⛰️', 36, 60, 40), bar(84, 90, 32, 20, 'blue')],
        cards: [
          { icon: '🌊', label: 'It runs to the sea' },
          { icon: '⬆️', label: 'It goes up the hill' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 82, 16, 18), bar(46, 34, 70, 2, 'brown'), at('👕', 46, 52, 24), at('💧', 46, 76, 8)],
        cards: [
          { icon: '👕', label: 'It gets dry' },
          { icon: '🌊', label: 'It gets more wet' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'day',
        base: [at('💧', 36, 40, 10), at('💧', 52, 30, 10), at('💧', 66, 44, 10), bar(50, 90, 100, 20, 'blue')],
        cards: [
          { icon: '☁️', label: 'A cloud comes' },
          { icon: '🌳', label: 'A tree grows' },
          { icon: '🔥', label: 'A fire starts' },
        ],
      },
    
      {
        bg: 'day',
        base: [at('💧', 50, 68, 16), at('☀️', 78, 20, 18)],
        cards: [
          { icon: '💨', label: 'Water goes up' },
          { icon: '🧊', label: 'It turns to ice' },
          { icon: '🌱', label: 'It grows roots' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('☁️', 50, 36, 32)],
        cards: [
          { icon: '🌧️', label: 'Rain falls' },
          { icon: '🔥', label: 'The cloud burns' },
          { icon: '🌵', label: 'It gets dry' },
        ],
      },
      {
        bg: 'day',
        base: [at('👕', 46, 58, 26), at('☀️', 80, 18, 16)],
        cards: [
          { icon: '💨', label: 'The water goes up' },
          { icon: '🌊', label: 'A flood comes' },
          { icon: '🎂', label: 'A cake comes' },
        ],
      },
    ]),
  ],
};
