import type { ContentModule } from '../types';

export const homeChanges: ContentModule = {
  id: 's3-u3-m1',
  unitId: 's3-u3',
  grade: 3,
  title: 'When a Home Changes',
  icon: '🐸',
  prereq: ['s3-u2-m1'],
  skills: ['sci-habitat'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['frog', 'leave', 'dry', 'pond', 'need', 'wet', 'home'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A frog leaves a dry pond.',
      visual: {
        kind: 'evidence-text',
        title: 'The water goes',
        sentences: ['The pond shrinks in the sun.', 'The frog hops off to find water.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'The place',
        sentences: ['See the place.', 'See what the animal does.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A frog needs a wet home.',
      visual: {
        kind: 'evidence-text',
        title: 'A fit',
        sentences: ['If the home no longer fits, the animal must leave or it cannot live there.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-habitat',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows what the change causes?',
      visual: (p) => {
        const stories = [
          {
            title: 'Smaller pond',
            sentences: ['The pond gets smaller.', 'The frog leaves the dry pond.'],
          },
          {
            title: 'Cut trees',
            sentences: ['The trees are cut down.', 'The birds lose the home in the branches.'],
          },
          {
            title: 'Dry river',
            sentences: ['The river dries in the heat.', 'The fish cannot live there.'],
          },
          {
            title: 'Filled in',
            sentences: ['People fill the pond with soil.', 'Frogs must find a wet home.'],
          },
          {
            title: 'Rain returns',
            sentences: ['Rain fills the dry pond.', 'Frogs can come back.'],
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
      skill: 'sci-habitat',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A pond dries up. What do the frogs do?',
          'Why does a frog leave a dry pond?',
          'The forest is cut down. What happens to the birds?',
          'Rain fills the pond again. What can happen?',
          'A fish is left in a dry ditch. What is wrong?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['They leave', 'They grow thick fur', 'They become rocks', 'They make light'],
          ['It needs a wet home', 'It needs a magnet', 'It likes dry sand best', 'It wants a dark box'],
          ['They lose their home', 'They turn pale', 'They become fish', 'They freeze'],
          ['Frogs can return', 'The water becomes fur', 'Fish grow feathers', 'The pond turns to metal'],
          ['It has no water home', 'It has too much fur', 'It has no magnet', 'It is really a bird'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
