import type { ContentModule } from '../types';
import { at, whatHappensNext } from '../scienceScene';

export const leftBehind: ContentModule = {
  id: 's5-u3-m1',
  unitId: 's5-u3',
  grade: 5,
  title: 'Left Behind',
  icon: '🧂',
  prereq: ['s5-u2-m1'],
  skills: ['sci-salt'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['salt', 'water', 'dry', 'stay', 'sun'],

  learn: [
    // Airnya pergi. Garamnya tidak ikut hilang — tertinggal di piring.
    {
      stage: 'concrete',
      prompt: 'Dry the salt water, or not.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('🥣', 50, 58, 28)],
        options: [
          {
            icon: '☀️',
            label: 'Dry',
            caption: 'The water goes. Salt stays.',
            result: [at('☀️', 80, 16, 14), at('🥣', 50, 58, 26), at('🧂', 50, 52, 14, { fx: 'pop' })],
          },
          {
            icon: '🧢',
            label: 'Not dry',
            caption: 'The salt water stays.',
            result: [at('🧢', 50, 40, 16), at('🥣', 50, 60, 26), at('💧', 50, 56, 12)],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'Dry the salt water.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('☀️', 80, 16, 16), at('🥣', 50, 60, 26), at('💧', 50, 54, 12)],
        options: [
          {
            icon: '🧂',
            label: 'Salt stays',
            caption: 'Salt stays.',
            result: [at('☀️', 80, 16, 14), at('🥣', 50, 60, 24), at('🧂', 50, 52, 14, { fx: 'pop' })],
          },
          { icon: '✨', label: 'It all goes', caption: 'It all goes.' },
          { icon: '💧', label: 'Water stays', caption: 'Water stays.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Water goes. Salt stays.',
      visual: {
        kind: 'evidence-text',
        title: 'Salt',
        sentences: [
          'When salt water dries, the salt is left behind.',
          'Plain water dries, and nothing is left.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-salt', [
      {
        ask: 'Salt water dries in the sun.',
        bg: 'day',
        base: [at('☀️', 80, 16, 16), at('🥣', 50, 60, 26), at('💧', 50, 54, 10)],
        cards: [
          { icon: '🧂', label: 'Salt is left' },
          { icon: '✨', label: 'It all goes' },
          { icon: '🚫', label: 'Drying makes new salt' },
        ],
      },
      {
        ask: 'The bowl is covered, so it cannot dry.',
        bg: 'room',
        base: [at('🧢', 50, 38, 16), at('🥣', 50, 62, 24)],
        cards: [
          { icon: '💧', label: 'The salt water stays' },
          { icon: '🧂', label: 'Only salt is left' },
          { icon: '🚫', label: 'Drying makes new salt' },
        ],
      },
      {
        ask: 'Sugar water dries in the sun.',
        bg: 'day',
        base: [at('☀️', 78, 16, 14), at('🥛', 50, 58, 24)],
        cards: [
          { icon: '🍬', label: 'Sugar is left' },
          { icon: '✨', label: 'It all goes' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        ask: 'Plain water dries in the sun.',
        bg: 'day',
        base: [at('☀️', 80, 16, 16), at('🥣', 50, 60, 26)],
        cards: [
          { icon: '🚫', label: 'Nothing is left' },
          { icon: '🧂', label: 'Salt is left' },
          { icon: '❔', label: 'Drying makes new salt' },
        ],
      },
      {
        ask: 'Wind and sun dry the salt water.',
        bg: 'day',
        base: [at('🌬️', 20, 30, 16), at('☀️', 80, 16, 14), at('🥣', 50, 62, 22)],
        cards: [
          { icon: '🧂', label: 'Salt is left' },
          { icon: '💧', label: 'The water stays' },
          { icon: '🚫', label: 'Drying makes new salt' },
        ],
      },
      {
        ask: 'It is night, and the bowl is covered.',
        bg: 'night',
        base: [at('🌙', 80, 16, 14), at('🧢', 50, 42, 16), at('🥣', 50, 64, 24)],
        cards: [
          { icon: '💧', label: 'The salt water stays' },
          { icon: '🧂', label: 'Only salt is left' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        ask: 'Two suns dry the salt water.',
        bg: 'day',
        base: [at('☀️', 18, 16, 12), at('☀️', 82, 18, 14), at('🥣', 50, 62, 28)],
        cards: [
          { icon: '🧂', label: 'Salt is left' },
          { icon: '✨', label: 'Salt goes too' },
          { icon: '🚫', label: 'Drying makes new salt' },
        ],
      },
      {
        ask: 'Salt water dries on a rock.',
        bg: 'day',
        base: [at('🪨', 50, 62, 28), at('☀️', 80, 16, 14), at('💧', 50, 48, 12)],
        cards: [
          { icon: '🧂', label: 'Salt is left on it' },
          { icon: '✨', label: 'Nothing is left' },
          { icon: '🚫', label: 'Drying makes new salt' },
        ],
      },
    ]),
  ],
};
