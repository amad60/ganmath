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
          { icon: '🛑', label: 'It stops in the air', caption: 'It stops in the air.' },
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
        ask: 'Why did this ball go far?',
        bg: 'day',
        base: [bar(30, 68, 52, 4, 'blue', { rotate: 32 }), at('⚽', 86, 80, 12), ground()],
        cards: [
          { icon: '🧊', label: 'A smooth slide' },
          { icon: '🪨', label: 'A rough slide' },
          { icon: '🐢', label: 'Rough is faster' },
        ],
      },
      {
        ask: 'What made this ball slow?',
        bg: 'day',
        base: [bar(30, 68, 52, 4, 'brown', { rotate: 32 }), at('⚽', 26, 56, 12), ground()],
        cards: [
          { icon: '🪨', label: 'A rough slide' },
          { icon: '🧊', label: 'A smooth slide' },
          { icon: '⚖️', label: 'The ball is heavy' },
        ],
      },
      {
        ask: 'What helps this sled go far?',
        bg: 'cloudy',
        base: [bar(34, 58, 60, 4, 'white', { rotate: 28 }), at('🛷', 80, 78, 16), ground('white')],
        cards: [
          { icon: '❄️', label: 'Smooth snow' },
          { icon: '🪨', label: 'Rough snow' },
          { icon: '🛑', label: 'The sled cannot slide' },
        ],
      },
      {
        ask: 'What caused this car to slow?',
        bg: 'day',
        base: [at('🪨', 40, 80, 14), at('🪨', 62, 82, 12), at('🚗', 22, 64, 16), ground('gray')],
        cards: [
          { icon: '🟫', label: 'Rough ground' },
          { icon: '🧊', label: 'Smooth ground' },
          { icon: '🚗', label: 'A light car stops' },
        ],
      },
      {
        ask: 'What keeps this marble fast?',
        bg: 'room',
        base: [bar(50, 82, 90, 6, 'gray'), at('⚪', 86, 72, 10)],
        cards: [
          { icon: '🪵', label: 'A smooth floor' },
          { icon: '🪨', label: 'A rough floor' },
          { icon: '🛑', label: 'It cannot roll' },
        ],
      },
      {
        ask: 'Which part slowed this ball?',
        bg: 'day',
        base: [at('🌾', 46, 78, 16), at('🌾', 68, 80, 14), at('⚽', 24, 64, 14), ground()],
        cards: [
          { icon: '🟫', label: 'Rough grass' },
          { icon: '🧊', label: 'A smooth path' },
          { icon: '💨', label: 'The air under it' },
        ],
      },
      {
        ask: 'Why did this book slow?',
        bg: 'day',
        base: [ground('brown'), at('📗', 22, 70, 16)],
        cards: [
          { icon: '🧶', label: 'A rough carpet' },
          { icon: '🧊', label: 'A smooth carpet' },
          { icon: '📗', label: 'The book is round' },
        ],
      },
      {
        ask: 'What is missing on this slide?',
        bg: 'day',
        base: [bar(30, 68, 52, 4, 'brown', { rotate: 32 }), at('⚽', 24, 54, 12), ground()],
        cards: [
          { icon: '🧊', label: 'A smooth surface' },
          { icon: '🪨', label: 'A rougher path' },
          { icon: '🏀', label: 'A heavier ball' },
        ],
      },
    ]),
  ],
};
