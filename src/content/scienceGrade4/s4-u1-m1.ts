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
      prompt: 'Water on the roots, or not.',
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
        ask: 'Why does this plant stay up?',
        base: [at('🌿', 50, 48, 32), ground('brown')],
        cards: [
          { icon: '💧', label: 'Water reached the roots' },
          { icon: '🌸', label: 'Flower drinks' },
          { icon: '🍃', label: 'Leaf drinks' },
        ],
      },
      {
        bg: 'day',
        ask: 'What was missing for this plant?',
        base: [at('🥀', 50, 55, 28), ground('yellow')],
        cards: [
          { icon: '💧', label: 'Water at the roots' },
          { icon: '🌸', label: 'Flower drinks' },
          { icon: '☀️', label: 'Sun on the flower' },
        ],
      },
      {
        bg: 'day',
        ask: 'What caused this plant to droop?',
        base: [at('🥀', 50, 30, 22), at('✂️', 50, 58, 14), at('💧', 50, 80, 12), ground('brown')],
        cards: [
          { icon: '🌱', label: 'The roots were cut' },
          { icon: '🏜️', label: 'There was no water' },
          { icon: '🌸', label: 'The flower was cut' },
        ],
      },
      {
        bg: 'day',
        ask: 'Which part got the rain?',
        base: [at('🌧️', 50, 16, 18), at('🌿', 50, 52, 26), ground('brown')],
        cards: [
          { icon: '🌱', label: 'Roots under it' },
          { icon: '🌸', label: 'The flower on top' },
          { icon: '🍃', label: 'Only the leaf' },
        ],
      },
      {
        bg: 'day',
        ask: 'Why did this plant droop?',
        base: [at('💧', 72, 26, 12), at('🍃', 58, 36, 16), at('🥀', 46, 58, 24), ground('yellow')],
        cards: [
          { icon: '🏜️', label: 'Water missed the roots' },
          { icon: '🍃', label: 'Leaf drank it' },
          { icon: '🌸', label: 'Flower drinks' },
        ],
      },
      {
        bg: 'day',
        ask: 'What keeps this tree standing?',
        base: [at('🌳', 50, 48, 36), ground('green')],
        cards: [
          { icon: '💧', label: 'Water at roots' },
          { icon: '🍃', label: 'Leaves drink' },
          { icon: '🌸', label: 'Flower drinks' },
        ],
      },
      {
        bg: 'day',
        ask: 'What was missing for this rose?',
        base: [at('🥀', 50, 40, 28), at('💧', 68, 26, 12), ground('yellow')],
        cards: [
          { icon: '🪴', label: 'Water at the roots' },
          { icon: '🌸', label: 'Water on the petals' },
          { icon: '🍃', label: 'A bigger leaf' },
        ],
      },
      {
        bg: 'room',
        ask: 'Which part took the water up?',
        base: [at('🌿', 50, 34, 24), at('🥛', 50, 62, 28)],
        cards: [
          { icon: '🌱', label: 'The roots' },
          { icon: '🌸', label: 'The flower on top' },
          { icon: '🥤', label: 'The cup did it' },
        ],
      },
    ]),
  ],
};
