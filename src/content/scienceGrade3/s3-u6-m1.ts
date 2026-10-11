import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

export const rampsAndLevers: ContentModule = {
  id: 's3-u6-m1',
  unitId: 's3-u6',
  grade: 3,
  title: 'Ramps and Levers',
  icon: '🪵',
  prereq: ['s3-u5-m1'],
  skills: ['sci-ramp'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['ramp', 'help', 'heavy', 'lever', 'lift', 'rock', 'use', 'hand', 'hands', 'push', 'pushes', 'alone', 'cannot', 'box', 'easy', 'goes', 'go', 'breaks', 'fly', 'flies'],

  learn: [
    // Batunya sama beratnya; yang diubah hanya alatnya. Tangan saja → batu hanya
    // bergoyang. Dengan tuas → ujung panjang ditekan, batu terangkat. Papan
    // diputar ±14°, cukup untuk terbaca "naik" tanpa animasi rotasi tambahan.
    {
      stage: 'concrete',
      prompt: 'Lift the rock with a lever, or hands.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('🪨', 24, 70, 18), at('🧒', 76, 64, 24), ground()],
        options: [
          {
            icon: '🪵',
            label: 'Lever',
            caption: 'Push down here. The rock goes up.',
            result: [
              bar(48, 76, 70, 3, 'brown', { rotate: 14 }),
              at('🔺', 30, 79, 12),
              at('🪨', 16, 54, 16, { fx: 'rise' }),
              at('👇', 80, 72, 14, { fx: 'pulse' }),
              ground(),
            ],
          },
          {
            icon: '✋',
            label: 'Hands',
            caption: 'Hands alone cannot lift it.',
            result: [at('🪨', 40, 72, 22, { fx: 'shake' }), at('🧒', 64, 64, 24), ground()],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    // Bidang miring: benda berat naik dengan dorongan, bukan diangkat.
    // Soal gambar tidak memakai kotak-di-ramp supaya tebakan ini bukan kuncinya.
    {
      stage: 'pictorial',
      prompt: 'Push a box up the ramp. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [bar(60, 70, 60, 4, 'brown', { rotate: -22 }), at('📦', 24, 78, 14), at('🧒', 10, 72, 20), ground()],
        options: [
          {
            icon: '⬆️',
            label: 'It goes up',
            caption: 'A ramp makes the push easy.',
            result: [
              bar(60, 70, 60, 4, 'brown', { rotate: -22 }),
              at('📦', 76, 48, 14, { fx: 'slide-right' }),
              at('🧒', 60, 58, 20, { fx: 'slide-right' }),
              ground(),
            ],
          },
          { icon: '⬇️', label: 'It stays down', caption: 'It stays down.' },
          { icon: '✋', label: 'Hands must lift it', caption: 'Hands must lift it.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A lever can lift a rock.',
      visual: {
        kind: 'evidence-text',
        title: 'Two helpers',
        sentences: ['A ramp makes a push easier. A lever can lift what hands cannot.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-ramp', [
      {
        ask: 'What helps lift this rock?',
        bg: 'day',
        base: [bar(48, 72, 70, 3, 'brown', { rotate: 14 }), at('🔺', 30, 78, 12), at('🪨', 16, 52, 16), ground()],
        cards: [
          { icon: '⬆️', label: 'A lever' },
          { icon: '✋', label: 'Hands alone' },
          { icon: '🪨', label: 'The rock itself' },
        ],
      },
      {
        ask: 'What made this push easy?',
        bg: 'day',
        base: [bar(58, 68, 64, 4, 'brown', { rotate: -22 }), at('📦', 78, 46, 14), ground()],
        cards: [
          { icon: '📐', label: 'The ramp' },
          { icon: '🧱', label: 'A steep wall' },
          { icon: '✋', label: 'Hands alone' },
        ],
      },
      {
        ask: 'Why is this girl up?',
        bg: 'day',
        base: [bar(50, 70, 76, 3, 'red', { rotate: -12 }), at('🔺', 50, 80, 10), at('👧', 18, 52, 18), at('🧔', 82, 62, 24)],
        cards: [
          { icon: '⬇️', label: 'The heavy end went down' },
          { icon: '👧', label: 'The light end is heavier' },
          { icon: '📐', label: 'It is a ramp' },
        ],
      },
      {
        ask: 'Which part lifted this lid?',
        bg: 'room',
        base: [at('🥫', 36, 62, 28), at('🥄', 64, 44, 18, { rotate: -30 })],
        cards: [
          { icon: '🪵', label: 'The spoon lever' },
          { icon: '🥫', label: 'The lid jumped' },
          { icon: '💪', label: 'A harder pull' },
        ],
      },
      {
        ask: 'What helps this cart go up?',
        bg: 'day',
        base: [bar(56, 68, 60, 4, 'gray', { rotate: -20 }), at('🛒', 78, 48, 16), ground()],
        cards: [
          { icon: '📐', label: 'A ramp helps the push' },
          { icon: '🧱', label: 'A flat wall' },
          { icon: '🛒', label: 'No push at all' },
        ],
      },
      {
        ask: 'What keeps this push easy?',
        bg: 'day',
        base: [bar(56, 68, 64, 4, 'brown', { rotate: -18 }), at('🧳', 78, 46, 16), ground()],
        cards: [
          { icon: '📐', label: 'A long ramp' },
          { icon: '⬆️', label: 'Lifting straight up' },
          { icon: '🛞', label: 'A broken wheel' },
        ],
      },
      {
        ask: 'What caused this book to rise?',
        bg: 'room',
        base: [bar(48, 64, 64, 3, 'brown', { rotate: 16 }), at('🔺', 34, 74, 10), at('📗', 18, 46, 16)],
        cards: [
          { icon: '🪵', label: 'The ruler lever' },
          { icon: '📗', label: 'The book rose alone' },
          { icon: '📐', label: 'A ramp under it' },
        ],
      },
      {
        ask: 'What is missing to lift it?',
        bg: 'day',
        base: [at('🪨', 40, 70, 24), at('🧒', 70, 62, 24), ground()],
        cards: [
          { icon: '🪵', label: 'A lever is missing' },
          { icon: '🙌', label: 'More hands' },
          { icon: '🪨', label: 'A bigger rock' },
        ],
      },
    ]),
  ],
};
