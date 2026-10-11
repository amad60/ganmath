import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

export const airTakesSpace: ContentModule = {
  id: 's3-u4-m1',
  unitId: 's3-u4',
  grade: 3,
  title: 'Air Takes Space',
  icon: '🎈',
  prereq: ['s3-u3-m1'],
  skills: ['sci-air'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['air', 'balloon', 'wind', 'move', 'blow', 'out', 'let', 'fill', 'fills', 'get', 'gets', 'boat', 'sail', 'stay', 'stays', 'sink', 'moving', 'pushes'],

  learn: [
    // Udara tidak terlihat, jadi yang ditunjukkan adalah RUANG yang dipakainya:
    // balon membesar saat udara masuk dan mengecil saat udaranya keluar.
    {
      stage: 'concrete',
      prompt: 'Blow air in, or let it out.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('🎈', 50, 44, 22), at('🧒', 24, 70, 22)],
        options: [
          {
            icon: '🌬️',
            label: 'Blow in',
            caption: 'Air fills the balloon. It gets big.',
            result: [at('🎈', 54, 36, 40, { fx: 'grow' }), at('🧒', 20, 70, 22)],
          },
          {
            icon: '💨',
            label: 'Let out',
            caption: 'The air goes out. It gets small.',
            result: [
              at('🎈', 54, 54, 12, { fx: 'shrink' }),
              at('💨', 76, 40, 14, { fx: 'slide-right' }),
              at('🧒', 20, 70, 22),
            ],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    // Angin = udara yang bergerak, dan udara yang bergerak bisa mendorong benda.
    // Perahu layar dipakai di sini saja; soal gambar memakai layang-layang, kincir, dll.
    {
      stage: 'pictorial',
      prompt: 'Wind blows on the boat. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'water',
        base: [at('🌬️', 14, 30, 18), at('⛵', 42, 50, 28)],
        options: [
          {
            icon: '⛵',
            label: 'It moves',
            caption: 'Moving air pushes the sail.',
            result: [at('🌬️', 14, 30, 18), at('💨', 34, 30, 12, { fx: 'slide-right' }), at('⛵', 70, 50, 28, { fx: 'slide-right' })],
          },
          { icon: '🛑', label: 'It stays', caption: 'It stays.' },
          { icon: '⬇️', label: 'The sail falls', caption: 'The sail falls.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Wind moves the air.',
      visual: {
        kind: 'evidence-text',
        title: 'You cannot see it',
        sentences: ['Air takes space even when you cannot see it. Wind is air on the move.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-air', [
      {
        ask: 'What keeps this balloon big?',
        bg: 'room',
        base: [at('🎈', 54, 40, 40), at('🧒', 18, 70, 22)],
        cards: [
          { icon: '💨', label: 'Air inside it' },
          { icon: '🕳️', label: 'It is empty' },
          { icon: '💧', label: 'Water inside it' },
        ],
      },
      {
        ask: 'What made these bubbles?',
        bg: 'water',
        base: [at('🍾', 36, 42, 22), at('🫧', 62, 36, 16), at('🫧', 74, 52, 12)],
        cards: [
          { icon: '💨', label: 'Air in the water' },
          { icon: '🚫', label: 'Air is empty' },
          { icon: '💧', label: 'Water made them' },
        ],
      },
      {
        ask: 'What keeps this kite up?',
        bg: 'day',
        base: [at('🪁', 62, 28, 24), bar(40, 70, 2, 50, 'gray'), ground()],
        cards: [
          { icon: '🌬️', label: 'Moving air' },
          { icon: '🧵', label: 'The string lifts it' },
          { icon: '🚫', label: 'Air cannot push' },
        ],
      },
      {
        ask: 'Why did this balloon get small?',
        bg: 'room',
        base: [at('🎈', 54, 52, 14), at('🧒', 20, 70, 22)],
        cards: [
          { icon: '💨', label: 'Air went out' },
          { icon: '🎈', label: 'More air went in' },
          { icon: '🚫', label: 'Air takes no space' },
        ],
      },
      {
        ask: 'What made this paper move?',
        bg: 'room',
        base: [at('🌀', 24, 50, 22), at('📄', 72, 48, 16)],
        cards: [
          { icon: '💨', label: 'Air from the fan' },
          { icon: '📄', label: 'The paper moved alone' },
          { icon: '🕳️', label: 'Air is empty' },
        ],
      },
      {
        ask: 'What helps this chime move?',
        bg: 'day',
        base: [at('🎐', 58, 42, 26), ground()],
        cards: [
          { icon: '🌬️', label: 'Wind is moving air' },
          { icon: '😴', label: 'Still air' },
          { icon: '🚫', label: 'No air at all' },
        ],
      },
      {
        ask: 'What caused the leaves to move?',
        bg: 'day',
        base: [at('🍂', 36, 70, 14), at('🍂', 58, 48, 14), at('🍂', 74, 62, 12), ground()],
        cards: [
          { icon: '🌬️', label: 'Wind pushed them' },
          { icon: '🍂', label: 'The leaves jumped' },
          { icon: '🚫', label: 'Air cannot push' },
        ],
      },
      {
        ask: 'What is missing in this ball?',
        bg: 'room',
        base: [at('⚽', 50, 58, 14)],
        cards: [
          { icon: '💨', label: 'Air to fill it' },
          { icon: '💧', label: 'Water to fill it' },
          { icon: '🚫', label: 'It needs no air' },
        ],
      },
    ]),
  ],
};
