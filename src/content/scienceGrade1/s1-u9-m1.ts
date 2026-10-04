import type { ContentModule } from '../types';

export const loudAndQuiet: ContentModule = {
  id: 's1-u9-m1',
  unitId: 's1-u9',
  grade: 1,
  title: 'Loud and Quiet',
  icon: '🥁',
  prereq: ['s1-u8-m1'],
  skills: ['sci-sound'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['drum', 'loud', 'quiet', 'whisper', 'sound'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A drum is loud.',
      visual: {
        kind: 'evidence-text',
        title: 'Big sound',
        sentences: ['Hands hit the drum.', 'The sound fills the room.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'How strong',
        sentences: ['See what makes the sound.', 'Is it big or soft?'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A whisper is quiet.',
      visual: {
        kind: 'evidence-text',
        title: 'Two sounds',
        sentences: ['A drum is loud. A whisper is quiet.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-sound',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows the sound?',
      visual: (p) => {
        const stories = [
          {
            title: 'Band',
            sentences: ['The children line up.', 'The drum boom fills the hall.'],
          },
          {
            title: 'Library',
            sentences: ['Rows of books are still.', 'Rina speaks in a tiny whisper.'],
          },
          {
            title: 'Thunder',
            sentences: ['Clouds cover the sky.', 'A loud boom shakes the window.'],
          },
          {
            title: 'Nap',
            sentences: ['The baby is asleep.', 'Dad hums a quiet tune.'],
          },
          {
            title: 'Street',
            sentences: ['Cars wait at the light.', 'A horn makes a loud blast.'],
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
      skill: 'sci-sound',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'Hands hit a drum in the hall. How is the sound?',
          'Rina speaks so only one friend hears. How is the sound?',
          'A horn blasts at the light. How is the sound?',
          'Dad hums beside a sleeping baby. How is the sound?',
          'Thunder shakes the window. How is the sound?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['Loud', 'Quiet', 'Wet', 'Soft cloth'],
          ['Quiet', 'Loud', 'Bright', 'Hard'],
          ['Loud', 'Quiet', 'Dark', 'Cold'],
          ['Quiet', 'Loud', 'Sunny', 'Heavy'],
          ['Loud', 'Quiet', 'Sweet', 'Green'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
