import type { ContentModule } from '../types';
import { at, whatHappensNext } from '../scienceScene';

export const wrapKeepsWarm: ContentModule = {
  id: 's6-u6-m1',
  unitId: 's6-u6',
  grade: 6,
  title: 'Wrap Keeps Warm',
  icon: '🧣',
  prereq: ['s6-u5-m1'],
  skills: ['sci-wrap'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['wrap', 'warm', 'cup', 'cold', 'stay'],

  learn: [
    // Minuman hangat yang sama. Yang dibungkus tetap hangat. Yang telanjang jadi dingin.
    {
      stage: 'concrete',
      prompt: 'Wrap the cup, or not.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('☕', 50, 58, 26)],
        options: [
          {
            icon: '🧣',
            label: 'Wrap',
            caption: 'A wrap. The cup stays warm.',
            result: [at('🧣', 50, 58, 28), at('🔥', 78, 30, 14, { fx: 'pulse' })],
          },
          {
            icon: '💨',
            label: 'No wrap',
            caption: 'No wrap. The cup is cold.',
            result: [at('☕', 50, 58, 26), at('❄️', 78, 30, 14, { fx: 'fade' })],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'Wrap the cup, or not.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'cloudy',
        base: [at('🍜', 50, 58, 26), at('🌬️', 80, 28, 16)],
        options: [
          {
            icon: '❄️',
            label: 'The cup is cold',
            caption: 'The cup is cold.',
            result: [at('🍜', 50, 58, 24), at('❄️', 78, 32, 14, { fx: 'fade' })],
          },
          { icon: '🔥', label: 'The cup stays warm', caption: 'The cup stays warm.' },
          { icon: '🚫', label: 'Wrap is the same', caption: 'Wrap is the same.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A wrap. The cup stays warm.',
      visual: {
        kind: 'evidence-text',
        title: 'Wrap',
        sentences: [
          'A wrap keeps the cup warm.',
          'No wrap, and the cup is cold.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-wrap', [
      {
        ask: 'What keeps this cup warm?',
        bg: 'room',
        base: [at('☕', 48, 58, 24), at('🧣', 58, 52, 18), at('🔥', 80, 30, 14)],
        cards: [
          { icon: '🧣', label: 'The wrap' },
          { icon: '❄️', label: 'No wrap' },
          { icon: '🚫', label: 'A wrap does nothing' },
        ],
      },
      {
        ask: 'Why is this cup cold?',
        bg: 'cloudy',
        base: [at('☕', 50, 58, 24), at('🌬️', 80, 24, 14), at('❄️', 28, 30, 14)],
        cards: [
          { icon: '💨', label: 'It has no wrap' },
          { icon: '🧣', label: 'A wrap is on it' },
          { icon: '🔥', label: 'It stays warm anyway' },
        ],
      },
      {
        ask: 'What helps you stay warm?',
        bg: 'cloudy',
        base: [at('🧒', 46, 56, 22), at('🧥', 58, 48, 18), at('😊', 78, 30, 14)],
        cards: [
          { icon: '🧥', label: 'The coat' },
          { icon: '❄️', label: 'No coat' },
          { icon: '🚫', label: 'A coat does nothing' },
        ],
      },
      {
        ask: 'What is missing in the cold?',
        bg: 'cloudy',
        base: [at('🧒', 50, 56, 24), at('❄️', 80, 22, 14), at('🥶', 28, 36, 14)],
        cards: [
          { icon: '🧥', label: 'A coat' },
          { icon: '🔥', label: 'You are still warm' },
          { icon: '🚫', label: 'Clothes do nothing' },
        ],
      },
      {
        ask: 'What made the bottle stay warm?',
        bg: 'room',
        base: [at('🍼', 46, 58, 20), at('🧣', 60, 50, 18), at('🔥', 80, 30, 12)],
        cards: [
          { icon: '🧣', label: 'The wrap on it' },
          { icon: '❄️', label: 'No wrap on it' },
          { icon: '🔥', label: 'The wrap made heat' },
        ],
      },
      {
        ask: 'What caused this cold bottle?',
        bg: 'cloudy',
        base: [at('🍼', 50, 58, 22), at('❄️', 80, 22, 14)],
        cards: [
          { icon: '💨', label: 'No wrap' },
          { icon: '🔥', label: 'A wrap kept it warm' },
          { icon: '🚫', label: 'Wrapping does nothing' },
        ],
      },
      {
        ask: 'What did the feathers do?',
        bg: 'cloudy',
        base: [at('🐦', 48, 55, 22), at('🪶', 68, 40, 12), at('😊', 80, 28, 12)],
        cards: [
          { icon: '🪶', label: 'They kept it warm' },
          { icon: '🥶', label: 'They left it cold' },
          { icon: '🚫', label: 'Feathers do nothing' },
        ],
      },
      {
        ask: 'What does a cold body need?',
        bg: 'water',
        base: [at('🧒', 50, 55, 22), at('🥶', 76, 36, 14), at('💧', 30, 40, 12)],
        cards: [
          { icon: '🧣', label: 'A wrap' },
          { icon: '🔥', label: 'Warm with no wrap' },
          { icon: '🚫', label: 'A wrap makes heat' },
        ],
      },
    ]),
  ],
};
