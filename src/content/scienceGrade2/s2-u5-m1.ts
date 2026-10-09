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
        bg: 'day',
        base: [at('☀️', 84, 16, 18), at('🍦', 46, 58, 30)],
        cards: [
          { icon: '💧', label: 'It melts' },
          { icon: '🧊', label: 'It gets hard' },
          { icon: '🌱', label: 'It grows' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 84, 16, 18), ground('white'), at('⛄', 46, 62, 34)],
        cards: [
          { icon: '💦', label: 'It melts' },
          { icon: '❄️', label: 'It gets big' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 84, 16, 18), bar(46, 80, 40, 4, 'gray'), at('🍫', 46, 66, 22)],
        cards: [
          { icon: '💧', label: 'It melts' },
          { icon: '🧊', label: 'It gets cold' },
          { icon: '🐦', label: 'It flies' },
        ],
      },
      {
        bg: 'night',
        base: [at('❄️', 20, 20, 12), at('❄️', 80, 18, 12), at('🌙', 50, 16, 12), bar(50, 86, 100, 28, 'blue')],
        cards: [
          { icon: '🧊', label: 'The pond freezes' },
          { icon: '🔥', label: 'The pond gets hot' },
          { icon: '🌸', label: 'Flowers grow' },
        ],
      },
      {
        bg: 'cloudy',
        base: [at('❄️', 18, 18, 12), at('❄️', 82, 20, 12), bar(50, 78, 40, 4, 'gray'), at('💧', 50, 62, 18)],
        cards: [
          { icon: '🧊', label: 'It turns to ice' },
          { icon: '☀️', label: 'It gets hot' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
    
      {
        bg: 'day',
        base: [at('🍭', 46, 58, 24), at('☀️', 80, 18, 16)],
        cards: [
          { icon: '💧', label: 'It melts' },
          { icon: '❄️', label: 'It freezes' },
          { icon: '🌱', label: 'It grows' },
        ],
      },
      {
        bg: 'room',
        base: [at('💧', 46, 58, 18), at('❄️', 76, 30, 20)],
        cards: [
          { icon: '🧊', label: 'It turns to ice' },
          { icon: '🔥', label: 'It boils' },
          { icon: '🌸', label: 'It blooms' },
        ],
      },
      {
        bg: 'room',
        base: [at('🕯️', 46, 58, 28), at('🔥', 70, 36, 16)],
        cards: [
          { icon: '💧', label: 'The wax melts' },
          { icon: '❄️', label: 'It freezes' },
          { icon: '🐦', label: 'It flies' },
        ],
      },
    ]),
  ],
};
