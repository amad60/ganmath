import type { ContentModule } from '../types';
import { at, whatHappensNext } from '../scienceScene';

export const earthTurns: ContentModule = {
  id: 's6-u3-m1',
  unitId: 's6-u3',
  grade: 6,
  title: 'Earth Turns',
  icon: '🌍',
  prereq: ['s6-u2-m1'],
  skills: ['sci-spin'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['earth', 'sun', 'day', 'night', 'side', 'face'],

  learn: [
    // Matahari tetap di kiri. Sisi kiri menghadap matahari: siang. Sisi kanan membelakangi: malam.
    {
      stage: 'concrete',
      prompt: 'Face the sun, or away.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'plain',
        base: [at('🌍', 52, 55, 30), at('☀️', 16, 28, 16)],
        options: [
          {
            icon: '🏠',
            label: 'To the sun',
            caption: 'Your side faces the sun. It is day.',
            result: [at('☀️', 16, 28, 16), at('🌍', 52, 55, 28), at('🏠', 32, 58, 12), at('🌞', 34, 34, 14, { fx: 'pop' })],
          },
          {
            icon: '🌙',
            label: 'Away',
            caption: 'Your side is away. It is night.',
            result: [at('☀️', 16, 28, 14), at('🌍', 52, 55, 28), at('🏠', 78, 50, 14, { fx: 'pop' })],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'Is this side night?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'plain',
        base: [at('☀️', 16, 28, 16), at('🌍', 52, 55, 30), at('🏠', 78, 50, 12)],
        options: [
          {
            icon: '🌙',
            label: 'It is night',
            caption: 'This side faces away. It is night.',
            result: [at('☀️', 16, 28, 14), at('🌍', 52, 55, 28), at('🏠', 78, 50, 14, { fx: 'pop' })],
          },
          { icon: '🌞', label: 'It is day', caption: 'It is day.' },
          { icon: '🚫', label: 'Sides are the same', caption: 'Sides are the same.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Face the sun. It is day.',
      visual: {
        kind: 'evidence-text',
        title: 'Turns',
        sentences: [
          'Your side faces the sun, and it is day.',
          'Your side is away, and it is night. The sun is still there.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-spin', [
      {
        ask: 'Why is it day?',
        bg: 'day',
        base: [at('☀️', 16, 28, 16), at('🌍', 52, 55, 28), at('🏠', 32, 56, 12)],
        cards: [
          { icon: '🌞', label: 'Toward sun' },
          { icon: '🌙', label: 'Faces away' },
          { icon: '🌑', label: 'Sun is gone' },
        ],
      },
      {
        ask: 'What made it night?',
        bg: 'night',
        base: [at('☀️', 16, 28, 14), at('🌍', 52, 55, 28), at('🏠', 78, 50, 12)],
        cards: [
          { icon: '🌙', label: 'Faces away' },
          { icon: '🌞', label: 'Toward sun' },
          { icon: '🌑', label: 'Sun is gone' },
        ],
      },
      {
        ask: 'What is missing on the dark side?',
        bg: 'night',
        base: [at('☀️', 16, 26, 14), at('🌍', 52, 55, 28), at('🏠', 78, 50, 12)],
        cards: [
          { icon: '🌞', label: 'Sunlight' },
          { icon: '🌙', label: 'Faces the sun' },
          { icon: '☁️', label: 'A cloud' },
        ],
      },
      {
        ask: 'What helps this tree have day?',
        bg: 'day',
        base: [at('☀️', 16, 26, 16), at('🌍', 52, 58, 26), at('🌳', 32, 48, 14)],
        cards: [
          { icon: '🌞', label: 'Toward sun' },
          { icon: '🌙', label: 'Faces away' },
          { icon: '☁️', label: 'Cloud makes night' },
        ],
      },
      {
        ask: 'What caused night for the flower?',
        bg: 'night',
        base: [at('☀️', 16, 26, 14), at('🌍', 52, 55, 26), at('🌸', 78, 50, 12)],
        cards: [
          { icon: '🌙', label: 'Faces away' },
          { icon: '🌞', label: 'Toward sun' },
          { icon: '💡', label: 'Lamp makes day' },
        ],
      },
      {
        ask: 'What keeps the sun at night?',
        bg: 'night',
        base: [at('☀️', 16, 26, 16), at('🌍', 52, 55, 26), at('🏠', 78, 50, 12)],
        cards: [
          { icon: '⬅️', label: 'Still there' },
          { icon: '🌑', label: 'Sun is gone' },
          { icon: '💡', label: 'Lamp is the sun' },
        ],
      },
      {
        ask: 'Which part has day?',
        bg: 'plain',
        base: [at('☁️', 48, 14, 12), at('☀️', 16, 30, 14), at('🌍', 52, 56, 26), at('🏠', 32, 52, 12), at('🌸', 78, 50, 12)],
        cards: [
          { icon: '🌞', label: 'Toward sun' },
          { icon: '🌙', label: 'Faces away' },
          { icon: '☁️', label: 'The cloud' },
        ],
      },
      {
        ask: 'What does this night need?',
        bg: 'night',
        base: [at('☀️', 16, 26, 14), at('🌍', 52, 55, 26), at('🏠', 78, 50, 12)],
        cards: [
          { icon: '🌙', label: 'Faces away' },
          { icon: '🌞', label: 'Toward sun' },
          { icon: '🌑', label: 'Sun is gone' },
        ],
      },
    ]),
  ],
};
