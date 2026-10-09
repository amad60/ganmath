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
        bg: 'room',
        base: [ground('brown'), at('🧲', 22, 62, 24), at('📎', 74, 68, 14)],
        cards: [
          { icon: '⬅️', label: 'It moves to the magnet' },
          { icon: '🛑', label: 'It stays' },
          { icon: '🎈', label: 'It flies up' },
        ],
      },
      {
        bg: 'room',
        base: [ground('brown'), at('🧲', 22, 62, 24), at('🪵', 74, 70, 16)],
        cards: [
          { icon: '🛑', label: 'It stays' },
          { icon: '⬅️', label: 'It moves to the magnet' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'room',
        base: [ground('brown'), at('🧲', 22, 62, 24), at('🔩', 74, 68, 14)],
        cards: [
          { icon: '⬅️', label: 'It moves to the magnet' },
          { icon: '🛑', label: 'It stays' },
          { icon: '🌧️', label: 'It rains' },
        ],
      },
      {
        bg: 'room',
        base: [ground('brown'), at('🧲', 22, 62, 24), at('🧸', 74, 66, 20)],
        cards: [
          { icon: '🛑', label: 'It stays' },
          { icon: '⬅️', label: 'It moves to the magnet' },
          { icon: '💤', label: 'It goes to sleep' },
        ],
      },
      {
        bg: 'room',
        base: [ground('brown'), at('🧲', 22, 62, 24), at('🧷', 74, 68, 14)],
        cards: [
          { icon: '⬅️', label: 'It moves to the magnet' },
          { icon: '🛑', label: 'It stays' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
    
      {
        bg: 'room',
        base: [at('🧲', 28, 52, 24), at('📌', 68, 54, 16)],
        cards: [
          { icon: '📌', label: 'It moves to the magnet' },
          { icon: '🍃', label: 'The leaf jumps' },
          { icon: '🌧️', label: 'It rains' },
        ],
      },
      {
        bg: 'room',
        base: [at('🧲', 28, 52, 24), at('📄', 70, 56, 18)],
        cards: [
          { icon: '📄', label: 'It stays' },
          { icon: '📎', label: 'It jumps over' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'room',
        base: [at('🧲', 28, 52, 24), at('🔑', 70, 56, 18)],
        cards: [
          { icon: '🔑', label: 'It moves to the magnet' },
          { icon: '🪵', label: 'The wood jumps' },
          { icon: '❄️', label: 'It snows' },
        ],
      },
    ]),
  ],
};
