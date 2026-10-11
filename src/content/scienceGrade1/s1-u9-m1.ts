import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const loudAndQuiet: ContentModule = {
  id: 's1-u9-m1',
  unitId: 's1-u9',
  grade: 1,
  title: 'Loud and Quiet',
  icon: '🥁',
  prereq: ['s1-u8-m1'],
  skills: ['sci-sound'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['drum', 'loud', 'quiet', 'whisper', 'sound', 'hit', 'bang'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap the drum soft, or hit it hard.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('🥁', 50, 62, 28)],
        options: [
          {
            icon: '🤏',
            label: 'Soft',
            caption: 'A soft tap is quiet.',
            result: [at('🥁', 50, 62, 28), at('🎵', 64, 30, 8, { fx: 'pop' })],
          },
          {
            icon: '💥',
            label: 'Hard',
            caption: 'A hard hit is loud.',
            result: [
              at('🥁', 50, 62, 28, { fx: 'shake' }),
              at('🎵', 26, 24, 14, { fx: 'pop' }),
              at('🎶', 72, 22, 16, { fx: 'pop' }),
              at('🔊', 86, 56, 12),
            ],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'A whisper. What do you hear?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'room',
        base: [at('🤫', 34, 56, 26), at('🧒', 74, 60, 26)],
        options: [
          { icon: '🔊', label: 'A loud bang', caption: 'A loud bang.' },
          { icon: '🔇', label: 'No sound', caption: 'No sound.' },
          {
            icon: '🔈',
            label: 'A quiet sound',
            caption: 'A whisper is quiet.',
            result: [at('🤫', 34, 56, 26), at('🧒', 74, 60, 26), at('🔈', 54, 26, 10, { fx: 'pop' })],
          },
        ],
        correct: 2,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A whisper is quiet.',
      visual: {
        kind: 'evidence-text',
        title: 'Two sounds',
        sentences: ['A drum is loud. A whisper is quiet.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-sound', [
      {
        ask: 'You hit the drum hard.',
        bg: 'room',
        base: [at('💥', 30, 30, 16), at('🥁', 50, 62, 28)],
        cards: [
          { icon: '🔊', label: 'A loud sound' },
          { icon: '🔈', label: 'A quiet sound' },
          { icon: '🌙', label: 'It gets dark' },
        ],
      },
      {
        ask: 'Someone whispers.',
        bg: 'room',
        base: [at('🤫', 34, 56, 26), at('🧒', 74, 60, 26)],
        cards: [
          { icon: '🔈', label: 'A quiet sound' },
          { icon: '🔊', label: 'A loud sound' },
          { icon: '🚫', label: 'There is no sound' },
        ],
      },
      {
        ask: 'A trumpet plays.',
        bg: 'room',
        base: [at('🎺', 46, 54, 30)],
        cards: [
          { icon: '🔊', label: 'A loud sound' },
          { icon: '🔈', label: 'A quiet sound' },
          { icon: '🚫', label: 'There is no sound' },
        ],
      },
      {
        ask: 'A mouse nibbles cheese.',
        bg: 'room',
        base: [at('🐭', 46, 70, 22), at('🧀', 76, 76, 14)],
        cards: [
          { icon: '🔈', label: 'A quiet sound' },
          { icon: '🔊', label: 'A loud sound' },
          { icon: '🔥', label: 'It gets hot' },
        ],
      },
      {
        ask: 'Thunder cracks.',
        bg: 'cloudy',
        base: [at('🌩️', 50, 30, 30), ground()],
        cards: [
          { icon: '🔊', label: 'A loud sound' },
          { icon: '🔈', label: 'A quiet sound' },
          { icon: '🌱', label: 'It grows' },
        ],
      },
    
      {
        ask: 'Someone whispers again.',
        bg: 'room',
        base: [at('🤫', 50, 52, 32)],
        cards: [
          { icon: '🔇', label: 'A quiet sound' },
          { icon: '📢', label: 'A loud sound' },
          { icon: '🚫', label: 'There is no sound' },
        ],
      },
      {
        ask: 'A hand hits the drum.',
        bg: 'room',
        base: [at('🥁', 42, 58, 28), at('✋', 72, 48, 16)],
        cards: [
          { icon: '🔊', label: 'A loud sound' },
          { icon: '🤫', label: 'A quiet sound' },
          { icon: '🚫', label: 'There is no sound' },
        ],
      },
      {
        ask: 'A closed book makes no hit.',
        bg: 'room',
        base: [at('📚', 50, 54, 30)],
        cards: [
          { icon: '🤫', label: 'A quiet sound' },
          { icon: '⛈️', label: 'A storm' },
          { icon: '🚫', label: 'There is no sound' },
        ],
      },
    ]),
  ],
};
