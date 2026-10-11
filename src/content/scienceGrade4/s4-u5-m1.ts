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
      prompt: 'Same ends, or not the same.',
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
        ask: 'Why are these ends apart?',
        base: [at('🔴', 20, 50, 16), at('🔴', 80, 50, 16)],
        cards: [
          { icon: '↔️', label: 'Same ends push away' },
          { icon: '🤝', label: 'Same ends pull together' },
          { icon: '🚫', label: 'These ends do nothing' },
        ],
      },
      {
        bg: 'plain',
        ask: 'Why do these ends meet?',
        base: [at('🔴', 42, 50, 16), at('🔵', 58, 50, 16)],
        cards: [
          { icon: '🤝', label: 'Different ends pull' },
          { icon: '↔️', label: 'Different ends push' },
          { icon: '🧲', label: 'These ends do nothing' },
        ],
      },
      {
        bg: 'plain',
        ask: 'What caused this wide gap?',
        base: [at('🔵', 18, 50, 16), at('🔵', 82, 50, 16)],
        cards: [
          { icon: '↔️', label: 'Same ends push away' },
          { icon: '🤝', label: 'Same blue ends pull' },
          { icon: '🧲', label: 'Magnets only pull' },
        ],
      },
      {
        bg: 'plain',
        ask: 'What keeps these ends together?',
        base: [at('🔴', 32, 50, 14), at('📄', 50, 50, 14), at('🔵', 68, 50, 14)],
        cards: [
          { icon: '🤝', label: 'Different ends still pull' },
          { icon: '↔️', label: 'The paper makes them push' },
          { icon: '🚫', label: 'Paper stops all pulls' },
        ],
      },
      {
        bg: 'plain',
        ask: 'Why are these boats apart?',
        base: [at('⛵', 16, 56, 18), at('🔴', 30, 40, 10), at('⛵', 84, 56, 18), at('🔴', 70, 40, 10)],
        cards: [
          { icon: '↔️', label: 'Same ends push the boats' },
          { icon: '🤝', label: 'Same ends pull the boats' },
          { icon: '🧲', label: 'Magnets only pull' },
        ],
      },
      {
        bg: 'plain',
        ask: 'What made these boats meet?',
        base: [at('⛵', 34, 56, 18), at('🔴', 46, 40, 10), at('⛵', 66, 56, 18), at('🔵', 56, 40, 10)],
        cards: [
          { icon: '🤝', label: 'Different ends pull' },
          { icon: '↔️', label: 'Different ends push boats' },
          { icon: '🧲', label: 'All ends pull together' },
        ],
      },
      {
        bg: 'plain',
        ask: 'What did the same ends do?',
        base: [at('🚂', 16, 55, 20), at('🔴', 34, 38, 10), at('🚂', 84, 55, 20), at('🔴', 66, 38, 10)],
        cards: [
          { icon: '↔️', label: 'They pushed the trains apart' },
          { icon: '🤝', label: 'They pulled the trains' },
          { icon: '🚫', label: 'The ends did nothing' },
        ],
      },
      {
        bg: 'plain',
        ask: 'Which part pulls these trains?',
        base: [at('🚂', 34, 55, 18), at('🔴', 46, 38, 10), at('🚂', 66, 55, 18), at('🔵', 56, 38, 10)],
        cards: [
          { icon: '🤝', label: 'The ends that differ' },
          { icon: '↔️', label: 'The ends that are the same' },
          { icon: '🧲', label: 'Every end pulls a train' },
        ],
      },
    ]),
  ],
};
