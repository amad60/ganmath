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
        ask: 'Sand is poured on a cloth.',
        bg: 'room',
        base: [at('🏖️', 50, 18, 14), at('👕', 50, 46, 22), at('🥛', 50, 74, 16)],
        cards: [
          { icon: '🧺', label: 'Sand stays on the cloth' },
          { icon: '💧', label: 'Sand goes through' },
          { icon: '🚫', label: 'The cloth changes the mix' },
        ],
      },
      {
        ask: 'Salt water is poured on a cloth.',
        bg: 'room',
        base: [at('🧂', 50, 16, 14), at('👕', 50, 46, 22), at('🥛', 50, 74, 16)],
        cards: [
          { icon: '💧', label: 'Salt water goes through' },
          { icon: '🧺', label: 'Salt stays on the cloth' },
          { icon: '🚫', label: 'The cloth changes the mix' },
        ],
      },
      {
        ask: 'Sugar water is poured on a cloth.',
        bg: 'room',
        base: [at('🍬', 50, 16, 12), at('👕', 50, 46, 22), at('🥛', 50, 76, 14)],
        cards: [
          { icon: '💧', label: 'Sugar water goes through' },
          { icon: '🍬', label: 'Sugar stays on the cloth' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        ask: 'A leaf is poured on a cloth.',
        bg: 'room',
        base: [at('🍃', 50, 16, 14), at('👕', 50, 48, 22), at('🥛', 50, 76, 14)],
        cards: [
          { icon: '🧺', label: 'The leaf stays on it' },
          { icon: '💧', label: 'The leaf goes through' },
          { icon: '🚫', label: 'The cloth changes the mix' },
        ],
      },
      {
        ask: 'A rock is poured on a cloth.',
        bg: 'room',
        base: [at('🪨', 50, 16, 14), at('👕', 50, 48, 22), at('🥛', 50, 76, 14)],
        cards: [
          { icon: '🧺', label: 'The rock stays on it' },
          { icon: '💧', label: 'The rock goes through' },
          { icon: '🚫', label: 'The cloth changes the mix' },
        ],
      },
      {
        ask: 'Salt water is poured with no cloth.',
        bg: 'room',
        base: [at('🧂', 50, 20, 16), at('🥛', 50, 64, 22)],
        cards: [
          { icon: '💧', label: 'It all goes in' },
          { icon: '🧺', label: 'Something catches it' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        ask: 'Sand is poured on a dry cloth.',
        bg: 'plain',
        base: [at('🏖️', 50, 28, 18), at('👕', 50, 52, 26)],
        cards: [
          { icon: '🧺', label: 'Sand stays on the cloth' },
          { icon: '💧', label: 'It goes through' },
          { icon: '🚫', label: 'The cloth changes the mix' },
        ],
      },
      {
        ask: 'Mud is poured on a cloth.',
        bg: 'room',
        base: [at('🟤', 50, 16, 14), at('👕', 50, 46, 24), at('🥛', 50, 76, 14)],
        cards: [
          { icon: '🧺', label: 'Mud stays on the cloth' },
          { icon: '💧', label: 'Mud goes through' },
          { icon: '🚫', label: 'The cloth changes the mix' },
        ],
      },
    ]),
  ],
};
