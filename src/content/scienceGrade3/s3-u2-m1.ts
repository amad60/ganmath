import type { ContentModule } from '../types';

export const bodyCoverings: ContentModule = {
  id: 's3-u2-m1',
  unitId: 's3-u2',
  grade: 3,
  title: 'Body Coverings',
  icon: '🐻',
  prereq: ['s3-u1-m1'],
  skills: ['sci-cover'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['fur', 'animal', 'warm', 'feather', 'bird', 'scale', 'fish'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fur keeps an animal warm.',
      visual: {
        kind: 'evidence-text',
        title: 'Cold wind',
        sentences: ['The wind is cold.', 'Thick fur holds the warmth in.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'The covering',
        sentences: ['See the animal.', 'See what covers its body.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Feathers keep a bird warm.',
      visual: {
        kind: 'evidence-text',
        title: 'A fit',
        sentences: ['Fur, feathers, and scales each help the animal where it lives.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-cover',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows how the covering helps?',
      visual: (p) => {
        const stories = [
          {
            title: 'Cold wind',
            sentences: ['The wind is cold.', 'Thick fur keeps the animal warm.'],
          },
          {
            title: 'In the pond',
            sentences: ['The fish swims along.', 'Scales cover its body in the water.'],
          },
          {
            title: 'On the branch',
            sentences: ['The bird sits in the cold.', 'Feathers keep it warm.'],
          },
          {
            title: 'Hot day',
            sentences: ['The day is hot.', 'Thin fur lets extra heat leave.'],
          },
          {
            title: 'On the pond',
            sentences: ['The duck lands.', 'Feathers keep the water off its skin.'],
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
      skill: 'sci-cover',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A wolf lives where it is cold. What helps?',
          'What covers a fish and helps it in water?',
          'What keeps a bird warm?',
          'An animal in a hot place has very thick fur. What is the problem?',
          'Why does a polar bear have thick fur?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['Thick fur', 'Bare skin only', 'A metal shell', 'A pale leaf'],
          ['Scales', 'Fur', 'Feathers', 'A wool coat'],
          ['Feathers', 'Scales', 'A wet rock', 'A magnet'],
          ['It stays too warm', 'It cannot see', 'It melts at once', 'It becomes a plant'],
          ['To keep warm', 'To swim like a fish', 'To make food from light', 'To block every sound'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
