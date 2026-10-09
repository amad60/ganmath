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
      prompt: 'See this. See what changes.',
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
          { icon: '🌈', label: 'It grows big', caption: 'It grows big.' },
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
        bg: 'room',
        base: [at('☕', 46, 58, 22), at('🧣', 58, 52, 20)],
        cards: [
          { icon: '🔥', label: 'The cup stays warm' },
          { icon: '❄️', label: 'The cup is cold' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('☕', 50, 58, 26), at('🌬️', 80, 24, 14)],
        cards: [
          { icon: '❄️', label: 'The cup is cold' },
          { icon: '🔥', label: 'The cup stays warm' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('🧒', 46, 58, 22), at('🧥', 58, 50, 18), at('❄️', 82, 20, 12)],
        cards: [
          { icon: '😊', label: 'You stay warm' },
          { icon: '🥶', label: 'You are cold' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('🧒', 50, 58, 24), at('❄️', 80, 20, 14)],
        cards: [
          { icon: '🥶', label: 'You are cold' },
          { icon: '😊', label: 'You stay warm' },
          { icon: '🧊', label: 'You turn to ice' },
        ],
      },
      {
        bg: 'room',
        base: [at('🍼', 46, 58, 20), at('🧣', 60, 52, 18)],
        cards: [
          { icon: '🔥', label: 'It stays warm' },
          { icon: '❄️', label: 'It is cold' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('🍼', 50, 58, 22), at('❄️', 80, 22, 14)],
        cards: [
          { icon: '🥶', label: 'It is cold' },
          { icon: '🔥', label: 'It stays warm' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('🐦', 48, 55, 22), at('🪶', 64, 42, 12), at('❄️', 82, 20, 12)],
        cards: [
          { icon: '😊', label: 'It stays warm' },
          { icon: '🥶', label: 'It is cold' },
          { icon: '🌸', label: 'A flower comes' },
        ],
      },
      {
        bg: 'water',
        base: [at('🧒', 50, 55, 22), at('💧', 70, 40, 12)],
        cards: [
          { icon: '🥶', label: 'You are cold' },
          { icon: '🔥', label: 'You stay warm' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
    ]),
  ],
};
