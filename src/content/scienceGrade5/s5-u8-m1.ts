import type { ContentModule } from '../types';
import { at, whatHappensNext } from '../scienceScene';

export const highOrLow: ContentModule = {
  id: 's5-u8-m1',
  unitId: 's5-u8',
  grade: 5,
  title: 'High or Low',
  icon: '🎸',
  prereq: ['s5-u7-m1'],
  skills: ['sci-pitch'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['tight', 'loose', 'string', 'high', 'low', 'sound'],

  learn: [
    // Talinya sama. Yang berubah ketegangannya: kencang bunyinya tinggi, kendor rendah.
    {
      stage: 'concrete',
      prompt: 'A tight string, or loose.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('🎸', 50, 55, 30)],
        options: [
          {
            icon: '💪',
            label: 'Tight',
            caption: 'Tight. The sound is high.',
            result: [at('🎸', 50, 52, 28), at('⬆️', 78, 28, 14, { fx: 'rise' })],
          },
          {
            icon: '〰️',
            label: 'Loose',
            caption: 'Loose. The sound is low.',
            result: [at('🎸', 50, 58, 26), at('⬇️', 78, 70, 14, { fx: 'fall' })],
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
        base: [at('〰️', 50, 55, 28)],
        options: [
          {
            icon: '⬇️',
            label: 'The sound is low',
            caption: 'The sound is low.',
            result: [at('〰️', 50, 55, 26), at('⬇️', 78, 68, 14, { fx: 'fall' })],
          },
          { icon: '⬆️', label: 'The sound is high', caption: 'The sound is high.' },
          { icon: '🌈', label: 'It grows big', caption: 'It grows big.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A tight string. A high sound.',
      visual: {
        kind: 'evidence-text',
        title: 'Sound',
        sentences: [
          'A tight string makes a high sound.',
          'A loose string makes a low sound.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-pitch', [
      {
        bg: 'room',
        base: [at('🎸', 46, 55, 26), at('💪', 78, 40, 14)],
        cards: [
          { icon: '⬆️', label: 'The sound is high' },
          { icon: '⬇️', label: 'The sound is low' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🎸', 50, 58, 26), at('〰️', 50, 36, 16)],
        cards: [
          { icon: '⬇️', label: 'The sound is low' },
          { icon: '⬆️', label: 'The sound is high' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'room',
        base: [at('🥁', 50, 55, 28), at('💪', 78, 36, 14)],
        cards: [
          { icon: '⬆️', label: 'The sound is high' },
          { icon: '⬇️', label: 'The sound is low' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'room',
        base: [at('🥁', 50, 58, 26), at('〰️', 72, 30, 14)],
        cards: [
          { icon: '⬇️', label: 'The sound is low' },
          { icon: '⬆️', label: 'The sound is high' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'plain',
        base: [at('➖', 50, 50, 20), at('💪', 80, 40, 14)],
        cards: [
          { icon: '⬆️', label: 'The sound is high' },
          { icon: '⬇️', label: 'The sound is low' },
          { icon: '🔔', label: 'A bell rings' },
        ],
      },
      {
        bg: 'plain',
        base: [at('〰️', 50, 52, 24)],
        cards: [
          { icon: '⬇️', label: 'The sound is low' },
          { icon: '⬆️', label: 'The sound is high' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🎸', 40, 55, 24), at('☝️', 70, 42, 16)],
        cards: [
          { icon: '⬆️', label: 'The sound is high' },
          { icon: '⬇️', label: 'The sound is low' },
          { icon: '🌸', label: 'A flower comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🫙', 36, 58, 20), at('〰️', 62, 48, 16)],
        cards: [
          { icon: '⬇️', label: 'The sound is low' },
          { icon: '⬆️', label: 'The sound is high' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
    ]),
  ],
};
