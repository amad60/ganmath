import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

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
  questionTypes: ['clue-tap', 'choose-text', 'pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['drum', 'loud', 'quiet', 'whisper', 'sound', 'hit', 'bang'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap the drum soft, or hit it hard.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('🥁', 50, 62, 28)],
        options: [
          {
            icon: '🤏',
            label: 'Soft',
            caption: 'A soft tap is quiet.',
            result: [at('🥁', 50, 62, 28), at('🎵', 64, 30, 8, { fx: 'pop' })],
          },
          {
            icon: '💥',
            label: 'Hard',
            caption: 'A hard hit is loud.',
            result: [
              at('🥁', 50, 62, 28, { fx: 'shake' }),
              at('🎵', 26, 24, 14, { fx: 'pop' }),
              at('🎶', 72, 22, 16, { fx: 'pop' }),
              at('🔊', 86, 56, 12),
            ],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'A whisper. What do you hear?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'room',
        base: [at('🤫', 34, 56, 26), at('🧒', 74, 60, 26)],
        options: [
          { icon: '🔊', label: 'A loud bang', caption: 'A loud bang.' },
          { icon: '🌈', label: 'A rainbow', caption: 'A rainbow.' },
          {
            icon: '🔈',
            label: 'A quiet sound',
            caption: 'A whisper is quiet.',
            result: [at('🤫', 34, 56, 26), at('🧒', 74, 60, 26), at('🔈', 54, 26, 10, { fx: 'pop' })],
          },
        ],
        correct: 2,
      },
      action: 'explore',
      target: 1,
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
    whatHappensNext('sci-sound', [
      {
        bg: 'room',
        base: [at('💥', 30, 30, 16), at('🥁', 50, 62, 28)],
        cards: [
          { icon: '🔊', label: 'A loud sound' },
          { icon: '🔈', label: 'A quiet sound' },
          { icon: '🌙', label: 'It gets dark' },
        ],
      },
      {
        bg: 'room',
        base: [at('🤫', 34, 56, 26), at('🧒', 74, 60, 26)],
        cards: [
          { icon: '🔈', label: 'A quiet sound' },
          { icon: '🔊', label: 'A loud sound' },
          { icon: '🌧️', label: 'It rains' },
        ],
      },
      {
        bg: 'room',
        base: [at('🎺', 46, 54, 30)],
        cards: [
          { icon: '🔊', label: 'A loud sound' },
          { icon: '🔈', label: 'A quiet sound' },
          { icon: '❄️', label: 'It snows' },
        ],
      },
      {
        bg: 'room',
        base: [at('🐭', 46, 70, 22), at('🧀', 76, 76, 14)],
        cards: [
          { icon: '🔈', label: 'A quiet sound' },
          { icon: '🔊', label: 'A loud sound' },
          { icon: '🔥', label: 'It gets hot' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('🌩️', 50, 30, 30), ground()],
        cards: [
          { icon: '🔊', label: 'A loud sound' },
          { icon: '🔈', label: 'A quiet sound' },
          { icon: '🌱', label: 'It grows' },
        ],
      },
    ]),
  ],
};
