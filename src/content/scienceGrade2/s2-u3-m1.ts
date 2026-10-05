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
  questionTypes: ['clue-tap', 'choose-text', 'pick-picture'],
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
    {
      type: 'clue-tap',
      skill: 'sci-cycle',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows the next change?',
      visual: (p) => {
        const stories = [
          {
            title: 'Still egg',
            sentences: ['The egg is on a leaf.', 'A caterpillar comes out of the egg.'],
          },
          {
            title: 'Eating',
            sentences: ['The caterpillar eats leaves.', 'Later it becomes a butterfly.'],
          },
          {
            title: 'Pond eggs',
            sentences: ['Frog eggs sit in the pond.', 'A tadpole swims out.'],
          },
          {
            title: 'New legs',
            sentences: ['The tadpole grows legs.', 'It becomes a frog.'],
          },
          {
            title: 'Again',
            sentences: ['The butterfly opens its wings.', 'She lays an egg and the cycle starts again.'],
          },
        ];
        return {
          kind: 'evidence-text',
          title: stories[p.s as number]?.title,
          sentences: stories[p.s as number]?.sentences ?? [],
        };
      },
    },
    {
      type: 'choose-text',
      skill: 'sci-cycle',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A butterfly egg hatches. What comes out first?',
          'What does a caterpillar become?',
          'A tadpole lives in the pond. What does it become?',
          'What comes just before a butterfly?',
          'The cycle starts again. What does the butterfly lay?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['A caterpillar', 'A full butterfly', 'A fox', 'A magnet'],
          ['A butterfly', 'A fish', 'A rock', 'A metal clip'],
          ['A frog', 'A bird', 'A seed', 'A shadow'],
          ['A caterpillar', 'A fox', 'A rubbish bin', 'A lamp'],
          ['An egg', 'A block of ice', 'A nest of metal', 'A drum'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
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
    ]),
  ],
};
