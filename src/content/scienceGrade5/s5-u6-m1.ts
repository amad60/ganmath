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
        // Bayangan panjang adalah bukti. Matahari rendah tidak digambar.
        ask: 'This shadow is long. What made it long?',
        bg: 'day',
        base: [at('🧍', 42, 52, 26), at('📏', 72, 74, 16), ground()],
        cards: [
          { icon: '🌅', label: 'A low sun made it' },
          { icon: '☀️', label: 'A high sun made it' },
          { icon: '🚫', label: 'Sun height does nothing' },
        ],
      },
      {
        ask: 'This shadow is short. Why is it short?',
        bg: 'day',
        base: [at('🧍', 50, 52, 26), at('▪️', 50, 80, 10), ground()],
        cards: [
          { icon: '☀️', label: 'A high sun made it' },
          { icon: '🌅', label: 'A low sun made it' },
          { icon: '📏', label: 'A high sun makes it long' },
        ],
      },
      {
        ask: 'The tree shadow is long. What caused it?',
        bg: 'day',
        base: [at('🌳', 40, 50, 28), at('📏', 72, 74, 16), ground()],
        cards: [
          { icon: '🌅', label: 'A low sun caused it' },
          { icon: '☀️', label: 'A high sun caused it' },
          { icon: '🌳', label: 'The tree grew taller' },
        ],
      },
      {
        ask: 'The house shadow is short. What keeps it short?',
        bg: 'day',
        base: [at('🏠', 50, 52, 28), at('▪️', 50, 80, 10), ground()],
        cards: [
          { icon: '☀️', label: 'A high sun keeps it short' },
          { icon: '🌅', label: 'A low sun keeps it short' },
          { icon: '🚫', label: 'Sun height does nothing' },
        ],
      },
      {
        ask: 'There is no shadow. Why is it missing?',
        bg: 'night',
        base: [at('🌙', 78, 18, 16), at('🧍', 50, 55, 26), ground()],
        cards: [
          { icon: '🚫', label: 'There is no sun' },
          { icon: '📏', label: 'Night makes a long shadow' },
          { icon: '🌅', label: 'A low sun is still up' },
        ],
      },
      {
        ask: 'The tower shadow is long. What did the sun do?',
        bg: 'day',
        base: [at('🗼', 48, 48, 26), at('📏', 74, 74, 16), ground()],
        cards: [
          { icon: '🌅', label: 'A low sun made it long' },
          { icon: '☀️', label: 'A high sun made it long' },
          { icon: '🚫', label: 'The sun removed the shadow' },
        ],
      },
      {
        ask: 'The flag shadow is short. What helps make it short?',
        bg: 'day',
        base: [at('🚩', 50, 48, 22), at('▪️', 50, 80, 10), ground()],
        cards: [
          { icon: '☀️', label: 'A high sun helps' },
          { icon: '🌅', label: 'A low sun helps' },
          { icon: '🌑', label: 'No sun helps' },
        ],
      },
      {
        ask: 'The shadow grew short. Why did that happen?',
        bg: 'day',
        base: [at('🧒', 50, 52, 26), at('▪️', 50, 80, 10), ground()],
        cards: [
          { icon: '⬆️', label: 'The sun moved high' },
          { icon: '🌅', label: 'The sun moved low' },
          { icon: '🧒', label: 'The child grew shorter' },
        ],
      },
    ]),
  ],
};
