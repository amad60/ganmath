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
  questionTypes: ['pick-picture'],
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
          { icon: '☀️', label: 'It is not night', caption: 'It is not night.' },
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
    whatHappensNext('sci-day-night', [
      {
        ask: 'It is bright outside. What made it bright?',
        bg: 'day',
        base: [at('🏠', 50, 68, 26), at('🐦', 24, 36, 12), ground()],
        cards: [
          { icon: '☀️', label: 'The sun' },
          { icon: '🌙', label: 'The moon' },
          { icon: '⭐', label: 'The stars' },
        ],
      },
      {
        ask: 'The sky is dark. Why is it night?',
        bg: 'night',
        base: [at('🏠', 48, 68, 26), ground('gray')],
        cards: [
          { icon: '🌅', label: 'The sun is down' },
          { icon: '🌙', label: 'The moon left' },
          { icon: '☁️', label: 'Clouds hid it' },
        ],
      },
      {
        ask: 'We can see stars. Why is the sky dark?',
        bg: 'night',
        base: [at('⭐', 28, 22, 10), at('⭐', 52, 16, 8), at('⭐', 74, 28, 8)],
        cards: [
          { icon: '🌇', label: 'The sun is down' },
          { icon: '🌕', label: 'The moon shines' },
          { icon: '🌧️', label: 'Rain fell' },
        ],
      },
      {
        ask: 'It is day. What made the day bright?',
        bg: 'day',
        base: [at('🧒', 40, 66, 24), at('⚽', 68, 74, 14), ground()],
        cards: [
          { icon: '☀️', label: 'The sun' },
          { icon: '🌙', label: 'The moon' },
          { icon: '💡', label: 'A lamp' },
        ],
      },
      {
        ask: 'The goat sleeps. Why is it dark out?',
        bg: 'night',
        base: [at('🐐', 48, 66, 26), at('😴', 70, 48, 12)],
        cards: [
          { icon: '🌅', label: 'The sun is down' },
          { icon: '🙈', label: 'The goat hides' },
          { icon: '☁️', label: 'Clouds came' },
        ],
      },
      {
        ask: 'The plant looks bright. What caused that?',
        bg: 'day',
        base: [at('🌻', 50, 58, 30), ground()],
        cards: [
          { icon: '☀️', label: 'The sun' },
          { icon: '💡', label: 'A lamp' },
          { icon: '⭐', label: 'The stars' },
        ],
      },
      {
        ask: 'What helps us know this is night?',
        bg: 'night',
        base: [at('🏠', 50, 68, 26), at('🛏️', 28, 62, 16), ground('gray')],
        cards: [
          { icon: '🌙', label: 'The moon' },
          { icon: '☀️', label: 'The sun' },
          { icon: '☁️', label: 'A cloud' },
        ],
      },
      {
        ask: 'We can see the cup. What made it bright?',
        bg: 'day',
        base: [at('☕', 50, 62, 26)],
        cards: [
          { icon: '☀️', label: 'The sun' },
          { icon: '🌕', label: 'The moon shines' },
          { icon: '☁️', label: 'A cloud' },
        ],
      },
    ]),
  ],
};
