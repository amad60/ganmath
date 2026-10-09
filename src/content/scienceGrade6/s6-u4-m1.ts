import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const beakFitsFood: ContentModule = {
  id: 's6-u4-m1',
  unitId: 's6-u4',
  grade: 6,
  title: 'Beak Fits Food',
  icon: '🦢',
  prereq: ['s6-u3-m1'],
  skills: ['sci-beak'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['beak', 'long', 'short', 'flower', 'seed', 'eat', 'deep'],

  learn: [
    // Makanannya beda. Paruh panjang masuk bunga dalam. Paruh pendek makan biji.
    {
      stage: 'concrete',
      prompt: 'A long beak, or a short one.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('🌺', 28, 55, 22), at('🌰', 74, 68, 14), ground('green')],
        options: [
          {
            icon: '🦢',
            label: 'Long',
            caption: 'A long beak eats a deep flower.',
            result: [at('🦢', 40, 48, 26, { fx: 'pop' }), at('🌺', 24, 55, 18), ground('green')],
          },
          {
            icon: '🦜',
            label: 'Short',
            caption: 'A short beak eats a seed.',
            result: [at('🦜', 62, 50, 24, { fx: 'pop' }), at('🌰', 74, 70, 12), ground('green')],
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
        bg: 'day',
        base: [at('🌺', 50, 58, 28), ground('green')],
        options: [
          {
            icon: '🦢',
            label: 'The long beak eats',
            caption: 'The long beak eats.',
            result: [at('🦢', 58, 46, 28, { fx: 'pop' }), at('🌺', 36, 58, 20), ground('green')],
          },
          { icon: '🦜', label: 'The short beak eats', caption: 'The short beak eats.' },
          { icon: '🌈', label: 'It grows big', caption: 'It grows big.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A long beak eats a deep flower.',
      visual: {
        kind: 'evidence-text',
        title: 'Beak',
        sentences: [
          'A long beak eats a deep flower.',
          'A short beak eats a seed.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-beak', [
      {
        bg: 'day',
        base: [at('🌺', 50, 58, 28), ground('green')],
        cards: [
          { icon: '🦢', label: 'The long beak eats' },
          { icon: '🦜', label: 'The short beak eats' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌰', 50, 68, 18), ground('brown')],
        cards: [
          { icon: '🦜', label: 'The short beak eats' },
          { icon: '🦢', label: 'Only a long beak eats' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌷', 50, 55, 26), ground('green')],
        cards: [
          { icon: '🦢', label: 'The long beak eats' },
          { icon: '🐤', label: 'The short beak eats' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'day',
        base: [at('🥜', 50, 66, 16), ground('brown')],
        cards: [
          { icon: '🦜', label: 'The short beak eats' },
          { icon: '🦢', label: 'The long beak only' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌺', 36, 55, 22), at('🌺', 64, 58, 20), ground('green')],
        cards: [
          { icon: '🦢', label: 'The long beak eats' },
          { icon: '🦜', label: 'The short beak eats' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌾', 50, 62, 26), ground('green')],
        cards: [
          { icon: '🐤', label: 'The short beak eats' },
          { icon: '🦢', label: 'The long beak only' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌺', 40, 55, 24), at('🦜', 72, 52, 20), ground('green')],
        cards: [
          { icon: '🚫', label: 'It cannot eat' },
          { icon: '😋', label: 'It eats the flower' },
          { icon: '🌸', label: 'A new flower' },
        ],
      },
      {
        bg: 'water',
        base: [at('🐟', 50, 62, 18), at('🌊', 50, 78, 20)],
        cards: [
          { icon: '🦢', label: 'The long beak eats' },
          { icon: '🦜', label: 'The short beak eats' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
    ]),
  ],
};
