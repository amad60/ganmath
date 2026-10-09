import type { ContentModule } from '../types';
import { at, whatHappensNext } from '../scienceScene';

export const bornThatWay: ContentModule = {
  id: 's5-u9-m1',
  unitId: 's5-u9',
  grade: 5,
  title: 'Born That Way',
  icon: '🐣',
  prereq: ['s5-u8-m1'],
  skills: ['sci-born'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['chick', 'hen', 'born', 'learn', 'dog', 'trick', 'cat'],

  learn: [
    // Anak ayam mirip induknya sejak lahir. Trik anjing dipelajari, bukan bawaan.
    {
      stage: 'concrete',
      prompt: 'A chick, or a trick.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('🥚', 50, 58, 22)],
        options: [
          {
            icon: '🐣',
            label: 'Chick',
            caption: 'A chick is born like a hen.',
            result: [at('🐣', 36, 60, 18), at('🐔', 68, 52, 22, { fx: 'pop' })],
          },
          {
            icon: '⭕',
            label: 'Trick',
            caption: 'The dog learns a trick.',
            result: [at('🐶', 40, 58, 20), at('⭕', 68, 36, 14), at('🎓', 78, 22, 14, { fx: 'pop' })],
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
        base: [at('🐱', 50, 58, 26)],
        options: [
          {
            icon: '🐈',
            label: 'It is born like a cat',
            caption: 'It is born like a cat.',
            result: [at('🐱', 34, 60, 18), at('🐈', 68, 52, 24, { fx: 'pop' })],
          },
          { icon: '🎓', label: 'It learns a trick', caption: 'It learns a trick.' },
          { icon: '🌈', label: 'It grows big', caption: 'It grows big.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A chick is born like a hen.',
      visual: {
        kind: 'evidence-text',
        title: 'Born',
        sentences: [
          'A chick is born like a hen. A kitten is born like a cat.',
          'A trick is not born. The dog learns it.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-born', [
      {
        bg: 'day',
        base: [at('🥚', 36, 60, 16), at('🐣', 64, 58, 20)],
        cards: [
          { icon: '🐔', label: 'It is born like a hen' },
          { icon: '🎓', label: 'It learns a trick' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐶', 50, 58, 26)],
        cards: [
          { icon: '🐕', label: 'It is born like a dog' },
          { icon: '🎓', label: 'It learns a trick' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'room',
        base: [at('🐶', 36, 60, 20), at('⭕', 68, 42, 16)],
        cards: [
          { icon: '🎓', label: 'It learns a trick' },
          { icon: '🐕', label: 'The trick is born' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'room',
        base: [at('🐱', 50, 58, 26)],
        cards: [
          { icon: '🐈', label: 'It is born like a cat' },
          { icon: '🎓', label: 'It learns a trick' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🧒', 36, 58, 22), at('📕', 68, 55, 16)],
        cards: [
          { icon: '🎓', label: 'The child learns it' },
          { icon: '🐔', label: 'It is born that way' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐥', 50, 60, 22)],
        cards: [
          { icon: '🦆', label: 'It is born like a duck' },
          { icon: '🎓', label: 'It learns a trick' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐮', 50, 58, 26)],
        cards: [
          { icon: '🐄', label: 'It is born like a cow' },
          { icon: '🎓', label: 'It learns a trick' },
          { icon: '🌸', label: 'A flower comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🦜', 42, 52, 24), at('💬', 70, 32, 14)],
        cards: [
          { icon: '🎓', label: 'It learns the words' },
          { icon: '🦜', label: 'The words are born' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
    ]),
  ],
};
