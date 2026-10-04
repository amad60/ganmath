import type { ContentModule } from '../types';

export const lifeCycles: ContentModule = {
  id: 's2-u3-m1',
  unitId: 's2-u3',
  grade: 2,
  title: 'Life Cycles',
  icon: '🦋',
  prereq: ['s2-u2-m1'],
  skills: ['sci-cycle'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['egg', 'caterpillar', 'butterfly', 'frog', 'tadpole'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'An egg can become a caterpillar.',
      visual: {
        kind: 'evidence-text',
        title: 'From an egg',
        sentences: ['The egg is still.', 'A caterpillar comes out and eats.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'The order',
        sentences: ['See the living thing.', 'See what it becomes next.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A caterpillar becomes a butterfly.',
      visual: {
        kind: 'evidence-text',
        title: 'In order',
        sentences: ['Egg, caterpillar, then butterfly. The order does not jump.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-cycle',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows the next change?',
      visual: (p) => {
        const stories = [
          {
            title: 'Still egg',
            sentences: ['The egg is on a leaf.', 'A caterpillar comes out of the egg.'],
          },
          {
            title: 'Eating',
            sentences: ['The caterpillar eats leaves.', 'Later it becomes a butterfly.'],
          },
          {
            title: 'Pond eggs',
            sentences: ['Frog eggs sit in the pond.', 'A tadpole swims out.'],
          },
          {
            title: 'New legs',
            sentences: ['The tadpole grows legs.', 'It becomes a frog.'],
          },
          {
            title: 'Again',
            sentences: ['The butterfly opens its wings.', 'She lays an egg and the cycle starts again.'],
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
      skill: 'sci-cycle',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A butterfly egg hatches. What comes out first?',
          'What does a caterpillar become?',
          'A tadpole lives in the pond. What does it become?',
          'What comes just before a butterfly?',
          'The cycle starts again. What does the butterfly lay?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['A caterpillar', 'A full butterfly', 'A fox', 'A magnet'],
          ['A butterfly', 'A fish', 'A rock', 'A metal clip'],
          ['A frog', 'A bird', 'A seed', 'A shadow'],
          ['A caterpillar', 'A fox', 'A rubbish bin', 'A lamp'],
          ['An egg', 'A block of ice', 'A nest of metal', 'A drum'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
