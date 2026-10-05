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
  questionTypes: ['clue-tap', 'choose-text', 'pick-picture'],
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
          { icon: '🎈', label: 'It flies up', caption: 'It flies up.' },
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
    {
      type: 'clue-tap',
      skill: 'sci-states',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows solid or liquid?',
      visual: (p) => {
        const stories = [
          {
            title: 'New cup',
            sentences: ['The cup is on the table.', 'The water pours and takes the cup shape.'],
          },
          {
            title: 'The rock',
            sentences: ['She taps the rock.', 'The rock keeps one shape.'],
          },
          {
            title: 'Juice',
            sentences: ['Juice sits in a jug.', 'She pours it into a new cup.'],
          },
          {
            title: 'Wood block',
            sentences: ['The block is wood.', 'It stays the same shape in a new box.'],
          },
          {
            title: 'Milk',
            sentences: ['Milk is in a bottle.', 'She pours the milk into a glass.'],
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
      skill: 'sci-states',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'Water is poured into a new cup. What happens?',
          'A rock is moved into a new box. What happens to its shape?',
          'Which one is a liquid?',
          'Which one is a solid?',
          'You tip a cup of water. What does the water do?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['It takes the cup shape', 'It keeps a rock shape', 'It becomes a seed', 'It flies away'],
          ['It keeps one shape', 'It pours out', 'It becomes liquid', 'It melts away'],
          ['Juice in a cup', 'A wood block', 'A metal clip', 'A nest'],
          ['A rock', 'Milk', 'Water', 'Juice'],
          ['It flows out', 'It stays a hard block', 'It becomes a nest', 'It turns to metal'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
    whatHappensNext('sci-states', [
      {
        bg: 'room',
        base: [ground('brown'), at('🥛', 50, 70, 24, { rotate: 80 })],
        cards: [
          { icon: '💦', label: 'It spills out' },
          { icon: '🧱', label: 'It stays like a block' },
          { icon: '🌸', label: 'A flower grows' },
        ],
      },
      {
        bg: 'water',
        base: [at('✋', 50, 14, 14), at('🪨', 50, 34, 14)],
        cards: [
          { icon: '🪨', label: 'It keeps its shape' },
          { icon: '💦', label: 'It turns to water' },
          { icon: '🎈', label: 'It floats up' },
        ],
      },
      {
        bg: 'room',
        base: [ground('brown'), at('🧱', 30, 40, 18), at('📦', 64, 72, 30)],
        cards: [
          { icon: '🧱', label: 'It keeps its shape' },
          { icon: '💦', label: 'It spills' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'room',
        base: [ground('brown'), at('🍯', 50, 66, 26, { rotate: -100 })],
        cards: [
          { icon: '💧', label: 'It pours out' },
          { icon: '🧊', label: 'It stays in a block' },
          { icon: '🐝', label: 'A bee comes out' },
        ],
      },
      {
        bg: 'room',
        base: [ground('brown'), at('🍓', 50, 34, 18), bar(50, 84, 60, 3, 'gray')],
        cards: [
          { icon: '🍓', label: 'It keeps its shape' },
          { icon: '💦', label: 'It goes flat' },
          { icon: '🌳', label: 'It grows into a tree' },
        ],
      },
    ]),
  ],
};
