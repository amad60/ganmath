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
  questionTypes: ['clue-tap', 'choose-text', 'pick-picture'],
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
    {
      type: 'clue-tap',
      skill: 'sci-rot',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows the rot?',
      visual: (p) => {
        const stories = [
          {
            title: 'On the soil',
            sentences: ['A dead leaf lies on the soil.', 'It rots and becomes part of the soil.'],
          },
          {
            title: 'Under',
            sentences: ['Worms pull the leaf under.', 'The rot feeds the soil.'],
          },
          {
            title: 'The log',
            sentences: ['A log sits on the forest floor.', 'It slowly rots and breaks apart.'],
          },
          {
            title: 'Dark soil',
            sentences: ['The soil is dark and soft.', 'Rotted leaves helped make it.'],
          },
          {
            title: 'A fresh fall',
            sentences: ['A fresh leaf falls.', 'Over time it rots and feeds the soil.'],
          },
        ];
        return {
          kind: 'evidence-text',
          title: stories[p.s as number]?.title,
          sentences: stories[p.s as number]?.sentences ?? [],
        };
      },
    },
    {
      type: 'choose-text',
      skill: 'sci-rot',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A dead leaf stays on the ground for a long time. What happens?',
          'Why is rot good for a plant?',
          'What helps dead leaves break down?',
          'A forest floor is full of old leaves. What do they become?',
          'If nothing ever rotted, what would be missing?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['It rots into the soil', 'It becomes a battery', 'It lights up', 'It turns to metal'],
          ['It feeds the soil', 'It dries every pond', 'It stops all light', 'It makes a gap in a wire'],
          ['Rot', 'A closed bulb path', 'A magnet only', 'Thick fur'],
          ['Part of the soil', 'A balloon of air', 'A ramp', 'A cloud at once'],
          ['Food for the soil', 'Extra fur', 'More gaps in wires', 'A louder sound'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
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
    ]),
  ],
};
