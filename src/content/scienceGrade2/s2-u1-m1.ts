import type { ContentModule } from '../types';

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
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['look', 'seed', 'need', 'water', 'sun', 'sprout', 'soil', 'plant'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A seed needs water and sun.',
      visual: {
        kind: 'evidence-text',
        title: 'A dry seed',
        sentences: ['The seed sits in dry soil.', 'Water and sun help a sprout come up.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'What helps',
        sentences: ['See the seed.', 'See what reaches it.'],
      },
      action: 'watch',
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
  ],
};
