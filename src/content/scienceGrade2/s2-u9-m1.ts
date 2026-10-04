import type { ContentModule } from '../types';

export const soilAndRain: ContentModule = {
  id: 's2-u9-m1',
  unitId: 's2-u9',
  grade: 2,
  title: 'Soil and Rain',
  icon: '🌧️',
  prereq: ['s2-u8-m1'],
  skills: ['sci-soil'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['rain', 'soak', 'soil', 'wash'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Rain soaks into soil.',
      visual: {
        kind: 'evidence-text',
        title: 'After rain',
        sentences: ['Soft rain falls.', 'The soil drinks it in.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'On the ground',
        sentences: ['See the rain.', 'See what the ground does.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Big rain can wash soil away.',
      visual: {
        kind: 'evidence-text',
        title: 'Hard rain',
        sentences: ['Soft rain soaks in. Hard rain can carry soil off.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-soil',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows what the rain does?',
      visual: (p) => {
        const stories = [
          {
            title: 'Dry bed',
            sentences: ['The soil is dry.', 'Rain soaks into the soil.'],
          },
          {
            title: 'Hard rain',
            sentences: ['The rain is hard and long.', 'The water washes soil down the path.'],
          },
          {
            title: 'Thirsty plant',
            sentences: ['The plant looks dry.', 'The soil holds the rain for it.'],
          },
          {
            title: 'Bare path',
            sentences: ['The path has no cover.', 'Rain runs off and takes soil with it.'],
          },
          {
            title: 'Leaf cover',
            sentences: ['She spreads leaves on the soil.', 'The soil stays and keeps the water.'],
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
      skill: 'sci-soil',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'Soft rain falls on dry soil. What happens?',
          'Very hard rain hits bare soil. What can happen?',
          'Why is wet soil good for a plant?',
          'Leaves cover the soil. What do they help do?',
          'No rain comes for a long time. What happens to the soil?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['It soaks in', 'It becomes a magnet', 'It turns to metal', 'It flies off'],
          ['Soil washes away', 'Soil becomes ice', 'Soil turns into a nest', 'Soil pulls metal'],
          ['It holds water', 'It is a magnet', 'It is metal', 'It is a shadow'],
          ['Keep the soil in place', 'Melt the soil', 'Freeze the rain', 'Eat the plant'],
          ['It dries out', 'It becomes a fox', 'It turns to wood', 'It lays an egg'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
