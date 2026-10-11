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
          { icon: '💥', label: 'It breaks', caption: 'It breaks.' },
          { icon: '🪽', label: 'It flies', caption: 'It flies.' },
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
        ask: 'You push down on the lever.',
        bg: 'day',
        base: [bar(50, 74, 70, 3, 'brown'), at('🔺', 50, 84, 10), at('🪨', 22, 64, 16), at('👇', 78, 60, 14), ground()],
        cards: [
          { icon: '⬆️', label: 'The rock goes up' },
          { icon: '⬇️', label: 'It sinks down' },
          { icon: '🚫', label: 'The tool does nothing' },
        ],
      },
      {
        ask: 'The heavier person sits on the other end.',
        bg: 'day',
        base: [bar(50, 74, 76, 3, 'red'), at('🔺', 50, 84, 10), at('👧', 18, 60, 18), at('🧔', 82, 56, 26)],
        cards: [
          { icon: '🙋', label: 'The girl goes up' },
          { icon: '😴', label: 'They sleep' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        ask: 'You push the cart toward the ramp.',
        bg: 'day',
        base: [bar(56, 72, 60, 4, 'gray', { rotate: -20 }), at('🛒', 22, 80, 14), ground()],
        cards: [
          { icon: '🛒', label: 'It rolls up' },
          { icon: '🚫', label: 'The tool does nothing' },
          { icon: '❔', label: 'Hands and tools are the same' },
        ],
      },
      {
        ask: 'The ball is on a slope.',
        bg: 'day',
        base: [bar(44, 66, 56, 4, 'brown', { rotate: 26 }), at('⚽', 24, 46, 12), ground()],
        cards: [
          { icon: '⬇️', label: 'It rolls down' },
          { icon: '⬆️', label: 'It rolls up' },
          { icon: '🌙', label: 'It is night' },
        ],
      },
      {
        ask: 'You push the spoon under the lid.',
        bg: 'room',
        base: [at('🥫', 40, 64, 30), at('🥄', 66, 48, 20, { rotate: -30 })],
        cards: [
          { icon: '🔓', label: 'The lid comes off' },
          { icon: '🧊', label: 'It freezes' },
          { icon: '🌱', label: 'It grows' },
        ],
      },
    
      {
        ask: 'You push the box up the ramp.',
        bg: 'day',
        base: [at('📦', 62, 48, 20), at('📐', 40, 68, 28)],
        cards: [
          { icon: '⬆️', label: 'The box goes up' },
          { icon: '💥', label: 'It breaks' },
          { icon: '😴', label: 'They sleep' },
        ],
      },
      {
        ask: 'You push down on the lever under the rock.',
        bg: 'day',
        base: [at('🪨', 68, 64, 20), at('🪵', 36, 52, 28)],
        cards: [
          { icon: '⬆️', label: 'The rock lifts' },
          { icon: '⬇️', label: 'It sinks down' },
          { icon: '🚫', label: 'The tool does nothing' },
        ],
      },
      {
        ask: 'A ramp is in front of the cart.',
        bg: 'day',
        base: [at('🛒', 58, 58, 26), at('📐', 32, 70, 22)],
        cards: [
          { icon: '😊', label: 'The ramp helps' },
          { icon: '🧱', label: 'The wall stops it' },
          { icon: '❄️', label: 'It freezes' },
        ],
      },
    ]),
  ],
};
