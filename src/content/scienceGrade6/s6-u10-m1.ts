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
          { icon: '🚫', label: 'Run is the same', caption: 'Run is the same.' },
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
        ask: 'Why are breaths fast?',
        bg: 'day',
        base: [at('🏃', 48, 55, 26), at('🌬️', 76, 32, 16), ground('green')],
        cards: [
          { icon: '🏃', label: 'You were running' },
          { icon: '🪑', label: 'You were sitting' },
          { icon: '🚫', label: 'Running changes nothing' },
        ],
      },
      {
        ask: 'What keeps breaths slow?',
        bg: 'room',
        base: [at('🪑', 48, 64, 18), at('🧒', 50, 46, 20), at('😴', 78, 30, 14)],
        cards: [
          { icon: '🪑', label: 'You are sitting' },
          { icon: '🏃', label: 'You were running' },
          { icon: '🌬️', label: 'Sitting makes breaths fast' },
        ],
      },
      {
        ask: 'What made its breaths fast?',
        bg: 'day',
        base: [at('🐕', 46, 58, 24), at('🌬️', 76, 36, 14), ground('green')],
        cards: [
          { icon: '🐕', label: 'It was running' },
          { icon: '😴', label: 'It was resting' },
          { icon: '🚫', label: 'Running changes nothing' },
        ],
      },
      {
        ask: 'What caused the slow breaths?',
        bg: 'night',
        base: [at('🐕', 50, 62, 24), at('😴', 78, 32, 14), ground('green')],
        cards: [
          { icon: '🐕', label: 'It is resting' },
          { icon: '🏃', label: 'It was running' },
          { icon: '🌬️', label: 'Rest makes breaths fast' },
        ],
      },
      {
        ask: 'What did the race do?',
        bg: 'day',
        base: [at('😓', 42, 52, 22), at('🌬️', 72, 32, 14), at('🏅', 78, 48, 12), ground('green')],
        cards: [
          { icon: '🌬️', label: 'It made breaths fast' },
          { icon: '😴', label: 'It made breaths slow' },
          { icon: '🚫', label: 'A race changes nothing' },
        ],
      },
      {
        ask: 'What helps breaths stay slow?',
        bg: 'room',
        base: [at('📕', 30, 58, 14), at('🪑', 58, 64, 16), at('🧒', 58, 46, 18), at('😴', 80, 30, 12)],
        cards: [
          { icon: '🪑', label: 'Sitting still' },
          { icon: '🏃', label: 'Running instead' },
          { icon: '🌬️', label: 'Reading makes breaths fast' },
        ],
      },
      {
        ask: 'What is missing for slow breaths?',
        bg: 'day',
        base: [at('🧒', 40, 54, 20), at('⚽', 68, 60, 14), at('🌬️', 78, 32, 12), ground('green')],
        cards: [
          { icon: '🪑', label: 'Sitting' },
          { icon: '🏃', label: 'You sat the whole time' },
          { icon: '🚫', label: 'Play changes nothing' },
        ],
      },
      {
        ask: 'What do slow breaths need?',
        bg: 'room',
        base: [at('🪑', 50, 66, 20), at('🧒', 50, 46, 20), at('😴', 78, 28, 14)],
        cards: [
          { icon: '🪑', label: 'Sitting' },
          { icon: '🏃', label: 'A hard run' },
          { icon: '🚫', label: 'Breaths stay the same' },
        ],
      },
    ]),
  ],
};
