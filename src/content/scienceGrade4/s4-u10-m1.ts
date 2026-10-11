import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const oneLinkBreaks: ContentModule = {
  id: 's4-u10-m1',
  unitId: 's4-u10',
  grade: 4,
  title: 'One Link Breaks',
  icon: '🔗',
  prereq: ['s4-u9-m1'],
  skills: ['sci-link'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['plant', 'stay', 'go', 'rabbit', 'food', 'eater', 'fox'],

  learn: [
    // Rumput hilang, kelinci ikut pergi. Tebakan: rumput masih ada, kelinci tidak — rubah ikut pergi.
    {
      stage: 'concrete',
      prompt: 'The plants stay, or go.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('🐇', 62, 62, 20), ground('green')],
        options: [
          {
            icon: '🌱',
            label: 'Plants stay',
            caption: 'Plants stay. The rabbit stays.',
            result: [at('🌱', 32, 66, 18), at('😋', 64, 58, 22), ground('green')],
          },
          {
            icon: '💨',
            label: 'Plants go',
            caption: 'Plants go. The rabbit goes.',
            result: [at('💨', 64, 48, 18, { fx: 'slide-right' }), ground('yellow')],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'The rabbit has no food.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('🌱', 24, 68, 16), at('🦊', 64, 58, 22), ground('green')],
        options: [
          {
            icon: '💨',
            label: 'The fox goes',
            caption: 'No rabbits. The fox goes.',
            result: [at('🌱', 24, 68, 16), at('💨', 78, 46, 16, { fx: 'slide-right' }), ground('green')],
          },
          { icon: '🦊', label: 'The fox stays', caption: 'The fox stays.' },
          { icon: '🌳', label: 'It grows big', caption: 'It grows big.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'No food. The eater goes.',
      visual: {
        kind: 'evidence-text',
        title: 'Link',
        sentences: [
          'The food goes, and the eater goes too.',
          'Grass can stay, but if the rabbits go, the fox goes.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-link', [
      {
        bg: 'day',
        ask: 'Why did the rabbit go?',
        base: [at('🏜️', 50, 58, 28), ground('yellow')],
        cards: [
          { icon: '🌱', label: 'Grass food is gone' },
          { icon: '🚫', label: 'Breaks are fine' },
          { icon: '🐇', label: 'Needs no food' },
        ],
      },
      {
        bg: 'day',
        ask: 'What keeps the rabbit here?',
        base: [at('🌱', 30, 68, 16), at('🐇', 66, 60, 20), ground('green')],
        cards: [
          { icon: '🌿', label: 'Grass food is here' },
          { icon: '💨', label: 'The rabbit should go' },
          { icon: '🚫', label: 'Breaks are fine' },
        ],
      },
      {
        bg: 'day',
        ask: 'Why did the fox go?',
        base: [at('🌱', 32, 66, 18), at('🌱', 68, 70, 14), ground('green')],
        cards: [
          { icon: '🐇', label: 'Rabbit food is gone' },
          { icon: '🌿', label: 'Eats the grass' },
          { icon: '🚫', label: 'Breaks are fine' },
        ],
      },
      {
        bg: 'day',
        ask: 'What keeps the fox here?',
        base: [at('🌱', 20, 70, 14), at('🐇', 48, 62, 16), at('🦊', 76, 52, 20), ground('green')],
        cards: [
          { icon: '🍖', label: 'Still has rabbit food' },
          { icon: '🌿', label: 'Eats the grass' },
          { icon: '💨', label: 'Needs no food' },
        ],
      },
      {
        bg: 'day',
        ask: 'Why did the bee go?',
        base: [at('🌿', 50, 64, 22), ground('green')],
        cards: [
          { icon: '🌸', label: 'Flower food is gone' },
          { icon: '🐝', label: 'Needs no flower' },
          { icon: '🌱', label: 'Eats the grass' },
        ],
      },
      {
        bg: 'day',
        ask: 'What keeps the bee here?',
        base: [at('🌸', 32, 60, 18), at('🐝', 68, 46, 18), ground('green')],
        cards: [
          { icon: '🍯', label: 'Flower food is here' },
          { icon: '💨', label: 'The bee should go' },
          { icon: '🚫', label: 'Breaks are fine' },
        ],
      },
      {
        bg: 'water',
        ask: 'Why did the big fish go?',
        base: [at('🌊', 50, 62, 32)],
        cards: [
          { icon: '🦐', label: 'Small food is gone' },
          { icon: '🐟', label: 'The fish needs nothing' },
          { icon: '🍃', label: 'Water is food enough' },
        ],
      },
      {
        bg: 'water',
        ask: 'What made the big fish stay?',
        base: [at('🦐', 30, 58, 16), at('🐟', 68, 46, 22), at('🌊', 50, 80, 22)],
        cards: [
          { icon: '🍽️', label: 'Food link is here' },
          { icon: '💨', label: 'It should go anyway' },
          { icon: '💧', label: 'Eats the water' },
        ],
      },
    ]),
  ],
};
