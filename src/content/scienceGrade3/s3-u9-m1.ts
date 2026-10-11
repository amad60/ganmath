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
          { icon: '💧', label: 'The water stays', caption: 'The water stays.' },
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
        ask: 'What made this water rise?',
        bg: 'day',
        base: [at('☀️', 82, 16, 18), bar(50, 90, 100, 20, 'blue'), at('💧', 44, 52, 10), at('💧', 62, 40, 10)],
        cards: [
          { icon: '🔆', label: 'The sun heated it' },
          { icon: '❄️', label: 'The sun cooled it' },
          { icon: '🧊', label: 'Cold air lifted it' },
        ],
      },
      {
        ask: 'What caused this cloud?',
        bg: 'day',
        base: [at('☁️', 50, 24, 32), at('💧', 38, 46, 8), at('💧', 62, 42, 8), bar(50, 92, 100, 16, 'blue')],
        cards: [
          { icon: '🫧', label: 'Drops gathered' },
          { icon: '🧊', label: 'Drops turned to ice' },
          { icon: '🔆', label: 'Heat alone' },
        ],
      },
      {
        ask: 'Why did this rain fall?',
        bg: 'cloudy',
        base: [at('☁️', 48, 18, 30), at('🌧️', 48, 34, 22), at('💧', 36, 58, 8), at('💧', 58, 64, 8), bar(50, 92, 100, 16, 'green')],
        cards: [
          { icon: '🫧', label: 'The cloud was full' },
          { icon: '🌧️', label: 'Heat pulled it up' },
          { icon: '🧊', label: 'The cloud froze' },
        ],
      },
      {
        ask: 'What keeps this water rising?',
        bg: 'day',
        base: [at('☀️', 82, 16, 16), bar(50, 84, 40, 6, 'blue'), at('💧', 42, 52, 8), at('💧', 58, 44, 8), ground('gray')],
        cards: [
          { icon: '🔆', label: 'Heat from the sun' },
          { icon: '❄️', label: 'Cold from the sun' },
          { icon: '🧊', label: 'It turned to ice' },
        ],
      },
      {
        ask: 'What made this shirt dry?',
        bg: 'day',
        base: [at('☀️', 82, 16, 16), bar(46, 32, 70, 2, 'brown'), at('👕', 46, 50, 22), at('💧', 46, 28, 8)],
        cards: [
          { icon: '🔆', label: 'The sun lifted water' },
          { icon: '💧', label: 'The sun added water' },
          { icon: '🧊', label: 'The shirt froze' },
        ],
      },
      {
        ask: 'What helps this steam rise?',
        bg: 'room',
        base: [at('🫖', 50, 68, 26), at('💨', 50, 36, 16)],
        cards: [
          { icon: '🔆', label: 'Heat under the pot' },
          { icon: '❄️', label: 'Cold under the pot' },
          { icon: '🧊', label: 'Ice makes steam' },
        ],
      },
      {
        ask: 'What is missing in the sky?',
        bg: 'day',
        base: [at('☀️', 82, 16, 16), at('💧', 40, 40, 10), at('💧', 58, 32, 10), bar(50, 90, 100, 20, 'blue')],
        cards: [
          { icon: '☁️', label: 'A cloud of drops' },
          { icon: '🌊', label: 'Water stayed down' },
          { icon: '⬇️', label: 'Heat pushed it down' },
        ],
      },
      {
        ask: 'Which part brings water back?',
        bg: 'cloudy',
        base: [at('☀️', 84, 14, 14), at('☁️', 34, 18, 22), at('🌧️', 36, 38, 16), at('⛰️', 30, 62, 26), bar(84, 90, 32, 18, 'blue')],
        cards: [
          { icon: '💦', label: 'Rain from the cloud' },
          { icon: '☀️', label: 'Sun pulls it up' },
          { icon: '🧊', label: 'Ice in the cloud' },
        ],
      },
    ]),
  ],
};
