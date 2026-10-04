import type { ContentModule } from '../types';

export const sunRainWind: ContentModule = {
  id: 's1-u4-m1',
  unitId: 's1-u4',
  grade: 1,
  title: 'Sun, Rain, and Wind',
  icon: '🌤️',
  prereq: ['s1-u3-m1'],
  skills: ['sci-weather'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['sun', 'day', 'warm', 'rain', 'fall', 'cloud', 'wind', 'push', 'sky', 'look'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'The sun makes the day warm.',
      visual: {
        kind: 'evidence-text',
        title: 'A warm yard',
        sentences: ['The sun is high.', 'The yard feels warm.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the sky.',
      visual: {
        kind: 'evidence-text',
        title: 'The day',
        sentences: ['Look up.', 'See what the day is doing.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Wind can push a leaf.',
      visual: {
        kind: 'evidence-text',
        title: 'Moving air',
        sentences: ['Rain falls, the sun warms, and wind pushes.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-weather',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows the weather?',
      visual: (p) => {
        const stories = [
          {
            title: 'Clear sky',
            sentences: ['The sky is clear.', 'The sun makes the yard warm.'],
          },
          {
            title: 'Dark clouds',
            sentences: ['Clouds get dark.', 'Rain falls on the street.'],
          },
          {
            title: 'Moving flag',
            sentences: ['The flag starts to move.', 'Wind pushes it to the side.'],
          },
          {
            title: 'Drying puddle',
            sentences: ['The puddle was deep.', 'The sun dries the puddle up.'],
          },
          {
            title: 'Bending trees',
            sentences: ['Trees lean over.', 'A strong wind bends the branches.'],
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
      skill: 'sci-weather',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'The yard is hot and bright. What is the day like?',
          'Drops fall from the sky. What is it?',
          'The hat blows off. What moves it?',
          'Clothes flap on the line. What moves them?',
          'A puddle gets smaller on a bright day. What dries it?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['Sunny', 'Rainy', 'Windy', 'Snowy'],
          ['Rain', 'Sun', 'Wind', 'Sand'],
          ['Wind', 'Rain', 'Sun', 'Fog'],
          ['Wind', 'A drum', 'A book', 'A shoe'],
          ['The sun', 'The moon', 'A drum', 'A shoe'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
