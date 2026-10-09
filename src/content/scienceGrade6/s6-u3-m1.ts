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
      prompt: 'See this. See what changes.',
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
          { icon: '🌈', label: 'It grows big', caption: 'It grows big.' },
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
        bg: 'plain',
        base: [at('☀️', 14, 30, 16), at('🌍', 55, 55, 28), at('🏠', 40, 48, 12)],
        cards: [
          { icon: '🌞', label: 'It is day' },
          { icon: '🌙', label: 'It is night' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'plain',
        base: [at('☀️', 14, 30, 16), at('🌍', 50, 55, 28), at('🏠', 74, 50, 12)],
        cards: [
          { icon: '🌙', label: 'It is night' },
          { icon: '🌞', label: 'It is day' },
          { icon: '🔥', label: 'The sun goes out' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 18, 24, 16), at('🌍', 58, 55, 26), at('🧒', 42, 46, 12)],
        cards: [
          { icon: '🌞', label: 'It is day' },
          { icon: '🌙', label: 'It is night' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'plain',
        base: [at('☀️', 16, 26, 14), at('🌍', 52, 55, 28), at('🧒', 76, 48, 12)],
        cards: [
          { icon: '🌙', label: 'It is night' },
          { icon: '🌞', label: 'It is day' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('☁️', 40, 18, 14), at('☀️', 16, 30, 14), at('🌍', 62, 58, 24), at('🏠', 48, 50, 10)],
        cards: [
          { icon: '🌞', label: 'It is still day' },
          { icon: '🌙', label: 'It is night' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'plain',
        base: [at('☀️', 80, 24, 16), at('🌍', 42, 55, 28), at('🏠', 28, 48, 12)],
        cards: [
          { icon: '🌙', label: 'It is night' },
          { icon: '🌞', label: 'It is day' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
      {
        bg: 'plain',
        base: [at('☀️', 78, 26, 14), at('🌍', 40, 55, 26), at('🏠', 56, 46, 10)],
        cards: [
          { icon: '🌞', label: 'It is day' },
          { icon: '🌙', label: 'It is night' },
          { icon: '🌸', label: 'A flower comes' },
        ],
      },
      {
        bg: 'night',
        base: [at('💡', 70, 30, 14), at('🌍', 40, 55, 28), at('🏠', 58, 48, 12), at('☀️', 12, 24, 12)],
        cards: [
          { icon: '🌙', label: 'It is night' },
          { icon: '🌞', label: 'The lamp makes day' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
    ]),
  ],
};
