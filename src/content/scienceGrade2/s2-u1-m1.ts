import type { ContentModule } from '../types';
import { at, bar, whatHappensNext } from '../scienceScene';

export const seedsGrow: ContentModule = {
  id: 's2-u1-m1',
  unitId: 's2-u1',
  grade: 2,
  title: 'Seeds Grow',
  icon: '🌱',
  prereq: [],
  skills: ['sci-seeds'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text', 'pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['look', 'seed', 'need', 'water', 'sun', 'sprout', 'soil', 'plant', 'stay', 'weak', 'dry', 'dries', 'hot', 'day', 'into', 'turn', 'ice'],

  learn: [
    {
      stage: 'concrete',
      // Satu variabel per tombol: air+matahari, tanpa air, tanpa matahari. Tanpa
      // matahari kecambahnya TETAP muncul tapi lemah — biji memang bisa berkecambah
      // di gelap, jadi adegan "tidak tumbuh sama sekali" akan mengajarkan hal salah.
      prompt: 'Tap one. Look at the seed.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [bar(50, 88, 100, 24, 'brown'), at('🌰', 50, 80, 9)],
        options: [
          {
            icon: '💧',
            label: 'Water and sun',
            caption: 'Water and sun: a sprout comes up.',
            result: [
              at('☀️', 84, 16, 16, { fx: 'pulse' }),
              at('💧', 36, 34, 10, { fx: 'fall' }),
              bar(50, 88, 100, 24, 'brown'),
              at('🌱', 50, 62, 26, { fx: 'grow' }),
            ],
          },
          {
            icon: '🚫',
            label: 'No water',
            caption: 'No water: the seed stays a seed.',
            result: [
              at('☀️', 84, 16, 16),
              bar(50, 88, 100, 24, 'brown'),
              at('🌰', 50, 80, 9, { fx: 'shake' }),
            ],
          },
          {
            icon: '🌑',
            label: 'No sun',
            caption: 'No sun: the sprout is weak.',
            bg: 'night',
            result: [
              at('💧', 36, 34, 10, { fx: 'fall' }),
              bar(50, 88, 100, 24, 'brown'),
              at('🌱', 50, 64, 20, { dim: true, fx: 'droop' }),
            ],
          },
        ],
      },
      action: 'explore',
      target: 3,
    },
    {
      stage: 'pictorial',
      prompt: 'Hot sun, no water for days. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('☀️', 82, 18, 20), bar(50, 88, 100, 24, 'brown'), at('🌱', 50, 64, 22)],
        options: [
          { icon: '🌳', label: 'It grows big', caption: 'It grows big.' },
          {
            icon: '🥀',
            label: 'It dries up',
            caption: 'No water. The sprout dries up.',
            result: [
              at('☀️', 82, 18, 20, { fx: 'pulse' }),
              bar(50, 88, 100, 24, 'brown'),
              at('🥀', 50, 62, 24, { fx: 'droop' }),
            ],
          },
          { icon: '🧊', label: 'It turns to ice', caption: 'It turns to ice.' },
        ],
        correct: 1,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A sprout grows from a seed.',
      visual: {
        kind: 'evidence-text',
        title: 'Next',
        sentences: ['With water and sun, a seed becomes a sprout.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-seeds',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows what the seed needs?',
      visual: (p) => {
        const stories = [
          {
            title: 'Dry pot',
            sentences: ['The pot is dry.', 'Lina pours water on the seed.'],
          },
          {
            title: 'Dark room',
            sentences: ['The room is dark.', 'Budi moves the pot into the sun.'],
          },
          {
            title: 'On the table',
            sentences: ['The seed is on the table.', 'Siti presses it into damp soil.'],
          },
          {
            title: 'No drink',
            sentences: ['Days pass with no drink.', 'Rain wets the soil around the seed.'],
          },
          {
            title: 'Cupboard',
            sentences: ['The pot sits in a cupboard.', 'Dewi sets it where the sun can reach.'],
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
      skill: 'sci-seeds',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A dry seed gets water and sun. What happens next?',
          'A seed stays dry in a dark box. What happens?',
          'What does a seed need so a sprout can grow?',
          'The soil is wet and the sun is on the pot. What grows?',
          'No water comes for many days. What happens to the seed?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['It sprouts', 'It turns to rock', 'It becomes a magnet', 'It flies away'],
          ['It stays a seed', 'It sprouts at once', 'It melts', 'It grows a nest'],
          ['Water and sun', 'A magnet', 'A drum', 'A loud horn'],
          ['A sprout', 'Only a shadow', 'A block of ice', 'A metal clip'],
          ['It does not sprout', 'It becomes a tree that day', 'It turns to ice', 'It hops off'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
    whatHappensNext('sci-seeds', [
      {
        bg: 'day',
        base: [at('☀️', 84, 16, 16), at('🌧️', 36, 18, 18), bar(50, 88, 100, 24, 'brown'), at('🌰', 50, 80, 9)],
        cards: [
          { icon: '🌱', label: 'A sprout comes up' },
          { icon: '🪨', label: 'It turns to rock' },
          { icon: '🧊', label: 'It turns to ice' },
        ],
      },
      {
        bg: 'room',
        base: [bar(50, 80, 56, 4, 'white'), at('🌰', 44, 74, 9), at('🌰', 56, 74, 9)],
        cards: [
          { icon: '🌰', label: 'It stays a seed' },
          { icon: '🌳', label: 'It becomes a tree' },
          { icon: '🌸', label: 'It gets a flower' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 84, 16, 16), at('🌧️', 30, 18, 18), bar(50, 88, 100, 24, 'brown'), at('🌱', 50, 64, 20)],
        cards: [
          { icon: '🌿', label: 'It grows' },
          { icon: '🔥', label: 'It burns' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌻', 50, 50, 40), bar(50, 92, 100, 16, 'brown')],
        cards: [
          { icon: '🌰', label: 'It makes seeds' },
          { icon: '🧊', label: 'It makes ice' },
          { icon: '🐦', label: 'It makes birds' },
        ],
      },
      {
        bg: 'day',
        base: [at('🍎', 28, 34, 18), at('👉', 46, 60, 10), bar(50, 88, 100, 24, 'brown'), at('🌰', 62, 80, 9)],
        cards: [
          { icon: '🌱', label: 'A sprout comes up' },
          { icon: '🍏', label: 'An apple comes up' },
          { icon: '🪨', label: 'A rock comes up' },
        ],
      },
    ]),
  ],
};
