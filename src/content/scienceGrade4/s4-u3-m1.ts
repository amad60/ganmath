import type { ContentModule } from '../types';
import { at, whatHappensNext } from '../scienceScene';

export const sugarDissolves: ContentModule = {
  id: 's4-u3-m1',
  unitId: 's4-u3',
  grade: 4,
  title: 'Sugar Dissolves',
  icon: '🍬',
  prereq: ['s4-u2-m1'],
  skills: ['sci-dissolve'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['sugar', 'sand', 'water', 'cup', 'stay'],

  learn: [
    // Gelas dan airnya sama. Yang berubah hanya yang dimasukkan: gula atau pasir.
    {
      stage: 'concrete',
      prompt: 'Add sugar, or sand.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('🥛', 50, 58, 32)],
        options: [
          {
            icon: '🍬',
            label: 'Sugar',
            caption: 'Sugar goes into the water.',
            result: [at('🥛', 50, 58, 34), at('✨', 70, 36, 14, { fx: 'pop' })],
          },
          {
            icon: '🏖️',
            label: 'Sand',
            caption: 'Sand stays in the cup.',
            result: [at('🥛', 50, 52, 30), at('🏖️', 50, 74, 16, { fx: 'fall' }), at('⬇️', 74, 68, 12)],
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
        base: [at('🥛', 50, 58, 30), at('🍬', 50, 28, 16)],
        options: [
          {
            icon: '✨',
            label: 'It goes into water',
            caption: 'It goes into water.',
            result: [at('🥛', 50, 56, 32), at('✨', 70, 36, 14, { fx: 'pop' })],
          },
          { icon: '🍬', label: 'The sugar stays', caption: 'The sugar stays.' },
          { icon: '🌳', label: 'It grows big', caption: 'It grows big.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Sugar goes into water.',
      visual: {
        kind: 'evidence-text',
        title: 'Water',
        sentences: [
          'Sugar goes into water. You cannot see it, but it is still there.',
          'Sand does not go into water. It stays in the cup.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-dissolve', [
      {
        bg: 'room',
        base: [at('🥛', 50, 58, 30), at('🍬', 50, 24, 14)],
        cards: [
          { icon: '✨', label: 'The sugar goes in' },
          { icon: '🍬', label: 'The sugar stays' },
          { icon: '🧊', label: 'It turns to ice' },
        ],
      },
      {
        bg: 'room',
        base: [at('🥛', 50, 58, 30), at('🏖️', 50, 22, 16)],
        cards: [
          { icon: '⬇️', label: 'The sand stays' },
          { icon: '✨', label: 'The sand goes in' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🍬', 50, 55, 28)],
        cards: [
          { icon: '⬇️', label: 'The sugar stays' },
          { icon: '✨', label: 'It goes into water' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'plain',
        base: [at('🏖️', 50, 58, 28)],
        cards: [
          { icon: '⏳', label: 'The sand stays' },
          { icon: '✨', label: 'It goes away' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🥛', 46, 60, 28), at('🥄', 68, 36, 16), at('🍬', 40, 30, 12)],
        cards: [
          { icon: '✨', label: 'The sugar goes in' },
          { icon: '🍬', label: 'A pile stays' },
          { icon: '🪨', label: 'It turns to rock' },
        ],
      },
      {
        bg: 'room',
        base: [at('🥛', 46, 60, 28), at('🥄', 70, 34, 16), at('🏖️', 38, 28, 14)],
        cards: [
          { icon: '⬇️', label: 'The sand stays' },
          { icon: '✨', label: 'The sand goes in' },
          { icon: '🌸', label: 'A flower comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🥛', 48, 64, 24), at('🍬', 50, 20, 22)],
        cards: [
          { icon: '✨', label: 'The lump goes in' },
          { icon: '🍬', label: 'The lump stays' },
          { icon: '❄️', label: 'The cup freezes' },
        ],
      },
      {
        bg: 'water',
        base: [at('🪨', 50, 36, 20), at('🌊', 50, 70, 28)],
        cards: [
          { icon: '⬇️', label: 'The rock stays' },
          { icon: '✨', label: 'It goes into water' },
          { icon: '🌺', label: 'A flower comes' },
        ],
      },
    ]),
  ],
};
