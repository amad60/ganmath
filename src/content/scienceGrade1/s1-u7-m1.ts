import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const dayAndNight: ContentModule = {
  id: 's1-u7-m1',
  unitId: 's1-u7',
  grade: 1,
  title: 'Day and Night',
  icon: '🌙',
  prereq: ['s1-u6-m1'],
  skills: ['sci-day-night'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text', 'pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['night', 'dark', 'cool', 'moon', 'star', 'down', 'rainbow'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Pick the day or the night.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('☀️', 80, 18, 16), at('🏠', 50, 70, 26), ground()],
        options: [
          {
            icon: '☀️',
            label: 'Day',
            caption: 'The sun is up. It is bright.',
            bg: 'day',
            result: [at('☀️', 80, 18, 18, { fx: 'rise' }), at('🐦', 26, 30, 10), at('🏠', 50, 70, 26), ground()],
          },
          {
            icon: '🌙',
            label: 'Night',
            caption: 'The moon is up. It is dark.',
            bg: 'night',
            result: [
              at('🌙', 80, 18, 16, { fx: 'rise' }),
              at('⭐', 22, 16, 8, { fx: 'pop' }),
              at('⭐', 46, 26, 7, { fx: 'pop' }),
              at('🏠', 50, 70, 26),
              ground('gray'),
            ],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'The sun goes down. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('☀️', 82, 70, 16), at('🏠', 42, 70, 26), ground()],
        options: [
          { icon: '🌈', label: 'A rainbow comes', caption: 'A rainbow comes.' },
          {
            icon: '🌙',
            label: 'Night comes',
            caption: 'Night comes. It gets dark.',
            bg: 'night',
            result: [
              at('🌙', 80, 18, 16, { fx: 'rise' }),
              at('⭐', 22, 16, 8, { fx: 'pop' }),
              at('🏠', 42, 70, 26),
              ground('gray'),
            ],
          },
          { icon: '🌞', label: 'It gets hot', caption: 'It gets hot.' },
        ],
        correct: 1,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Night is dark and cool.',
      visual: {
        kind: 'evidence-text',
        title: 'Two times',
        sentences: ['Day is bright with the sun. Night is dark with the moon.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-day-night',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows day or night?',
      visual: (p) => {
        const stories = [
          {
            title: 'Breakfast',
            sentences: ['Budi sits at the table.', 'Bright sun lights the kitchen.'],
          },
          {
            title: 'Bedtime',
            sentences: ['The house is still.', 'The moon shines in the dark sky.'],
          },
          {
            title: 'Play time',
            sentences: ['Children go outside.', 'The day is warm and bright.'],
          },
          {
            title: 'Stars',
            sentences: ['Everyone is quiet.', 'Little stars twinkle at night.'],
          },
          {
            title: 'School bell',
            sentences: ['The bag is by the door.', 'It is morning and the sun is up.'],
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
      skill: 'sci-day-night',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'The yard is bright and warm. What time is it?',
          'The sky is dark and the moon is up. What time is it?',
          'You can see little lights twinkling. What are they?',
          'What is in the sky when the day is bright?',
          'The air is cool and you need a lamp. What time is it?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['Day', 'Night', 'Winter', 'A cave'],
          ['Night', 'Noon', 'Day', 'Sunrise only'],
          ['Stars', 'Leaves', 'Rocks', 'Fish'],
          ['The sun', 'The moon', 'A lamp', 'A star'],
          ['Night', 'Day', 'Noon', 'Morning sun'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
    whatHappensNext('sci-day-night', [
      {
        bg: 'day',
        base: [at('☀️', 82, 70, 16), at('🏠', 42, 70, 26), ground()],
        cards: [
          { icon: '🌙', label: 'Night comes' },
          { icon: '🌈', label: 'A rainbow comes' },
          { icon: '🌞', label: 'It gets hot' },
        ],
      },
      {
        bg: 'night',
        base: [at('🌙', 80, 70, 14), at('⭐', 30, 20, 8), at('🏠', 42, 70, 26), ground('gray')],
        cards: [
          { icon: '☀️', label: 'The sun comes up' },
          { icon: '🍰', label: 'A cake comes' },
          { icon: '🌊', label: 'Water comes' },
        ],
      },
      {
        bg: 'night',
        base: [at('🌙', 80, 18, 16), at('🛏️', 46, 66, 30)],
        cards: [
          { icon: '😴', label: 'We sleep' },
          { icon: '🏊', label: 'We swim' },
          { icon: '🪁', label: 'We fly a kite' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐓', 30, 66, 22), at('☀️', 80, 72, 16), ground()],
        cards: [
          { icon: '🏫', label: 'We go to school' },
          { icon: '😴', label: 'We go to sleep' },
          { icon: '⭐', label: 'Stars come out' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 50, 18, 22), at('🏠', 50, 72, 24), ground()],
        cards: [
          { icon: '😎', label: 'It is bright' },
          { icon: '🌙', label: 'It is dark' },
          { icon: '⭐', label: 'Stars come out' },
        ],
      },
    ]),
  ],
};
