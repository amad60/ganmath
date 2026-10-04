import type { ContentModule } from '../types';

export const heatAndCold: ContentModule = {
  id: 's2-u5-m1',
  unitId: 's2-u5',
  grade: 2,
  title: 'Heat and Cold',
  icon: '🌡️',
  prereq: ['s2-u4-m1'],
  skills: ['sci-heat'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['heat', 'melt', 'ice', 'cold', 'freeze'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Heat can melt ice.',
      visual: {
        kind: 'evidence-text',
        title: 'In the sun',
        sentences: ['Ice sits in the sun.', 'It melts and becomes water.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'What changes',
        sentences: ['See the thing.', 'See what changes.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Cold can freeze water.',
      visual: {
        kind: 'evidence-text',
        title: 'Two ways',
        sentences: ['Heat melts ice. Cold freezes water.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-heat',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows heat or cold?',
      visual: (p) => {
        const stories = [
          {
            title: 'Sunny step',
            sentences: ['The ice sits in the sun.', 'The ice melts into water.'],
          },
          {
            title: 'Cold box',
            sentences: ['Water is in a cold box.', 'The water freezes into ice.'],
          },
          {
            title: 'Warm pan',
            sentences: ['Butter is by the warm pan.', 'The butter melts and goes soft.'],
          },
          {
            title: 'Night puddle',
            sentences: ['The puddle is out at night.', 'The cold turns it into ice.'],
          },
          {
            title: 'Warm hand',
            sentences: ['Chocolate sits in a warm hand.', 'It melts and drips.'],
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
      skill: 'sci-heat',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'Ice sits in the hot sun. What happens?',
          'Water stays in a very cold box. What happens?',
          'What can melt ice?',
          'What can freeze water?',
          'Butter is left in a warm pan. What happens?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['It melts', 'It freezes harder', 'It becomes a seed', 'It grows a nest'],
          ['It freezes', 'It melts', 'It becomes wood', 'It sprouts'],
          ['Heat', 'A dark nest', 'A quiet room', 'A magnet'],
          ['Cold', 'A bright lamp', 'A rabbit', 'Soft rain only'],
          ['It melts', 'It becomes a rock', 'It freezes hard', 'It grows leaves'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
