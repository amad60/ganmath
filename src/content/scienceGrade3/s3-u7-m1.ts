import type { ContentModule } from '../types';

export const soundTravels: ContentModule = {
  id: 's3-u7-m1',
  unitId: 's3-u7',
  grade: 3,
  title: 'Sound Travels',
  icon: '🔔',
  prereq: ['s3-u6-m1'],
  skills: ['sci-sound-travel'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text'],
  visuals: ['evidence-text'],
  vocab: ['shake', 'sound', 'far', 'quiet'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'A shake makes a sound.',
      visual: {
        kind: 'evidence-text',
        title: 'The string',
        sentences: ['He plucks the string.', 'It shakes and a sound comes out.'],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Look at the picture.',
      visual: {
        kind: 'evidence-text',
        title: 'From here to there',
        sentences: ['See what shakes.', 'See how far the listener stands.'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Far away the sound is quiet.',
      visual: {
        kind: 'evidence-text',
        title: 'Through the air',
        sentences: ['Sound moves through the air. Farther away, it is quieter.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-sound-travel',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows the sound?',
      visual: (p) => {
        const stories = [
          {
            title: 'The string',
            sentences: ['He plucks the string.', 'The string shakes and a sound comes.'],
          },
          {
            title: 'Down the hall',
            sentences: ['She stands far away.', 'The sound is quieter there.'],
          },
          {
            title: 'Covered ears',
            sentences: ['The drum is loud.', 'Covered ears make it hard to hear.'],
          },
          {
            title: 'The drum',
            sentences: ['The drum skin is tapped.', 'It shakes and the sound moves through the air.'],
          },
          {
            title: 'Closer',
            sentences: ['She walks toward the bell.', 'The sound is louder up close.'],
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
      skill: 'sci-sound-travel',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A string is plucked and it shakes. What do you hear?',
          'You walk far from a drum. What happens to the sound?',
          'What does sound move through to reach you?',
          'You cover your ears. What changes?',
          'A bell is tapped and keeps shaking. What do you hear?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['A sound', 'Nothing, a shake is silent', 'Only light', 'Only a pale leaf'],
          ['It gets quiet', 'It gets louder', 'It becomes light', 'It turns to soil'],
          ['Air', 'A box with no air', 'Fur only', 'Soil only'],
          ['The sound is harder to hear', 'The drum gets louder', 'The string stops being string', 'The air turns to water'],
          ['A sound', 'Nothing at all', 'Only light', 'Only wind with no sound'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
  ],
};
