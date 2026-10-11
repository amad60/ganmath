import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

export const heatAndCold: ContentModule = {
  id: 's2-u5-m1',
  unitId: 's2-u5',
  grade: 2,
  title: 'Heat and Cold',
  icon: '🌡️',
  prereq: ['s2-u4-m1'],
  skills: ['sci-heat'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['heat', 'melt', 'ice', 'cold', 'freeze', 'hot', 'warm', 'hand', 'slowly', 'stay', 'butter', 'pan', 'hard', 'turn', 'water', 'grow', 'place', 'get'],

  learn: [
    {
      stage: 'concrete',
      // Es yang sama di tiga tempat. Tangan sengaja ada di tengah: panas tidak harus
      // matahari, dan es di tangan mencair PELAN — jadi panas punya kadar.
      prompt: 'Put the ice in each place.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [bar(50, 80, 40, 4, 'gray'), at('🧊', 50, 66, 20)],
        options: [
          {
            icon: '☀️',
            label: 'Sun',
            caption: 'Hot sun: the ice melts.',
            bg: 'day',
            result: [
              at('☀️', 84, 16, 18),
              bar(50, 80, 40, 4, 'gray'),
              at('🧊', 50, 66, 20, { fx: 'fade' }),
              bar(50, 76, 44, 6, 'blue', { fx: 'grow' }),
            ],
          },
          {
            icon: '✋',
            label: 'Hand',
            caption: 'A warm hand melts it slowly.',
            result: [
              at('🤲', 50, 76, 30),
              at('🧊', 50, 56, 14, { fx: 'shrink' }),
              at('💧', 72, 86, 7, { fx: 'fall' }),
            ],
          },
          {
            icon: '❄️',
            label: 'Cold',
            caption: 'In the cold, ice stays ice.',
            bg: 'cloudy',
            result: [
              at('❄️', 16, 18, 10),
              at('❄️', 84, 24, 10),
              bar(50, 80, 40, 4, 'gray'),
              at('🧊', 50, 66, 20, { fx: 'pulse' }),
            ],
          },
        ],
      },
      action: 'explore',
      target: 3,
    },
    {
      stage: 'pictorial',
      prompt: 'Put butter in a hot pan. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'room',
        base: [at('🔥', 50, 86, 14), bar(50, 72, 44, 4, 'gray'), at('🧈', 50, 61, 18)],
        options: [
          { icon: '🧊', label: 'It gets hard', caption: 'It gets hard.' },
          { icon: '🌱', label: 'It grows', caption: 'It grows.' },
          {
            icon: '💧',
            label: 'It melts',
            caption: 'Heat melts the butter.',
            result: [
              at('🔥', 50, 86, 14, { fx: 'pulse' }),
              bar(50, 72, 44, 4, 'gray'),
              at('🧈', 50, 61, 18, { fx: 'fade' }),
              bar(50, 68, 34, 3, 'yellow', { fx: 'grow' }),
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
      prompt: 'Cold can freeze water.',
      visual: {
        kind: 'evidence-text',
        title: 'Two ways',
        sentences: ['Heat melts ice. Cold freezes water.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-heat', [
      {
        ask: 'The ice cream is a puddle. What caused that?',
        bg: 'day',
        base: [bar(50, 82, 36, 4, 'gray'), bar(50, 78, 28, 6, 'yellow'), at('🍦', 50, 62, 16, { dim: true })],
        cards: [
          { icon: '☀️', label: 'Heat' },
          { icon: '❄️', label: 'Cold air' },
          { icon: '🧊', label: 'A freezer' },
        ],
      },
      {
        ask: 'The water became ice. What made it freeze?',
        bg: 'room',
        base: [bar(50, 80, 40, 4, 'gray'), at('🧊', 50, 66, 22)],
        cards: [
          { icon: '❄️', label: 'Cold' },
          { icon: '🔥', label: 'Heat' },
          { icon: '☀️', label: 'Sunshine' },
        ],
      },
      {
        ask: 'The snowman became a puddle. Why?',
        bg: 'day',
        base: [ground('green'), bar(50, 84, 40, 6, 'blue'), at('🥕', 50, 78, 10)],
        cards: [
          { icon: '☀️', label: 'Heat melted it' },
          { icon: '❄️', label: 'Cold froze it more' },
          { icon: '💨', label: 'Wind built it up' },
        ],
      },
      {
        ask: 'The butter went soft. What caused that?',
        bg: 'room',
        base: [bar(50, 78, 44, 4, 'gray'), bar(50, 74, 30, 4, 'yellow')],
        cards: [
          { icon: '🔥', label: 'Heat' },
          { icon: '❄️', label: 'A cold room' },
          { icon: '🧊', label: 'The pan froze' },
        ],
      },
      {
        ask: 'Water in the cup is ice. What made it?',
        bg: 'room',
        base: [at('🥛', 50, 64, 28), at('🧊', 50, 56, 14)],
        cards: [
          { icon: '❄️', label: 'Cold' },
          { icon: '☀️', label: 'Heat from the sun' },
          { icon: '🔥', label: 'The cup boiled it' },
        ],
      },
      {
        ask: 'This chocolate melted. What made it melt?',
        bg: 'room',
        base: [bar(50, 80, 40, 4, 'gray'), bar(50, 76, 28, 6, 'brown')],
        cards: [
          { icon: '☀️', label: 'Heat' },
          { icon: '❄️', label: 'A cold box' },
          { icon: '🧊', label: 'Extra ice' },
        ],
      },
      {
        ask: 'This ice is still ice. What keeps it frozen?',
        bg: 'room',
        base: [bar(50, 80, 40, 4, 'gray'), at('🧊', 50, 64, 24)],
        cards: [
          { icon: '❄️', label: 'Cold' },
          { icon: '🔥', label: 'A hot pan' },
          { icon: '🤲', label: 'Warm hands' },
        ],
      },
      {
        ask: 'This water did not freeze. Why?',
        bg: 'room',
        base: [bar(50, 80, 44, 4, 'gray'), at('💧', 50, 64, 20)],
        cards: [
          { icon: '🌡️', label: 'Not cold enough' },
          { icon: '🔥', label: 'Heat freezes water' },
          { icon: '☀️', label: 'The sun makes ice' },
        ],
      },
    ]),
  ],
};
