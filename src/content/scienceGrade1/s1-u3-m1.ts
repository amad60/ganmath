import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const materialsChange: ContentModule = {
  id: 's1-u3-m1',
  unitId: 's1-u3',
  grade: 1,
  title: 'Hard, Soft, and Change',
  icon: '🪨',
  prereq: ['s1-u2-m1'],
  skills: ['sci-materials'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['clue-tap', 'choose-text', 'pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['rock', 'hard', 'heavy', 'leaf', 'soft', 'light', 'ice', 'melt', 'watch', 'object', 'look', 'sun', 'chocolate', 'stay', 'get'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put the ice in the sun, or cold.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('🧊', 50, 62, 24), ground('gray')],
        options: [
          {
            icon: '☀️',
            label: 'Sun',
            caption: 'The ice melts into water.',
            bg: 'day',
            result: [
              at('☀️', 82, 18, 16, { fx: 'pop' }),
              at('🧊', 50, 70, 12, { dim: true, fx: 'shrink' }),
              at('💧', 66, 80, 12, { fx: 'pop' }),
              ground('gray'),
            ],
          },
          {
            icon: '❄️',
            label: 'Cold',
            caption: 'In the cold, ice stays hard.',
            result: [
              at('❄️', 20, 20, 12),
              at('❄️', 80, 24, 10),
              at('🧊', 50, 62, 24, { fx: 'pulse' }),
              ground('gray'),
            ],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'Chocolate in the sun. What next?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('☀️', 82, 18, 16), at('🍫', 50, 64, 24), ground('gray')],
        options: [
          { icon: '🧊', label: 'It gets hard', caption: 'It gets hard.' },
          {
            icon: '🫠',
            label: 'It melts',
            caption: 'The sun melts the chocolate.',
            result: [
              at('☀️', 82, 18, 16),
              at('🍫', 50, 70, 22, { dim: true, fx: 'droop' }),
              at('🫠', 24, 40, 14, { fx: 'pop' }),
              ground('gray'),
            ],
          },
          { icon: '🌱', label: 'It grows', caption: 'It grows.' },
        ],
        correct: 1,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Ice melts into water.',
      visual: {
        kind: 'evidence-text',
        title: 'A change',
        sentences: ['Hard ice in the sun becomes water.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'clue-tap',
      skill: 'sci-materials',
      params: { s: [0, 4] },
      answer: () => 1,
      text: () => 'Which sentence shows what happens?',
      visual: (p) => {
        const stories = [
          {
            title: 'Pebble',
            sentences: ['The pebble drops in the bowl.', 'It goes down to the bottom.'],
          },
          {
            title: 'Cork',
            sentences: ['The cork drops in the bowl.', 'It stays on top of the water.'],
          },
          {
            title: 'Ice cube',
            sentences: ['The ice cube sits in the sun.', 'It turns into a puddle.'],
          },
          {
            title: 'Sponge',
            sentences: ['The sponge is squeezed.', 'It feels soft in the hand.'],
          },
          {
            title: 'Brick',
            sentences: ['The brick is tapped.', 'It feels hard and does not bend.'],
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
      skill: 'sci-materials',
      params: { c: [0, 4] },
      answer: () => 0,
      text: (p) => {
        const stories = [
          'A coin is put in water. What happens?',
          'A leaf is put in water. What happens?',
          'An ice cube sits in the sun. What happens?',
          'A pillow is squeezed. How does it feel?',
          'A stone is tapped. How does it feel?',
        ];
        return stories[p.c as number] ?? '';
      },
      options: (p) => {
        const list = [
          ['It sinks', 'It flies', 'It sings', 'It blooms'],
          ['It floats', 'It rings', 'It cooks', 'It reads'],
          ['It melts', 'It grows fur', 'It lays eggs', 'It rings'],
          ['Soft', 'Sharp', 'Loud', 'Sweet'],
          ['Hard', 'Sweet', 'Quiet', 'Floppy'],
        ];
        return list[p.c as number] ?? ['A', 'B', 'C', 'D'];
      },
    },
    whatHappensNext('sci-materials', [
      {
        bg: 'day',
        base: [at('☀️', 82, 18, 16), at('🧊', 50, 64, 24), ground('gray')],
        cards: [
          { icon: '💧', label: 'It melts into water' },
          { icon: '🪨', label: 'It turns to rock' },
          { icon: '🌱', label: 'It grows' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 82, 18, 16), at('🍫', 50, 64, 24), ground('gray')],
        cards: [
          { icon: '🫠', label: 'It melts' },
          { icon: '🧊', label: 'It gets cold' },
          { icon: '🎈', label: 'It flies' },
        ],
      },
      {
        bg: 'room',
        base: [at('❄️', 24, 22, 14), at('❄️', 78, 26, 12), at('💧', 50, 64, 24)],
        cards: [
          { icon: '🧊', label: 'It turns to ice' },
          { icon: '🔥', label: 'It gets hot' },
          { icon: '🌱', label: 'It grows' },
        ],
      },
      {
        bg: 'day',
        base: [at('☀️', 82, 18, 16), at('🍦', 50, 62, 26), ground('gray')],
        cards: [
          { icon: '🫠', label: 'It melts' },
          { icon: '🪨', label: 'It gets hard' },
          { icon: '🌳', label: 'It grows' },
        ],
      },
      {
        bg: 'room',
        base: [at('🔥', 30, 62, 20), at('🕯️', 62, 60, 26)],
        cards: [
          { icon: '🫠', label: 'It melts' },
          { icon: '❄️', label: 'It freezes' },
          { icon: '🌱', label: 'It grows' },
        ],
      },
    ]),
  ],
};
