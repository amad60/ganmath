import type { ContentModule } from '../types';
import { at, bar, ground, whatHappensNext } from '../scienceScene';

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
    whatHappensNext(
      'sci-earth',
      [
        {
          bg: 'day',
          base: [bar(50, 64, 100, 12, 'green'), bar(50, 86, 100, 32, 'blue'), at('🥤', 40, 50, 14), at('🧒', 70, 40, 26)],
          cards: [
            { icon: '🗑️', label: 'Put it in the bin' },
            { icon: '🌊', label: 'Throw it in the river' },
            { icon: '🔥', label: 'Burn it' },
          ],
        },
        {
          bg: 'room',
          base: [at('🚰', 40, 36, 26), at('💧', 40, 58, 10), at('💧', 40, 72, 10), at('🪥', 74, 50, 20)],
          cards: [
            { icon: '🛑', label: 'Turn the tap off' },
            { icon: '🌊', label: 'Let it run' },
            { icon: '🛁', label: 'Fill a big bath' },
          ],
        },
        {
          bg: 'day',
          base: [at('☀️', 84, 16, 16), at('💡', 40, 30, 18), at('🛋️', 50, 76, 30)],
          cards: [
            { icon: '🌑', label: 'Turn the light off' },
            { icon: '💡', label: 'Add more lamps' },
            { icon: '📺', label: 'Turn on the TV' },
          ],
        },
        {
          bg: 'day',
          base: [ground('gray'), at('🥫', 36, 74, 18), at('🍾', 56, 72, 20), at('📰', 74, 78, 16)],
          cards: [
            { icon: '♻️', label: 'Make new things from them' },
            { icon: '🌊', label: 'Throw them in the river' },
            { icon: '🔥', label: 'Burn them' },
          ],
        },
        {
          bg: 'day',
          base: [ground('green'), at('🪵', 34, 82, 18), at('🪵', 60, 84, 18), at('🌳', 82, 58, 30)],
          cards: [
            { icon: '🌱', label: 'Plant a new tree' },
            { icon: '🪓', label: 'Cut more trees' },
            { icon: '🗑️', label: 'Fill it with rubbish' },
          ],
        },
      
      {
        bg: 'day',
        base: [at('🗑️', 30, 58, 20), at('🏞️', 68, 55, 26), at('💧', 68, 74, 12)],
        cards: [
          { icon: '🤢', label: 'The water gets dirty' },
          { icon: '🌸', label: 'It turns into flowers' },
          { icon: '✨', label: 'It gets clean' },
        ],
      },
      {
        bg: 'room',
        base: [at('🚰', 50, 48, 28), at('💧', 50, 74, 14)],
        cards: [
          { icon: '💧', label: 'Water is wasted' },
          { icon: '🌳', label: 'A tree grows' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'room',
        base: [at('🫙', 50, 56, 28)],
        cards: [
          { icon: '🫙', label: 'Use the jar again' },
          { icon: '🔥', label: 'Burn it' },
          { icon: '🌊', label: 'Throw it in the river' },
        ],
      },
    ],
      // Merawat bumi soal PILIHAN tindakan, jadi kartunya tindakan yang menolong.
      'Which one helps?',
    ),
  ],
};
