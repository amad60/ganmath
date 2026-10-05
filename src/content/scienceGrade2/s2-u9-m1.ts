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
  questionTypes: ['clue-tap', 'choose-text', 'pick-picture'],
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
    {
      type: 'clue-tap',
      skill: 'sci-soil',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows what the rain does?',
      visual: (p) => {
        const stories = [
          {
            title: 'Dry bed',
            sentences: ['The soil is dry.', 'Rain soaks into the soil.'],
          },
          {
            title: 'Hard rain',
            sentences: ['The rain is hard and long.', 'The water washes soil down the path.'],
          },
          {
            title: 'Thirsty plant',
            sentences: ['The plant looks dry.', 'The soil holds the rain for it.'],
          },
          {
            title: 'Bare path',
            sentences: ['The path has no cover.', 'Rain runs off and takes soil with it.'],
          },
          {
            title: 'Leaf cover',
            sentences: ['She spreads leaves on the soil.', 'The soil stays and keeps the water.'],
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
      skill: 'sci-soil',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'Soft rain falls on dry soil. What happens?',
          'Very hard rain hits bare soil. What can happen?',
          'Why is wet soil good for a plant?',
          'Leaves cover the soil. What do they help do?',
          'No rain comes for a long time. What happens to the soil?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['It soaks in', 'It becomes a magnet', 'It turns to metal', 'It flies off'],
          ['Soil washes away', 'Soil becomes ice', 'Soil turns into a nest', 'Soil pulls metal'],
          ['It holds water', 'It is a magnet', 'It is metal', 'It is a shadow'],
          ['Keep the soil in place', 'Melt the soil', 'Freeze the rain', 'Eat the plant'],
          ['It dries out', 'It becomes a fox', 'It turns to wood', 'It lays an egg'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
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
    ]),
  ],
};
