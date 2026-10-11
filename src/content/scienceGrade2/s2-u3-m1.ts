import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const lifeCycles: ContentModule = {
  id: 's2-u3-m1',
  unitId: 's2-u3',
  grade: 2,
  title: 'Life Cycles',
  icon: '🦋',
  prereq: ['s2-u2-m1'],
  skills: ['sci-cycle'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['egg', 'caterpillar', 'butterfly', 'frog', 'tadpole', 'first', 'eats', 'flies', 'lay', 'chick', 'hen', 'duck', 'back'],

  learn: [
    {
      stage: 'concrete',
      // Tap-part, bukan change: siklus harus terlihat SEKALIGUS, dengan panah yang
      // kembali ke telur. Kalau tahapnya muncul satu per satu, anak melihat garis
      // lurus yang berakhir di kupu-kupu, bukan lingkaran.
      prompt: 'Tap each one. The egg comes first.',
      visual: {
        kind: 'science-scene',
        mode: 'tap-part',
        bg: 'day',
        base: [
          at('🍃', 22, 34, 22),
          at('🥚', 22, 28, 12, { part: 0 }),
          at('➡️', 50, 30, 10),
          at('🐛', 78, 30, 20, { part: 1 }),
          at('↙️', 68, 60, 10),
          at('🦋', 50, 76, 22, { part: 2 }),
          at('↖️', 30, 60, 10),
        ],
        options: [
          { icon: '🥚', label: 'Egg', caption: 'First, a small egg.' },
          { icon: '🐛', label: 'Caterpillar', caption: 'It eats and grows.' },
          { icon: '🦋', label: 'Butterfly', caption: 'It flies and lays eggs.' },
        ],
      },
      action: 'explore',
      target: 3,
    },
    {
      stage: 'pictorial',
      prompt: 'The chick grows. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [ground('green'), at('🐥', 50, 72, 20)],
        options: [
          { icon: '🐣', label: 'It goes back in the egg', caption: 'It goes back in the egg.' },
          { icon: '🦆', label: 'It becomes a duck', caption: 'It becomes a duck.' },
          {
            icon: '🐔',
            label: 'It becomes a hen',
            caption: 'The chick becomes a hen.',
            result: [ground('green'), at('🐔', 50, 62, 34, { fx: 'grow' })],
          },
        ],
        correct: 2,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A caterpillar becomes a butterfly.',
      visual: {
        kind: 'evidence-text',
        title: 'In order',
        sentences: ['Egg, caterpillar, then butterfly. The order does not jump.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-cycle', [
      {
        ask: 'A caterpillar is eating. What did it hatch from?',
        bg: 'day',
        base: [at('🍃', 50, 62, 36), at('🐛', 50, 52, 22)],
        cards: [
          { icon: '🥚', label: 'An egg' },
          { icon: '🦋', label: 'A butterfly' },
          { icon: '🐣', label: 'A chick' },
        ],
      },
      {
        ask: 'This is a butterfly. What did it grow from?',
        bg: 'day',
        base: [at('🦋', 50, 50, 36)],
        cards: [
          { icon: '🐛', label: 'A caterpillar' },
          { icon: '🥚', label: 'Only an egg' },
          { icon: '🐔', label: 'A hen' },
        ],
      },
      {
        ask: 'This caterpillar is grown. Which part comes next?',
        bg: 'day',
        base: [at('🐛', 50, 56, 32)],
        cards: [
          { icon: '🦋', label: 'A butterfly' },
          { icon: '🥚', label: 'Back to an egg' },
          { icon: '🐸', label: 'A frog' },
        ],
      },
      {
        ask: 'The butterfly is an adult. What helps the cycle?',
        bg: 'day',
        base: [at('🦋', 50, 46, 32)],
        cards: [
          { icon: '🥚', label: 'It lays eggs' },
          { icon: '🐛', label: 'A caterpillar again' },
          { icon: '🐔', label: 'It becomes a hen' },
        ],
      },
      {
        ask: 'A duckling has hatched. Which part comes next?',
        bg: 'day',
        base: [ground('green'), at('🐤', 50, 70, 24)],
        cards: [
          { icon: '🦆', label: 'A duck' },
          { icon: '🥚', label: 'Back in the egg' },
          { icon: '🦋', label: 'A butterfly' },
        ],
      },
      {
        ask: 'This goat is fully grown. What did it start as?',
        bg: 'day',
        base: [ground('green'), at('🐐', 50, 64, 32)],
        cards: [
          { icon: '🍼', label: 'A baby goat' },
          { icon: '🥚', label: 'An egg' },
          { icon: '🐛', label: 'A caterpillar' },
        ],
      },
      {
        ask: 'A bird egg is in the nest. Which part comes next?',
        bg: 'day',
        base: [at('🪺', 50, 56, 36)],
        cards: [
          { icon: '🐣', label: 'A chick' },
          { icon: '🐛', label: 'A caterpillar' },
          { icon: '🐔', label: 'A grown hen' },
        ],
      },
      {
        ask: 'Eggs are on the leaf. Which part comes next?',
        bg: 'day',
        base: [at('🍃', 50, 58, 40), at('🥚', 40, 50, 12), at('🥚', 58, 54, 12)],
        cards: [
          { icon: '🐛', label: 'A caterpillar' },
          { icon: '🦋', label: 'Straight to a butterfly' },
          { icon: '🐣', label: 'A chick' },
        ],
      },
    ]),
  ],
};
