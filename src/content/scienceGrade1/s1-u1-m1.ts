import type { ContentModule } from '../types';

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
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['living', 'need', 'water', 'food', 'plant', 'live', 'air', 'life', 'look'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Living things need water and food.',
      visual: {
        kind: 'evidence-text',
        title: 'A thirsty plant',
        sentences: ['The plant looks dry.', 'Water on the soil helps it stand up.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at what it needs.',
      visual: {
        kind: 'evidence-text',
        title: 'Find the need',
        sentences: ['See the living thing.', 'Find what keeps it going.'],
      },
      action: 'watch',
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
  ],
};
