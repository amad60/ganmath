import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

export const solidAndLiquid: ContentModule = {
  id: 's2-u4-m1',
  unitId: 's2-u4',
  grade: 2,
  title: 'Solid and Liquid',
  icon: '💧',
  prereq: ['s2-u3-m1'],
  skills: ['sci-states'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['solid', 'keep', 'shape', 'liquid', 'cup', 'pour', 'water', 'plate', 'bowl', 'tall', 'flat', 'wide', 'apple', 'its', 'own', 'flies', 'goes'],

  learn: [
    {
      stage: 'concrete',
      // Airnya sama, wadahnya yang berganti. Air digambar sebagai batang biru yang
      // MENGISI dari dasar (`grow` berporos di bawah) — bentuknya ikut dinding wadah.
      prompt: 'Pour the water into each one.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [ground('brown'), at('🫖', 50, 50, 28)],
        options: [
          {
            icon: '🥛',
            label: 'Cup',
            caption: 'In a cup, the water is tall.',
            result: [
              ground('brown'),
              at('💧', 50, 22, 10, { fx: 'fall' }),
              bar(41, 66, 2.5, 40, 'gray'),
              bar(59, 66, 2.5, 40, 'gray'),
              bar(50, 86, 20, 3, 'gray'),
              bar(50, 69, 15.5, 32, 'blue', { fx: 'grow' }),
            ],
          },
          {
            icon: '🥣',
            label: 'Bowl',
            caption: 'In a bowl, the water is wide.',
            result: [
              ground('brown'),
              at('💧', 50, 22, 10, { fx: 'fall' }),
              bar(29, 74, 2.5, 24, 'gray'),
              bar(71, 74, 2.5, 24, 'gray'),
              bar(50, 86, 44, 3, 'gray'),
              bar(50, 78, 38, 12, 'blue', { fx: 'grow' }),
            ],
          },
          {
            icon: '🍽️',
            label: 'Plate',
            caption: 'On a plate, the water goes flat.',
            result: [
              ground('brown'),
              at('💧', 50, 22, 10, { fx: 'fall' }),
              bar(16, 82, 2.5, 8, 'gray'),
              bar(84, 82, 2.5, 8, 'gray'),
              bar(50, 86, 70, 3, 'gray'),
              bar(50, 82.5, 64, 4, 'blue', { fx: 'grow' }),
            ],
          },
        ],
      },
      action: 'explore',
      target: 3,
    },
    {
      stage: 'pictorial',
      prompt: 'Put the apple in a cup. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'room',
        base: [
          ground('brown'),
          at('🍎', 50, 20, 14),
          bar(41, 66, 2.5, 40, 'gray'),
          bar(59, 66, 2.5, 40, 'gray'),
          bar(50, 86, 20, 3, 'gray'),
        ],
        options: [
          { icon: '💦', label: 'It goes flat', caption: 'It goes flat.' },
          {
            icon: '🍎',
            label: 'It keeps its shape',
            caption: 'A solid keeps its own shape.',
            result: [
              ground('brown'),
              bar(41, 66, 2.5, 40, 'gray'),
              bar(59, 66, 2.5, 40, 'gray'),
              bar(50, 86, 20, 3, 'gray'),
              at('🍎', 50, 76, 13, { fx: 'fall' }),
            ],
          },
          { icon: '🥣', label: 'It goes wide', caption: 'It goes wide.' },
        ],
        correct: 1,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A liquid takes the cup shape.',
      visual: {
        kind: 'evidence-text',
        title: 'It pours',
        sentences: ['Water pours. In a new cup it takes that shape.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-states', [
      {
        ask: 'The water stands tall in the cup. Why?',
        bg: 'room',
        base: [
          ground('brown'),
          bar(41, 62, 2.5, 36, 'gray'),
          bar(59, 62, 2.5, 36, 'gray'),
          bar(50, 80, 20, 3, 'gray'),
          bar(50, 66, 15, 26, 'blue'),
        ],
        cards: [
          { icon: '🥛', label: 'It took the cup shape' },
          { icon: '🧱', label: 'Water keeps one shape' },
          { icon: '📐', label: 'The cup grew taller' },
        ],
      },
      {
        ask: 'Water on the plate went flat. What made that?',
        bg: 'room',
        base: [ground('brown'), bar(50, 82, 64, 3, 'gray'), bar(50, 80, 56, 4, 'blue')],
        cards: [
          { icon: '🍽️', label: 'It took the plate shape' },
          { icon: '🧊', label: 'The plate froze it' },
          { icon: '📏', label: 'Water is always flat' },
        ],
      },
      {
        ask: 'The water looks wide now. What caused that?',
        bg: 'room',
        base: [
          ground('brown'),
          bar(28, 74, 2.5, 20, 'gray'),
          bar(72, 74, 2.5, 20, 'gray'),
          bar(50, 84, 46, 3, 'gray'),
          bar(50, 78, 40, 10, 'blue'),
        ],
        cards: [
          { icon: '🥣', label: 'The bowl shape' },
          { icon: '📏', label: 'Water is always wide' },
          { icon: '🧱', label: 'It became a solid' },
        ],
      },
      {
        ask: 'The apple in the cup stayed round. Why?',
        bg: 'room',
        base: [
          ground('brown'),
          bar(41, 62, 2.5, 36, 'gray'),
          bar(59, 62, 2.5, 36, 'gray'),
          bar(50, 80, 20, 3, 'gray'),
          at('🍎', 50, 70, 14),
        ],
        cards: [
          { icon: '🍎', label: 'A solid keeps its shape' },
          { icon: '💦', label: 'It poured like water' },
          { icon: '💧', label: 'It became water' },
        ],
      },
      {
        ask: 'Juice filled a new cup. What did the juice do?',
        bg: 'room',
        base: [
          ground('brown'),
          bar(41, 62, 2.5, 36, 'gray'),
          bar(59, 62, 2.5, 36, 'gray'),
          bar(50, 80, 20, 3, 'gray'),
          bar(50, 68, 15, 22, 'red'),
        ],
        cards: [
          { icon: '🥛', label: 'It took the cup shape' },
          { icon: '📦', label: 'It stayed a box' },
          { icon: '🧊', label: 'It turned solid' },
        ],
      },
      {
        ask: 'A nail sits in the cup. What keeps its shape?',
        bg: 'room',
        base: [ground('brown'), at('🥛', 50, 64, 28), at('🔩', 50, 58, 14)],
        cards: [
          { icon: '🔩', label: 'It is a solid' },
          { icon: '🔥', label: 'The cup melts it' },
          { icon: '💦', label: 'It pours flat' },
        ],
      },
      {
        ask: 'Water spilled from the cup. Why can it spill?',
        bg: 'room',
        base: [ground('brown'), at('🥛', 36, 48, 22, { rotate: 80 }), bar(62, 84, 36, 5, 'blue')],
        cards: [
          { icon: '💧', label: 'Water pours' },
          { icon: '🧱', label: 'It is a solid block' },
          { icon: '🧊', label: 'The cup is ice' },
        ],
      },
      {
        ask: 'This water matches the new cup. What helps?',
        bg: 'room',
        base: [
          ground('brown'),
          bar(38, 66, 2.5, 28, 'gray'),
          bar(62, 66, 2.5, 28, 'gray'),
          bar(50, 80, 26, 3, 'gray'),
          bar(50, 70, 20, 18, 'blue'),
        ],
        cards: [
          { icon: '🥛', label: 'Water takes that shape' },
          { icon: '🧱', label: 'Water has its own shape' },
          { icon: '🧸', label: 'The cup is soft' },
        ],
      },
    ]),
  ],
};
