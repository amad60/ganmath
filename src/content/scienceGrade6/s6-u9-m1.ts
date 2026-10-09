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
      prompt: 'See this. See what changes.',
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
          { icon: '🌈', label: 'It grows big', caption: 'It grows big.' },
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
        bg: 'room',
        base: [at('🧲', 50, 22, 16), at('🏖️', 50, 70, 24), at('🔩', 48, 62, 12)],
        cards: [
          { icon: '⚙️', label: 'The iron comes out' },
          { icon: '👀', label: 'It all stays' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🏖️', 50, 68, 26), at('🔩', 50, 60, 12)],
        cards: [
          { icon: '👀', label: 'The iron stays' },
          { icon: '⚙️', label: 'The iron comes out' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'room',
        base: [at('🧲', 50, 22, 16), at('📄', 50, 64, 18)],
        cards: [
          { icon: '🚫', label: 'Nothing comes out' },
          { icon: '⚙️', label: 'The paper comes out' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'plain',
        base: [at('🧲', 50, 24, 18), at('🔩', 50, 64, 16)],
        cards: [
          { icon: '⚙️', label: 'The iron comes out' },
          { icon: '👀', label: 'The iron stays' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🧲', 50, 22, 16), at('🏖️', 50, 70, 26)],
        cards: [
          { icon: '🚫', label: 'The sand stays' },
          { icon: '⚙️', label: 'The sand comes out' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'room',
        base: [at('🧲', 50, 22, 16), at('🍚', 50, 68, 20), at('🔩', 50, 60, 10)],
        cards: [
          { icon: '⚙️', label: 'The iron comes out' },
          { icon: '👀', label: 'It all stays' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
      {
        bg: 'plain',
        base: [at('🧲', 50, 24, 16), at('🧸', 50, 64, 20)],
        cards: [
          { icon: '🚫', label: 'Nothing comes out' },
          { icon: '⚙️', label: 'It comes out' },
          { icon: '🌸', label: 'A flower comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🧲', 36, 28, 16), at('🏖️', 62, 70, 22), at('🔩', 58, 60, 10), at('📄', 40, 66, 12)],
        cards: [
          { icon: '⚙️', label: 'Only the iron comes out' },
          { icon: '👀', label: 'Sand and paper come out' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
    ]),
  ],
};
