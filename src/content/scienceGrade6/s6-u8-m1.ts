import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const warmAndWetRots: ContentModule = {
  id: 's6-u8-m1',
  unitId: 's6-u8',
  grade: 6,
  title: 'Warm and Wet Rots',
  icon: '🍎',
  prereq: ['s6-u7-m1'],
  skills: ['sci-rotfast'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['warm', 'wet', 'apple', 'rot', 'cold', 'dry', 'stay'],

  learn: [
    // Apelnya sama. Hangat dan basah: busuk. Dingin dan kering: tetap.
    {
      stage: 'concrete',
      prompt: 'Warm and wet, or cold.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('🍎', 50, 58, 26)],
        options: [
          {
            icon: '💧',
            label: 'Warm wet',
            caption: 'Warm and wet. The apple rots.',
            result: [at('☀️', 80, 18, 12), at('💧', 30, 40, 12), at('🍂', 50, 58, 26, { fx: 'fade' })],
          },
          {
            icon: '❄️',
            label: 'Cold dry',
            caption: 'Cold and dry. The apple stays.',
            result: [at('❄️', 80, 18, 14), at('🍎', 50, 58, 26), at('✅', 28, 36, 12)],
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
        bg: 'room',
        base: [at('☀️', 80, 16, 14), at('💧', 28, 36, 12), at('🍎', 50, 58, 24)],
        options: [
          {
            icon: '🍂',
            label: 'The apple rots',
            caption: 'The apple rots.',
            result: [at('☀️', 80, 16, 12), at('💧', 28, 36, 10), at('🍂', 50, 58, 24, { fx: 'fade' })],
          },
          { icon: '✅', label: 'The apple stays', caption: 'The apple stays.' },
          { icon: '🌈', label: 'It grows big', caption: 'It grows big.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Warm and wet. The apple rots.',
      visual: {
        kind: 'evidence-text',
        title: 'Rots',
        sentences: [
          'Warm and wet, and the apple rots.',
          'Cold and dry, and the apple stays.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-rotfast', [
      {
        bg: 'room',
        base: [at('☀️', 80, 16, 14), at('💧', 26, 36, 12), at('🍎', 50, 58, 24)],
        cards: [
          { icon: '🍂', label: 'The apple rots' },
          { icon: '✅', label: 'The apple stays' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('❄️', 80, 16, 14), at('🍎', 50, 58, 24)],
        cards: [
          { icon: '✅', label: 'The apple stays' },
          { icon: '🍂', label: 'The apple rots' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'room',
        base: [at('☀️', 78, 16, 12), at('💧', 24, 34, 12), at('🍞', 50, 58, 22)],
        cards: [
          { icon: '🍂', label: 'The bread rots' },
          { icon: '✅', label: 'The bread stays' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'room',
        base: [at('❄️', 78, 16, 14), at('🍞', 50, 58, 22)],
        cards: [
          { icon: '✅', label: 'The bread stays' },
          { icon: '🍂', label: 'The bread rots' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 80, 16, 12), at('💧', 28, 40, 10), at('🍃', 50, 60, 20), ground('brown')],
        cards: [
          { icon: '🍂', label: 'The leaf rots' },
          { icon: '✅', label: 'The leaf stays' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'room',
        base: [at('❄️', 78, 18, 14), at('🍃', 50, 58, 22)],
        cards: [
          { icon: '✅', label: 'The leaf stays' },
          { icon: '🍂', label: 'The leaf rots' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 80, 16, 16), at('🍎', 50, 58, 24)],
        cards: [
          { icon: '✅', label: 'The apple stays' },
          { icon: '🍂', label: 'The apple rots' },
          { icon: '🌸', label: 'A flower comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('❄️', 78, 18, 14), at('💧', 26, 40, 12), at('🍎', 50, 58, 22)],
        cards: [
          { icon: '✅', label: 'The apple stays' },
          { icon: '🍂', label: 'The apple rots' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
    ]),
  ],
};
