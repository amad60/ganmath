import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

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
        // Mangkuk kering masih ada garam. Airnya yang pergi.
        ask: 'Why is the salt still there?',
        bg: 'day',
        base: [at('☀️', 80, 16, 14), at('🥣', 50, 62, 26), at('🧂', 50, 54, 14)],
        cards: [
          { icon: '💧', label: 'The water left the salt' },
          { icon: '✨', label: 'The salt vanished' },
          { icon: '☀️', label: 'The sun destroyed the salt' },
        ],
      },
      {
        ask: 'The bowl is still wet. What is missing?',
        bg: 'room',
        base: [at('🧢', 50, 40, 16), at('🥣', 50, 62, 24), at('💧', 50, 56, 12)],
        cards: [
          { icon: '☀️', label: 'Drying is missing' },
          { icon: '✨', label: 'The salt vanished' },
          { icon: '🧢', label: 'The cover removes the salt' },
        ],
      },
      {
        // Gula, sama seperti garam: air pergi, gula tertinggal.
        ask: 'What did drying do to the sugar water?',
        bg: 'day',
        base: [at('☀️', 80, 16, 14), at('🥣', 50, 62, 26), at('⚪', 50, 52, 10)],
        cards: [
          { icon: '🍬', label: 'The sugar is left behind' },
          { icon: '✨', label: 'The sugar vanished' },
          { icon: '🧂', label: 'Drying left salt instead' },
        ],
      },
      {
        ask: 'Why is nothing left in the bowl?',
        bg: 'day',
        base: [at('☀️', 80, 16, 14), at('🥣', 50, 62, 26)],
        cards: [
          { icon: '🚫', label: 'Plain water leaves nothing' },
          { icon: '🧂', label: 'Drying made new salt' },
          { icon: '💧', label: 'The water is still hiding' },
        ],
      },
      {
        ask: 'What caused the salt on the rock?',
        bg: 'day',
        base: [at('☀️', 80, 16, 14), at('🪨', 50, 64, 28), at('⚪', 50, 52, 10), ground('brown')],
        cards: [
          { icon: '🌊', label: 'Salt water dried on it' },
          { icon: '🪨', label: 'The rock turned into salt' },
          { icon: '✨', label: 'The salt vanished anyway' },
        ],
      },
      {
        ask: 'What keeps the salt from vanishing?',
        bg: 'day',
        base: [at('🥣', 50, 62, 26), at('🧂', 50, 52, 14)],
        cards: [
          { icon: '💧', label: 'Only the water goes' },
          { icon: '✨', label: 'Salt goes with the water' },
          { icon: '🔥', label: 'Heat destroys the salt' },
        ],
      },
      {
        ask: 'What made the salt stay?',
        bg: 'day',
        base: [at('🌬️', 18, 28, 16), at('☀️', 80, 16, 14), at('🥣', 50, 62, 24), at('🧂', 50, 52, 12)],
        cards: [
          { icon: '📤', label: 'Water went and salt stayed' },
          { icon: '🌬️', label: 'The wind took the salt' },
          { icon: '✨', label: 'Nothing solid can stay' },
        ],
      },
      {
        ask: 'Which part of the salt water is left?',
        bg: 'day',
        base: [at('☀️', 80, 16, 14), at('🥣', 50, 62, 26), at('🧂', 50, 52, 14)],
        cards: [
          { icon: '⚪', label: 'The salt part' },
          { icon: '💧', label: 'The water part' },
          { icon: '✨', label: 'No part is left' },
        ],
      },
    ]),
  ],
};
