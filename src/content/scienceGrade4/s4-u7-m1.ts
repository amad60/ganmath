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
      prompt: 'See this. See what changes.',
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
        base: [at('⛵', 50, 36, 24), at('🌊', 50, 68, 30)],
        cards: [
          { icon: '⬆️', label: 'It floats' },
          { icon: '⚫', label: 'It sinks' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'water',
        base: [at('⚫', 50, 30, 16), at('🌊', 50, 64, 32)],
        cards: [
          { icon: '⬇️', label: 'The lump sinks' },
          { icon: '⛵', label: 'It floats' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'water',
        base: [at('🚢', 50, 38, 28), at('🌊', 50, 70, 28)],
        cards: [
          { icon: '⬆️', label: 'The ship floats' },
          { icon: '🥄', label: 'It sinks' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'water',
        base: [at('🥄', 50, 26, 16), at('🌊', 50, 66, 30)],
        cards: [
          { icon: '⬇️', label: 'The spoon sinks' },
          { icon: '🚢', label: 'It floats' },
          { icon: '🐟', label: 'A fish comes' },
        ],
      },
      {
        bg: 'water',
        base: [at('🛶', 50, 36, 24), at('🌊', 50, 68, 28)],
        cards: [
          { icon: '⬆️', label: 'The boat floats' },
          { icon: '🪙', label: 'It sinks' },
          { icon: '❄️', label: 'It freezes' },
        ],
      },
      {
        bg: 'water',
        base: [at('🪙', 50, 28, 14), at('🌊', 50, 66, 30)],
        cards: [
          { icon: '⬇️', label: 'The lump sinks' },
          { icon: '🛶', label: 'It floats' },
          { icon: '🌸', label: 'A flower comes' },
        ],
      },
      {
        bg: 'water',
        base: [at('⛵', 50, 48, 22), at('💧', 50, 44, 12), at('🌊', 50, 72, 26)],
        cards: [
          { icon: '⬇️', label: 'The boat sinks' },
          { icon: '🛟', label: 'It floats' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'water',
        base: [at('🛟', 50, 38, 22), at('🌊', 50, 70, 26)],
        cards: [
          { icon: '⬆️', label: 'It floats' },
          { icon: '⚓', label: 'It sinks' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
    ]),
  ],
};
