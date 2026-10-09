import type { ContentModule } from '../types';
import { at, whatHappensNext } from '../scienceScene';

export const polesPushAndPull: ContentModule = {
  id: 's4-u5-m1',
  unitId: 's4-u5',
  grade: 4,
  title: 'Poles Push and Pull',
  icon: '🧲',
  prereq: ['s4-u4-m1'],
  skills: ['sci-poles'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['push', 'pull', 'magnet'],

  learn: [
    // Ujung yang sama menolak. Ujung yang beda tarik-menarik. Bukan "magnet selalu menarik".
    {
      stage: 'concrete',
      prompt: 'Same ends, or not the same.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'plain',
        base: [at('🧲', 30, 52, 22), at('🧲', 70, 52, 22)],
        options: [
          {
            icon: '🔴',
            label: 'Same',
            caption: 'Same ends push away.',
            result: [
              at('🔴', 18, 52, 16, { fx: 'slide-left' }),
              at('🔴', 82, 52, 16, { fx: 'slide-right' }),
            ],
          },
          {
            icon: '🔵',
            label: 'Not same',
            caption: 'Not the same. They pull.',
            result: [
              at('🔴', 42, 52, 16, { fx: 'slide-right' }),
              at('🔵', 58, 52, 16, { fx: 'slide-left' }),
            ],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'See this. See what changes.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'plain',
        base: [at('🚗', 28, 58, 20), at('🔴', 40, 42, 12), at('🚗', 72, 58, 20), at('🔴', 60, 42, 12)],
        options: [
          {
            icon: '↔️',
            label: 'They push away',
            caption: 'They push away.',
            result: [at('🚗', 16, 58, 18, { fx: 'slide-left' }), at('🚗', 84, 58, 18, { fx: 'slide-right' })],
          },
          { icon: '🤝', label: 'They pull', caption: 'They pull.' },
          { icon: '🌳', label: 'It grows big', caption: 'It grows big.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Same magnet ends push away.',
      visual: {
        kind: 'evidence-text',
        title: 'Ends',
        sentences: [
          'Same magnet ends push away.',
          'Ends that are not the same pull together.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-poles', [
      {
        bg: 'plain',
        base: [at('🔴', 40, 50, 16), at('🔴', 60, 50, 16)],
        cards: [
          { icon: '↔️', label: 'They push away' },
          { icon: '🤝', label: 'They pull' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'plain',
        base: [at('🔴', 40, 50, 16), at('🔵', 60, 50, 16)],
        cards: [
          { icon: '🤝', label: 'They pull' },
          { icon: '↔️', label: 'They push away' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'plain',
        base: [at('🔵', 36, 50, 16), at('🔵', 64, 50, 16)],
        cards: [
          { icon: '👐', label: 'They push away' },
          { icon: '🤗', label: 'They pull' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🚗', 30, 58, 18), at('🔴', 42, 40, 10), at('🚗', 70, 58, 18), at('🔴', 58, 40, 10)],
        cards: [
          { icon: '↔️', label: 'The cars push away' },
          { icon: '🚃', label: 'The cars pull in' },
          { icon: '🐟', label: 'They swim' },
        ],
      },
      {
        bg: 'room',
        base: [at('🚗', 32, 58, 18), at('🔴', 44, 40, 10), at('🚙', 70, 58, 18), at('🔵', 58, 40, 10)],
        cards: [
          { icon: '🚃', label: 'The cars pull in' },
          { icon: '🚗', label: 'The cars push away' },
          { icon: '❄️', label: 'They freeze' },
        ],
      },
      {
        bg: 'plain',
        base: [at('✋', 28, 55, 18), at('🔴', 40, 40, 10), at('✋', 72, 55, 18), at('🔴', 60, 40, 10)],
        cards: [
          { icon: '🙌', label: 'The hands push out' },
          { icon: '👏', label: 'The hands pull in' },
          { icon: '🌻', label: 'A flower comes' },
        ],
      },
      {
        bg: 'plain',
        base: [at('✋', 30, 55, 18), at('🔴', 42, 38, 10), at('✋', 70, 55, 18), at('🔵', 58, 38, 10)],
        cards: [
          { icon: '👏', label: 'The hands pull in' },
          { icon: '🙌', label: 'The hands push out' },
          { icon: '🔔', label: 'They ring' },
        ],
      },
      {
        bg: 'plain',
        base: [at('🔴', 32, 50, 14), at('📄', 50, 50, 14), at('🔵', 68, 50, 14)],
        cards: [
          { icon: '🤝', label: 'They still pull' },
          { icon: '↔️', label: 'They push away' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
    ]),
  ],
};
