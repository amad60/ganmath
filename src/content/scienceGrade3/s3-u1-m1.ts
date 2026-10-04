import type { ContentModule } from '../types';

export const leavesMakeFood: ContentModule = {
  id: 's3-u1-m1',
  unitId: 's3-u1',
  grade: 3,
  title: 'Leaves Make Food',
  icon: '🍃',
  prereq: [],
  skills: ['sci-leaves'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['look', 'leaf', 'light', 'pale'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A leaf uses light.',
      visual: {
        kind: 'evidence-text',
        title: 'By the window',
        sentences: ['The leaf faces the sun.', 'It stays green and makes food.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'Watch the leaf',
        sentences: ['See the leaf.', 'See what reaches it.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'No light makes a leaf pale.',
      visual: {
        kind: 'evidence-text',
        title: 'Covered',
        sentences: ['A leaf in the light stays green. A covered leaf turns pale.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-leaves',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows what the leaf does?',
      visual: (p) => {
        const stories = [
          {
            title: 'By the wall',
            sentences: ['The pot sits by the wall.', 'The leaf faces the sun and stays green.'],
          },
          {
            title: 'A cover',
            sentences: ['A box covers the leaf.', 'With no light the leaf turns pale.'],
          },
          {
            title: 'The window',
            sentences: ['She moves the plant to the window.', 'The leaf gets light and makes food.'],
          },
          {
            title: 'All day dark',
            sentences: ['The room stays dark.', 'The covered leaf droops and goes pale.'],
          },
          {
            title: 'On the leaf',
            sentences: ['The sun falls on the leaf.', 'The plant uses that light to make food.'],
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
      skill: 'sci-leaves',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A leaf gets sun all day. What can it do?',
          'A box covers a leaf for many days. What happens?',
          'What does a leaf need to make food?',
          'Why does a plant grow better by a window?',
          'No light reaches the leaf. What happens to the food-making?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['Make food', 'Turn to metal', 'Become a magnet', 'Freeze solid'],
          ['It turns pale', 'It makes more food', 'It becomes a rock', 'It lays an egg'],
          ['Light', 'A dark box', 'A magnet', 'A block of ice'],
          ['The leaf gets light', 'The leaf gets no air', 'The pot is metal', 'The soil is a magnet'],
          ['It stops', 'It gets faster', 'It makes ice', 'It pulls metal'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
