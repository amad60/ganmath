import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const evenPush: ContentModule = {
  id: 's5-u7-m1',
  unitId: 's5-u7',
  grade: 5,
  title: 'Even Push',
  icon: '📦',
  prereq: ['s5-u6-m1'],
  skills: ['sci-balance'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['push', 'stay'],

  learn: [
    // Kotaknya sama. Dorongan sama membuatnya diam. Satu sisi lebih kuat, kotak bergerak.
    {
      stage: 'concrete',
      prompt: 'Same push, or one more.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('📦', 50, 55, 22), ground('gray')],
        options: [
          {
            icon: '🤝',
            label: 'Same',
            caption: 'Same push. The box stays.',
            result: [at('🧒', 18, 55, 16), at('📦', 50, 55, 20), at('🧒', 82, 55, 16), at('🛑', 50, 28, 12), ground('gray')],
          },
          {
            icon: '💪',
            label: 'One more',
            caption: 'One push is more. It goes.',
            result: [at('🧒', 16, 55, 16), at('📦', 62, 52, 20, { fx: 'slide-right' }), at('➡️', 82, 40, 14), ground('gray')],
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
        base: [at('🧒', 16, 55, 16), at('📦', 48, 55, 20), at('💪', 82, 48, 18), ground('gray')],
        options: [
          {
            icon: '➡️',
            label: 'The box goes',
            caption: 'The box goes.',
            result: [at('📦', 68, 52, 20, { fx: 'slide-right' }), at('➡️', 86, 40, 12), ground('gray')],
          },
          { icon: '🛑', label: 'The box stays', caption: 'The box stays.' },
          { icon: '🌈', label: 'It grows big', caption: 'It grows big.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Same push. The box stays.',
      visual: {
        kind: 'evidence-text',
        title: 'Push',
        sentences: [
          'The same push on both sides, and the box stays.',
          'One push is more, and the box goes.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-balance', [
      {
        bg: 'room',
        base: [at('🧒', 16, 55, 16), at('📦', 50, 55, 20), at('🧒', 84, 55, 16), ground('gray')],
        cards: [
          { icon: '🛑', label: 'The box stays' },
          { icon: '➡️', label: 'The box goes' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🧒', 14, 55, 14), at('📦', 46, 55, 20), at('💪', 84, 46, 18), ground('gray')],
        cards: [
          { icon: '➡️', label: 'The box goes' },
          { icon: '🛑', label: 'The box stays' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'room',
        base: [at('📦', 50, 55, 24), ground('gray')],
        cards: [
          { icon: '🛑', label: 'The box stays' },
          { icon: '➡️', label: 'The box goes' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'plain',
        base: [at('🧒', 18, 55, 16), at('⚽', 50, 55, 16), at('🧒', 82, 55, 16)],
        cards: [
          { icon: '🛑', label: 'The ball stays' },
          { icon: '➡️', label: 'The ball goes' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'plain',
        base: [at('💪', 18, 50, 18), at('⚽', 55, 55, 16)],
        cards: [
          { icon: '➡️', label: 'The ball goes' },
          { icon: '🛑', label: 'The ball stays' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'room',
        base: [at('🧒', 12, 50, 12), at('🧒', 22, 62, 12), at('📦', 50, 55, 18), at('🧒', 84, 55, 14), ground('gray')],
        cards: [
          { icon: '➡️', label: 'The box goes' },
          { icon: '🛑', label: 'The box stays' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🧒', 18, 55, 16), at('🚪', 50, 50, 28), at('🧒', 82, 55, 16)],
        cards: [
          { icon: '🛑', label: 'The door stays' },
          { icon: '➡️', label: 'The door goes' },
          { icon: '🌸', label: 'A flower comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('💪', 16, 48, 18), at('🚪', 55, 50, 26), at('🧒', 86, 58, 14)],
        cards: [
          { icon: '➡️', label: 'The door goes' },
          { icon: '🛑', label: 'The door stays' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
    ]),
  ],
};
