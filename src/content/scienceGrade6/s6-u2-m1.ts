import type { ContentModule } from '../types';
import { at, whatHappensNext } from '../scienceScene';

export const springBack: ContentModule = {
  id: 's6-u2-m1',
  unitId: 's6-u2',
  grade: 6,
  title: 'Spring Back',
  icon: '🌀',
  prereq: ['s6-u1-m1'],
  skills: ['sci-spring'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['spring', 'clay', 'flat', 'back', 'press'],

  learn: [
    // Ditekan sama. Pegas kembali. Tanah liat tetap pipih.
    {
      stage: 'concrete',
      prompt: 'Press a spring, or clay.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('✋', 50, 28, 16)],
        options: [
          {
            icon: '🌀',
            label: 'Spring',
            caption: 'The spring comes back.',
            result: [at('🌀', 50, 55, 28, { fx: 'pop' }), at('↩️', 78, 36, 14)],
          },
          {
            icon: '🟤',
            label: 'Clay',
            caption: 'The clay is flat.',
            result: [at('✋', 50, 36, 16), at('🟤', 50, 68, 20), at('⏹️', 78, 48, 14)],
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
        bg: 'room',
        base: [at('✋', 50, 30, 16), at('🧽', 50, 62, 18)],
        options: [
          {
            icon: '↩️',
            label: 'It comes back',
            caption: 'It comes back.',
            result: [at('🧽', 50, 52, 26, { fx: 'pop' }), at('↩️', 78, 36, 14)],
          },
          { icon: '⏹️', label: 'It is flat', caption: 'It is flat.' },
          { icon: '🌈', label: 'It grows big', caption: 'It grows big.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A spring comes back.',
      visual: {
        kind: 'evidence-text',
        title: 'Back',
        sentences: [
          'Press a spring, and it comes back.',
          'Press clay, and it stays flat.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-spring', [
      {
        bg: 'room',
        base: [at('✋', 50, 28, 16), at('🌀', 50, 62, 20)],
        cards: [
          { icon: '↩️', label: 'The spring comes back' },
          { icon: '⏹️', label: 'It stays flat' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('✋', 50, 30, 16), at('🟤', 50, 66, 18)],
        cards: [
          { icon: '⏹️', label: 'The clay stays flat' },
          { icon: '↩️', label: 'It comes back' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'plain',
        base: [at('✋', 24, 40, 14), at('➰', 60, 55, 20)],
        cards: [
          { icon: '↩️', label: 'It comes back' },
          { icon: '⏹️', label: 'It stays flat' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'room',
        base: [at('✋', 50, 28, 16), at('🍞', 50, 64, 18)],
        cards: [
          { icon: '⏹️', label: 'It stays flat' },
          { icon: '↩️', label: 'It comes back' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'room',
        base: [at('✋', 48, 30, 16), at('🧽', 50, 66, 16)],
        cards: [
          { icon: '↩️', label: 'It comes back' },
          { icon: '⏹️', label: 'It stays flat' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'day',
        base: [at('✋', 50, 30, 14), at('🏖️', 50, 68, 20)],
        cards: [
          { icon: '⏹️', label: 'It stays flat' },
          { icon: '↩️', label: 'It comes back' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🌀', 40, 55, 22), at('✋', 70, 28, 14)],
        cards: [
          { icon: '↩️', label: 'It comes back' },
          { icon: '⏹️', label: 'It stays flat' },
          { icon: '🌸', label: 'A flower comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('✋', 46, 32, 14), at('🖍️', 58, 64, 16)],
        cards: [
          { icon: '⏹️', label: 'It stays flat' },
          { icon: '↩️', label: 'It comes back' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
    ]),
  ],
};
