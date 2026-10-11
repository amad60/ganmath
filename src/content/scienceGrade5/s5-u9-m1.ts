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
      prompt: 'A chick is born, or a trick.',
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
          { icon: '🥚', label: 'A trick is born', caption: 'A trick is born.' },
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
        ask: 'A chick hatches from an egg.',
        bg: 'day',
        base: [at('🥚', 36, 60, 16), at('🐣', 64, 58, 20)],
        cards: [
          { icon: '🐔', label: 'It is born like a hen' },
          { icon: '🎓', label: 'It learns a trick' },
          { icon: '🚫', label: 'Born and learned are the same' },
        ],
      },
      {
        ask: 'A puppy is born.',
        bg: 'day',
        base: [at('🐶', 50, 58, 26)],
        cards: [
          { icon: '🐕', label: 'It is born like a dog' },
          { icon: '🎓', label: 'It learns a trick' },
          { icon: '🚫', label: 'Born and learned are the same' },
        ],
      },
      {
        ask: 'A dog is taught to jump a hoop.',
        bg: 'room',
        base: [at('🐶', 36, 60, 20), at('⭕', 68, 42, 16)],
        cards: [
          { icon: '🎓', label: 'It learns a trick' },
          { icon: '🐕', label: 'The trick is born' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        ask: 'A kitten is born.',
        bg: 'room',
        base: [at('🐱', 50, 58, 26)],
        cards: [
          { icon: '🐈', label: 'It is born like a cat' },
          { icon: '🎓', label: 'It learns a trick' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        ask: 'A child reads a book to learn.',
        bg: 'room',
        base: [at('🧒', 36, 58, 22), at('📕', 68, 55, 16)],
        cards: [
          { icon: '🎓', label: 'The child learns it' },
          { icon: '🐔', label: 'It is born that way' },
          { icon: '🚫', label: 'Born and learned are the same' },
        ],
      },
      {
        ask: 'A duckling hatches.',
        bg: 'day',
        base: [at('🐥', 50, 60, 22)],
        cards: [
          { icon: '🦆', label: 'It is born like a duck' },
          { icon: '🎓', label: 'It learns a trick' },
          { icon: '🚫', label: 'Born and learned are the same' },
        ],
      },
      {
        ask: 'A calf is born.',
        bg: 'day',
        base: [at('🐮', 50, 58, 26)],
        cards: [
          { icon: '🐄', label: 'It is born like a cow' },
          { icon: '🎓', label: 'It learns a trick' },
          { icon: '🚫', label: 'Born and learned are the same' },
        ],
      },
      {
        ask: 'A parrot is taught words.',
        bg: 'room',
        base: [at('🦜', 42, 52, 24), at('💬', 70, 32, 14)],
        cards: [
          { icon: '🎓', label: 'It learns the words' },
          { icon: '🦜', label: 'The words are born' },
          { icon: '🚫', label: 'Born and learned are the same' },
        ],
      },
    ]),
  ],
};
