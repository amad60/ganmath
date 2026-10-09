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
          { icon: '⬇️', label: 'It sinks', caption: 'It sinks.' },
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
        bg: 'day',
        base: [at('🌬️', 16, 30, 18), at('🪁', 56, 60, 22), ground()],
        cards: [
          { icon: '🪁', label: 'It flies up' },
          { icon: '🪨', label: 'It turns to rock' },
          { icon: '🌧️', label: 'It rains' },
        ],
      },
      {
        bg: 'day',
        base: [at('🎈', 50, 40, 34), at('📌', 76, 40, 14)],
        cards: [
          { icon: '💥', label: 'The air rushes out' },
          { icon: '🎈', label: 'It gets bigger' },
          { icon: '🌸', label: 'It grows a flower' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌬️', 16, 28, 18), at('🍂', 50, 82, 12), at('🍂', 64, 84, 12), ground()],
        cards: [
          { icon: '💨', label: 'The leaves blow away' },
          { icon: '🌱', label: 'They grow' },
          { icon: '🧊', label: 'They freeze' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌬️', 16, 30, 18), at('🎐', 60, 40, 24)],
        cards: [
          { icon: '🔔', label: 'It rings' },
          { icon: '🔥', label: 'It burns' },
          { icon: '😴', label: 'It sleeps' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌬️', 16, 28, 18), at('👕', 60, 48, 22), bar(60, 32, 70, 2, 'brown')],
        cards: [
          { icon: '👋', label: 'The shirt moves' },
          { icon: '🪨', label: 'It turns to rock' },
          { icon: '🌙', label: 'It is night' },
        ],
      },
    
      {
        bg: 'water',
        base: [at('🍾', 46, 48, 24), at('💧', 70, 70, 20)],
        cards: [
          { icon: '🫧', label: 'Bubbles rise' },
          { icon: '🪨', label: 'It turns to rock' },
          { icon: '🌱', label: 'It grows' },
        ],
      },
      {
        bg: 'room',
        base: [at('🌀', 28, 50, 22), at('📄', 68, 56, 18)],
        cards: [
          { icon: '💨', label: 'The paper moves' },
          { icon: '🪨', label: 'The paper stays' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'room',
        base: [at('⚽', 50, 58, 26), at('💨', 28, 40, 14)],
        cards: [
          { icon: '🎈', label: 'The ball gets bigger' },
          { icon: '🥀', label: 'It shrinks' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
    ]),
  ],
};
