import type { ContentModule } from '../types';

export const airTakesSpace: ContentModule = {
  id: 's3-u4-m1',
  unitId: 's3-u4',
  grade: 3,
  title: 'Air Takes Space',
  icon: '🎈',
  prereq: ['s3-u3-m1'],
  skills: ['sci-air'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['air', 'balloon', 'wind', 'move'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Air fills a balloon.',
      visual: {
        kind: 'evidence-text',
        title: 'A flat balloon',
        sentences: ['The balloon starts flat.', 'A breath of air makes it round.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'Hidden',
        sentences: ['See the object.', 'See what is inside the space.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Wind moves the air.',
      visual: {
        kind: 'evidence-text',
        title: 'You cannot see it',
        sentences: ['Air takes space even when you cannot see it. Wind is air on the move.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-air',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows the air?',
      visual: (p) => {
        const stories = [
          {
            title: 'Flat balloon',
            sentences: ['The balloon is flat.', 'She blows air in and it grows round.'],
          },
          {
            title: 'Cup in water',
            sentences: ['The cup is pushed into the water.', 'Air inside keeps the water out.'],
          },
          {
            title: 'The fan',
            sentences: ['He waves a fan.', 'Moving air is the wind.'],
          },
          {
            title: 'A bubble',
            sentences: ['A bubble floats past.', 'Air is trapped inside the bubble.'],
          },
          {
            title: 'Empty bag',
            sentences: ['The bag looks empty.', 'Air still fills the space inside.'],
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
      skill: 'sci-air',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'You blow into a flat balloon. What happens?',
          'A cup pushed into water stays dry inside. Why?',
          'What is wind?',
          'An empty bag pushes back when you squeeze it. What is in it?',
          'You cannot see air. How can you tell it is there?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['Air fills it', 'It turns to soil', 'It becomes a frog', 'It grows fur'],
          ['Air fills the cup', 'The cup has no space', 'Water is fur', 'The cup is a leaf'],
          ['Moving air', 'A dry pond', 'A pale leaf', 'A gap in a wire'],
          ['Air', 'Only soil', 'A frog', 'Nothing at all'],
          ['It fills space', 'It has a bright color', 'It is fur', 'It is a rock'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
