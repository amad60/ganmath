import type { ContentModule } from '../types';
import { at, whatHappensNext } from '../scienceScene';

export const foodIsFuel: ContentModule = {
  id: 's6-u1-m1',
  unitId: 's6-u1',
  grade: 6,
  title: 'Food Is Fuel',
  icon: '🍎',
  prereq: [],
  skills: ['sci-fuel'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['food', 'run', 'slow', 'eat'],

  learn: [
    // Makanan adalah bahan bakar. Piring penuh: bisa lari. Piring kosong: lambat.
    {
      stage: 'concrete',
      prompt: 'Eat food, or not.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('🧒', 50, 58, 26)],
        options: [
          {
            icon: '🍎',
            label: 'Food',
            caption: 'Food in. You can run.',
            result: [at('🍎', 28, 62, 14), at('🧒', 50, 50, 22), at('⚡', 76, 32, 16, { fx: 'pop' })],
          },
          {
            icon: '🍽️',
            label: 'No food',
            caption: 'No food. You are slow.',
            result: [at('🍽️', 28, 62, 16), at('🧒', 50, 56, 24), at('🐢', 78, 58, 16, { fx: 'fade' })],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'Eat food, or not.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('🍽️', 30, 62, 18), at('🧒', 62, 55, 24)],
        options: [
          {
            icon: '🐢',
            label: 'You are slow',
            caption: 'You are slow.',
            result: [at('🍽️', 28, 62, 16), at('🐢', 64, 58, 22, { fx: 'fade' })],
          },
          { icon: '⚡', label: 'You can run', caption: 'You can run.' },
          { icon: '🍎', label: 'You eat and are slow', caption: 'You eat and are slow.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Food in. You can run.',
      visual: {
        kind: 'evidence-text',
        title: 'Food',
        sentences: [
          'Eat food, and you can run.',
          'No food, and you are slow.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-fuel', [
      {
        ask: 'Why can you run?',
        bg: 'day',
        base: [at('🧒', 46, 55, 24), at('⚡', 74, 34, 16)],
        cards: [
          { icon: '🍎', label: 'You ate food' },
          { icon: '🍽️', label: 'You had no food' },
          { icon: '🚫', label: 'Food does nothing' },
        ],
      },
      {
        ask: 'What is missing?',
        bg: 'room',
        base: [at('🍽️', 30, 62, 16), at('🧒', 58, 56, 22), at('🐢', 80, 58, 14)],
        cards: [
          { icon: '🍎', label: 'Food' },
          { icon: '⚡', label: 'You can still run' },
          { icon: '🐢', label: 'Eating makes you slow' },
        ],
      },
      {
        ask: 'What made you able to run?',
        bg: 'room',
        base: [at('🧒', 50, 54, 24), at('⚡', 78, 32, 14)],
        cards: [
          { icon: '🍚', label: 'Rice you ate' },
          { icon: '🍽️', label: 'An empty plate' },
          { icon: '🚫', label: 'The meal did nothing' },
        ],
      },
      {
        ask: 'What helps a horse run?',
        bg: 'day',
        base: [at('🐎', 48, 56, 26), at('⚡', 78, 34, 14)],
        cards: [
          { icon: '🌾', label: 'Grass it ate' },
          { icon: '🏜️', label: 'No food at all' },
          { icon: '🐢', label: 'Food makes it slow' },
        ],
      },
      {
        ask: 'What does the dog need?',
        bg: 'day',
        base: [at('🐕', 48, 58, 24), at('🐢', 78, 58, 14)],
        cards: [
          { icon: '🦴', label: 'Food to eat' },
          { icon: '⚡', label: 'It can still run' },
          { icon: '🚫', label: 'Food does nothing' },
        ],
      },
      {
        ask: 'What caused the slow steps?',
        bg: 'room',
        base: [at('🧒', 50, 56, 24), at('🐢', 78, 56, 16)],
        cards: [
          { icon: '🍽️', label: 'No food' },
          { icon: '🍎', label: 'A big meal' },
          { icon: '⚡', label: 'Meal slows you' },
        ],
      },
      {
        ask: 'What did eating do?',
        bg: 'room',
        base: [at('🧒', 46, 54, 22), at('⚡', 76, 32, 16)],
        cards: [
          { icon: '🏃', label: 'Let you run' },
          { icon: '🐢', label: 'It made you slow' },
          { icon: '🚫', label: 'It changed nothing' },
        ],
      },
      {
        ask: 'What keeps a rabbit running?',
        bg: 'day',
        base: [at('🐇', 48, 58, 22), at('⚡', 76, 36, 14)],
        cards: [
          { icon: '🌱', label: 'Plants it ate' },
          { icon: '🏜️', label: 'No plants to eat' },
          { icon: '🐢', label: 'Plants make it slow' },
        ],
      },
    ]),
  ],
};
