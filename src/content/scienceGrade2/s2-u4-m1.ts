import type { ContentModule } from '../types';

export const solidAndLiquid: ContentModule = {
  id: 's2-u4-m1',
  unitId: 's2-u4',
  grade: 2,
  title: 'Solid and Liquid',
  icon: '💧',
  prereq: ['s2-u3-m1'],
  skills: ['sci-states'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['solid', 'keep', 'shape', 'liquid', 'cup', 'pour'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A solid keeps one shape.',
      visual: {
        kind: 'evidence-text',
        title: 'Same shape',
        sentences: ['A rock is moved to a new box.', 'Its shape stays the same.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'Watch the move',
        sentences: ['See the thing.', 'See what happens when it moves.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A liquid takes the cup shape.',
      visual: {
        kind: 'evidence-text',
        title: 'It pours',
        sentences: ['Water pours. In a new cup it takes that shape.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-states',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows solid or liquid?',
      visual: (p) => {
        const stories = [
          {
            title: 'New cup',
            sentences: ['The cup is on the table.', 'The water pours and takes the cup shape.'],
          },
          {
            title: 'The rock',
            sentences: ['She taps the rock.', 'The rock keeps one shape.'],
          },
          {
            title: 'Juice',
            sentences: ['Juice sits in a jug.', 'She pours it into a new cup.'],
          },
          {
            title: 'Wood block',
            sentences: ['The block is wood.', 'It stays the same shape in a new box.'],
          },
          {
            title: 'Milk',
            sentences: ['Milk is in a bottle.', 'She pours the milk into a glass.'],
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
      skill: 'sci-states',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'Water is poured into a new cup. What happens?',
          'A rock is moved into a new box. What happens to its shape?',
          'Which one is a liquid?',
          'Which one is a solid?',
          'You tip a cup of water. What does the water do?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['It takes the cup shape', 'It keeps a rock shape', 'It becomes a seed', 'It flies away'],
          ['It keeps one shape', 'It pours out', 'It becomes liquid', 'It melts away'],
          ['Juice in a cup', 'A wood block', 'A metal clip', 'A nest'],
          ['A rock', 'Milk', 'Water', 'Juice'],
          ['It flows out', 'It stays a hard block', 'It becomes a nest', 'It turns to metal'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
