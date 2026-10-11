import type { ContentModule } from '../types';
import { at, bar, whatHappensNext } from '../scienceScene';

export const plantParts: ContentModule = {
  id: 's1-u5-m1',
  unitId: 's1-u5',
  grade: 1,
  title: 'Parts of a Plant',
  icon: '🌿',
  prereq: ['s1-u4-m1'],
  skills: ['sci-plant-parts'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['root', 'stem', 'flower', 'part', 'hold', 'leaves', 'seed'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap each part of the plant.',
      visual: {
        kind: 'science-scene',
        mode: 'tap-part',
        bg: 'day',
        base: [
          bar(50, 90, 100, 20, 'brown'),
          bar(42, 89, 3, 18, 'yellow', { rotate: 35, part: 0 }),
          bar(50, 91, 3, 20, 'yellow', { part: 0 }),
          bar(58, 89, 3, 18, 'yellow', { rotate: -35, part: 0 }),
          bar(50, 54, 3, 50, 'green', { part: 1 }),
          at('🍃', 40, 52, 14, { flip: true, part: 2 }),
          at('🍃', 60, 42, 14, { part: 2 }),
          at('🌸', 50, 20, 18, { part: 3 }),
        ],
        options: [
          { icon: '🟫', label: 'Root', caption: 'Roots take in water.' },
          { icon: '🟩', label: 'Stem', caption: 'The stem holds the plant up.' },
          { icon: '🍃', label: 'Leaf', caption: 'Leaves take in the sun.' },
          { icon: '🌸', label: 'Flower', caption: 'A flower makes seeds.' },
        ],
      },
      action: 'explore',
      target: 4,
    },
    {
      stage: 'pictorial',
      prompt: 'This plant has no roots. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [bar(50, 90, 100, 20, 'brown'), at('🌿', 50, 50, 30), at('✂️', 30, 80, 12)],
        options: [
          { icon: '🌳', label: 'It grows big', caption: 'It grows big.' },
          { icon: '🟩', label: 'The stem holds it', caption: 'The stem holds it.' },
          {
            icon: '🥀',
            label: 'It dries up',
            caption: 'No roots, no water. It dries up.',
            result: [bar(50, 90, 100, 20, 'brown'), at('🥀', 50, 56, 28, { fx: 'droop' })],
          },
        ],
        correct: 2,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A flower grows on the plant.',
      visual: {
        kind: 'evidence-text',
        title: 'Four parts',
        sentences: ['A plant has roots, a stem, leaves, and a flower.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-plant-parts', [
      {
        ask: 'The plant dried up. Which part was missing?',
        bg: 'day',
        base: [bar(50, 90, 100, 20, 'brown'), at('🥀', 50, 52, 28), at('✂️', 28, 78, 12)],
        cards: [
          { icon: '🟫', label: 'Roots' },
          { icon: '🌸', label: 'The flower' },
          { icon: '☀️', label: 'The sun' },
        ],
      },
      {
        ask: 'The plant fell over. Which part broke?',
        bg: 'day',
        base: [bar(50, 90, 100, 20, 'brown'), at('🌿', 62, 70, 26, { rotate: 70 })],
        cards: [
          { icon: '🟩', label: 'The stem' },
          { icon: '🟫', label: 'The roots' },
          { icon: '🪴', label: 'A pot' },
        ],
      },
      {
        ask: 'Which part takes in the sun?',
        bg: 'day',
        base: [at('☀️', 82, 16, 16), at('🌿', 50, 58, 30), bar(50, 90, 100, 20, 'brown')],
        cards: [
          { icon: '🍃', label: 'Leaves' },
          { icon: '🟩', label: 'The stem' },
          { icon: '💧', label: 'Water' },
        ],
      },
      {
        ask: 'Seeds are here. Which part made them?',
        bg: 'day',
        base: [bar(50, 90, 100, 20, 'brown'), at('🌰', 42, 74, 14), at('🌰', 62, 70, 12)],
        cards: [
          { icon: '🌸', label: 'The flower' },
          { icon: '🍃', label: 'A leaf' },
          { icon: '🟤', label: 'The soil' },
        ],
      },
      {
        ask: 'Which part takes water from the soil?',
        bg: 'day',
        base: [bar(50, 90, 100, 20, 'brown'), at('💧', 36, 84, 12), at('🌱', 58, 58, 24)],
        cards: [
          { icon: '🟫', label: 'Roots' },
          { icon: '🌸', label: 'The flower' },
          { icon: '🌰', label: 'A seed' },
        ],
      },
      {
        ask: 'This seed is new. Which part made it?',
        bg: 'day',
        base: [at('🌰', 62, 72, 16), at('🌿', 40, 52, 28), bar(50, 90, 100, 20, 'brown')],
        cards: [
          { icon: '🌸', label: 'The flower' },
          { icon: '🟫', label: 'The roots' },
          { icon: '☀️', label: 'The sun' },
        ],
      },
      {
        ask: 'Which part holds the flower in the cup?',
        bg: 'room',
        base: [at('☕', 50, 70, 22), at('🌷', 50, 42, 26)],
        cards: [
          { icon: '🟩', label: 'The stem' },
          { icon: '🍃', label: 'A leaf' },
          { icon: '🟤', label: 'The soil' },
        ],
      },
      {
        ask: 'What helps this plant take in the sun?',
        bg: 'day',
        base: [at('☀️', 82, 16, 16), at('🌿', 50, 56, 30), bar(50, 90, 100, 20, 'brown')],
        cards: [
          { icon: '🍃', label: 'Leaves' },
          { icon: '🟩', label: 'The stem' },
          { icon: '🪨', label: 'A rock' },
        ],
      },
    ]),
  ],
};
