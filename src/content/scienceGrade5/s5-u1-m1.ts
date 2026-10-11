import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

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
      prompt: 'Light on one plant, or dark.',
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
          { icon: '💧', label: 'Water makes it pale', caption: 'Water makes it pale.' },
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
        // Air sama di kedua pot. Satu tertutup, satu kena cahaya. Hanya cahaya yang berubah.
        ask: 'Why is this plant test fair?',
        bg: 'day',
        base: [at('💧', 26, 74, 10), at('💧', 72, 74, 10), at('🌱', 28, 56, 18), at('📦', 70, 50, 16), at('🌱', 72, 64, 14), ground('brown')],
        cards: [
          { icon: '🔬', label: 'Only light' },
          { icon: '💦', label: 'Water too' },
          { icon: '⚖️', label: 'Both differ' },
        ],
      },
      {
        // Satu matahari. Dua pot: satu basah, satu tanah cokelat kering. Hanya air yang berubah.
        ask: 'What did this fair test change?',
        bg: 'day',
        base: [
          at('☀️', 50, 14, 16),
          at('🪴', 28, 46, 22),
          at('💧', 28, 68, 14),
          bar(28, 82, 30, 12, 'brown'),
          at('🪴', 74, 46, 22),
          bar(74, 82, 30, 14, 'brown'),
        ],
        cards: [
          { icon: '🧪', label: 'Only water' },
          { icon: '💡', label: 'Light too' },
          { icon: '⚖️', label: 'Both differ' },
        ],
      },
      {
        // Basah dan tertutup lawan kering di matahari. Dua hal berubah, sebabnya tidak bisa disebut.
        ask: 'Why is this test not fair?',
        bg: 'day',
        base: [
          at('📦', 28, 32, 16),
          at('💧', 28, 68, 12),
          at('🪴', 28, 50, 18),
          bar(28, 82, 28, 12, 'brown'),
          at('☀️', 78, 14, 14),
          at('🪴', 74, 48, 18),
          bar(74, 82, 30, 14, 'brown'),
        ],
        cards: [
          { icon: '❓', label: 'Both differ' },
          { icon: '🔬', label: 'Only light' },
          { icon: '🧪', label: 'Only water' },
        ],
      },
      {
        // Dua cangkir, minuman sama. Hanya tutupnya yang beda.
        ask: 'What keeps this cup test fair?',
        bg: 'room',
        base: [at('☕', 30, 62, 22), at('☕', 72, 62, 22), at('📦', 72, 40, 16)],
        cards: [
          { icon: '🔒', label: 'Only the cover' },
          { icon: '🍬', label: 'Heat and sugar' },
          { icon: '⚖️', label: 'Both differ' },
        ],
      },
      {
        // Dua es, piring sama. Satu di matahari, satu tertutup. Hanya matahari yang beda.
        ask: 'Why is this ice test fair?',
        bg: 'day',
        base: [
          at('☀️', 16, 16, 14),
          at('🧊', 30, 52, 16),
          at('🍽️', 30, 74, 14),
          at('📦', 74, 36, 16),
          at('🧊', 72, 54, 16),
          at('🍽️', 72, 74, 14),
        ],
        cards: [
          { icon: '🔬', label: 'Only the sun' },
          { icon: '🥣', label: 'Dish too' },
          { icon: '⚖️', label: 'Both differ' },
        ],
      },
      {
        // Matahari dan piring sama-sama berubah. Sebabnya tidak bisa disebut.
        ask: 'What made this ice test not fair?',
        bg: 'day',
        base: [
          at('☀️', 16, 16, 14),
          at('🧊', 28, 50, 14),
          at('🔴', 28, 72, 14),
          at('📦', 78, 36, 14),
          at('🧊', 72, 50, 14),
          at('🔵', 72, 72, 14),
        ],
        cards: [
          { icon: '⚖️', label: 'Sun and dish' },
          { icon: '🔬', label: 'Only the sun' },
          { icon: '🧪', label: 'You can name it' },
        ],
      },
      {
        // Dua minuman sama. Satu sendok logam, satu sendok kayu. Hanya sendok yang beda.
        ask: 'Why is this spoon test fair?',
        bg: 'room',
        base: [at('☕', 30, 64, 22), at('🥄', 30, 40, 16), at('☕', 72, 64, 22), at('🪵', 72, 40, 16)],
        cards: [
          { icon: '🔬', label: 'Only the spoon' },
          { icon: '🍵', label: 'Drink too' },
          { icon: '⚖️', label: 'Both differ' },
        ],
      },
      {
        // Kertas basah di matahari lawan kertas kering yang tertutup. Air dan cahaya berubah.
        ask: 'Why can you not tell the cause?',
        bg: 'day',
        base: [
          at('☀️', 18, 16, 14),
          at('💧', 30, 72, 12),
          at('📄', 32, 50, 18),
          at('📦', 74, 38, 16),
          at('📄', 72, 56, 16),
        ],
        cards: [
          { icon: '⚖️', label: 'Water and light' },
          { icon: '💡', label: 'Only light' },
          { icon: '❔', label: 'You can name it' },
        ],
      },
    ]),
  ],
};
