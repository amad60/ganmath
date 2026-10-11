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
      prompt: 'Sugar in the water, or sand.',
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
        ask: 'Why can you not see the sugar?',
        base: [at('🥛', 50, 58, 32)],
        cards: [
          { icon: '✨', label: 'Went into water' },
          { icon: '💨', label: 'Gone forever' },
          { icon: '🧪', label: 'The water destroyed it' },
        ],
      },
      {
        bg: 'room',
        ask: 'Why does this sand stay?',
        base: [at('🥛', 50, 52, 28), at('🏖️', 50, 74, 14)],
        cards: [
          { icon: '🚫', label: 'Sand stays out' },
          { icon: '✨', label: 'Went into water' },
          { icon: '💨', label: 'The sand disappeared forever' },
        ],
      },
      {
        bg: 'room',
        ask: 'What was missing for the sugar?',
        base: [at('🍬', 50, 55, 28)],
        cards: [
          { icon: '🥛', label: 'Water to enter' },
          { icon: '💨', label: 'It should vanish anyway' },
          { icon: '🏖️', label: 'Sand makes sugar vanish' },
        ],
      },
      {
        bg: 'room',
        ask: 'What did the water do?',
        base: [at('🥣', 22, 58, 18), at('🥛', 55, 58, 26), at('🥄', 78, 36, 14)],
        cards: [
          { icon: '✨', label: 'Took sugar in' },
          { icon: '💨', label: 'Made sugar vanish' },
          { icon: '🍬', label: 'Left a pile' },
        ],
      },
      {
        bg: 'room',
        ask: 'Why can you not see the salt?',
        base: [at('🧂', 22, 40, 16), at('🥛', 60, 58, 28)],
        cards: [
          { icon: '✨', label: 'Still in the water' },
          { icon: '💨', label: 'The salt disappeared forever' },
          { icon: '🧪', label: 'The water destroyed it' },
        ],
      },
      {
        bg: 'room',
        ask: 'Why does this rock stay?',
        base: [at('🥛', 50, 52, 28), at('🪨', 50, 74, 16)],
        cards: [
          { icon: '🚫', label: 'Stays out of water' },
          { icon: '✨', label: 'Went into water' },
          { icon: '💨', label: 'The rock disappeared forever' },
        ],
      },
      {
        bg: 'room',
        ask: 'What keeps the sugar in there?',
        base: [at('🥣', 24, 58, 20), at('🥛', 66, 56, 26)],
        cards: [
          { icon: '✨', label: 'Still in the water' },
          { icon: '💨', label: 'It is gone forever' },
          { icon: '🏖️', label: 'Sand hides it' },
        ],
      },
      {
        bg: 'room',
        ask: 'What caused the sand to stay?',
        base: [at('🥛', 46, 58, 28), at('🥄', 72, 34, 14), at('🏖️', 48, 74, 12)],
        cards: [
          { icon: '🚫', label: 'Sand stays out' },
          { icon: '✨', label: 'Stirring put it in' },
          { icon: '💨', label: 'Stirring hid it' },
        ],
      },
    ]),
  ],
};
