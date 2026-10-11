import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

export const rotFeedsSoil: ContentModule = {
  id: 's3-u10-m1',
  unitId: 's3-u10',
  grade: 3,
  title: 'Rot Feeds the Soil',
  icon: '🍂',
  prereq: ['s3-u9-m1'],
  skills: ['sci-rot'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['dead', 'leaf', 'rot', 'soil', 'feed', 'wait', 'days', 'many', 'plant', 'seed', 'grow', 'grows', 'turn', 'turns', 'into', 'apple', 'bigger', 'rock', 'sits'],

  learn: [
    // Dua tombol, dua akibat yang berurutan secara sebab: tunggu → daun mati membusuk
    // jadi tanah gelap (cacing muncul), tanam → tanah itu memberi makan tanaman baru.
    // Daunnya MEMUDAR di tempat, bukan pergi — ia berubah jadi tanah, tidak hilang.
    {
      stage: 'concrete',
      prompt: 'Wait many days, or plant a seed.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('🍂', 34, 78, 16), at('🍂', 52, 80, 14), at('🍂', 68, 77, 16), ground('green')],
        options: [
          {
            icon: '⏳',
            label: 'Wait',
            caption: 'The dead leaves rot into soil.',
            result: [
              at('🍂', 34, 78, 16, { fx: 'fade' }),
              at('🍂', 68, 77, 16, { fx: 'fade' }),
              at('🪱', 52, 80, 12, { fx: 'pop' }),
              bar(50, 94, 100, 14, 'brown'),
            ],
          },
          {
            icon: '🌱',
            label: 'Plant',
            caption: 'The soil feeds the new plant.',
            result: [at('🌿', 50, 62, 34, { fx: 'grow' }), bar(50, 94, 100, 14, 'brown')],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    // Buah yang jatuh: benda MATI lain yang juga membusuk. Soal gambar memakai
    // daun, kayu, dan kulit pisang — bukan apel — supaya tebakan ini bukan kuncinya.
    {
      stage: 'pictorial',
      prompt: 'An apple sits for days. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('🌳', 26, 46, 44), at('🍎', 64, 82, 14), bar(50, 94, 100, 14, 'brown')],
        options: [
          {
            icon: '🪱',
            label: 'It rots away',
            caption: 'It rots and feeds the soil.',
            result: [
              at('🌳', 26, 46, 44),
              at('🍎', 64, 82, 14, { dim: true, fx: 'fade' }),
              at('🪱', 76, 86, 12, { fx: 'pop' }),
              bar(50, 94, 100, 14, 'brown'),
            ],
          },
          { icon: '🍏', label: 'It grows bigger', caption: 'It grows bigger.' },
          { icon: '🍎', label: 'It stays the same', caption: 'It stays the same.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Rot feeds the soil.',
      visual: {
        kind: 'evidence-text',
        title: 'Back to the plants',
        sentences: ['Rot turns dead leaves into soil that can feed a plant.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-rot', [
      {
        ask: 'What made this dark soil?',
        bg: 'day',
        base: [at('🍂', 34, 78, 14, { dim: true }), at('🍂', 66, 78, 14, { dim: true }), bar(50, 94, 100, 14, 'brown')],
        cards: [
          { icon: '🪱', label: 'Dead leaves rotted' },
          { icon: '🌳', label: 'Leaves grew a tree' },
          { icon: '🪨', label: 'Rocks broke apart' },
        ],
      },
      {
        ask: 'What caused this log to soften?',
        bg: 'day',
        base: [at('🪵', 54, 76, 28), bar(50, 94, 100, 14, 'brown')],
        cards: [
          { icon: '🍄', label: 'Dead wood rotted' },
          { icon: '🌱', label: 'The log grew roots' },
          { icon: '🚫', label: 'Rot skipped it' },
        ],
      },
      {
        ask: 'Why did this banana change?',
        bg: 'day',
        base: [at('🍌', 50, 74, 18, { dim: true, rotate: 20 }), bar(50, 94, 100, 14, 'brown')],
        cards: [
          { icon: '🪱', label: 'It rotted' },
          { icon: '🍌', label: 'It grew bigger' },
          { icon: '✨', label: 'It stayed fresh' },
        ],
      },
      {
        ask: 'What helps this plant grow?',
        bg: 'day',
        base: [at('🌿', 50, 60, 32), bar(50, 94, 100, 14, 'brown')],
        cards: [
          { icon: '🍂', label: 'Soil from rot' },
          { icon: '🧸', label: 'Toy in the soil' },
          { icon: '🪨', label: 'Rocks feed it' },
        ],
      },
      {
        ask: 'What keeps this bottle the same?',
        bg: 'day',
        base: [at('🧴', 50, 64, 26), bar(50, 94, 100, 14, 'brown')],
        cards: [
          { icon: '🚫', label: 'It cannot rot' },
          { icon: '🪱', label: 'It rotted' },
          { icon: '🌿', label: 'It feeds a plant' },
        ],
      },
      {
        ask: 'What is missing for rot here?',
        bg: 'day',
        base: [at('🧸', 50, 68, 24), bar(50, 94, 100, 14, 'brown')],
        cards: [
          { icon: '🍂', label: 'A dead plant' },
          { icon: '⏳', label: 'More days' },
          { icon: '☀️', label: 'More sun' },
        ],
      },
      {
        ask: 'What did rot do to this peel?',
        bg: 'day',
        base: [at('🍊', 50, 72, 18, { dim: true }), bar(50, 94, 100, 14, 'brown')],
        cards: [
          { icon: '🟫', label: 'It made soil' },
          { icon: '🍊', label: 'It grew new fruit' },
          { icon: '✨', label: 'It stayed fresh' },
        ],
      },
      {
        ask: 'Which part feeds this plant?',
        bg: 'day',
        base: [at('🌱', 50, 64, 26), bar(50, 94, 100, 14, 'brown')],
        cards: [
          { icon: '🪱', label: 'Soil made by rot' },
          { icon: '🧸', label: 'The toy' },
          { icon: '🪨', label: 'The rocks' },
        ],
      },
    ]),
  ],
};
