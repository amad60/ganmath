import type { ContentModule } from '../types';

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
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['dead', 'leaf', 'rot', 'soil', 'feed'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A dead leaf rots into soil.',
      visual: {
        kind: 'evidence-text',
        title: 'On the ground',
        sentences: ['A dead leaf lies on the ground.', 'It softens and becomes part of the soil.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'Over time',
        sentences: ['See what fell.', 'See what the ground does with it.'],
      },
      action: 'watch',
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
  ],
};
