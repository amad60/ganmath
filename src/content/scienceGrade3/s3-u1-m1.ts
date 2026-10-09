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
  vocab: ['look', 'leaf', 'light', 'pale', 'plant', 'green', 'stay', 'turn', 'dark', 'give', 'cover', 'under', 'fruit', 'food'],

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
          { icon: '🍎', label: 'It makes fruit', caption: 'It makes fruit.' },
          { icon: '🌳', label: 'It grows big', caption: 'It grows big.' },
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
        bg: 'night',
        base: [at('🌙', 82, 16, 14), at('🌿', 50, 60, 32), ground('brown')],
        cards: [
          { icon: '🍂', label: 'It turns pale' },
          { icon: '🌳', label: 'It grows big' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 82, 16, 16), at('💧', 30, 30, 10), at('🌱', 50, 66, 24), ground('brown')],
        cards: [
          { icon: '🌿', label: 'It grows green' },
          { icon: '🧊', label: 'It freezes' },
          { icon: '🪨', label: 'It turns to rock' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 82, 16, 16), at('🌳', 46, 56, 44), ground()],
        cards: [
          { icon: '🍎', label: 'It makes fruit' },
          { icon: '🥶', label: 'It gets cold' },
          { icon: '🌑', label: 'It goes dark' },
        ],
      },
      {
        bg: 'night',
        base: [at('🪨', 16, 60, 30), at('🪨', 84, 60, 30), at('🌱', 50, 70, 20), ground('gray')],
        cards: [
          { icon: '🥀', label: 'It turns pale' },
          { icon: '🌻', label: 'It gets a flower' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 82, 16, 16, { fx: 'pop' }), at('🌿', 50, 62, 30, { dim: true }), ground('brown')],
        cards: [
          { icon: '🌿', label: 'It gets green again' },
          { icon: '🧊', label: 'It freezes' },
          { icon: '🐟', label: 'It swims away' },
        ],
      },
    
      {
        bg: 'day',
        base: [at('🍃', 50, 56, 30), at('📦', 50, 50, 36)],
        cards: [
          { icon: '🫥', label: 'The leaf gets pale' },
          { icon: '🍎', label: 'It makes fruit now' },
          { icon: '❄️', label: 'It freezes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🍃', 50, 56, 28), at('☀️', 80, 18, 16), at('💧', 28, 40, 12)],
        cards: [
          { icon: '🌿', label: 'The leaf stays green' },
          { icon: '🪨', label: 'It turns to rock' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'day',
        base: [at('🍃', 36, 56, 22), at('🌑', 70, 40, 20)],
        cards: [
          { icon: '😕', label: 'That leaf gets pale' },
          { icon: '🌺', label: 'It gets a flower' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
    ]),
  ],
};
