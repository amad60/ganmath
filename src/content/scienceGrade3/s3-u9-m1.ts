import type { ContentModule } from '../types';

export const waterGoesAround: ContentModule = {
  id: 's3-u9-m1',
  unitId: 's3-u9',
  grade: 3,
  title: 'Water Goes Around',
  icon: '☁️',
  prereq: ['s3-u8-m1'],
  skills: ['sci-water-cycle'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['sun', 'heat', 'water', 'rain', 'cloud'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'The sun heats water.',
      visual: {
        kind: 'evidence-text',
        title: 'The puddle',
        sentences: ['A puddle sits in the sun.', 'The water rises into the air.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'Up and down',
        sentences: ['See the water.', 'See where it goes next.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Rain falls from a cloud.',
      visual: {
        kind: 'evidence-text',
        title: 'Around again',
        sentences: ['Heated water rises, drops make a cloud, and rain falls back down.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-water-cycle',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows where the water goes?',
      visual: (p) => {
        const stories = [
          {
            title: 'Hot puddle',
            sentences: ['The puddle sits in the sun.', 'The sun heats the water and it rises.'],
          },
          {
            title: 'Wet clothes',
            sentences: ['Wet clothes hang in the sun.', 'The water leaves and the clothes dry.'],
          },
          {
            title: 'High air',
            sentences: ['The air up high is cool.', 'Drops come together and form a cloud.'],
          },
          {
            title: 'Heavy cloud',
            sentences: ['The cloud is full of drops.', 'Rain falls from the cloud.'],
          },
          {
            title: 'Again',
            sentences: ['Rain soaks the ground.', 'The sun can heat that water again.'],
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
      skill: 'sci-water-cycle',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A puddle sits in the hot sun. What happens to the water?',
          'Where do the drops in a cloud come from?',
          'What falls from a cloud?',
          'Wet clothes dry in the sun. Where did the water go?',
          'Rain falls, then the sun heats the puddle again. What is that?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['It rises into the air', 'It turns to fur', 'It becomes a rock at once', 'It lights a bulb'],
          ['Water that rose', 'A dry pond with no water', 'A magnet', 'A metal clip'],
          ['Rain', 'Fur', 'A lever', 'A battery'],
          ['Up into the air', 'Into the fur', 'Into the bulb', 'It became a frog'],
          ['The water goes around again', 'The water is gone forever', 'The cloud becomes soil', 'The rain turns to metal'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
