import type { ContentModule } from '../types';
import { at, bar, whatHappensNext } from '../scienceScene';

export const careForEarth: ContentModule = {
  id: 's2-u10-m1',
  unitId: 's2-u10',
  grade: 2,
  title: 'Care for the Earth',
  icon: '🌍',
  prereq: ['s2-u9-m1'],
  skills: ['sci-earth'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['rubbish', 'bin', 'waste', 'harm', 'river', 'save', 'clean', 'keeps', 'place', 'use', 'less', 'rain', 'washes', 'jumps', 'turns', 'flowers', 'fish', 'bank'],

  learn: [
    {
      stage: 'concrete',
      // Gelas plastik yang sama, tiga nasib. Ikan ikut di gambar supaya "merusak"
      // terlihat sebagai akibat pada makhluk hidup, bukan sekadar kata.
      prompt: 'Put the rubbish in one place.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [
          bar(50, 64, 100, 12, 'green'),
          bar(50, 86, 100, 32, 'blue'),
          at('🗑️', 84, 48, 20),
          at('🥤', 30, 50, 12),
          at('🐟', 60, 86, 12),
        ],
        options: [
          {
            icon: '🚮',
            label: 'Bin',
            caption: 'The bin keeps the river clean.',
            result: [
              bar(50, 64, 100, 12, 'green'),
              bar(50, 86, 100, 32, 'blue'),
              at('🗑️', 84, 48, 20),
              at('🥤', 84, 44, 12, { fx: 'fall' }),
              at('🐟', 56, 86, 12, { fx: 'slide-left' }),
            ],
          },
          {
            icon: '🌊',
            label: 'River',
            caption: 'Rubbish in the river harms the fish.',
            result: [
              bar(50, 64, 100, 12, 'green'),
              bar(50, 86, 100, 32, 'blue'),
              at('🗑️', 84, 48, 20),
              at('🥤', 38, 82, 12, { rotate: 70, fx: 'fall' }),
              at('🐟', 62, 88, 12, { dim: true, fx: 'shake' }),
            ],
          },
          {
            icon: '♻️',
            label: 'Use again',
            caption: 'Use it again: less waste.',
            result: [
              bar(50, 64, 100, 12, 'green'),
              bar(50, 86, 100, 32, 'blue'),
              at('🗑️', 84, 48, 20),
              at('🪴', 30, 48, 16, { fx: 'pop' }),
              at('🐟', 60, 86, 12),
            ],
          },
        ],
      },
      action: 'explore',
      target: 3,
    },
    {
      stage: 'pictorial',
      prompt: 'Rubbish on the bank. Rain comes. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'cloudy',
        base: [
          at('🌧️', 30, 16, 22),
          bar(50, 64, 100, 12, 'green'),
          bar(50, 86, 100, 32, 'blue'),
          at('🥤', 30, 50, 12),
          at('🐟', 64, 86, 12),
        ],
        options: [
          { icon: '🌸', label: 'It turns into flowers', caption: 'It turns into flowers.' },
          {
            icon: '🌊',
            label: 'Rain washes it into the river',
            caption: 'Rain washes rubbish into the river.',
            result: [
              at('🌧️', 30, 16, 22),
              bar(50, 64, 100, 12, 'green'),
              bar(50, 86, 100, 32, 'blue'),
              at('🥤', 40, 82, 12, { rotate: 70, fx: 'fall' }),
              at('🐟', 64, 88, 12, { dim: true, fx: 'shake' }),
            ],
          },
          { icon: '🗑️', label: 'It jumps into the bin', caption: 'It jumps into the bin.' },
        ],
        correct: 1,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Waste harms a river.',
      visual: {
        kind: 'evidence-text',
        title: 'Why it matters',
        sentences: ['Rubbish in a river harms the fish. Saving water leaves more to use.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-earth', [
      {
        ask: 'The fish looks sick. What caused that?',
        bg: 'day',
        base: [bar(50, 64, 100, 12, 'green'), bar(50, 86, 100, 32, 'blue'), at('🥤', 40, 80, 12, { rotate: 40 }), at('🐟', 68, 84, 14, { dim: true })],
        cards: [
          { icon: '🥤', label: 'Rubbish in the river' },
          { icon: '🐟', label: 'The fish needs rubbish' },
          { icon: '✨', label: 'Clean water hurt it' },
        ],
      },
      {
        ask: 'Water runs and no one uses it. Why does that matter?',
        bg: 'room',
        base: [at('🚰', 46, 36, 28), at('💧', 46, 62, 12), at('💧', 46, 78, 12)],
        cards: [
          { icon: '💧', label: 'Less water is left' },
          { icon: '🌊', label: 'More water appears' },
          { icon: '🪄', label: 'The tap makes new water' },
        ],
      },
      {
        ask: 'The fish is well. What keeps the river safe?',
        bg: 'day',
        base: [bar(50, 64, 100, 12, 'green'), bar(50, 86, 100, 32, 'blue'), at('🐟', 56, 84, 14)],
        cards: [
          { icon: '🗑️', label: 'Rubbish stayed in the bin' },
          { icon: '🌊', label: 'Rubbish in the water' },
          { icon: '🥤', label: 'More waste helps' },
        ],
      },
      {
        ask: 'The tap is off after a drink. What helps?',
        bg: 'room',
        base: [at('🚰', 36, 42, 26), at('🥛', 70, 64, 22)],
        cards: [
          { icon: '🛑', label: 'Saving water' },
          { icon: '🚰', label: 'Leaving the tap on' },
          { icon: '🛁', label: 'Filling a big bath' },
        ],
      },
      {
        ask: 'A cup is in the stream. What did it do?',
        bg: 'day',
        base: [bar(50, 64, 100, 12, 'green'), bar(50, 86, 100, 32, 'blue'), at('🥤', 42, 80, 14, { rotate: 50 }), at('🐟', 70, 86, 14, { dim: true })],
        cards: [
          { icon: '🤢', label: 'Harmed the fish' },
          { icon: '🍽️', label: 'Fed the fish' },
          { icon: '✨', label: 'Cleaned the water' },
        ],
      },
      {
        ask: 'The hose runs on the path. Why is water lost?',
        bg: 'day',
        base: [bar(50, 88, 100, 18, 'gray'), at('💦', 40, 48, 18), at('🌱', 82, 70, 16)],
        cards: [
          { icon: '🛑', label: 'No one is using it' },
          { icon: '🌊', label: 'Paths need a flood' },
          { icon: '🪄', label: 'Hoses make more water' },
        ],
      },
      {
        ask: 'Bank rubbish can reach the fish. What caused the risk?',
        bg: 'cloudy',
        base: [at('🌧️', 24, 16, 20), bar(50, 64, 100, 12, 'green'), bar(50, 86, 100, 32, 'blue'), at('🥤', 30, 52, 12), at('🐟', 68, 84, 12)],
        cards: [
          { icon: '🌧️', label: 'Rain can wash it in' },
          { icon: '☀️', label: 'Rain makes it safe' },
          { icon: '🍽️', label: 'Fish eat the rubbish' },
        ],
      },
      {
        ask: 'The river is full of rubbish. What is missing?',
        bg: 'day',
        base: [bar(50, 64, 100, 12, 'green'), bar(50, 86, 100, 32, 'blue'), at('🥤', 36, 78, 12), at('🗑️', 62, 80, 16)],
        cards: [
          { icon: '💧', label: 'Clean water' },
          { icon: '🥤', label: 'More cups' },
          { icon: '🗑️', label: 'More rubbish' },
        ],
      },
    ]),
  ],
};
