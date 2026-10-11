import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const bodyCoverings: ContentModule = {
  id: 's3-u2-m1',
  unitId: 's3-u2',
  grade: 3,
  title: 'Body Coverings',
  icon: '🐻',
  prereq: ['s3-u1-m1'],
  skills: ['sci-cover'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['fur', 'animal', 'warm', 'feather', 'bird', 'scale', 'fish', 'keep', 'keeps', 'snow', 'cold', 'get', 'gets', 'with', 'rain', 'duck', 'dry', 'wet', 'stays', 'sink', 'sinks', 'falls', 'fall', 'thick'],

  learn: [
    // Salju yang sama, satu hal yang diubah: ada bulu tebal atau tidak. Hewan tanpa
    // penutup menggigil — anak melihat GUNA bulunya, bukan sekadar namanya.
    {
      stage: 'concrete',
      prompt: 'Snow falls. Give it fur, or not.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'cloudy',
        base: [at('❄️', 24, 18, 10), at('❄️', 74, 14, 10), at('❓', 50, 62, 26), ground('white')],
        options: [
          {
            icon: '🐻',
            label: 'With fur',
            caption: 'Thick fur keeps the animal warm.',
            result: [
              at('❄️', 24, 18, 10, { fx: 'fall' }),
              at('❄️', 74, 14, 10, { fx: 'fall' }),
              at('🐻', 50, 62, 30, { fx: 'pop' }),
              ground('white'),
            ],
          },
          {
            icon: '🥶',
            label: 'No fur',
            caption: 'No fur. The animal gets cold.',
            result: [
              at('❄️', 24, 18, 10, { fx: 'fall' }),
              at('❄️', 74, 14, 10, { fx: 'fall' }),
              at('🥶', 50, 62, 26, { fx: 'shake' }),
              ground('white'),
            ],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    // Hujan di bebek: penutup tubuh juga menjaga KERING, bukan hanya hangat.
    // Soal gambar tidak memakai bebek kehujanan supaya tebakan ini tidak jadi kunci.
    {
      stage: 'pictorial',
      prompt: 'Rain falls on a duck. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'cloudy',
        base: [at('🌧️', 50, 16, 20), at('🦆', 50, 66, 28), ground()],
        options: [
          {
            icon: '🦆',
            label: 'It stays dry',
            caption: 'Feathers keep the duck dry.',
            result: [
              at('🌧️', 50, 16, 20),
              at('💧', 34, 52, 9, { fx: 'fall' }),
              at('💧', 68, 56, 9, { fx: 'fall' }),
              at('🦆', 50, 66, 28, { fx: 'shake' }),
              ground(),
            ],
          },
          { icon: '🥶', label: 'It gets cold', caption: 'It gets cold.' },
          { icon: '💧', label: 'It gets wet', caption: 'It gets wet.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Feathers keep a bird warm.',
      visual: {
        kind: 'evidence-text',
        title: 'A fit',
        sentences: ['Fur, feathers, and scales each help the animal where it lives.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-cover', [
      {
        ask: 'What keeps this bear warm?',
        bg: 'cloudy',
        base: [at('❄️', 22, 16, 12), at('❄️', 78, 18, 12), at('🐻', 50, 62, 32), ground('white')],
        cards: [
          { icon: '🧥', label: 'Thick fur' },
          { icon: '🪶', label: 'Feathers' },
          { icon: '🐟', label: 'Scales' },
        ],
      },
      {
        ask: 'What helps this bird in snow?',
        bg: 'cloudy',
        base: [at('❄️', 22, 16, 12), at('❄️', 78, 18, 12), at('🐦', 50, 62, 28), ground('white')],
        cards: [
          { icon: '🪶', label: 'Feathers' },
          { icon: '🐻', label: 'Fur' },
          { icon: '🐟', label: 'Scales' },
        ],
      },
      {
        ask: 'Which part helps this fish?',
        bg: 'water',
        base: [at('🐟', 50, 52, 28)],
        cards: [
          { icon: '🛡️', label: 'Scales' },
          { icon: '🧥', label: 'Fur' },
          { icon: '🪶', label: 'Feathers' },
        ],
      },
      {
        ask: 'Why is this sheep cold?',
        bg: 'cloudy',
        base: [at('❄️', 78, 16, 12), at('🐑', 46, 62, 28), at('✂️', 18, 48, 14), at('🥶', 78, 62, 18), ground('white')],
        cards: [
          { icon: '🧶', label: 'Wool was cut' },
          { icon: '❄️', label: 'Snow warms it' },
          { icon: '🧥', label: 'Wool makes it cold' },
        ],
      },
      {
        ask: 'What keeps this duck dry?',
        bg: 'cloudy',
        base: [at('🌧️', 50, 16, 22), at('🦆', 50, 66, 28), at('💧', 32, 48, 8), ground()],
        cards: [
          { icon: '🪶', label: 'Feathers block rain' },
          { icon: '🐻', label: 'Fur blocks rain' },
          { icon: '🐟', label: 'Scales block rain' },
        ],
      },
      {
        ask: 'What keeps this child warm?',
        bg: 'cloudy',
        base: [at('❄️', 22, 16, 12), at('❄️', 80, 18, 12), at('🧒', 44, 64, 24), at('🧥', 66, 56, 18), ground('white')],
        cards: [
          { icon: '🧣', label: 'A thick coat' },
          { icon: '👕', label: 'A wet shirt' },
          { icon: '🦎', label: 'Bare skin' },
        ],
      },
      {
        ask: 'What helps this lizard here?',
        bg: 'day',
        base: [at('☀️', 82, 16, 16), at('🦎', 50, 64, 28), at('🪨', 52, 80, 18), ground('yellow')],
        cards: [
          { icon: '🛡️', label: 'Scales fit the heat' },
          { icon: '🐻', label: 'Fur fits the sand' },
          { icon: '🪶', label: 'Feathers fit the sand' },
        ],
      },
      {
        ask: 'What did the fur do?',
        bg: 'cloudy',
        base: [at('❄️', 24, 16, 12), at('❄️', 78, 18, 12), at('🐕', 50, 64, 28), ground('white')],
        cards: [
          { icon: '🧥', label: 'It kept the dog warm' },
          { icon: '🥶', label: 'It made the dog cold' },
          { icon: '❄️', label: 'The snow warmed it' },
        ],
      },
    ]),
  ],
};
