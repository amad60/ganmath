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
        // Gagang logam panas. Panasnya pindah, tidak tinggal di minuman.
        ask: 'The metal handle is hot. What made it hot?',
        bg: 'room',
        base: [at('☕', 42, 64, 22), at('🥄', 62, 42, 18), at('🥵', 82, 28, 16)],
        cards: [
          { icon: '➡️', label: 'Heat moved in metal' },
          { icon: '🔒', label: 'Heat never moved' },
          { icon: '🪵', label: 'Wood heated the hand' },
        ],
      },
      {
        ask: 'The wood handle is cool. Why is it cool?',
        bg: 'room',
        base: [at('☕', 42, 64, 22), at('🪵', 62, 42, 18), at('❄️', 82, 28, 14)],
        cards: [
          { icon: '🛑', label: 'Wood blocks the heat' },
          { icon: '🥵', label: 'Wood heats the hand' },
          { icon: '🥄', label: 'Metal and wood match' },
        ],
      },
      {
        ask: 'The pan handle is hot. What caused it?',
        bg: 'room',
        base: [at('🔥', 22, 62, 16), at('🍳', 55, 52, 22), at('🥵', 82, 36, 14)],
        cards: [
          { icon: '➡️', label: 'Heat moved along it' },
          { icon: '🕯️', label: 'Heat stayed in flame' },
          { icon: '🪵', label: 'Wood heats the same' },
        ],
      },
      {
        ask: 'Which part of the fork got the heat?',
        bg: 'room',
        base: [at('🕯️', 18, 62, 16), at('🍴', 55, 48, 22)],
        cards: [
          { icon: '🖐️', label: 'Far end got hot' },
          { icon: '🕯️', label: 'Only the flame end' },
          { icon: '🚫', label: 'No metal part heats' },
        ],
      },
      {
        ask: 'What keeps this wood spoon cool?',
        bg: 'room',
        base: [at('☕', 40, 64, 22), at('🪵', 62, 40, 18)],
        cards: [
          { icon: '❄️', label: 'Wood blocks the heat' },
          { icon: '🔥', label: 'Wood heats the hand' },
          { icon: '🥄', label: 'It heats like metal' },
        ],
      },
      {
        ask: 'The handle got hot. What did the heat do?',
        bg: 'room',
        base: [at('☕', 40, 64, 22), at('🥄', 60, 40, 18), at('🥵', 80, 28, 14)],
        cards: [
          { icon: '🖐️', label: 'Moved to the handle' },
          { icon: '🔒', label: 'Heat never moved' },
          { icon: '🪵', label: 'Moved into the wood' },
        ],
      },
      {
        ask: 'The nail top is hot. Why is it hot?',
        bg: 'room',
        base: [at('🔥', 24, 70, 16), at('📌', 50, 48, 28), at('🥵', 50, 22, 14)],
        cards: [
          { icon: '⬆️', label: 'Heat moved up it' },
          { icon: '🔥', label: 'Heat stayed at flame' },
          { icon: '🛑', label: 'Nail blocks all heat' },
        ],
      },
      {
        ask: 'Your hand is hot. What helps the heat get there?',
        bg: 'room',
        base: [at('☕', 36, 64, 20), at('🥄', 55, 42, 16), at('🖐️', 78, 32, 16)],
        cards: [
          { icon: '🔗', label: 'Metal spoon carries it' },
          { icon: '🪵', label: 'Wood would carry it' },
          { icon: '🚫', label: 'Heat misses the hand' },
        ],
      },
    ]),
  ],
};
