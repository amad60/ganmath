import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

export const homeChanges: ContentModule = {
  id: 's3-u3-m1',
  unitId: 's3-u3',
  grade: 3,
  title: 'When a Home Changes',
  icon: '🐸',
  prereq: ['s3-u2-m1'],
  skills: ['sci-habitat'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['frog', 'leave', 'dry', 'pond', 'need', 'wet', 'home', 'full', 'must', 'stay', 'stays', 'tree', 'trees', 'cut', 'new', 'find', 'bird', 'rock', 'sleep', 'sleeps', 'fly', 'flies', 'there'],

  learn: [
    // Kolamnya yang diubah, katak tetap katak. Rumah yang tidak lagi cocok
    // membuat hewan PERGI — gerak keluar itulah akibat yang perlu dilihat.
    {
      stage: 'concrete',
      prompt: 'Make the pond full, or dry.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [bar(50, 82, 70, 12, 'blue'), at('🐸', 50, 66, 20), ground()],
        options: [
          {
            icon: '💧',
            label: 'Full pond',
            caption: 'A wet home. The frog stays.',
            result: [
              at('🌧️', 30, 16, 16, { fx: 'pop' }),
              bar(50, 82, 80, 14, 'blue', { fx: 'grow' }),
              at('🐸', 50, 66, 22, { fx: 'pop' }),
              ground(),
            ],
          },
          {
            icon: '☀️',
            label: 'Dry pond',
            caption: 'A dry home. The frog must leave.',
            result: [
              at('☀️', 82, 16, 18, { fx: 'pop' }),
              bar(50, 84, 70, 10, 'brown'),
              at('🐸', 86, 66, 18, { fx: 'slide-right' }),
              ground('yellow'),
            ],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    // Hewan lain, perubahan lain (pohon ditebang) — supaya "rumah berubah → pindah"
    // terasa sebagai aturan, bukan fakta tentang katak saja.
    {
      stage: 'pictorial',
      prompt: 'The tree is cut. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('🪵', 30, 78, 22), at('🐦', 30, 56, 16), at('🌳', 82, 56, 34), ground()],
        options: [
          {
            icon: '🌳',
            label: 'It finds a new tree',
            caption: 'It flies to a new home.',
            result: [at('🪵', 30, 78, 22), at('🌳', 82, 56, 34), at('🐦', 78, 40, 14, { fx: 'slide-right' }), ground()],
          },
          { icon: '🏠', label: 'It can stay', caption: 'It can stay.' },
          { icon: '😴', label: 'It sleeps there', caption: 'It sleeps there.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A frog needs a wet home.',
      visual: {
        kind: 'evidence-text',
        title: 'A fit',
        sentences: ['If the home no longer fits, the animal must leave or it cannot live there.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-habitat', [
      {
        ask: 'Why did this frog leave?',
        bg: 'day',
        base: [at('☀️', 82, 16, 16), bar(50, 84, 70, 10, 'brown'), at('🐸', 82, 66, 16), ground('yellow')],
        cards: [
          { icon: '🏜️', label: 'The pond dried' },
          { icon: '💧', label: 'The pond still fits' },
          { icon: '☀️', label: 'It needs less water' },
        ],
      },
      {
        ask: 'What made this bird leave?',
        bg: 'day',
        base: [at('🪵', 28, 76, 22), at('🐦', 72, 40, 16), at('🌳', 82, 52, 28), ground()],
        cards: [
          { icon: '🪓', label: 'The tree was cut' },
          { icon: '🌳', label: 'The tree still fits' },
          { icon: '🐸', label: 'Needs a dry pond' },
        ],
      },
      {
        ask: 'What is missing for this fish?',
        bg: 'day',
        base: [at('🐟', 50, 70, 20, { dim: true }), at('🏜️', 50, 42, 36), ground('yellow')],
        cards: [
          { icon: '💧', label: 'Water' },
          { icon: '🏜️', label: 'Dry sand' },
          { icon: '🌳', label: 'A tree' },
        ],
      },
      {
        ask: 'Why did these ants leave?',
        bg: 'cloudy',
        base: [at('🌧️', 40, 14, 20), bar(50, 86, 100, 16, 'blue'), at('🐜', 78, 58, 12), at('🐜', 88, 62, 12)],
        cards: [
          { icon: '🌊', label: 'The home flooded' },
          { icon: '🏠', label: 'The home still fits' },
          { icon: '☔', label: 'They need more rain' },
        ],
      },
      {
        ask: 'What keeps this frog here?',
        bg: 'day',
        base: [bar(50, 82, 74, 14, 'blue'), at('🐸', 50, 66, 20), ground()],
        cards: [
          { icon: '💦', label: 'A wet pond' },
          { icon: '🏜️', label: 'A dry pond' },
          { icon: '🚶', label: 'It must leave' },
        ],
      },
      {
        ask: 'What caused this bear to leave?',
        bg: 'day',
        base: [at('🐻‍❄️', 28, 62, 26), at('🧊', 62, 74, 16, { dim: true }), at('💧', 74, 70, 12), ground('blue')],
        cards: [
          { icon: '☀️', label: 'The ice melted' },
          { icon: '🧊', label: 'The ice still fits' },
          { icon: '🏜️', label: 'Dry sand fits' },
        ],
      },
      {
        ask: 'What does this crab need?',
        bg: 'day',
        base: [at('🦀', 50, 66, 24), at('🪨', 50, 80, 22), ground('yellow')],
        cards: [
          { icon: '🌊', label: 'A wet pool' },
          { icon: '🪨', label: 'A dry rock' },
          { icon: '🪺', label: 'A tree nest' },
        ],
      },
      {
        ask: 'Which part no longer fits?',
        bg: 'day',
        base: [at('🪵', 36, 76, 20), at('🐦', 74, 42, 16), ground()],
        cards: [
          { icon: '🏠', label: 'The broken home' },
          { icon: '🐦', label: 'The bird itself' },
          { icon: '☁️', label: 'The open sky' },
        ],
      },
    ]),
  ],
};
