import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

export const whatLivingThingsNeed: ContentModule = {
  id: 's1-u1-m1',
  unitId: 's1-u1',
  grade: 1,
  title: 'What Living Things Need',
  icon: '🌱',
  prereq: [],
  skills: ['sci-needs'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text', 'pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['living', 'need', 'water', 'food', 'plant', 'live', 'air', 'life', 'look', 'give', 'fish', 'sand', 'dry', 'dries', 'feel', 'great', 'bad', 'fly', 'flies'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Give the plant water, or not.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('☀️', 84, 16, 14), at('🌱', 50, 66, 24), ground('brown')],
        options: [
          {
            icon: '💧',
            label: 'Water',
            caption: 'With water, the plant grows.',
            result: [
              at('☀️', 84, 16, 14),
              at('💧', 34, 22, 9, { fx: 'fall' }),
              at('💧', 62, 16, 9, { fx: 'fall' }),
              at('🌿', 50, 58, 36, { fx: 'grow' }),
              ground('brown'),
            ],
          },
          {
            icon: '🚫',
            label: 'No water',
            caption: 'No water, so the plant dries up.',
            result: [at('☀️', 84, 16, 14), at('🥀', 50, 64, 28, { fx: 'droop' }), ground('brown')],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'A fish is on the sand.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [bar(50, 88, 100, 24, 'yellow'), at('🐟', 50, 66, 22, { rotate: -15 })],
        options: [
          { icon: '😄', label: 'It feels great', caption: 'It feels great.' },
          {
            icon: '😣',
            label: 'It feels bad',
            caption: 'A fish needs water to live.',
            result: [
              bar(50, 88, 100, 24, 'yellow'),
              at('🐟', 50, 70, 22, { dim: true, fx: 'droop' }),
              at('💧', 80, 30, 12, { fx: 'pop' }),
            ],
          },
          { icon: '🐦', label: 'It can fly', caption: 'It can fly.' },
        ],
        correct: 1,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Air water and food keep life.',
      visual: {
        kind: 'evidence-text',
        title: 'Three needs',
        sentences: ['Plants, animals, and people need water, food, and air.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-needs',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows what it needs?',
      visual: (p) => {
        const stories = [
          {
            title: 'Dry plant',
            sentences: ['The leaf looks dry.', 'Mira pours water on the soil.'],
          },
          {
            title: 'Hungry puppy',
            sentences: ['The puppy is still.', 'Dad puts food in the bowl.'],
          },
          {
            title: 'Fish bowl',
            sentences: ['The fish stays near the top.', 'Air bubbles rise in the bowl.'],
          },
          {
            title: 'Drooping flower',
            sentences: ['The flower droops at noon.', 'Lina gives it a drink of water.'],
          },
          {
            title: 'Hungry kitten',
            sentences: ['The kitten cries by the dish.', 'Budi fills the dish with food.'],
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
      skill: 'sci-needs',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A plant in a dry pot looks sad. What does it need?',
          'The puppy bowl is empty. What does it need?',
          'A fish is in a jar with no holes. What does it need?',
          'The seedling has water and air, and it is thin. What else does it need?',
          'People and plants stay alive with three things. Which set is right?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['Water', 'A hat', 'A song', 'A book'],
          ['Food', 'A cloud', 'A pencil', 'A drum'],
          ['Air', 'A shoe', 'A kite', 'A coin'],
          ['Food', 'A bell', 'A sock', 'A map'],
          ['Water, food, and air', 'Rocks, sand, and coins', 'Hats, shoes, and bags', 'Drums, bells, and songs'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
    whatHappensNext('sci-needs', [
      {
        bg: 'day',
        base: [at('☀️', 84, 16, 14), at('🌱', 50, 66, 24), at('💧', 20, 34, 12), at('🚫', 20, 34, 20), ground('brown')],
        cards: [
          { icon: '🥀', label: 'It dries up' },
          { icon: '🌳', label: 'It becomes a big tree' },
          { icon: '🌸', label: 'It grows a flower' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 84, 16, 14), at('💧', 40, 24, 10), at('💧', 58, 20, 10), at('🌱', 50, 66, 24), ground('brown')],
        cards: [
          { icon: '🌿', label: 'It grows' },
          { icon: '🥀', label: 'It dries up' },
          { icon: '🪨', label: 'It turns to rock' },
        ],
      },
      {
        bg: 'room',
        base: [at('🐶', 36, 60, 26), at('🦴', 70, 74, 16)],
        cards: [
          { icon: '😋', label: 'It eats' },
          { icon: '😢', label: 'It cries' },
          { icon: '🌧️', label: 'It rains' },
        ],
      },
      {
        bg: 'day',
        base: [bar(50, 88, 100, 24, 'yellow'), at('🐟', 50, 66, 22, { rotate: -15 })],
        cards: [
          { icon: '😣', label: 'It feels bad' },
          { icon: '😄', label: 'It feels great' },
          { icon: '🐦', label: 'It can fly' },
        ],
      },
      {
        bg: 'room',
        base: [at('🐱', 36, 60, 26), at('🥛', 70, 70, 16)],
        cards: [
          { icon: '😌', label: 'It feels good' },
          { icon: '😠', label: 'It gets angry' },
          { icon: '❄️', label: 'It snows' },
        ],
      },
    ]),
  ],
};
