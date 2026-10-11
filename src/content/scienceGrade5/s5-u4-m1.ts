import type { ContentModule } from '../types';
import { at, whatHappensNext } from '../scienceScene';

export const heatMoves: ContentModule = {
  id: 's5-u4-m1',
  unitId: 's5-u4',
  grade: 5,
  title: 'Heat Moves',
  icon: '🥄',
  prereq: ['s5-u3-m1'],
  skills: ['sci-heat'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['metal', 'wood', 'heat', 'hot', 'spoon', 'hand'],

  learn: [
    // Minuman panasnya sama. Gagang logam ikut panas, gagang kayu tidak.
    {
      stage: 'concrete',
      prompt: 'A metal spoon, or wood.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('☕', 50, 62, 26), at('🔥', 78, 24, 12)],
        options: [
          {
            icon: '🥄',
            label: 'Metal',
            caption: 'Heat goes to the hand.',
            result: [at('☕', 46, 64, 24), at('🥄', 58, 40, 20), at('🥵', 78, 28, 16, { fx: 'pop' })],
          },
          {
            icon: '🪵',
            label: 'Wood',
            caption: 'The wood is not hot.',
            result: [at('☕', 46, 64, 24), at('🪵', 58, 40, 18), at('❄️', 80, 26, 14)],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'Heat on metal, or wood.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'room',
        base: [at('🕯️', 24, 58, 20), at('🥄', 55, 42, 22)],
        options: [
          {
            icon: '🥵',
            label: 'This end is hot',
            caption: 'This end is hot.',
            result: [at('🕯️', 22, 58, 18), at('🥄', 55, 42, 22), at('🥵', 82, 32, 16, { fx: 'pop' })],
          },
          { icon: '❄️', label: 'It is not hot', caption: 'It is not hot.' },
          { icon: '🚫', label: 'No heat', caption: 'No heat.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Heat goes to the hand.',
      visual: {
        kind: 'evidence-text',
        title: 'Metal',
        sentences: [
          'Heat goes along a metal spoon to your hand.',
          'A wood spoon stays cool.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-heat', [
      {
        ask: 'A metal spoon sits in a hot drink.',
        bg: 'room',
        base: [at('☕', 42, 62, 24), at('🥄', 60, 40, 18), at('🔥', 80, 22, 12)],
        cards: [
          { icon: '🥵', label: 'The handle is hot' },
          { icon: '❄️', label: 'The handle stays cool' },
          { icon: '🚫', label: 'Heat stays at the flame' },
        ],
      },
      {
        ask: 'A wooden spoon sits in a hot drink.',
        bg: 'room',
        base: [at('☕', 42, 62, 24), at('🪵', 62, 40, 18), at('🔥', 80, 22, 12)],
        cards: [
          { icon: '❄️', label: 'The handle stays cool' },
          { icon: '🥵', label: 'The handle is hot' },
          { icon: '🔥', label: 'The wood burns up' },
        ],
      },
      {
        ask: 'A metal spoon touches a flame.',
        bg: 'room',
        base: [at('🕯️', 20, 60, 18), at('🥄', 58, 44, 20)],
        cards: [
          { icon: '🥵', label: 'The far end is hot' },
          { icon: '❄️', label: 'It stays cool' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        ask: 'A wooden spoon touches a flame.',
        bg: 'room',
        base: [at('🕯️', 20, 60, 18), at('🪵', 58, 46, 20)],
        cards: [
          { icon: '❄️', label: 'The far end stays cool' },
          { icon: '🥵', label: 'The far end is hot' },
          { icon: '🚫', label: 'Heat stays at the flame' },
        ],
      },
      {
        ask: 'A metal pan sits on the fire.',
        bg: 'room',
        base: [at('🔥', 24, 62, 18), at('🍳', 55, 50, 22)],
        cards: [
          { icon: '🥵', label: 'The metal handle is hot' },
          { icon: '❄️', label: 'It stays cool' },
          { icon: '🚫', label: 'Heat stays at the flame' },
        ],
      },
      {
        ask: 'A wooden handle sits on the fire.',
        bg: 'room',
        base: [at('🔥', 24, 62, 18), at('🪵', 62, 46, 18)],
        cards: [
          { icon: '❄️', label: 'The wood stays cool' },
          { icon: '🥵', label: 'It is hot' },
          { icon: '🚫', label: 'Heat stays at the flame' },
        ],
      },
      {
        ask: 'Metal sits in the sun.',
        bg: 'day',
        base: [at('☀️', 80, 16, 16), at('🪙', 50, 58, 16)],
        cards: [
          { icon: '🥵', label: 'The metal is hot' },
          { icon: '❄️', label: 'It stays cool' },
          { icon: '🚫', label: 'Heat stays at the flame' },
        ],
      },
      {
        ask: 'Wood sits in the sun.',
        bg: 'day',
        base: [at('☀️', 80, 16, 16), at('🪵', 50, 58, 24)],
        cards: [
          { icon: '❄️', label: 'The wood stays cool' },
          { icon: '🥵', label: 'It is hot' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
    ]),
  ],
};
