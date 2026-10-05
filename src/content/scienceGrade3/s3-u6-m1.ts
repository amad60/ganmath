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
  questionTypes: ['clue-tap', 'choose-text', 'pick-picture'],
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
    {
      type: 'clue-tap',
      skill: 'sci-ramp',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows the ramp or the lever?',
      visual: (p) => {
        const stories = [
          {
            title: 'The step',
            sentences: ['The box is heavy.', 'The ramp helps her push it up.'],
          },
          {
            title: 'The rock',
            sentences: ['The rock is big.', 'A lever lifts the rock.'],
          },
          {
            title: 'Straight up',
            sentences: ['He cannot lift the box.', 'The ramp makes the move easier.'],
          },
          {
            title: 'The log',
            sentences: ['The log is the lever.', 'She pushes down and the rock goes up.'],
          },
          {
            title: 'A long ramp',
            sentences: ['The short ramp is steep.', 'A longer ramp makes the push easier.'],
          },
        ];
        return {
          kind: 'evidence-text',
          title: stories[p.s as number]?.title,
          sentences: stories[p.s as number]?.sentences ?? [],
        };
      },
    },
    {
      type: 'choose-text',
      skill: 'sci-ramp',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A heavy box must go up a step. What helps?',
          'What can a lever do?',
          'Why use a ramp for a heavy box?',
          'She pushes the long end of a lever down. What happens to the rock?',
          'Which ramp makes the push easier?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['A ramp', 'A pale leaf', 'A dry pond', 'Thick fur'],
          ['Lift a rock', 'Make a leaf pale', 'Dry a pond', 'Fill a balloon with soil'],
          ['The push is easier', 'The box gets heavier', 'The box falls faster', 'The box turns to air'],
          ['It lifts up', 'It becomes air', 'It grows fur', 'It leaves the pond'],
          ['A long low ramp', 'A short steep ramp', 'A high step with no ramp', 'A rough wall'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
    whatHappensNext('sci-ramp', [
      {
        bg: 'day',
        base: [bar(50, 74, 70, 3, 'brown'), at('🔺', 50, 84, 10), at('🪨', 22, 64, 16), at('👇', 78, 60, 14), ground()],
        cards: [
          { icon: '⬆️', label: 'The rock goes up' },
          { icon: '⬇️', label: 'It sinks down' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'day',
        base: [bar(50, 74, 76, 3, 'red'), at('🔺', 50, 84, 10), at('👧', 18, 60, 18), at('🧔', 82, 56, 26)],
        cards: [
          { icon: '🙋', label: 'The girl goes up' },
          { icon: '😴', label: 'They sleep' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'day',
        base: [bar(56, 72, 60, 4, 'gray', { rotate: -20 }), at('🛒', 22, 80, 14), ground()],
        cards: [
          { icon: '🛒', label: 'It rolls up' },
          { icon: '🔥', label: 'It burns' },
          { icon: '🌧️', label: 'It rains' },
        ],
      },
      {
        bg: 'day',
        base: [bar(44, 66, 56, 4, 'brown', { rotate: 26 }), at('⚽', 24, 46, 12), ground()],
        cards: [
          { icon: '⬇️', label: 'It rolls down' },
          { icon: '⬆️', label: 'It rolls up' },
          { icon: '🌙', label: 'It is night' },
        ],
      },
      {
        bg: 'room',
        base: [at('🥫', 40, 64, 30), at('🥄', 66, 48, 20, { rotate: -30 })],
        cards: [
          { icon: '🔓', label: 'The lid comes off' },
          { icon: '🧊', label: 'It freezes' },
          { icon: '🌱', label: 'It grows' },
        ],
      },
    ]),
  ],
};
