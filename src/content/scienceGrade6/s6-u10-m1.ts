import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const afterYouRun: ContentModule = {
  id: 's6-u10-m1',
  unitId: 's6-u10',
  grade: 6,
  title: 'After You Run',
  icon: '🌬️',
  prereq: ['s6-u9-m1'],
  skills: ['sci-breath'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['run', 'breath', 'slow', 'sit'],

  learn: [
    // Setelah lari, napas cepat. Duduk, napas lambat.
    {
      stage: 'concrete',
      prompt: 'Run, or sit.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('🧒', 50, 58, 26), ground('green')],
        options: [
          {
            icon: '🏃',
            label: 'Run',
            caption: 'You run. Breaths are fast.',
            result: [at('🏃', 46, 55, 26), at('🌬️', 76, 32, 16, { fx: 'pulse' }), ground('green')],
          },
          {
            icon: '🪑',
            label: 'Sit',
            caption: 'You sit. Breaths are slow.',
            result: [at('🪑', 50, 66, 20), at('🧒', 50, 48, 20), at('😴', 76, 30, 14), ground('green')],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'Run, or sit.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('😓', 50, 55, 28), ground('green')],
        options: [
          {
            icon: '🌬️',
            label: 'Breaths are fast',
            caption: 'Breaths are fast.',
            result: [at('😓', 46, 55, 24), at('🌬️', 76, 32, 16, { fx: 'pulse' }), ground('green')],
          },
          { icon: '😴', label: 'Breaths are slow', caption: 'Breaths are slow.' },
          { icon: '🚶', label: 'You run slow', caption: 'You run slow.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'You run. Breaths are fast.',
      visual: {
        kind: 'evidence-text',
        title: 'Breath',
        sentences: [
          'You run, and breaths are fast.',
          'You sit, and breaths are slow.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-breath', [
      {
        ask: 'You have just been running.',
        bg: 'day',
        base: [at('🏃', 50, 55, 28), ground('green')],
        cards: [
          { icon: '🌬️', label: 'Breaths are fast' },
          { icon: '😴', label: 'Breaths are slow' },
          { icon: '🚫', label: 'Breath stays the same' },
        ],
      },
      {
        ask: 'You are sitting still.',
        bg: 'room',
        base: [at('🪑', 46, 64, 20), at('🧒', 50, 46, 20)],
        cards: [
          { icon: '😴', label: 'Breaths are slow' },
          { icon: '🌬️', label: 'Breaths are fast' },
          { icon: '🚫', label: 'Breath stays the same' },
        ],
      },
      {
        ask: 'The dog has just been running.',
        bg: 'day',
        base: [at('🐕', 46, 58, 24), at('💨', 72, 48, 14), ground('green')],
        cards: [
          { icon: '🌬️', label: 'Breaths are fast' },
          { icon: '😴', label: 'Breaths are slow' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        ask: 'The dog is resting at night.',
        bg: 'night',
        base: [at('🐕', 50, 62, 24), at('🌙', 80, 18, 14), ground('green')],
        cards: [
          { icon: '😴', label: 'Breaths are slow' },
          { icon: '🌬️', label: 'Breaths are fast' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        ask: 'You just finished a race.',
        bg: 'day',
        base: [at('😓', 42, 52, 22), at('🏅', 72, 40, 14), ground('green')],
        cards: [
          { icon: '🌬️', label: 'Breaths are fast' },
          { icon: '😴', label: 'Breaths are slow' },
          { icon: '🚫', label: 'Breath stays the same' },
        ],
      },
      {
        ask: 'You are sitting and reading.',
        bg: 'room',
        base: [at('📕', 30, 58, 16), at('🪑', 58, 64, 18), at('🧒', 58, 46, 18)],
        cards: [
          { icon: '😴', label: 'Breaths are slow' },
          { icon: '🌬️', label: 'Breaths are fast' },
          { icon: '🚫', label: 'Breath stays the same' },
        ],
      },
      {
        ask: 'You have just been playing.',
        bg: 'day',
        base: [at('🧒', 36, 55, 20), at('⚽', 68, 58, 14), ground('green')],
        cards: [
          { icon: '🌬️', label: 'Breaths are fast' },
          { icon: '😴', label: 'Breaths are slow' },
          { icon: '🚫', label: 'Breath stays the same' },
        ],
      },
      {
        ask: 'You are standing quietly.',
        bg: 'day',
        base: [at('🧒', 50, 58, 22), at('🌱', 28, 70, 12), ground('green')],
        cards: [
          { icon: '😴', label: 'Breaths are slow' },
          { icon: '🌬️', label: 'Breaths are fast' },
          { icon: '🚫', label: 'Breath stays the same' },
        ],
      },
    ]),
  ],
};
