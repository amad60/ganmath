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
        ask: 'She covers her ears. What made it so loud?',
        bg: 'room',
        base: [at('👧', 48, 58, 28), at('🙉', 74, 36, 16)],
        cards: [
          { icon: '🥁', label: 'A drum' },
          { icon: '🤫', label: 'A whisper' },
          { icon: '📚', label: 'A book' },
        ],
      },
      {
        ask: 'He speaks by her ear. Why is it quiet?',
        bg: 'room',
        base: [at('👦', 30, 58, 26), at('👧', 70, 58, 26)],
        cards: [
          { icon: '🤫', label: 'A whisper' },
          { icon: '🥁', label: 'A drum' },
          { icon: '🎺', label: 'A horn' },
        ],
      },
      {
        ask: 'They cover their ears. What caused the loud sound?',
        bg: 'room',
        base: [at('🙉', 32, 48, 18), at('🙉', 68, 48, 18)],
        cards: [
          { icon: '🎺', label: 'A horn' },
          { icon: '🤫', label: 'A whisper' },
          { icon: '🐭', label: 'A mouse' },
        ],
      },
      {
        ask: 'The baby stays asleep. What keeps the sound quiet?',
        bg: 'room',
        base: [at('🍼', 36, 62, 16), at('😴', 64, 56, 26)],
        cards: [
          { icon: '🗣️', label: 'A soft voice' },
          { icon: '🥁', label: 'A drum' },
          { icon: '⛈️', label: 'Thunder' },
        ],
      },
      {
        ask: 'The cup hit the floor. Why was it loud?',
        bg: 'room',
        base: [at('☕', 50, 72, 22, { rotate: 70 }), at('😲', 28, 48, 20)],
        cards: [
          { icon: '💥', label: 'A hard hit' },
          { icon: '🤏', label: 'A soft tap' },
          { icon: '📚', label: 'A book' },
        ],
      },
      {
        ask: 'The goat calls out. Why does it sound loud?',
        bg: 'day',
        base: [at('🐐', 48, 60, 30), ground()],
        cards: [
          { icon: '📢', label: 'A loud call' },
          { icon: '🤏', label: 'A soft tap' },
          { icon: '😶', label: 'A sigh' },
        ],
      },
      {
        ask: 'What made the bell sound so loud?',
        bg: 'room',
        base: [at('🔔', 46, 50, 28), at('🎵', 74, 30, 14), at('🎵', 22, 34, 12)],
        cards: [
          { icon: '🔨', label: 'A hard hit' },
          { icon: '😶', label: 'A sigh' },
          { icon: '🐭', label: 'A mouse' },
        ],
      },
      {
        ask: 'Hands rub the shirt. Why is that quiet?',
        bg: 'room',
        base: [at('👕', 50, 58, 28), at('🤲', 28, 62, 16)],
        cards: [
          { icon: '🤏', label: 'A soft rub' },
          { icon: '⛈️', label: 'Thunder' },
          { icon: '🎺', label: 'A horn' },
        ],
      },
    ]),
  ],
};
