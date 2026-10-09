import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

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
        bg: 'day',
        base: [at('🍃', 50, 60, 40), at('🐛', 50, 52, 20)],
        cards: [
          { icon: '🦋', label: 'A butterfly' },
          { icon: '🐦', label: 'A bird' },
          { icon: '🐟', label: 'A fish' },
        ],
      },
      {
        bg: 'day',
        base: [at('🪺', 50, 56, 36)],
        cards: [
          { icon: '🐣', label: 'A chick comes out' },
          { icon: '🐛', label: 'A caterpillar comes out' },
          { icon: '🌸', label: 'A flower comes out' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌸', 50, 64, 30), at('🦋', 50, 30, 20)],
        cards: [
          { icon: '🥚', label: 'It lays eggs' },
          { icon: '🐟', label: 'It becomes a fish' },
          { icon: '🌳', label: 'It becomes a tree' },
        ],
      },
      {
        bg: 'day',
        base: [ground('green'), at('🐣', 50, 66, 30)],
        cards: [
          { icon: '🐥', label: 'A chick' },
          { icon: '🥚', label: 'An egg again' },
          { icon: '🐛', label: 'A caterpillar' },
        ],
      },
      {
        bg: 'day',
        base: [bar(50, 88, 100, 24, 'brown'), at('🌰', 50, 80, 9), at('🌧️', 50, 20, 20)],
        cards: [
          { icon: '🌱', label: 'A sprout' },
          { icon: '🐣', label: 'A chick' },
          { icon: '🦋', label: 'A butterfly' },
        ],
      },
    
      {
        bg: 'water',
        base: [at('🐤', 28, 58, 16), at('🐸', 62, 58, 24)],
        cards: [
          { icon: '🐸', label: 'A frog' },
          { icon: '🥚', label: 'It goes back in the egg' },
          { icon: '🪨', label: 'It turns to rock' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐛', 50, 60, 26)],
        cards: [
          { icon: '🫧', label: 'A chrysalis' },
          { icon: '🐠', label: 'A fish' },
          { icon: '🥁', label: 'A drum' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐣', 50, 58, 28)],
        cards: [
          { icon: '🐤', label: 'A chick' },
          { icon: '🦋', label: 'A butterfly' },
          { icon: '🌵', label: 'A cactus' },
        ],
      },
    ]),
  ],
};
