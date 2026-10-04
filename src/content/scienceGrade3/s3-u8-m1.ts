import type { ContentModule } from '../types';

export const closedPath: ContentModule = {
  id: 's3-u8-m1',
  unitId: 's3-u8',
  grade: 3,
  title: 'A Closed Path',
  icon: '💡',
  prereq: ['s3-u7-m1'],
  skills: ['sci-circuit'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['closed', 'path', 'light', 'bulb', 'gap'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A closed path lights a bulb.',
      visual: {
        kind: 'evidence-text',
        title: 'Clipped on',
        sentences: ['The wire meets the battery and the bulb.', 'The bulb lights.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'The loop',
        sentences: ['See the loop.', 'See if it is whole or broken.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A gap stops the light.',
      visual: {
        kind: 'evidence-text',
        title: 'Open or closed',
        sentences: ['A closed path lets the bulb light. A gap stops it.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-circuit',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows why the bulb is on or off?',
      visual: (p) => {
        const stories = [
          {
            title: 'Clipped on',
            sentences: ['The wire is clipped on.', 'The closed path lights the bulb.'],
          },
          {
            title: 'Clip off',
            sentences: ['One clip comes off.', 'The gap stops the light.'],
          },
          {
            title: 'In the holder',
            sentences: ['The battery sits in the holder.', 'The bulb lights when the path is closed.'],
          },
          {
            title: 'A cut',
            sentences: ['She cuts a gap in the wire.', 'The bulb goes dark.'],
          },
          {
            title: 'Joined again',
            sentences: ['He joins the wire again.', 'The bulb lights once more.'],
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
      skill: 'sci-circuit',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'The wire, battery, and bulb make a closed path. What happens?',
          'A clip falls off and leaves a gap. What happens?',
          'What does a bulb need to light?',
          'Why does the bulb go dark when the wire is cut?',
          'He connects the wire again. What happens?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['The bulb lights', 'The bulb stays dark', 'The wire becomes fur', 'The battery turns to soil'],
          ['The light stops', 'The bulb gets brighter', 'Air fills the bulb', 'The pond dries'],
          ['A closed path', 'A gap in the wire', 'No battery', 'A dry leaf on top'],
          ['The path has a gap', 'The air is gone', 'The leaf is pale', 'The frog left'],
          ['The bulb lights again', 'It stays dark forever', 'It makes food', 'It falls up'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
