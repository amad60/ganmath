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
          { icon: '🌸', label: 'It gets a flower', caption: 'It gets a flower.' },
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
        bg: 'day',
        base: [bar(50, 90, 100, 20, 'brown'), at('🌿', 50, 50, 30), at('✂️', 30, 80, 12)],
        cards: [
          { icon: '🥀', label: 'It dries up' },
          { icon: '🌳', label: 'It grows big' },
          { icon: '🌸', label: 'It gets a flower' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌸', 50, 40, 34), bar(50, 90, 100, 20, 'brown')],
        cards: [
          { icon: '🌰', label: 'It makes seeds' },
          { icon: '🪨', label: 'It makes rocks' },
          { icon: '🌧️', label: 'It makes rain' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 82, 16, 16), at('🍃', 50, 54, 30), bar(50, 90, 100, 20, 'brown')],
        cards: [
          { icon: '🌿', label: 'The plant grows' },
          { icon: '🌙', label: 'It is night' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'day',
        base: [at('💧', 50, 30, 16), at('🌱', 50, 66, 22), bar(50, 90, 100, 20, 'brown')],
        cards: [
          { icon: '🌿', label: 'The roots drink it' },
          { icon: '🔥', label: 'It burns' },
          { icon: '🪨', label: 'It turns to rock' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌷', 50, 50, 30), at('✂️', 64, 62, 12), bar(50, 90, 100, 20, 'brown')],
        cards: [
          { icon: '🥀', label: 'It falls down' },
          { icon: '🌳', label: 'It grows tall' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
    
      {
        bg: 'day',
        base: [at('🐝', 68, 42, 18), at('🌸', 42, 58, 28)],
        cards: [
          { icon: '🌰', label: 'It makes seeds' },
          { icon: '🪨', label: 'It makes rocks' },
          { icon: '🌙', label: 'It is night' },
        ],
      },
      {
        bg: 'day',
        base: [at('💧', 50, 78, 14), at('🌱', 50, 48, 28)],
        cards: [
          { icon: '🌿', label: 'The plant grows' },
          { icon: '🧊', label: 'It freezes' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'day',
        base: [at('🍃', 50, 40, 22), at('✂️', 28, 62, 14)],
        cards: [
          { icon: '🥀', label: 'The leaf dries' },
          { icon: '🚗', label: 'It becomes a car' },
          { icon: '🌧️', label: 'It makes rain' },
        ],
      },
    ]),
  ],
};
