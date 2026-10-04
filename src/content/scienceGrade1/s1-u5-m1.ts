import type { ContentModule } from '../types';

export const plantParts: ContentModule = {
  id: 's1-u5-m1',
  unitId: 's1-u5',
  grade: 1,
  title: 'Parts of a Plant',
  icon: '🌿',
  prereq: ['s1-u4-m1'],
  skills: ['sci-plant-parts'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['root', 'stem', 'flower', 'part'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A plant has a root and stem.',
      visual: {
        kind: 'evidence-text',
        title: 'Under and up',
        sentences: ['Roots take in water under the soil.', 'The stem holds the plant up.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'Find the part',
        sentences: ['See the plant.', 'Find the part that does the job.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A flower grows on the plant.',
      visual: {
        kind: 'evidence-text',
        title: 'Four parts',
        sentences: ['A plant has roots, a stem, leaves, and a flower.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-plant-parts',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows the plant part?',
      visual: (p) => {
        const stories = [
          {
            title: 'In the soil',
            sentences: ['Mira digs beside the plant.', 'White roots hold it in the soil.'],
          },
          {
            title: 'Holding up',
            sentences: ['The plant stands tall.', 'The green stem holds the leaves up.'],
          },
          {
            title: 'Catching light',
            sentences: ['The sun is bright.', 'Wide leaves catch the light.'],
          },
          {
            title: 'Pretty top',
            sentences: ['Bees visit the plant.', 'A yellow flower sits at the top.'],
          },
          {
            title: 'Drinking',
            sentences: ['The soil is wet.', 'Roots drink the water down below.'],
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
      skill: 'sci-plant-parts',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'Which part grows under the soil and takes in water?',
          'Which part holds the plant up?',
          'Which part catches the sunlight?',
          'Which part is colorful and sits at the top?',
          'Which part drinks water from the wet soil?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['Root', 'Flower', 'Seed', 'Thorn'],
          ['Stem', 'Root', 'Petal', 'Soil'],
          ['Leaf', 'Root', 'Rock', 'Pot'],
          ['Flower', 'Root', 'Stem', 'Soil'],
          ['Root', 'Flower', 'Bee', 'Sun'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
