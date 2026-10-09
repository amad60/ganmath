import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const onlyOneChange: ContentModule = {
  id: 's5-u1-m1',
  unitId: 's5-u1',
  grade: 5,
  title: 'Only One Change',
  icon: '🔬',
  prereq: [],
  skills: ['sci-fair'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['water', 'light', 'dark', 'plant', 'stay', 'pale', 'thing'],

  learn: [
    // Airnya sama di kedua pilihan. Yang berubah hanya cahaya, jadi pucatnya bisa ditunjuk.
    {
      stage: 'concrete',
      prompt: 'Same water. Light, or dark.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('💧', 30, 72, 12), at('🌱', 50, 58, 24), ground('brown')],
        options: [
          {
            icon: '☀️',
            label: 'Light',
            caption: 'Same water. The plant stays.',
            bg: 'day',
            result: [at('☀️', 80, 16, 14), at('💧', 30, 72, 12), at('🌿', 50, 52, 30, { fx: 'grow' }), ground('brown')],
          },
          {
            icon: '🌑',
            label: 'Dark',
            caption: 'Same water. The plant is pale.',
            bg: 'night',
            result: [at('💧', 30, 72, 12), at('🥀', 50, 58, 24, { fx: 'droop' }), ground('brown')],
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
        bg: 'day',
        base: [at('☀️', 82, 16, 14), at('💧', 24, 74, 10), at('💧', 70, 74, 10), at('🌱', 28, 58, 20), at('📦', 68, 52, 18), ground('brown')],
        options: [
          {
            icon: '🥀',
            label: 'One plant is pale',
            caption: 'One plant is pale.',
            result: [at('☀️', 82, 16, 14), at('🌿', 28, 56, 22), at('🥀', 68, 58, 20, { fx: 'droop' }), ground('brown')],
          },
          { icon: '🌿', label: 'They stay', caption: 'They stay.' },
          { icon: '🌈', label: 'It grows big', caption: 'It grows big.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Change only one thing.',
      visual: {
        kind: 'evidence-text',
        title: 'One thing',
        sentences: [
          'Keep the water the same. Change only the light.',
          'If two things change, you cannot tell which one did it.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-fair', [
      {
        bg: 'day',
        base: [at('💧', 26, 74, 10), at('💧', 72, 74, 10), at('🌱', 28, 56, 18), at('📦', 70, 50, 16), ground('brown')],
        cards: [
          { icon: '🥀', label: 'The covered plant is pale' },
          { icon: '🌿', label: 'Both stay green' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 80, 16, 14), at('💧', 28, 74, 10), at('🌱', 30, 56, 18), at('🏜️', 72, 70, 14), at('🌱', 72, 52, 16), ground('brown')],
        cards: [
          { icon: '🥀', label: 'The dry one droops' },
          { icon: '🌿', label: 'Both stay' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 80, 16, 14), at('💧', 30, 74, 10), at('💧', 68, 74, 10), at('🌱', 32, 56, 16), at('🌱', 68, 56, 16), ground('brown')],
        cards: [
          { icon: '🌿', label: 'Both plants stay' },
          { icon: '🥀', label: 'One turns pale' },
          { icon: '🧊', label: 'They freeze' },
        ],
      },
      {
        bg: 'night',
        base: [at('📦', 30, 50, 16), at('🏜️', 72, 70, 14), at('🌱', 32, 56, 16), at('🌱', 70, 56, 16), ground('brown')],
        cards: [
          { icon: '❓', label: 'You cannot tell' },
          { icon: '🌿', label: 'Both stay' },
          { icon: '🍎', label: 'They make fruit' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 80, 16, 14), at('💧', 30, 74, 12), at('🥀', 50, 58, 22), ground('brown')],
        cards: [
          { icon: '🌿', label: 'It turns green again' },
          { icon: '🥀', label: 'It stays pale' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'day',
        base: [at('🎵', 78, 20, 14), at('☀️', 20, 16, 12), at('💧', 40, 74, 10), at('🌱', 50, 56, 22), ground('brown')],
        cards: [
          { icon: '🌿', label: 'The plant stays' },
          { icon: '🥀', label: 'It turns pale' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🚪', 70, 48, 22), at('💧', 30, 74, 10), at('🌱', 36, 58, 20), ground('brown')],
        cards: [
          { icon: '🥀', label: 'The plant is pale' },
          { icon: '🌿', label: 'It stays green' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'day',
        base: [at('🔴', 28, 62, 16), at('🔵', 72, 62, 16), at('☀️', 50, 14, 12), at('💧', 28, 78, 8), at('💧', 72, 78, 8), at('🌱', 28, 48, 14), at('🌱', 72, 48, 14)],
        cards: [
          { icon: '🌿', label: 'Both plants stay' },
          { icon: '🥀', label: 'One turns pale' },
          { icon: '❄️', label: 'They freeze' },
        ],
      },
    ]),
  ],
};
