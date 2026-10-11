import type { ContentModule } from '../types';
import { at, whatHappensNext } from '../scienceScene';

export const floatOrSink: ContentModule = {
  id: 's4-u7-m1',
  unitId: 's4-u7',
  grade: 4,
  title: 'Float or Sink',
  icon: '⛵',
  prereq: ['s4-u6-m1'],
  skills: ['sci-float'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['boat', 'shape', 'lump', 'float', 'sink'],

  learn: [
    // Bahannya sama (tanah liat). Yang berubah bentuknya: perahu atau gumpalan.
    {
      stage: 'concrete',
      prompt: 'A boat shape, or a lump.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'water',
        base: [at('🌊', 50, 62, 36)],
        options: [
          {
            icon: '⛵',
            label: 'Boat',
            caption: 'The boat shape floats.',
            result: [at('⛵', 50, 42, 28, { fx: 'rise' }), at('⬆️', 74, 28, 12), at('🌊', 50, 70, 28)],
          },
          {
            icon: '⚫',
            label: 'Lump',
            caption: 'The lump sinks.',
            result: [at('🌊', 50, 48, 30), at('⚫', 50, 78, 16, { fx: 'fall' }), at('⬇️', 28, 74, 12)],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'A boat shape, or a lump.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'water',
        base: [at('🥄', 50, 28, 18), at('🌊', 50, 64, 32)],
        options: [
          {
            icon: '⬇️',
            label: 'The lump sinks',
            caption: 'The lump sinks.',
            result: [at('🌊', 50, 46, 28), at('🥄', 50, 78, 14, { fx: 'fall' })],
          },
          { icon: '⛵', label: 'It floats', caption: 'It floats.' },
          { icon: '🌳', label: 'It grows big', caption: 'It grows big.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A boat shape floats.',
      visual: {
        kind: 'evidence-text',
        title: 'Shape',
        sentences: [
          'A boat shape floats. A lump of the same thing sinks.',
          'A boat with a hole fills, and then it sinks.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-float', [
      {
        bg: 'water',
        ask: 'Why does this boat float?',
        base: [at('⛵', 50, 34, 26), at('🌊', 50, 70, 28)],
        cards: [
          { icon: '🛟', label: 'Boat shape' },
          { icon: '⚫', label: 'Material floats it' },
          { icon: '🎲', label: 'The water chose it' },
        ],
      },
      {
        bg: 'water',
        ask: 'Why did this lump sink?',
        base: [at('🌊', 50, 40, 30), at('⚫', 50, 78, 16)],
        cards: [
          { icon: '⬇️', label: 'A solid lump' },
          { icon: '🛟', label: 'A lump should float' },
          { icon: '🎲', label: 'The water chose it' },
        ],
      },
      {
        bg: 'water',
        ask: 'What caused this boat to sink?',
        base: [at('🌊', 50, 38, 28), at('⛵', 50, 74, 20), at('🕳️', 62, 68, 12)],
        cards: [
          { icon: '💧', label: 'Water filled the boat' },
          { icon: '🛟', label: 'Shape always floats' },
          { icon: '⚫', label: 'Material sank it' },
        ],
      },
      {
        bg: 'water',
        ask: 'Why does this bowl float?',
        base: [at('🥣', 50, 34, 26), at('🌊', 50, 70, 28)],
        cards: [
          { icon: '🛟', label: 'Boat shape' },
          { icon: '⚫', label: 'The stuff always sinks' },
          { icon: '🎲', label: 'Water chose this bowl' },
        ],
      },
      {
        bg: 'water',
        ask: 'Why did this marble sink?',
        base: [at('🌊', 50, 40, 28), at('🔮', 50, 78, 14)],
        cards: [
          { icon: '⚫', label: 'A solid lump' },
          { icon: '🛟', label: 'A round thing floats' },
          { icon: '🎲', label: 'Water picked the marble' },
        ],
      },
      {
        bg: 'water',
        ask: 'What keeps this ship up?',
        base: [at('🚢', 50, 34, 28), at('🌊', 50, 70, 26)],
        cards: [
          { icon: '🛟', label: 'Its wide boat shape' },
          { icon: '⚓', label: 'Heavy ships always sink' },
          { icon: '⚙️', label: 'Metal makes it sink' },
        ],
      },
      {
        bg: 'water',
        ask: 'What made this coin sink?',
        base: [at('🌊', 50, 40, 28), at('🪙', 50, 78, 14)],
        cards: [
          { icon: '⬇️', label: 'A solid lump' },
          { icon: '🛟', label: 'Flat coins always float' },
          { icon: '🎲', label: 'Water picked it' },
        ],
      },
      {
        bg: 'water',
        ask: 'Which part keeps this canoe up?',
        base: [at('🛶', 50, 34, 26), at('🌊', 50, 70, 26)],
        cards: [
          { icon: '🛟', label: 'The open boat shape' },
          { icon: '⚫', label: 'Material holds it' },
          { icon: '🕳️', label: 'A hole holds it' },
        ],
      },
    ]),
  ],
};
