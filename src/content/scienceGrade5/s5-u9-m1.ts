import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

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
        ask: 'The chick looks like a hen. Why?',
        bg: 'day',
        base: [at('🐣', 34, 60, 18), at('🐔', 68, 52, 22), ground()],
        cards: [
          { icon: '🥚', label: 'It is born that way' },
          { icon: '🎓', label: 'It learned to look like a hen' },
          { icon: '👉', label: 'Traits are chosen after birth' },
        ],
      },
      {
        ask: 'The kitten looks like a cat. What made that?',
        bg: 'room',
        base: [at('🐱', 34, 60, 18), at('🐈', 68, 52, 22)],
        cards: [
          { icon: '🥚', label: 'It was born like a cat' },
          { icon: '👉', label: 'It chose to be a cat' },
          { icon: '🎓', label: 'It learned a cat trick' },
        ],
      },
      {
        ask: 'The dog jumps a hoop. What did it learn?',
        bg: 'room',
        base: [at('🐶', 36, 58, 20), at('⭕', 68, 42, 16)],
        cards: [
          { icon: '🎓', label: 'A trick, not a born look' },
          { icon: '🥚', label: 'The hoop trick was born' },
          { icon: '🐕', label: 'The dog was born doing it' },
        ],
      },
      {
        ask: 'The duckling looks like a duck. Why?',
        bg: 'day',
        base: [at('🐥', 34, 60, 18), at('🦆', 68, 52, 22), ground()],
        cards: [
          { icon: '🥚', label: 'That look is born' },
          { icon: '👉', label: 'It picked the look later' },
          { icon: '🎓', label: 'It learned to be a duck' },
        ],
      },
      {
        ask: 'The calf looks like a cow. What keeps that?',
        bg: 'day',
        base: [at('🐮', 34, 58, 20), at('🐄', 70, 52, 22), ground()],
        cards: [
          { icon: '🥚', label: 'Being a cow is born' },
          { icon: '👉', label: 'Traits are chosen after birth' },
          { icon: '🎓', label: 'A calf learns its body' },
        ],
      },
      {
        ask: 'Why can this child read?',
        bg: 'room',
        base: [at('🧒', 36, 56, 22), at('📕', 68, 55, 16)],
        cards: [
          { icon: '🎓', label: 'The child learns reading' },
          { icon: '🥚', label: 'The child is born reading' },
          { icon: '📕', label: 'Books are born in a child' },
        ],
      },
      {
        ask: 'The parrot says words. What caused the words?',
        bg: 'room',
        base: [at('🦜', 40, 52, 24), at('💬', 70, 32, 14)],
        cards: [
          { icon: '🎓', label: 'The parrot learned the words' },
          { icon: '🥚', label: 'The words were born in it' },
          { icon: '👉', label: 'It chose the words at birth' },
        ],
      },
      {
        ask: 'Which part of this puppy is born?',
        bg: 'day',
        base: [at('🐶', 50, 58, 28), ground()],
        cards: [
          { icon: '🐕', label: 'Looking like a dog' },
          { icon: '⭕', label: 'Knowing a hoop trick' },
          { icon: '👉', label: 'A look it picks later' },
        ],
      },
    ]),
  ],
};
