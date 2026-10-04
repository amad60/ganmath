import type { ContentModule } from '../types';

export const careForEarth: ContentModule = {
  id: 's2-u10-m1',
  unitId: 's2-u10',
  grade: 2,
  title: 'Care for the Earth',
  icon: '🌍',
  prereq: ['s2-u9-m1'],
  skills: ['sci-earth'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['rubbish', 'bin', 'waste', 'harm', 'river', 'save'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put rubbish in the bin.',
      visual: {
        kind: 'evidence-text',
        title: 'By the river',
        sentences: ['Paper lies by the river.', 'Rudi puts it in the bin.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'A choice',
        sentences: ['See the place.', 'See the helpful act.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Waste harms a river.',
      visual: {
        kind: 'evidence-text',
        title: 'Why it matters',
        sentences: ['Rubbish in a river harms the fish. Saving water leaves more to use.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-earth',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows good care?',
      visual: (p) => {
        const stories = [
          {
            title: 'By the water',
            sentences: ['Paper is by the river.', 'Rudi puts the rubbish in the bin.'],
          },
          {
            title: 'Running tap',
            sentences: ['The tap runs and no one is there.', 'Lina turns it off to save water.'],
          },
          {
            title: 'The fish',
            sentences: ['Fish live in the river.', 'Rubbish in the river harms them.'],
          },
          {
            title: 'Empty room',
            sentences: ['No one is in the room.', 'Budi turns the lamp off.'],
          },
          {
            title: 'On the grass',
            sentences: ['Waste sits on the grass.', 'Siti carries it to the bin.'],
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
      skill: 'sci-earth',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'Rubbish is next to the river. What is good care?',
          'The tap runs and no one is using it. What should you do?',
          'Why keep rubbish out of the river?',
          'An empty room has the lamp on. What saves power?',
          'Waste stays on the grass in the rain. What can happen?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['Put it in the bin', 'Push it in the river', 'Leave it there', 'Kick it along'],
          ['Turn it off', 'Open it more', 'Drop paper in it', 'Melt ice on it'],
          ['It harms the fish', 'Fish eat paper as food', 'Rubbish helps seeds', 'It makes a magnet'],
          ['Turn the lamp off', 'Add another lamp', 'Open the tap', 'Pull a magnet'],
          ['It can wash into the river', 'It becomes soil at once', 'It feeds a fox', 'It freezes the pond'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
