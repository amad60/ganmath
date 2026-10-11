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
    // Matahari tetap ada. Sisi kita menghadap matahari: siang. Membelakangi: malam.
    {
      stage: 'concrete',
      prompt: 'Face the sun, or away.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'plain',
        base: [at('🌍', 50, 55, 30), at('☀️', 16, 30, 16)],
        options: [
          {
            icon: '🏠',
            label: 'To the sun',
            caption: 'Your side faces the sun. It is day.',
            result: [at('☀️', 16, 28, 16), at('🌍', 52, 55, 28), at('🌞', 78, 30, 14, { fx: 'pop' })],
          },
          {
            icon: '🌙',
            label: 'Away',
            caption: 'Your side is away. It is night.',
            result: [at('☀️', 16, 28, 14), at('🌍', 52, 55, 28), at('🌙', 80, 34, 14, { fx: 'pop' })],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'Which side faces the sun?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'plain',
        base: [at('☀️', 14, 28, 16), at('🌍', 55, 55, 30), at('🏠', 74, 48, 12)],
        options: [
          {
            icon: '🌙',
            label: 'It is night',
            caption: 'It is night.',
            result: [at('☀️', 14, 28, 14), at('🌍', 55, 55, 28), at('🌙', 82, 36, 14, { fx: 'pop' })],
          },
          { icon: '🌞', label: 'It is day', caption: 'It is day.' },
          { icon: '☀️', label: 'The sun is away', caption: 'The sun is away.' },
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
        base: [at('☀️', 14, 28, 16), at('🌍', 55, 55, 28), at('🏠', 40, 48, 12), at('🌞', 78, 30, 14)],
        cards: [
          { icon: '☀️', label: 'Your side faces the sun' },
          { icon: '🌙', label: 'Your side is away' },
          { icon: '🔄', label: 'The sun goes around' },
        ],
      },
      {
        ask: 'What made it night?',
        bg: 'night',
        base: [at('☀️', 14, 28, 14), at('🌍', 52, 55, 28), at('🏠', 74, 50, 12), at('🌙', 82, 32, 14)],
        cards: [
          { icon: '🌙', label: 'Your side is away' },
          { icon: '☀️', label: 'Your side faces the sun' },
          { icon: '🌑', label: 'The sun is gone' },
        ],
      },
      {
        ask: 'What is missing on the dark side?',
        bg: 'night',
        base: [at('☀️', 16, 26, 14), at('🌍', 55, 55, 28), at('🏠', 76, 48, 12)],
        cards: [
          { icon: '☀️', label: 'A side facing the sun' },
          { icon: '🌑', label: 'The sun is gone' },
          { icon: '🔄', label: 'The sun goes around' },
        ],
      },
      {
        ask: 'What helps this tree have day?',
        bg: 'day',
        base: [at('☀️', 16, 26, 16), at('🌍', 58, 58, 24), at('🌳', 42, 46, 14), at('🌞', 80, 30, 12)],
        cards: [
          { icon: '🌳', label: 'Its side faces the sun' },
          { icon: '🌙', label: 'Its side is away' },
          { icon: '☁️', label: 'A cloud makes night' },
        ],
      },
      {
        ask: 'What caused night for the flower?',
        bg: 'night',
        base: [at('☀️', 16, 26, 14), at('🌍', 50, 55, 26), at('🌸', 74, 48, 12), at('🌙', 84, 30, 12)],
        cards: [
          { icon: '🌙', label: 'Its side is away' },
          { icon: '☀️', label: 'Its side faces the sun' },
          { icon: '💡', label: 'A lamp makes day' },
        ],
      },
      {
        ask: 'What keeps the sun at night?',
        bg: 'night',
        base: [at('☀️', 16, 26, 16), at('🌍', 55, 55, 26), at('🏠', 76, 48, 12), at('🌙', 84, 32, 14)],
        cards: [
          { icon: '☀️', label: 'The sun is still there' },
          { icon: '🌑', label: 'The sun went away' },
          { icon: '🌙', label: 'Night puts the sun out' },
        ],
      },
      {
        ask: 'Which part has day?',
        bg: 'cloudy',
        base: [at('☁️', 40, 16, 14), at('☀️', 16, 30, 14), at('🌍', 58, 56, 26), at('🏠', 42, 48, 10), at('🌞', 80, 34, 12)],
        cards: [
          { icon: '🏠', label: 'The side facing the sun' },
          { icon: '🌙', label: 'The side facing away' },
          { icon: '☁️', label: 'The cloud' },
        ],
      },
      {
        ask: 'What does this night need?',
        bg: 'night',
        base: [at('☀️', 78, 24, 14), at('🌍', 42, 55, 26), at('🐈', 28, 48, 12), at('🌙', 18, 28, 12)],
        cards: [
          { icon: '🌙', label: 'That side away from the sun' },
          { icon: '☀️', label: 'That side facing the sun' },
          { icon: '🔄', label: 'The sun must move around' },
        ],
      },
    ]),
  ],
};
