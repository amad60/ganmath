import type { ContentModule } from '../types';

export const whoEatsWhat: ContentModule = {
  id: 's2-u8-m1',
  unitId: 's2-u8',
  grade: 2,
  title: 'Who Eats What',
  icon: '🦊',
  prereq: ['s2-u7-m1'],
  skills: ['sci-food'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['rabbit', 'eat', 'grass', 'fox'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A rabbit eats grass.',
      visual: {
        kind: 'evidence-text',
        title: 'In the field',
        sentences: ['The grass is short.', 'The rabbit nibbles it.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'Who eats',
        sentences: ['See the living things.', 'See which one eats the other.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A fox eats a rabbit.',
      visual: {
        kind: 'evidence-text',
        title: 'The chain',
        sentences: ['Grass feeds the rabbit. The rabbit feeds the fox.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-food',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows who eats?',
      visual: (p) => {
        const stories = [
          {
            title: 'The field',
            sentences: ['The grass is green.', 'The rabbit eats the grass.'],
          },
          {
            title: 'The hunt',
            sentences: ['The rabbit is in the field.', 'The fox eats the rabbit.'],
          },
          {
            title: 'On the leaf',
            sentences: ['A leaf is on the plant.', 'The caterpillar eats the leaf.'],
          },
          {
            title: 'The pond',
            sentences: ['Small fish swim in the pond.', 'The big bird eats a fish.'],
          },
          {
            title: 'Bare ground',
            sentences: ['The grass is gone.', 'The rabbit has less to eat.'],
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
      skill: 'sci-food',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'What does a rabbit eat?',
          'What eats the rabbit?',
          'The grass is all gone. What happens to the rabbit?',
          'A caterpillar is on a leaf. What does it do?',
          'In grass, rabbit, fox — what comes first?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['Grass', 'A fox', 'A metal clip', 'A block of ice'],
          ['A fox', 'The grass', 'A seed', 'A shadow'],
          ['It has less to eat', 'It turns to metal', 'It becomes a lamp', 'It freezes'],
          ['It eats the leaf', 'It eats a fox', 'It pulls metal', 'It makes ice'],
          ['Grass', 'The fox', 'The rabbit', 'A magnet'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
