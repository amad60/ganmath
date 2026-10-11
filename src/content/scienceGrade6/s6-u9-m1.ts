import type { ContentModule } from '../types';
import { at, whatHappensNext } from '../scienceScene';

export const pickTheIronOut: ContentModule = {
  id: 's6-u9-m1',
  unitId: 's6-u9',
  grade: 6,
  title: 'Pick the Iron Out',
  icon: '🧲',
  prereq: ['s6-u8-m1'],
  skills: ['sci-iron'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['magnet', 'iron', 'sand', 'pull', 'out', 'stay'],

  learn: [
    // Pasir dan besi tercampur. Magnet menarik besinya saja. Pasirnya tidak ikut.
    {
      stage: 'concrete',
      prompt: 'Iron in sand. A magnet, or not.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('🏖️', 50, 68, 28), at('🔩', 50, 60, 12)],
        options: [
          {
            icon: '🧲',
            label: 'Magnet',
            caption: 'The magnet pulls the iron out.',
            result: [at('🏖️', 50, 72, 26), at('🧲', 50, 28, 18), at('⚙️', 50, 42, 14, { fx: 'rise' })],
          },
          {
            icon: '🚫',
            label: 'No magnet',
            caption: 'No magnet. The iron stays.',
            result: [at('🏖️', 50, 68, 28), at('🔩', 50, 60, 12), at('👀', 78, 36, 14)],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'A magnet, or not.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'room',
        base: [at('🧲', 50, 24, 18), at('🏖️', 50, 70, 26), at('🔩', 50, 62, 12)],
        options: [
          {
            icon: '⚙️',
            label: 'The iron comes out',
            caption: 'The iron comes out.',
            result: [at('🧲', 50, 26, 16), at('⚙️', 50, 42, 14, { fx: 'rise' }), at('🏖️', 50, 74, 22)],
          },
          { icon: '👀', label: 'The iron stays', caption: 'The iron stays.' },
          { icon: '🏖️', label: 'The sand comes out', caption: 'The sand comes out.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A magnet pulls iron out.',
      visual: {
        kind: 'evidence-text',
        title: 'Iron',
        sentences: [
          'A magnet pulls iron out of sand.',
          'Sand stays. It is not iron.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-iron', [
      {
        ask: 'What did the magnet pull?',
        bg: 'room',
        base: [at('🧲', 50, 24, 16), at('⚙️', 50, 42, 14), at('🏖️', 50, 74, 22)],
        cards: [
          { icon: '⚙️', label: 'The iron' },
          { icon: '🏖️', label: 'The sand' },
          { icon: '🚫', label: 'Every object' },
        ],
      },
      {
        ask: 'Why does the iron stay?',
        bg: 'room',
        base: [at('🏖️', 50, 68, 26), at('🔩', 50, 60, 12)],
        cards: [
          { icon: '👀', label: 'No magnet is there' },
          { icon: '🧲', label: 'The magnet pulled it' },
          { icon: '🏖️', label: 'The sand is iron' },
        ],
      },
      {
        ask: 'What is missing for a pull?',
        bg: 'room',
        base: [at('🧲', 50, 24, 16), at('📄', 50, 64, 18)],
        cards: [
          { icon: '⚙️', label: 'Iron' },
          { icon: '📄', label: 'The paper is iron' },
          { icon: '🧲', label: 'The magnet pulls all' },
        ],
      },
      {
        ask: 'What helps the magnet pull?',
        bg: 'plain',
        base: [at('🧲', 50, 26, 18), at('🔩', 50, 48, 14)],
        cards: [
          { icon: '🔩', label: 'The iron' },
          { icon: '🏖️', label: 'Sand would come up' },
          { icon: '🚫', label: 'It pulls every object' },
        ],
      },
      {
        ask: 'What keeps the sand down?',
        bg: 'room',
        base: [at('🧲', 50, 22, 16), at('🏖️', 50, 70, 26)],
        cards: [
          { icon: '🏖️', label: 'It is not iron' },
          { icon: '⚙️', label: 'The sand is iron' },
          { icon: '🧲', label: 'The magnet takes it' },
        ],
      },
      {
        ask: 'What made the iron come out?',
        bg: 'room',
        base: [at('🧲', 50, 22, 16), at('⚙️', 50, 40, 12), at('🍚', 50, 70, 18)],
        cards: [
          { icon: '🧲', label: 'The magnet' },
          { icon: '🍚', label: 'The rice pulled it' },
          { icon: '👀', label: 'No magnet was used' },
        ],
      },
      {
        ask: 'What caused the toy to stay?',
        bg: 'plain',
        base: [at('🧲', 50, 24, 16), at('🧸', 50, 64, 20)],
        cards: [
          { icon: '🧸', label: 'It is not iron' },
          { icon: '⚙️', label: 'The toy is iron' },
          { icon: '🧲', label: 'A magnet pulls all toys' },
        ],
      },
      {
        ask: 'Which part comes out?',
        bg: 'room',
        base: [at('🧲', 36, 26, 16), at('⚙️', 36, 42, 12), at('🏖️', 66, 72, 18), at('📄', 44, 70, 12)],
        cards: [
          { icon: '⚙️', label: 'Only the iron' },
          { icon: '🏖️', label: 'The sand' },
          { icon: '📄', label: 'The paper' },
        ],
      },
    ]),
  ],
};
