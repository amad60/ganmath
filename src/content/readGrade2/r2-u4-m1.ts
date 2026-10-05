import type { ContentModule } from '../types';
import { clueAnswer, clueAsk, clueVisual, type ClueStory } from '../readBank';

const stories: ClueStory[] = [
  {
    title: 'Busy Bees',
    ask: 'Which sentence gives a DETAIL about the big idea?',
    clue: 1,
    sentences: [
      'Bees work hard for their hive.',
      'They carry yellow pollen on their legs.',
      'The moon was bright that night.',
    ],
  },
  {
    title: 'City Trains',
    ask: 'Which sentence gives a DETAIL about the big idea?',
    clue: 2,
    sentences: [
      'Trains carry people through the city.',
      'A cat slept on the platform.',
      'Each car stops at a painted mark.',
    ],
  },
  {
    title: 'Sea Turtles',
    ask: 'Which sentence gives a DETAIL about the big idea?',
    clue: 0,
    sentences: [
      'Their shells are hard and smooth.',
      'Sea turtles live in the ocean.',
      'Budi likes red sneakers.',
    ],
  },
  {
    title: 'Rainy Day',
    ask: 'Which sentence gives a DETAIL about the big idea?',
    clue: 2,
    sentences: [
      'The class stays inside when it rains.',
      'Owls hunt after sunset.',
      'They cut paper stars at their desks.',
    ],
  },
  {
    title: 'Bakery',
    ask: 'Which sentence gives a DETAIL about the big idea?',
    clue: 1,
    sentences: [
      'The bakery opens before sunrise.',
      'Warm bread comes out of the oven.',
      'A rocket needs a lot of fuel.',
    ],
  },
  {
    title: 'Library',
    ask: 'Which sentence gives a DETAIL about the big idea?',
    clue: 0,
    sentences: [
      'Readers borrow books with a card.',
      'The library is a quiet place to read.',
      'Snow fell on the mountain.',
    ],
  },
];

const choices: { ask: string; options: string[] }[] = [
  {
    ask: 'The big idea is: Owls hunt at night. Which detail supports it?',
    options: ['Their eyes gather dim light.', 'Owls are the best birds.', 'The sun is a star.', 'Rain falls from clouds.'],
  },
  {
    ask: 'The big idea is: Cactuses store water. Which detail supports it?',
    options: ['Thick stems hold rain for later.', 'Deserts are too sandy.', 'Camels have long legs.', 'Flowers are pretty.'],
  },
  {
    ask: 'The big idea is: Beavers build dams. Which detail supports it?',
    options: ['They pack mud between the logs.', 'Rivers flow to the sea.', 'Fish are tasty.', 'Winter is cold.'],
  },
  {
    ask: 'The big idea is: The team practices daily. Which detail supports it?',
    options: ['They run drills after school.', 'Soccer is the best sport.', 'The sky is blue.', 'Shoes come in pairs.'],
  },
  {
    ask: 'The big idea is: Penguins stay warm in ice. Which detail supports it?',
    options: ['They huddle so less heat escapes.', 'Ice is beautiful.', 'Seals swim fast.', 'Birds have feathers.'],
  },
  {
    ask: 'The big idea is: A market sells fresh food. Which detail supports it?',
    options: ['Farmers bring vegetables that morning.', 'Markets are crowded.', 'Coins are round.', 'Bikes have two wheels.'],
  },
];

export const supportingDetails: ContentModule = {
  id: 'r2-u4-m1',
  unitId: 'r2-u4',
  grade: 2,
  title: 'Which Detail Fits',
  icon: '🔎',
  prereq: ['r2-u3-m1'],
  skills: ['read-supporting-detail'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['detail', 'supports', 'topic', 'about', 'idea', 'support'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A detail tells more about the idea.',
      visual: {
        kind: 'evidence-text',
        title: 'Busy Bees',
        sentences: [
          'Bees work hard for their hive.',
          'They carry pollen from flower to flower.',
        ],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Tap the detail about the big idea.',
      visual: {
        kind: 'evidence-text',
        title: 'Busy Bees',
        sentences: [
          'Bees work hard for their hive.',
          'The moon was bright that night.',
          'They carry pollen on their legs.',
        ],
      },
      action: 'tap-clue',
      target: 2,
    },
    {
      stage: 'abstract',
      prompt: 'Details support the main idea.',
      visual: {
        kind: 'evidence-text',
        title: 'Support',
        sentences: ['A detail sticks to what the text is about.'],
      },
      action: 'watch',
      caption: 'idea ➔ detail',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'read-supporting-detail',
      params: { s: [0, stories.length - 1] },
      answer: (p) => clueAnswer(stories, p.s as number),
      text: (p) => clueAsk(stories, p.s as number),
      visual: (p) => clueVisual(stories, p.s as number),
    },
    {
      type: 'choose-text',
      skill: 'read-supporting-detail',
      params: { c: [0, choices.length - 1] },
      answer: () => 0,
      text: (p) => choices[p.c as number]?.ask ?? '',
      options: (p) => choices[p.c as number]?.options ?? ['A', 'B', 'C', 'D'],
    },
  ],
};
