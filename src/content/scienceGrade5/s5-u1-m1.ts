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
        // Air sama, satu tanaman tertutup. Hanya cahaya yang berubah.
        ask: 'Why is this plant test fair?',
        bg: 'day',
        base: [at('💧', 26, 74, 10), at('💧', 72, 74, 10), at('🌱', 28, 56, 18), at('📦', 70, 50, 16), at('🌱', 72, 64, 14), ground('brown')],
        cards: [
          { icon: '🔬', label: 'Only the light changed' },
          { icon: '💧', label: 'The water changed too' },
          { icon: '❓', label: 'You still know the cause' },
        ],
      },
      {
        // Cahaya sama. Yang berubah hanya airnya.
        ask: 'What did this fair test change?',
        bg: 'day',
        base: [at('☀️', 50, 14, 14), at('💧', 28, 74, 10), at('🌱', 30, 56, 18), at('🏜️', 72, 72, 14), at('🌱', 72, 52, 16), ground('brown')],
        cards: [
          { icon: '🧪', label: 'Only the water' },
          { icon: '☀️', label: 'The light changed too' },
          { icon: '⚖️', label: 'Both changes still show it' },
        ],
      },
      {
        // Tertutup dan basah lawan terbuka dan kering. Dua hal berubah.
        ask: 'Why is this test not fair?',
        bg: 'day',
        base: [
          at('📦', 28, 46, 16),
          at('💧', 30, 76, 10),
          at('🌱', 30, 62, 14),
          at('☀️', 78, 16, 14),
          at('🏜️', 74, 74, 12),
          at('🌱', 72, 54, 16),
          ground('brown'),
        ],
        cards: [
          { icon: '❓', label: 'You cannot tell the cause' },
          { icon: '🔬', label: 'You still know the cause' },
          { icon: '💧', label: 'Only the light changed' },
        ],
      },
      {
        // Benda baru: dua cangkir, minuman sama, hanya tutupnya beda.
        ask: 'What keeps this cup test fair?',
        bg: 'room',
        base: [at('☕', 32, 60, 20), at('📦', 70, 42, 16), at('☕', 70, 62, 18)],
        cards: [
          { icon: '🔒', label: 'Only the cover changed' },
          { icon: '🍬', label: 'Heat and sugar changed' },
          { icon: '⚖️', label: 'Both changes still show it' },
        ],
      },
      {
        // Benda baru: dua es, piring sama, hanya matahari yang beda.
        ask: 'Why is this ice test fair?',
        bg: 'day',
        base: [
          at('☀️', 16, 16, 14),
          at('🧊', 30, 56, 16),
          at('🍽️', 30, 74, 14),
          at('📦', 74, 42, 16),
          at('🧊', 72, 58, 16),
          at('🍽️', 72, 74, 14),
        ],
        cards: [
          { icon: '🔬', label: 'Only the sun changed' },
          { icon: '🍽️', label: 'The dish changed too' },
          { icon: '🧪', label: 'Two changes still name it' },
        ],
      },
      {
        // Es: matahari dan piring sama-sama berubah, sebabnya tidak bisa disebut.
        ask: 'What made this ice test not fair?',
        bg: 'day',
        base: [
          at('☀️', 16, 16, 14),
          at('🧊', 28, 52, 14),
          at('🔴', 28, 72, 14),
          at('📦', 78, 40, 14),
          at('🧊', 72, 52, 14),
          at('🔵', 72, 72, 14),
        ],
        cards: [
          { icon: '⚖️', label: 'Sun and dish both changed' },
          { icon: '🔬', label: 'Only one thing changed' },
          { icon: '🧪', label: 'Two changes still name it' },
        ],
      },
      {
        // Benda baru: satu minuman, dua sendok. Yang beda hanya sendoknya.
        ask: 'Why is this spoon test fair?',
        bg: 'room',
        base: [at('☕', 50, 64, 24), at('🥄', 36, 40, 16), at('🪵', 66, 42, 16)],
        cards: [
          { icon: '🔬', label: 'Only the spoon changed' },
          { icon: '☕', label: 'The drink changed too' },
          { icon: '❔', label: 'You can still name it' },
        ],
      },
      {
        // Kertas basah di matahari lawan kertas kering yang tertutup.
        ask: 'Why can you not tell the cause?',
        bg: 'day',
        base: [
          at('☀️', 18, 16, 14),
          at('💧', 30, 72, 10),
          at('📄', 32, 54, 18),
          at('📦', 74, 44, 16),
          at('🏜️', 76, 72, 12),
          at('📄', 70, 56, 16),
          ground('brown'),
        ],
        cards: [
          { icon: '⚖️', label: 'Water and light both changed' },
          { icon: '☀️', label: 'Only the light changed' },
          { icon: '❔', label: 'You can still name it' },
        ],
      },
    ]),
  ],
};
