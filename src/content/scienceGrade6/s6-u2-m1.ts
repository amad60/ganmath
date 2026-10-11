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
      prompt: 'Press a spring, or clay.',
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
          { icon: '🚫', label: 'Press is the same', caption: 'Press is the same.' },
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
        ask: 'Why did the spring come back?',
        bg: 'room',
        base: [at('🌀', 50, 55, 26), at('↩️', 78, 34, 14)],
        cards: [
          { icon: '🌀', label: 'You pressed a spring' },
          { icon: '🟤', label: 'It is clay' },
          { icon: '🚫', label: 'Pressing does nothing' },
        ],
      },
      {
        ask: 'What made the clay flat?',
        bg: 'room',
        base: [at('🟤', 50, 66, 18), at('⏹️', 76, 48, 14)],
        cards: [
          { icon: '✋', label: 'You pressed clay' },
          { icon: '🌀', label: 'It is a spring' },
          { icon: '↩️', label: 'It came back' },
        ],
      },
      {
        ask: 'What helps a sponge come back?',
        bg: 'room',
        base: [at('🧽', 50, 55, 24), at('↩️', 78, 34, 14)],
        cards: [
          { icon: '🌀', label: 'It is like a spring' },
          { icon: '🟤', label: 'It is like clay' },
          { icon: '⏹️', label: 'It stays flat' },
        ],
      },
      {
        ask: 'What caused the dough to stay flat?',
        bg: 'room',
        base: [at('🍞', 50, 62, 22), at('⏹️', 78, 42, 14)],
        cards: [
          { icon: '✋', label: 'You pressed it' },
          { icon: '🌀', label: 'It is a spring' },
          { icon: '↩️', label: 'It came back' },
        ],
      },
      {
        ask: 'What is missing from the sand?',
        bg: 'day',
        base: [at('🏖️', 50, 64, 24), at('⏹️', 78, 40, 14)],
        cards: [
          { icon: '🌀', label: 'It is not a spring' },
          { icon: '🟤', label: 'Sand is a spring' },
          { icon: '🚫', label: 'Pressing does nothing' },
        ],
      },
      {
        ask: 'What did you press?',
        bg: 'plain',
        base: [at('➰', 50, 55, 24), at('↩️', 78, 34, 14)],
        cards: [
          { icon: '🌀', label: 'A spring' },
          { icon: '🟤', label: 'Clay' },
          { icon: '⏹️', label: 'A flat lump' },
        ],
      },
      {
        ask: 'What keeps pressed clay flat?',
        bg: 'room',
        base: [at('🟤', 50, 66, 20), at('⏹️', 78, 44, 14)],
        cards: [
          { icon: '🟤', label: 'It is clay' },
          { icon: '🌀', label: 'A spring stays flat' },
          { icon: '↩️', label: 'A press brings it back' },
        ],
      },
      {
        ask: 'Which part comes back?',
        bg: 'room',
        base: [at('🌀', 32, 52, 22), at('↩️', 32, 28, 12), at('🟤', 70, 66, 18), at('⏹️', 84, 48, 12)],
        cards: [
          { icon: '🌀', label: 'The spring' },
          { icon: '🟤', label: 'The clay' },
          { icon: '🚫', label: 'Both are the same' },
        ],
      },
    ]),
  ],
};
