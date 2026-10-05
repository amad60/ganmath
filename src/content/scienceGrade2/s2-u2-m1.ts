import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

export const animalHomes: ContentModule = {
  id: 's2-u2-m1',
  unitId: 's2-u2',
  grade: 2,
  title: 'Animal Homes',
  icon: '🪺',
  prereq: ['s2-u1-m1'],
  skills: ['sci-homes'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text', 'pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['home', 'fish', 'live', 'bird', 'nest', 'pond', 'swim', 'grass', 'cannot', 'breathe', 'move', 'stick', 'tree', 'dig', 'hole'],

  learn: [
    {
      stage: 'concrete',
      // Variabelnya tempat, hewannya tetap: ikan yang sama di kolam dan di rumput.
      // Kalau hewannya ikut berganti, anak tidak tahu mana yang membuat bedanya.
      prompt: 'Move the fish. Where can it live?',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [ground('green'), bar(72, 90, 44, 14, 'blue'), at('🐟', 50, 36, 16)],
        options: [
          {
            icon: '💧',
            label: 'Pond',
            caption: 'In the pond, the fish can swim.',
            result: [ground('green'), bar(72, 90, 44, 14, 'blue'), at('🐟', 74, 88, 11, { flip: true, fx: 'slide-right' })],
          },
          {
            icon: '🌿',
            label: 'Grass',
            caption: 'On grass, a fish cannot breathe.',
            result: [ground('green'), bar(72, 90, 44, 14, 'blue'), at('🐟', 22, 82, 12, { dim: true, fx: 'shake' })],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'The bird finds sticks. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [ground('green'), at('🌳', 56, 52, 54), at('🐦', 18, 30, 14, { flip: true }), at('🪵', 22, 46, 10)],
        options: [
          { icon: '🕳️', label: 'It digs a hole', caption: 'It digs a hole.' },
          {
            icon: '🪺',
            label: 'It makes a nest',
            caption: 'The bird makes a nest in the tree.',
            result: [
              ground('green'),
              at('🌳', 56, 52, 54),
              at('🪺', 58, 40, 14, { fx: 'pop' }),
              at('🐦', 58, 26, 12, { flip: true, fx: 'fall' }),
            ],
          },
          { icon: '🌊', label: 'It swims in the pond', caption: 'It swims in the pond.' },
        ],
        correct: 1,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A bird lives in a nest.',
      visual: {
        kind: 'evidence-text',
        title: 'A fit',
        sentences: ['Animals live where they find what they need.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-homes',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows where it lives?',
      visual: (p) => {
        const stories = [
          {
            title: 'The bowl',
            sentences: ['The bowl is empty.', 'The fish swims in the pond.'],
          },
          {
            title: 'The tree',
            sentences: ['The tree is tall.', 'The bird sits on its nest.'],
          },
          {
            title: 'The field',
            sentences: ['The grass is green.', 'The rabbit sleeps in a hole.'],
          },
          {
            title: 'The bank',
            sentences: ['The mud is wet.', 'The frog stays by the pond.'],
          },
          {
            title: 'The garden',
            sentences: ['The soil is dark.', 'The worm lives under the soil.'],
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
      skill: 'sci-homes',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'Where does a fish live?',
          'Where does a bird keep its eggs?',
          'A frog needs a wet home. Where does it live?',
          'A worm stays under the ground. Where is its home?',
          'A fish is left on dry grass. What is wrong?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['In water', 'In a nest', 'In a tree top', 'In the sun only'],
          ['In a nest', 'In a pond', 'In a cup', 'In a block of ice'],
          ['By a pond', 'In a dry nest', 'On a magnet', 'In a rubbish bin'],
          ['In the soil', 'In the sky', 'In a nest', 'On a lamp'],
          ['It needs water', 'It needs a nest', 'It needs a magnet', 'It needs a drum'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
    whatHappensNext(
      'sci-homes',
      [
        {
          base: [at('🐟', 50, 50, 34)],
          cards: [
            { icon: '🌊', label: 'In a pond' },
            { icon: '🌳', label: 'In a tree' },
            { icon: '🏜️', label: 'In dry sand' },
          ],
        },
        {
          base: [at('🐸', 50, 50, 34)],
          cards: [
            { icon: '🌊', label: 'By a pond' },
            { icon: '🏜️', label: 'In dry sand' },
            { icon: '☁️', label: 'In the sky' },
          ],
        },
        {
          base: [at('🐪', 50, 50, 34)],
          cards: [
            { icon: '🏜️', label: 'In dry sand' },
            { icon: '🧊', label: 'On ice' },
            { icon: '🌊', label: 'In a pond' },
          ],
        },
        {
          base: [at('🐧', 50, 50, 34)],
          cards: [
            { icon: '🧊', label: 'On ice' },
            { icon: '🏜️', label: 'In dry sand' },
            { icon: '🌳', label: 'In a tree' },
          ],
        },
        {
          base: [at('🐒', 50, 50, 34)],
          cards: [
            { icon: '🌳', label: 'In the trees' },
            { icon: '🌊', label: 'In a pond' },
            { icon: '🧊', label: 'On ice' },
          ],
        },
      ],
      // Soal rumah hewan: gambarnya hewan, kartunya tempat — "apa yang terjadi"
      // tidak cocok untuk hewan yang hanya berdiri.
      'Where does it live?',
    ),
  ],
};
