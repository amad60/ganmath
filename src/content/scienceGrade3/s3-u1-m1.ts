import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const leavesMakeFood: ContentModule = {
  id: 's3-u1-m1',
  unitId: 's3-u1',
  grade: 3,
  title: 'Leaves Make Food',
  icon: '🍃',
  prereq: [],
  skills: ['sci-leaves'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['look', 'leaf', 'light', 'pale', 'plant', 'green', 'stay', 'turn', 'dark', 'give', 'cover', 'under', 'fruit', 'food', 'needs'],

  learn: [
    // Satu variabel saja: cahaya. Tanah, pot, dan airnya sama di kedua gambar,
    // jadi satu-satunya penyebab daun pucat yang bisa dilihat anak adalah gelapnya.
    {
      stage: 'concrete',
      prompt: 'Give the plant light, or dark.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('🌿', 50, 60, 34), ground('brown')],
        options: [
          {
            icon: '☀️',
            label: 'Light',
            caption: 'In the light, the leaf stays green.',
            bg: 'day',
            result: [at('☀️', 82, 18, 16, { fx: 'pop' }), at('🌿', 50, 58, 38, { fx: 'grow' }), ground('brown')],
          },
          {
            icon: '🌑',
            label: 'Dark',
            caption: 'No light. The leaf turns pale.',
            bg: 'night',
            result: [at('🌿', 50, 62, 32, { dim: true, fx: 'droop' }), ground('brown')],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    // Tebakan memakai SATU daun yang ditutup — tanaman lainnya tetap di cahaya.
    // Kalau hanya daun itu yang pucat, penyebabnya pasti tutupnya, bukan tanamannya.
    {
      stage: 'pictorial',
      prompt: 'A box covers one leaf. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('☀️', 84, 16, 14), at('🌿', 40, 60, 32), at('📦', 72, 50, 16), ground('brown')],
        options: [
          {
            icon: '🍂',
            label: 'It turns pale',
            caption: 'Under the box, the leaf turns pale.',
            result: [
              at('☀️', 84, 16, 14),
              at('🌿', 40, 60, 32),
              at('📦', 58, 22, 14, { fx: 'rise' }),
              at('🍃', 72, 54, 14, { dim: true, fx: 'pop' }),
              ground('brown'),
            ],
          },
          { icon: '🌿', label: 'It stays green', caption: 'It stays green.' },
          { icon: '🍎', label: 'It needs food', caption: 'It needs food.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'No light makes a leaf pale.',
      visual: {
        kind: 'evidence-text',
        title: 'Covered',
        sentences: ['A leaf in the light stays green. A covered leaf turns pale.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-leaves', [
      {
        ask: 'This leaf turned pale. Why?',
        bg: 'day',
        base: [at('☀️', 84, 16, 14), at('📦', 62, 46, 22), at('🍃', 50, 64, 18, { dim: true }), ground('brown')],
        cards: [
          { icon: '🌑', label: 'No light' },
          { icon: '💧', label: 'More water' },
          { icon: '🪴', label: 'A small pot' },
        ],
      },
      {
        ask: 'What keeps this leaf green?',
        bg: 'day',
        base: [at('☀️', 82, 16, 16), at('🌿', 50, 58, 36), ground('brown')],
        cards: [
          { icon: '✨', label: 'Light on it' },
          { icon: '📦', label: 'A dark cover' },
          { icon: '💧', label: 'Extra water' },
        ],
      },
      {
        ask: 'Which part got no light?',
        bg: 'day',
        base: [at('☀️', 18, 16, 14), at('🍃', 26, 60, 20), at('📦', 74, 48, 20), at('🍂', 74, 66, 14, { dim: true }), ground('brown')],
        cards: [
          { icon: '🌑', label: 'The covered leaf' },
          { icon: '🍃', label: 'The sunny leaf' },
          { icon: '🌱', label: 'The stem' },
        ],
      },
      {
        ask: 'What made this plant pale?',
        bg: 'night',
        base: [at('💧', 28, 72, 12), at('🌿', 54, 60, 30, { dim: true }), ground('brown')],
        cards: [
          { icon: '🌑', label: 'No light' },
          { icon: '💦', label: 'Too much water' },
          { icon: '🪴', label: 'A small pot' },
        ],
      },
      {
        ask: 'What does this pale leaf need?',
        bg: 'day',
        base: [at('💧', 24, 72, 12), at('🍃', 54, 60, 26, { dim: true }), ground('brown')],
        cards: [
          { icon: '☀️', label: 'Light' },
          { icon: '💧', label: 'More water' },
          { icon: '📦', label: 'A darker cover' },
        ],
      },
      {
        ask: 'This grass is pale. Why?',
        bg: 'day',
        base: [at('☀️', 82, 16, 14), at('🌱', 22, 70, 18), at('🪵', 70, 62, 24), at('🌾', 70, 80, 12, { dim: true }), ground('green')],
        cards: [
          { icon: '🌑', label: 'The board blocked light' },
          { icon: '💧', label: 'It needs water' },
          { icon: '🔥', label: 'The sun burned it' },
        ],
      },
      {
        ask: 'What caused this lettuce to pale?',
        bg: 'day',
        base: [at('🥬', 50, 66, 26, { dim: true }), at('🧣', 50, 44, 28), ground('brown')],
        cards: [
          { icon: '🌑', label: 'Cloth blocked the light' },
          { icon: '💧', label: 'Less water' },
          { icon: '🥶', label: 'Cold nights' },
        ],
      },
      {
        ask: 'What is missing for this leaf?',
        bg: 'night',
        base: [at('🚪', 22, 52, 26), at('🍃', 64, 58, 22, { dim: true }), at('💧', 82, 74, 10)],
        cards: [
          { icon: '☀️', label: 'Light' },
          { icon: '💧', label: 'Water' },
          { icon: '🪴', label: 'A pot' },
        ],
      },
    ]),
  ],
};
