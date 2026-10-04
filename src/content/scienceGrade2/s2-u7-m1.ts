import type { ContentModule } from '../types';

export const lightAndShadow: ContentModule = {
  id: 's2-u7-m1',
  unitId: 's2-u7',
  grade: 2,
  title: 'Light and Shadow',
  icon: '🔦',
  prereq: ['s2-u6-m1'],
  skills: ['sci-shadow'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['lamp', 'light', 'block', 'shadow', 'dark'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A lamp gives light.',
      visual: {
        kind: 'evidence-text',
        title: 'Lamp on',
        sentences: ['The lamp is on.', 'Light falls across the wall.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'In the way',
        sentences: ['See the light.', 'See what stands in the way.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A block makes a shadow.',
      visual: {
        kind: 'evidence-text',
        title: 'Blocked',
        sentences: ['When something blocks the light, a shadow appears.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-shadow',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows the shadow?',
      visual: (p) => {
        const stories = [
          {
            title: 'Hand',
            sentences: ['The lamp is on.', 'His hand blocks the light and a shadow shows.'],
          },
          {
            title: 'In the sun',
            sentences: ['She stands in the sun.', 'A dark shadow falls on the ground.'],
          },
          {
            title: 'Lamp off',
            sentences: ['The room is still.', 'The lamp is off, so there is no shadow.'],
          },
          {
            title: 'Cloud',
            sentences: ['A cloud covers the sun.', 'The shadow gets soft and pale.'],
          },
          {
            title: 'Step aside',
            sentences: ['He steps out of the light.', 'Nothing blocks it, so the shadow is gone.'],
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
      skill: 'sci-shadow',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A hand blocks the lamp light. What appears?',
          'The lamp is off and the room is dark. What is missing?',
          'You stand in bright sun. Where is your shadow?',
          'What do you need to make a shadow?',
          'She steps out of the light. What happens to the shadow?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['A shadow', 'A sprout', 'A magnet', 'A block of ice'],
          ['The shadow', 'The wood block', 'The nest', 'The bin'],
          ['On the ground', 'Inside a magnet', 'In the egg', 'In the metal cup'],
          ['Light and a block', 'Only a dark box', 'Only cold', 'Only a seed'],
          ['It is gone', 'It freezes', 'It sprouts', 'It becomes metal'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
