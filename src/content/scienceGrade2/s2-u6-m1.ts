import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const magnetsPull: ContentModule = {
  id: 's2-u6-m1',
  unitId: 's2-u6',
  grade: 2,
  title: 'Magnets',
  icon: '🧲',
  prereq: ['s2-u5-m1'],
  skills: ['sci-magnet'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['magnet', 'pull', 'metal', 'clip', 'wood', 'bolt', 'stay', 'cannot', 'hold', 'near', 'close', 'leaf', 'clips', 'moves', 'nothing'],

  learn: [
    {
      stage: 'concrete',
      // Dua logam dan satu kayu, ditaruh di titik yang SAMA. Yang logam ditarik dari
      // jauh (`pull-left`), kayunya diam — bedanya hanya bahannya.
      prompt: 'Hold each one near the magnet.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [ground('brown'), at('🧲', 22, 62, 24)],
        options: [
          {
            icon: '📎',
            label: 'Clip',
            caption: 'The magnet pulls the metal clip.',
            result: [ground('brown'), at('🧲', 22, 62, 24), at('📎', 42, 66, 12, { fx: 'pull-left' })],
          },
          {
            icon: '🪵',
            label: 'Wood',
            caption: 'Wood stays. It is not metal.',
            result: [ground('brown'), at('🧲', 22, 62, 24, { fx: 'pulse' }), at('🪵', 76, 70, 16)],
          },
          {
            icon: '🔩',
            label: 'Bolt',
            caption: 'The magnet pulls the metal bolt.',
            result: [ground('brown'), at('🧲', 22, 62, 24), at('🔩', 42, 66, 12, { fx: 'pull-left' })],
          },
        ],
      },
      action: 'explore',
      target: 3,
    },
    {
      stage: 'pictorial',
      prompt: 'The magnet comes close. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'room',
        base: [ground('brown'), at('🧲', 50, 18, 18), at('📎', 38, 82, 10), at('📎', 52, 84, 10), at('🍃', 72, 82, 12)],
        options: [
          { icon: '🍃', label: 'The leaf jumps up', caption: 'The leaf jumps up.' },
          {
            icon: '📎',
            label: 'Only the clips jump up',
            caption: 'It pulls the clips, not the leaf.',
            result: [
              ground('brown'),
              at('🧲', 50, 18, 18),
              at('📎', 44, 33, 10, { fx: 'pull-up' }),
              at('📎', 56, 35, 10, { fx: 'pull-up' }),
              at('🍃', 72, 82, 12),
            ],
          },
          { icon: '🛑', label: 'Nothing moves', caption: 'Nothing moves.' },
        ],
        correct: 1,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A magnet pulls metal only.',
      visual: {
        kind: 'evidence-text',
        title: 'Not wood',
        sentences: ['Metal moves to the magnet. Wood stays where it is.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-magnet', [
      {
        ask: 'The clip is on the magnet. What made it move?',
        bg: 'room',
        base: [ground('brown'), at('🧲', 36, 62, 24), at('📎', 52, 64, 12)],
        cards: [
          { icon: '📎', label: 'It is metal' },
          { icon: '🪵', label: 'It is wood' },
          { icon: '💨', label: 'Air pushed it' },
        ],
      },
      {
        ask: 'The wood did not move. Why?',
        bg: 'room',
        base: [ground('brown'), at('🧲', 28, 62, 24), at('🪵', 74, 70, 18)],
        cards: [
          { icon: '🪵', label: 'Wood is not metal' },
          { icon: '🔩', label: 'Wood is metal too' },
          { icon: '🧲', label: 'Magnets pull all things' },
        ],
      },
      {
        ask: 'The bolt is stuck. Why did the magnet pull it?',
        bg: 'room',
        base: [ground('brown'), at('🧲', 36, 62, 24), at('🔩', 52, 64, 14)],
        cards: [
          { icon: '🔩', label: 'The bolt is metal' },
          { icon: '🪵', label: 'The bolt is wood' },
          { icon: '⚖️', label: 'It was too heavy' },
        ],
      },
      {
        ask: 'The toy stayed put. What keeps it still?',
        bg: 'room',
        base: [ground('brown'), at('🧲', 26, 62, 24), at('🧸', 74, 66, 22)],
        cards: [
          { icon: '🧸', label: 'It is not metal' },
          { icon: '🧲', label: 'It is a magnet' },
          { icon: '🔩', label: 'The toy is metal' },
        ],
      },
      {
        ask: 'A nail is on the magnet. What caused that?',
        bg: 'room',
        base: [ground('brown'), at('🧲', 36, 62, 24), at('🔩', 54, 64, 14)],
        cards: [
          { icon: '🔩', label: 'The nail is metal' },
          { icon: '🪵', label: 'The nail is wood' },
          { icon: '🌍', label: 'All objects jump' },
        ],
      },
      {
        ask: 'The cup did not move. What is missing?',
        bg: 'room',
        base: [ground('brown'), at('🧲', 28, 62, 24), at('🥛', 74, 66, 22)],
        cards: [
          { icon: '⚙️', label: 'Metal' },
          { icon: '🪵', label: 'More wood' },
          { icon: '📏', label: 'Bigger size' },
        ],
      },
      {
        ask: 'The clips moved and the leaf stayed. Why?',
        bg: 'room',
        base: [ground('brown'), at('🧲', 30, 40, 22), at('📎', 40, 56, 10), at('📎', 52, 54, 10), at('🍃', 76, 78, 14)],
        cards: [
          { icon: '📎', label: 'Only metal is pulled' },
          { icon: '🍃', label: 'The leaf is metal' },
          { icon: '🧲', label: 'Both should move' },
        ],
      },
      {
        ask: 'The pin stuck to the magnet. What helps the pull?',
        bg: 'room',
        base: [ground('brown'), at('🧲', 36, 62, 24), at('🧷', 54, 64, 14)],
        cards: [
          { icon: '🧷', label: 'The pin is metal' },
          { icon: '🪵', label: 'The pin is wood' },
          { icon: '📄', label: 'Paper would stick too' },
        ],
      },
    ]),
  ],
};
