import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const whoEatsWhat: ContentModule = {
  id: 's2-u8-m1',
  unitId: 's2-u8',
  grade: 2,
  title: 'Who Eats What',
  icon: '🦊',
  prereq: ['s2-u7-m1'],
  skills: ['sci-food'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text', 'pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['rabbit', 'eat', 'grass', 'fox', 'give', 'some', 'food', 'carrot', 'meat', 'does', 'hungry', 'chase', 'sleep', 'they', 'go'],

  learn: [
    {
      stage: 'concrete',
      // Kelinci yang sama, makanannya yang berganti. Daging ditolak: "kelinci makan
      // tumbuhan" terlihat dari yang TIDAK dimakan, bukan cuma dari yang dimakan.
      prompt: 'Give the rabbit some food.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [ground('green'), at('🐇', 34, 72, 24, { flip: true })],
        options: [
          {
            icon: '🌿',
            label: 'Grass',
            caption: 'The rabbit eats the grass.',
            result: [ground('green'), at('🐇', 40, 72, 24, { flip: true, fx: 'slide-right' }), at('🌿', 68, 78, 16, { fx: 'shrink' })],
          },
          {
            icon: '🥕',
            label: 'Carrot',
            caption: 'The rabbit eats the carrot.',
            result: [ground('green'), at('🐇', 40, 72, 24, { flip: true, fx: 'slide-right' }), at('🥕', 68, 78, 16, { fx: 'shrink' })],
          },
          {
            icon: '🍖',
            label: 'Meat',
            caption: 'A rabbit does not eat meat.',
            result: [ground('green'), at('🐇', 28, 72, 24, { fx: 'shake' }), at('🍖', 68, 78, 16)],
          },
        ],
      },
      action: 'explore',
      target: 3,
    },
    {
      stage: 'pictorial',
      prompt: 'A hungry fox sees a rabbit. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [ground('green'), at('🦊', 20, 72, 22), at('🐇', 62, 72, 20, { flip: true })],
        options: [
          { icon: '🌿', label: 'The fox eats grass', caption: 'The fox eats grass.' },
          { icon: '💤', label: 'They go to sleep', caption: 'They go to sleep.' },
          {
            icon: '💨',
            label: 'The fox chases the rabbit',
            caption: 'A fox eats rabbits. It chases them.',
            result: [
              ground('green'),
              at('🦊', 52, 72, 22, { fx: 'slide-right' }),
              at('🐇', 86, 72, 20, { flip: true, fx: 'slide-right' }),
            ],
          },
        ],
        correct: 2,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A fox eats a rabbit.',
      visual: {
        kind: 'evidence-text',
        title: 'The chain',
        sentences: ['Grass feeds the rabbit. The rabbit feeds the fox.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-food',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows who eats?',
      visual: (p) => {
        const stories = [
          {
            title: 'The field',
            sentences: ['The grass is green.', 'The rabbit eats the grass.'],
          },
          {
            title: 'The hunt',
            sentences: ['The rabbit is in the field.', 'The fox eats the rabbit.'],
          },
          {
            title: 'On the leaf',
            sentences: ['A leaf is on the plant.', 'The caterpillar eats the leaf.'],
          },
          {
            title: 'The pond',
            sentences: ['Small fish swim in the pond.', 'The big bird eats a fish.'],
          },
          {
            title: 'Bare ground',
            sentences: ['The grass is gone.', 'The rabbit has less to eat.'],
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
      skill: 'sci-food',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'What does a rabbit eat?',
          'What eats the rabbit?',
          'The grass is all gone. What happens to the rabbit?',
          'A caterpillar is on a leaf. What does it do?',
          'In grass, rabbit, fox — what comes first?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['Grass', 'A fox', 'A metal clip', 'A block of ice'],
          ['A fox', 'The grass', 'A seed', 'A shadow'],
          ['It has less to eat', 'It turns to metal', 'It becomes a lamp', 'It freezes'],
          ['It eats the leaf', 'It eats a fox', 'It pulls metal', 'It makes ice'],
          ['Grass', 'The fox', 'The rabbit', 'A magnet'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
    whatHappensNext(
      'sci-food',
      [
        {
          base: [at('🐇', 50, 50, 34)],
          cards: [
            { icon: '🥕', label: 'A carrot' },
            { icon: '🍖', label: 'Meat' },
            { icon: '🪨', label: 'A rock' },
          ],
        },
        {
          base: [at('🐄', 50, 50, 34)],
          cards: [
            { icon: '🌾', label: 'Grass' },
            { icon: '🐟', label: 'A fish' },
            { icon: '🪨', label: 'A rock' },
          ],
        },
        {
          base: [at('🐦', 50, 50, 34)],
          cards: [
            { icon: '🐛', label: 'A worm' },
            { icon: '🪨', label: 'A rock' },
            { icon: '🔩', label: 'A bolt' },
          ],
        },
        {
          base: [at('🐈', 50, 50, 34)],
          cards: [
            { icon: '🐟', label: 'A fish' },
            { icon: '🌾', label: 'Grass' },
            { icon: '🪨', label: 'A rock' },
          ],
        },
        {
          base: [at('🐼', 50, 50, 34)],
          cards: [
            { icon: '🎋', label: 'Bamboo' },
            { icon: '🍖', label: 'Meat' },
            { icon: '🧊', label: 'Ice' },
          ],
        },
      ],
      // Soal rantai makanan: gambarnya hewan, kartunya makanan.
      'What does it eat?',
    ),
  ],
};
