import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const rootsDrink: ContentModule = {
  id: 's4-u1-m1',
  unitId: 's4-u1',
  grade: 4,
  title: 'Roots Drink',
  icon: '🌱',
  prereq: [],
  skills: ['sci-roots'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['water', 'root', 'plant', 'stay', 'droop'],

  learn: [
    // Satu variabel: air sampai ke akar atau tidak. Batang dan daunnya sama.
    {
      stage: 'concrete',
      prompt: 'Water on the roots, or not.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('🌱', 50, 48, 28), ground('brown')],
        options: [
          {
            icon: '💧',
            label: 'Water',
            caption: 'Water goes up. The plant stays up.',
            result: [at('💧', 50, 78, 12), at('🌿', 50, 42, 34, { fx: 'grow' }), ground('brown')],
          },
          {
            icon: '🏜️',
            label: 'No water',
            caption: 'No water. The plant droops.',
            result: [at('🥀', 50, 58, 28, { fx: 'droop' }), ground('brown')],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    // Airnya ada, tapi di samping — akarnya putus, jadi air tidak naik.
    {
      stage: 'pictorial',
      prompt: 'See this. See what changes.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('💧', 22, 70, 14), at('✂️', 50, 72, 14), at('🌱', 50, 42, 26), ground('brown')],
        options: [
          {
            icon: '🥀',
            label: 'The plant droops',
            caption: 'The plant droops.',
            result: [at('💧', 22, 70, 14), at('🥀', 50, 52, 26, { fx: 'droop' }), ground('brown')],
          },
          { icon: '🌿', label: 'The plant stays up', caption: 'The plant stays up.' },
          { icon: '🌳', label: 'It grows big', caption: 'It grows big.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Roots take water up.',
      visual: {
        kind: 'evidence-text',
        title: 'Roots',
        sentences: [
          'Water at the roots goes up the plant.',
          'No water at the roots, and the plant droops.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-roots', [
      {
        bg: 'day',
        base: [at('💧', 50, 80, 14), at('🌱', 50, 46, 28), ground('brown')],
        cards: [
          { icon: '🌿', label: 'The plant stays up' },
          { icon: '🥀', label: 'It droops' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌱', 50, 48, 26), ground('yellow')],
        cards: [
          { icon: '🥀', label: 'The plant droops' },
          { icon: '🌻', label: 'It gets a flower' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('💧', 18, 62, 14), at('✂️', 50, 74, 16), at('🌱', 50, 40, 24), ground('brown')],
        cards: [
          { icon: '🥀', label: 'The plant droops' },
          { icon: '🌳', label: 'It grows big' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌧️', 50, 16, 18), at('🌱', 50, 52, 26), ground('brown')],
        cards: [
          { icon: '🌿', label: 'The plant stays up' },
          { icon: '🧊', label: 'It freezes' },
          { icon: '🪨', label: 'It turns to rock' },
        ],
      },
      {
        bg: 'day',
        base: [at('💧', 78, 28, 12), at('🍃', 62, 40, 16), at('🌱', 46, 56, 24), ground('yellow')],
        cards: [
          { icon: '🥀', label: 'The plant droops' },
          { icon: '🌺', label: 'It gets a flower' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'day',
        base: [at('💧', 50, 86, 12), at('🌱', 50, 40, 34), ground('brown')],
        cards: [
          { icon: '🌿', label: 'The plant stays up' },
          { icon: '🐟', label: 'It swims away' },
          { icon: '❄️', label: 'It freezes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌱', 50, 36, 20), at('💧', 50, 88, 10), ground('brown')],
        cards: [
          { icon: '🥀', label: 'The plant droops' },
          { icon: '🍎', label: 'It makes fruit' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('🌧️', 30, 18, 16), at('🌧️', 70, 22, 14), at('🌱', 50, 50, 28), ground('brown')],
        cards: [
          { icon: '🌿', label: 'The plant stays up' },
          { icon: '🚢', label: 'A boat comes' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
    ]),
  ],
};
