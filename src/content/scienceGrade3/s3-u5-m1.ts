import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

export const fallAndSlow: ContentModule = {
  id: 's3-u5-m1',
  unitId: 's3-u5',
  grade: 3,
  title: 'Falling and Slowing',
  icon: '🏀',
  prereq: ['s3-u4-m1'],
  skills: ['sci-fall'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['ball', 'fall', 'down', 'rough', 'slide', 'slow', 'smooth', 'far', 'go', 'goes', 'toy', 'fast', 'parachute', 'stay', 'stays', 'pick', 'drop'],

  learn: [
    // Bola, tinggi, dan kemiringannya sama; yang diubah hanya permukaan seluncurannya.
    // Bola di seluncuran licin mendarat jauh, di yang kasar berhenti dekat — jarak
    // itulah ukuran "melambat" yang bisa dilihat anak tanpa angka.
    {
      stage: 'concrete',
      prompt: 'Pick a smooth slide or a rough one.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [bar(30, 68, 52, 4, 'gray', { rotate: 32 }), at('⚽', 9, 42, 12), ground()],
        options: [
          {
            icon: '🧊',
            label: 'Smooth',
            caption: 'Smooth slide. The ball goes far.',
            result: [
              bar(30, 68, 52, 4, 'blue', { rotate: 32 }),
              at('⚽', 86, 80, 12, { fx: 'slide-right' }),
              ground(),
            ],
          },
          {
            icon: '🪨',
            label: 'Rough',
            caption: 'Rough slide. The ball slows down.',
            result: [
              bar(30, 68, 52, 4, 'brown', { rotate: 32 }),
              at('⚽', 34, 63, 12, { fx: 'slide-right' }),
              ground(),
            ],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    // Parasut: udara yang melambatkan jatuh. Hasilnya diam di tengah udara —
    // mainan yang masih melayang di sana itulah "pelan".
    {
      stage: 'pictorial',
      prompt: 'Drop a toy with a parachute. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('🪂', 50, 20, 20), ground()],
        options: [
          {
            icon: '🪂',
            label: 'It falls slow',
            caption: 'The parachute slows the fall.',
            result: [at('🪂', 50, 50, 20, { fx: 'fall' }), ground()],
          },
          { icon: '💥', label: 'It falls fast', caption: 'It falls fast.' },
          { icon: '⬆️', label: 'It goes up', caption: 'It goes up.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A rough slide slows the ball.',
      visual: {
        kind: 'evidence-text',
        title: 'Two slides',
        sentences: ['A smooth slide lets the ball race. A rough slide slows it.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-fall', [
      {
        bg: 'day',
        base: [at('✋', 50, 14, 14), at('🏀', 50, 32, 14), ground()],
        cards: [
          { icon: '⬇️', label: 'It falls down' },
          { icon: '⬆️', label: 'It goes up' },
          { icon: '🌸', label: 'It grows a flower' },
        ],
      },
      {
        bg: 'day',
        base: [bar(50, 86, 100, 10, 'blue'), at('⚽', 20, 74, 12), at('🧊', 80, 76, 10)],
        cards: [
          { icon: '💨', label: 'It slides far' },
          { icon: '🛑', label: 'It stops now' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'day',
        base: [bar(50, 86, 100, 12, 'green'), at('⚽', 20, 74, 12), at('🌾', 50, 76, 14)],
        cards: [
          { icon: '🐌', label: 'It slows down' },
          { icon: '🚀', label: 'It goes faster' },
          { icon: '🪽', label: 'It flies' },
        ],
      },
      {
        bg: 'day',
        base: [at('🪶', 50, 18, 16), ground()],
        cards: [
          { icon: '🍃', label: 'It floats down slow' },
          { icon: '💥', label: 'It falls fast' },
          { icon: '🚀', label: 'It goes up' },
        ],
      },
      {
        bg: 'cloudy',
        base: [bar(34, 58, 60, 4, 'white', { rotate: 28 }), at('🛷', 14, 36, 14), ground('white')],
        cards: [
          { icon: '🛷', label: 'It slides down' },
          { icon: '⬆️', label: 'It goes up' },
          { icon: '🌧️', label: 'It rains' },
        ],
      },
    
      {
        bg: 'day',
        base: [at('📗', 50, 36, 22)],
        cards: [
          { icon: '⬇️', label: 'It falls down' },
          { icon: '⬆️', label: 'It goes up' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'day',
        base: [at('⚽', 50, 40, 18), at('🧊', 50, 74, 28)],
        cards: [
          { icon: '💨', label: 'It goes fast' },
          { icon: '🐌', label: 'It goes slow' },
          { icon: '🌱', label: 'It grows' },
        ],
      },
      {
        bg: 'day',
        base: [at('⚽', 50, 40, 18), at('🟫', 50, 76, 30)],
        cards: [
          { icon: '🐌', label: 'It goes slow' },
          { icon: '💨', label: 'It goes fast' },
          { icon: '🐦', label: 'It flies up' },
        ],
      },
    ]),
  ],
};
