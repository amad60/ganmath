import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const oneLinkBreaks: ContentModule = {
  id: 's4-u10-m1',
  unitId: 's4-u10',
  grade: 4,
  title: 'One Link Breaks',
  icon: '🔗',
  prereq: ['s4-u9-m1'],
  skills: ['sci-link'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['plant', 'stay', 'go', 'rabbit', 'food', 'eater', 'fox'],

  learn: [
    // Rumput hilang, kelinci ikut pergi. Tebakan: rumput masih ada, kelinci tidak — rubah ikut pergi.
    {
      stage: 'concrete',
      prompt: 'The plants stay, or go.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'day',
        base: [at('🐇', 62, 62, 20), ground('green')],
        options: [
          {
            icon: '🌱',
            label: 'Plants stay',
            caption: 'Plants stay. The rabbit stays.',
            result: [at('🌱', 32, 66, 18), at('😋', 64, 58, 22), ground('green')],
          },
          {
            icon: '💨',
            label: 'Plants go',
            caption: 'Plants go. The rabbit goes.',
            result: [at('💨', 64, 48, 18, { fx: 'slide-right' }), ground('yellow')],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'See this. See what changes.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'day',
        base: [at('🌱', 24, 68, 16), at('🦊', 64, 58, 22), ground('green')],
        options: [
          {
            icon: '💨',
            label: 'The fox goes',
            caption: 'No rabbits. The fox goes.',
            result: [at('🌱', 24, 68, 16), at('💨', 78, 46, 16, { fx: 'slide-right' }), ground('green')],
          },
          { icon: '🦊', label: 'The fox stays', caption: 'The fox stays.' },
          { icon: '🌳', label: 'It grows big', caption: 'It grows big.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'No food. The eater goes.',
      visual: {
        kind: 'evidence-text',
        title: 'Link',
        sentences: [
          'The food goes, and the eater goes too.',
          'Grass can stay, but if the rabbits go, the fox goes.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-link', [
      {
        bg: 'day',
        base: [at('🐇', 60, 62, 22), ground('yellow')],
        cards: [
          { icon: '💨', label: 'The rabbit goes' },
          { icon: '🐇', label: 'The rabbit stays' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌱', 30, 68, 16), at('🐇', 64, 60, 20), ground('green')],
        cards: [
          { icon: '😋', label: 'The rabbit stays' },
          { icon: '💨', label: 'The rabbit goes' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌱', 26, 68, 16), at('🦊', 66, 56, 22), ground('green')],
        cards: [
          { icon: '💨', label: 'The fox goes' },
          { icon: '🦊', label: 'The fox stays' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌱', 22, 70, 14), at('🐇', 46, 64, 16), at('🦊', 74, 54, 20), ground('green')],
        cards: [
          { icon: '😋', label: 'The fox stays' },
          { icon: '💨', label: 'The fox goes' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'day',
        base: [at('🐝', 62, 48, 20), ground('green')],
        cards: [
          { icon: '💨', label: 'The bee goes' },
          { icon: '🐝', label: 'The bee stays' },
          { icon: '❄️', label: 'It freezes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🌸', 30, 62, 18), at('🐝', 66, 46, 18), ground('green')],
        cards: [
          { icon: '😋', label: 'The bee stays' },
          { icon: '💨', label: 'The bee goes' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
      {
        bg: 'water',
        base: [at('🐟', 62, 48, 20), at('🌊', 50, 78, 24)],
        cards: [
          { icon: '💨', label: 'The big fish goes' },
          { icon: '🐟', label: 'The big fish stays' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'water',
        base: [at('🦐', 32, 62, 14), at('🐟', 66, 46, 20), at('🌊', 50, 80, 20)],
        cards: [
          { icon: '😋', label: 'The big fish stays' },
          { icon: '💨', label: 'The big fish goes' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
    ]),
  ],
};
