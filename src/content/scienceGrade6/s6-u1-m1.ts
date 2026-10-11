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
          { icon: '🍎', label: 'Food is slow', caption: 'Food is slow.' },
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
        ask: 'You eat a meal.',
        bg: 'room',
        base: [at('🍽️', 28, 60, 16), at('🍎', 40, 48, 12), at('🧒', 66, 55, 22)],
        cards: [
          { icon: '⚡', label: 'You can run' },
          { icon: '🐢', label: 'You are slow' },
          { icon: '🚫', label: 'Food does nothing' },
        ],
      },
      {
        ask: 'The plate is empty. You do not eat.',
        bg: 'room',
        base: [at('🍽️', 30, 60, 18), at('🧒', 66, 55, 22)],
        cards: [
          { icon: '🐢', label: 'You are slow' },
          { icon: '⚡', label: 'You can run' },
          { icon: '🚫', label: 'Food does nothing' },
        ],
      },
      {
        ask: 'You eat an apple.',
        bg: 'day',
        base: [at('🍎', 26, 62, 14), at('🧒', 60, 52, 22)],
        cards: [
          { icon: '⚡', label: 'You can run' },
          { icon: '🐢', label: 'You are slow' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        ask: 'You have no food, and a ball is there.',
        bg: 'day',
        base: [at('🧒', 40, 55, 22), at('⚽', 72, 62, 14)],
        cards: [
          { icon: '🐢', label: 'You are slow' },
          { icon: '⚡', label: 'You can run' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        ask: 'You eat rice.',
        bg: 'room',
        base: [at('🍚', 30, 60, 16), at('🧒', 66, 54, 22)],
        cards: [
          { icon: '⚡', label: 'You can run' },
          { icon: '🐢', label: 'You are slow' },
          { icon: '🚫', label: 'Food does nothing' },
        ],
      },
      {
        ask: 'The rabbit eats plants.',
        bg: 'day',
        base: [at('🐇', 40, 60, 20), at('🌱', 70, 68, 14)],
        cards: [
          { icon: '⚡', label: 'It can run' },
          { icon: '🐢', label: 'It is slow' },
          { icon: '🚫', label: 'Food does nothing' },
        ],
      },
      {
        ask: 'The rabbit has no plants.',
        bg: 'day',
        base: [at('🐇', 50, 58, 24), at('🏜️', 24, 70, 16)],
        cards: [
          { icon: '🐢', label: 'It is slow' },
          { icon: '⚡', label: 'It can run' },
          { icon: '🚫', label: 'Food does nothing' },
        ],
      },
      {
        ask: 'You drink milk and eat bread.',
        bg: 'room',
        base: [at('🥛', 28, 60, 16), at('🍞', 42, 62, 14), at('🧒', 70, 52, 20)],
        cards: [
          { icon: '⚡', label: 'You can run' },
          { icon: '🐢', label: 'You are slow' },
          { icon: '🚫', label: 'Food does nothing' },
        ],
      },
    ]),
  ],
};
