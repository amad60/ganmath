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
          { icon: '🪨', label: 'It turns to rock', caption: 'It turns to rock.' },
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
        bg: 'day',
        base: [at('🍂', 36, 80, 16), at('🍂', 62, 82, 16), ground()],
        cards: [
          { icon: '🟫', label: 'They turn into soil' },
          { icon: '🌳', label: 'They grow into a tree' },
          { icon: '🧊', label: 'They freeze' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌲', 20, 46, 40), at('🪵', 60, 82, 22), ground()],
        cards: [
          { icon: '🍄', label: 'It rots and gets soft' },
          { icon: '🔥', label: 'It burns' },
          { icon: '🪽', label: 'It flies' },
        ],
      },
      {
        bg: 'day',
        base: [at('🍌', 50, 80, 16, { rotate: 30 }), bar(50, 94, 100, 14, 'brown')],
        cards: [
          { icon: '🪱', label: 'It rots away' },
          { icon: '🍌', label: 'It gets bigger' },
          { icon: '💎', label: 'It turns to glass' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌱', 50, 74, 20), bar(50, 94, 100, 14, 'brown'), at('🪱', 70, 92, 10)],
        cards: [
          { icon: '🌿', label: 'The plant grows' },
          { icon: '🥀', label: 'It dries up' },
          { icon: '🌧️', label: 'It rains' },
        ],
      },
      {
        bg: 'day',
        base: [at('🧸', 50, 80, 18), bar(50, 94, 100, 14, 'brown')],
        cards: [
          { icon: '🧸', label: 'It stays the same' },
          { icon: '🪱', label: 'It rots away' },
          { icon: '🌳', label: 'It grows' },
        ],
      },
    
      {
        bg: 'day',
        base: [at('🍎', 50, 64, 22), at('🟫', 50, 82, 16)],
        cards: [
          { icon: '🍂', label: 'It rots' },
          { icon: '🌳', label: 'It grows into a tree' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'day',
        base: [at('🪵', 50, 60, 28), at('💧', 28, 40, 12)],
        cards: [
          { icon: '🍂', label: 'It rots' },
          { icon: '🌱', label: 'It sprouts leaves' },
          { icon: '❄️', label: 'It freezes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🧴', 50, 60, 24), at('🟫', 50, 82, 16)],
        cards: [
          { icon: '🧴', label: 'It stays' },
          { icon: '🍂', label: 'It rots away' },
          { icon: '🌸', label: 'It blooms' },
        ],
      },
    ]),
  ],
};
