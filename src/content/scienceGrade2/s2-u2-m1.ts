import type { ContentModule } from '../types';

export const animalHomes: ContentModule = {
  id: 's2-u2-m1',
  unitId: 's2-u2',
  grade: 2,
  title: 'Animal Homes',
  icon: '🪺',
  prereq: ['s2-u1-m1'],
  skills: ['sci-homes'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['home', 'fish', 'live', 'bird', 'nest', 'pond'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A fish lives in water.',
      visual: {
        kind: 'evidence-text',
        title: 'A wet home',
        sentences: ['The fish stays in the pond.', 'On dry grass it cannot breathe.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'Find the home',
        sentences: ['See the animal.', 'See the place that fits it.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A bird lives in a nest.',
      visual: {
        kind: 'evidence-text',
        title: 'A fit',
        sentences: ['Animals live where they find what they need.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-homes',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows where it lives?',
      visual: (p) => {
        const stories = [
          {
            title: 'The bowl',
            sentences: ['The bowl is empty.', 'The fish swims in the pond.'],
          },
          {
            title: 'The tree',
            sentences: ['The tree is tall.', 'The bird sits on its nest.'],
          },
          {
            title: 'The field',
            sentences: ['The grass is green.', 'The rabbit sleeps in a hole.'],
          },
          {
            title: 'The bank',
            sentences: ['The mud is wet.', 'The frog stays by the pond.'],
          },
          {
            title: 'The garden',
            sentences: ['The soil is dark.', 'The worm lives under the soil.'],
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
      skill: 'sci-homes',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'Where does a fish live?',
          'Where does a bird keep its eggs?',
          'A frog needs a wet home. Where does it live?',
          'A worm stays under the ground. Where is its home?',
          'A fish is left on dry grass. What is wrong?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['In water', 'In a nest', 'In a tree top', 'In the sun only'],
          ['In a nest', 'In a pond', 'In a cup', 'In a block of ice'],
          ['By a pond', 'In a dry nest', 'On a magnet', 'In a rubbish bin'],
          ['In the soil', 'In the sky', 'In a nest', 'On a lamp'],
          ['It needs water', 'It needs a nest', 'It needs a magnet', 'It needs a drum'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
