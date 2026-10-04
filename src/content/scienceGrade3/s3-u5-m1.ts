import type { ContentModule } from '../types';

export const fallAndSlow: ContentModule = {
  id: 's3-u5-m1',
  unitId: 's3-u5',
  grade: 3,
  title: 'Falling and Slowing',
  icon: '🏀',
  prereq: ['s3-u4-m1'],
  skills: ['sci-fall'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['ball', 'fall', 'down', 'rough', 'slide', 'slow'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A ball falls down.',
      visual: {
        kind: 'evidence-text',
        title: 'Let go',
        sentences: ['He opens his hand.', 'The ball drops to the ground.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'The path',
        sentences: ['See the ball.', 'See how the path changes the move.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A rough slide slows the ball.',
      visual: {
        kind: 'evidence-text',
        title: 'Two slides',
        sentences: ['A smooth slide lets the ball race. A rough slide slows it.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-fall',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows the fall or the slow-down?',
      visual: (p) => {
        const stories = [
          {
            title: 'Open hand',
            sentences: ['He lets go of the ball.', 'The ball falls down.'],
          },
          {
            title: 'Smooth slide',
            sentences: ['The slide is smooth.', 'The ball races to the end.'],
          },
          {
            title: 'Rough slide',
            sentences: ['The slide is rough.', 'The rough path slows the ball.'],
          },
          {
            title: 'A rock',
            sentences: ['She drops a rock.', 'The rock falls down.'],
          },
          {
            title: 'Sand',
            sentences: ['Sand covers the slide.', 'The ball slows and stops sooner.'],
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
      skill: 'sci-fall',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'You drop a ball. Which way does it go?',
          'A slide is rough. What happens to the ball?',
          'A slide is smooth and steep. What happens?',
          'Why does a rock fall when you let go?',
          'What slows a ball on a rough path?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['Down', 'Up and away', 'Only sideways', 'It floats in place'],
          ['It slows down', 'It speeds up', 'It floats', 'It turns to air'],
          ['The ball goes fast', 'The ball stops at once', 'The ball falls up', 'The ball becomes a leaf'],
          ['It is pulled down', 'The air pushes it up', 'Fur holds it', 'A magnet is missing'],
          ['The rough slide', 'A pale leaf', 'A dry pond', 'A feather'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
