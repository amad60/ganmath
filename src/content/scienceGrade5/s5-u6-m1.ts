import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const shadowGrowsShort: ContentModule = {
  id: 's5-u6-m1',
  unitId: 's5-u6',
  grade: 5,
  title: 'Shadow Grows Short',
  icon: '🌤️',
  prereq: ['s5-u5-m1'],
  skills: ['sci-shadowday'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['sun', 'shadow', 'long', 'short', 'low', 'high'],

  learn: [
    // Bendanya sama. Yang berubah tinggi mataharinya, jadi panjang bayangannya.
    {
      stage: 'concrete',
      prompt: 'A low sun, or a high sun.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('🧍', 50, 58, 28), ground()],
        options: [
          {
            icon: '🌅',
            label: 'Low',
            caption: 'A low sun. The shadow is long.',
            result: [at('🌅', 14, 62, 16), at('🧍', 50, 52, 26), at('📏', 72, 74, 18, { fx: 'slide-right' }), ground()],
          },
          {
            icon: '☀️',
            label: 'High',
            caption: 'A high sun. The shadow is short.',
            result: [at('☀️', 50, 12, 16), at('🧍', 50, 52, 26), at('▪️', 50, 78, 10), ground()],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'A low sun, or a high sun.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('☀️', 50, 12, 16), at('🌳', 50, 55, 30), ground()],
        options: [
          {
            icon: '▪️',
            label: 'The shadow is short',
            caption: 'The shadow is short.',
            result: [at('☀️', 50, 12, 14), at('🌳', 50, 52, 28), at('▪️', 50, 80, 10), ground()],
          },
          { icon: '📏', label: 'The shadow is long', caption: 'The shadow is long.' },
          { icon: '🚫', label: 'No shadow', caption: 'No shadow.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A high sun. A short shadow.',
      visual: {
        kind: 'evidence-text',
        title: 'Shadow',
        sentences: [
          'A low sun makes a long shadow.',
          'A high sun makes a short shadow.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-shadowday', [
      {
        ask: 'The sun is low.',
        bg: 'day',
        base: [at('🌅', 12, 58, 16), at('🧍', 55, 52, 26), ground()],
        cards: [
          { icon: '📏', label: 'The shadow is long' },
          { icon: '▪️', label: 'The shadow is short' },
          { icon: '🚫', label: 'Sun height does nothing' },
        ],
      },
      {
        ask: 'The sun is high.',
        bg: 'day',
        base: [at('☀️', 50, 10, 16), at('🧍', 50, 54, 26), ground()],
        cards: [
          { icon: '▪️', label: 'The shadow is short' },
          { icon: '📏', label: 'The shadow is long' },
          { icon: '🚫', label: 'Sun height does nothing' },
        ],
      },
      {
        ask: 'The sun is low behind the tree.',
        bg: 'day',
        base: [at('🌄', 88, 58, 16), at('🌳', 40, 52, 28), ground()],
        cards: [
          { icon: '📏', label: 'The shadow is long' },
          { icon: '▪️', label: 'The shadow is short' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        ask: 'It is night. There is no sun.',
        bg: 'night',
        base: [at('🌙', 80, 16, 16), at('🧍', 50, 55, 26), ground()],
        cards: [
          { icon: '🚫', label: 'No shadow' },
          { icon: '📏', label: 'A long shadow' },
          { icon: '❔', label: 'Sun height does nothing' },
        ],
      },
      {
        ask: 'The sun is low behind the house.',
        bg: 'day',
        base: [at('🌅', 10, 70, 14), at('🏠', 60, 52, 26), ground()],
        cards: [
          { icon: '📏', label: 'The shadow is long' },
          { icon: '▪️', label: 'The shadow is short' },
          { icon: '🚫', label: 'Sun height does nothing' },
        ],
      },
      {
        ask: 'The sun is high over the house.',
        bg: 'day',
        base: [at('☀️', 50, 8, 18), at('🏠', 50, 54, 28), ground()],
        cards: [
          { icon: '▪️', label: 'The shadow is short' },
          { icon: '📏', label: 'The shadow is long' },
          { icon: '🚫', label: 'Sun height does nothing' },
        ],
      },
      {
        ask: 'The sun is low behind the child.',
        bg: 'day',
        base: [at('🌅', 8, 48, 18), at('🧒', 48, 58, 22), ground()],
        cards: [
          { icon: '📏', label: 'The shadow is long' },
          { icon: '▪️', label: 'The shadow is short' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        ask: 'The sun is high, behind a thin cloud.',
        bg: 'cloudy',
        base: [at('☁️', 30, 18, 16), at('☀️', 62, 12, 14), at('🧍', 50, 56, 24), ground()],
        cards: [
          { icon: '▪️', label: 'The shadow is short' },
          { icon: '🚫', label: 'No shadow' },
          { icon: '❔', label: 'Sun height does nothing' },
        ],
      },
    ]),
  ],
};
