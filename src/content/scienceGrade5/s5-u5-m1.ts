import type { ContentModule } from '../types';
import { at, whatHappensNext } from '../scienceScene';

export const caughtOrThrough: ContentModule = {
  id: 's5-u5-m1',
  unitId: 's5-u5',
  grade: 5,
  title: 'Caught or Through',
  icon: '🧺',
  prereq: ['s5-u4-m1'],
  skills: ['sci-filter'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['sand', 'cloth', 'water', 'salt', 'stay', 'through'],

  learn: [
    // Kain yang sama. Pasir tertahan, air garam lolos.
    {
      stage: 'concrete',
      prompt: 'Sand, or salt water.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('👕', 50, 42, 26), at('🥛', 50, 74, 18)],
        options: [
          {
            icon: '🏖️',
            label: 'Sand',
            caption: 'Sand stays on the cloth.',
            result: [at('🧺', 50, 32, 16, { fx: 'pop' }), at('👕', 50, 48, 22), at('🥛', 50, 74, 16)],
          },
          {
            icon: '🧂',
            label: 'Salt water',
            caption: 'Salt water goes through.',
            result: [at('👕', 50, 40, 22), at('🥛', 50, 72, 20), at('💧', 50, 68, 12, { fx: 'fall' })],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'Sand on cloth, or salt water.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'room',
        base: [at('🌊', 50, 22, 16), at('👕', 50, 46, 24), at('🥛', 50, 74, 16)],
        options: [
          {
            icon: '🧺',
            label: 'Sand stays on it',
            caption: 'Sand stays on it.',
            result: [at('🧺', 50, 34, 16, { fx: 'pop' }), at('👕', 50, 50, 22), at('🥛', 50, 74, 16)],
          },
          { icon: '💧', label: 'It all goes through', caption: 'It all goes through.' },
          { icon: '🧂', label: 'The salt stays', caption: 'The salt stays.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Sand stays. Salt water goes through.',
      visual: {
        kind: 'evidence-text',
        title: 'Cloth',
        sentences: [
          'A cloth catches sand. The sand stays on it.',
          'Salt water goes through the cloth.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-filter', [
      {
        ask: 'Sand sits on the cloth. Why does it stay?',
        bg: 'room',
        base: [at('🏖️', 50, 28, 16), at('👕', 50, 48, 22), at('🥛', 50, 74, 16)],
        cards: [
          { icon: '🛑', label: 'Cloth catches the sand' },
          { icon: '💧', label: 'Sand goes through' },
          { icon: '🧂', label: 'Acts like salt water' },
        ],
      },
      {
        ask: 'Salt water is in the cup. What made it go through?',
        bg: 'room',
        base: [at('👕', 50, 42, 22), at('🥛', 50, 72, 18), at('💧', 50, 66, 12)],
        cards: [
          { icon: '⬇️', label: 'Salt water passes through' },
          { icon: '🏖️', label: 'Salt stays on cloth' },
          { icon: '🔄', label: 'Turns it into sand' },
        ],
      },
      {
        ask: 'Pebbles sit on the cloth. What keeps them there?',
        bg: 'room',
        base: [at('🪨', 50, 30, 14), at('👕', 50, 50, 22), at('🥛', 50, 76, 14)],
        cards: [
          { icon: '🛑', label: 'The cloth catches bits' },
          { icon: '💧', label: 'Pebbles fall through' },
          { icon: '🧂', label: 'Pebbles pass like water' },
        ],
      },
      {
        ask: 'Sugar water passed through. Why did it?',
        bg: 'room',
        base: [at('👕', 50, 42, 22), at('🥛', 50, 72, 18), at('💧', 50, 64, 12)],
        cards: [
          { icon: '⬇️', label: 'Sugar water goes through' },
          { icon: '🍬', label: 'Sugar stays like sand' },
          { icon: '🏖️', label: 'Cloth catches the water' },
        ],
      },
      {
        ask: 'A leaf is on the cloth. Which part stayed?',
        bg: 'room',
        base: [at('🍂', 50, 28, 16), at('👕', 50, 48, 22), at('🥛', 50, 74, 16)],
        cards: [
          { icon: '🧺', label: 'The solid leaf' },
          { icon: '💧', label: 'The leaf went through' },
          { icon: '🧂', label: 'Salt water stayed' },
        ],
      },
      {
        ask: 'Nothing was caught. What is missing?',
        bg: 'room',
        base: [at('💧', 50, 28, 14), at('🥛', 50, 64, 22)],
        cards: [
          { icon: '👕', label: 'The cloth is missing' },
          { icon: '🧺', label: 'Caught with no cloth' },
          { icon: '🏖️', label: 'Sand appears in cup' },
        ],
      },
      {
        ask: 'Mud sits on the cloth. What did the cloth do?',
        bg: 'room',
        base: [at('🟤', 50, 30, 14), at('👕', 50, 50, 22), at('🥛', 50, 76, 16), at('💧', 50, 70, 10)],
        cards: [
          { icon: '🛑', label: 'Caught the mud bits' },
          { icon: '💧', label: 'All mud went through' },
          { icon: '🧂', label: 'It only caught salt' },
        ],
      },
      {
        ask: 'Tea leaves sit on the cloth. What helps catch them?',
        bg: 'room',
        base: [at('🍂', 50, 28, 14), at('👕', 50, 48, 22), at('🥛', 50, 74, 16)],
        cards: [
          { icon: '🍃', label: 'Leaves act like sand' },
          { icon: '🍵', label: 'Tea water is caught' },
          { icon: '💧', label: 'Pass like salt water' },
        ],
      },
    ]),
  ],
};
