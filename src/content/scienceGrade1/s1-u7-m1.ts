import type { ContentModule } from '../types';

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
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['night', 'dark', 'cool', 'moon', 'star'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'The sun makes the day.',
      visual: {
        kind: 'evidence-text',
        title: 'Bright time',
        sentences: ['The sun is up.', 'We can see the yard.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the sky.',
      visual: {
        kind: 'evidence-text',
        title: 'Sky check',
        sentences: ['Look up.', 'Is it bright or dark?'],
      },
      action: 'watch',
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
  ],
};
