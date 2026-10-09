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
  questionTypes: ['pick-picture'],
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
      
      {
        bg: 'day',
        base: [at('🐝', 50, 52, 26)],
        cards: [
          { icon: '🍯', label: 'In a hive' },
          { icon: '🌊', label: 'In the sea' },
          { icon: '❄️', label: 'On ice' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐜', 50, 64, 22)],
        cards: [
          { icon: '🕳️', label: 'In the soil' },
          { icon: '🌊', label: 'In the sea' },
          { icon: '☁️', label: 'In a cloud' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐿️', 48, 56, 26)],
        cards: [
          { icon: '🌳', label: 'In a tree' },
          { icon: '🌊', label: 'In the sea' },
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
