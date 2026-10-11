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
          { icon: '🪨', label: 'It sinks', caption: 'It sinks.' },
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
        ask: 'Snow falls on an animal with fur.',
        bg: 'cloudy',
        base: [at('❄️', 24, 16, 10), at('❄️', 76, 20, 10), at('🐻', 50, 62, 30), ground('white')],
        cards: [
          { icon: '🙂', label: 'It stays warm' },
          { icon: '🥶', label: 'It freezes' },
          { icon: '🚫', label: 'The covering does nothing' },
        ],
      },
      {
        ask: 'Snow falls on a penguin.',
        bg: 'cloudy',
        base: [at('❄️', 22, 18, 10), at('🐧', 50, 60, 30), ground('white')],
        cards: [
          { icon: '🙂', label: 'It stays warm' },
          { icon: '🥵', label: 'It gets hot' },
          { icon: '🌱', label: 'It grows roots' },
        ],
      },
      {
        ask: 'A fish is in the water.',
        bg: 'water',
        base: [at('🐟', 50, 52, 26)],
        cards: [
          { icon: '🌊', label: 'It swims well' },
          { icon: '🏜️', label: 'It gets dry' },
          { icon: '🚫', label: 'The covering does nothing' },
        ],
      },
      {
        ask: 'The sheep wool has been cut, and it snows.',
        bg: 'cloudy',
        base: [at('❄️', 76, 16, 10), at('🐑', 46, 62, 30), at('✂️', 20, 50, 14), ground('white')],
        cards: [
          { icon: '🥶', label: 'It gets cold' },
          { icon: '🥵', label: 'It gets hot' },
          { icon: '🚫', label: 'The covering does nothing' },
        ],
      },
      {
        ask: 'Snow falls on a bird.',
        bg: 'cloudy',
        base: [at('❄️', 24, 16, 10), at('❄️', 76, 20, 10), at('🐦', 50, 62, 26), ground('white')],
        cards: [
          { icon: '🪶', label: 'Feathers keep it warm' },
          { icon: '🧊', label: 'It turns to ice' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
    
      {
        ask: 'Snow falls on an animal with thick fur.',
        bg: 'day',
        base: [at('🐻‍❄️', 48, 56, 30), at('❄️', 78, 24, 16)],
        cards: [
          { icon: '🧥', label: 'The fur keeps it warm' },
          { icon: '🥶', label: 'It freezes' },
          { icon: '🔥', label: 'It gets hot' },
        ],
      },
      {
        ask: 'Wind blows on a bird.',
        bg: 'day',
        base: [at('🐦', 46, 54, 26), at('💨', 76, 36, 16)],
        cards: [
          { icon: '🪶', label: 'Feathers keep it warm' },
          { icon: '🥶', label: 'It gets cold' },
          { icon: '💧', label: 'It melts' },
        ],
      },
      {
        ask: 'A fish has scales.',
        bg: 'water',
        base: [at('🐟', 50, 56, 28)],
        cards: [
          { icon: '🛡️', label: 'Scales keep it safe' },
          { icon: '🥵', label: 'It gets hot' },
          { icon: '🌵', label: 'It dries up' },
        ],
      },
    ]),
  ],
};
