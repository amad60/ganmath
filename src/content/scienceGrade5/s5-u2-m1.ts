import type { ContentModule } from '../types';
import { at, whatHappensNext } from '../scienceScene';

export const itComesBack: ContentModule = {
  id: 's5-u2-m1',
  unitId: 's5-u2',
  grade: 5,
  title: 'It Comes Back',
  icon: '🧊',
  prereq: ['s5-u1-m1'],
  skills: ['sci-melt'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['ice', 'warm', 'cold', 'melt', 'water', 'paper', 'burn', 'back'],

  learn: [
    // Es meleleh lalu bisa jadi es lagi. Kertas yang terbakar tidak kembali.
    {
      stage: 'concrete',
      prompt: 'Warm the ice, or cold.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('🧊', 50, 52, 28)],
        options: [
          {
            icon: '☀️',
            label: 'Warm',
            caption: 'The ice melts to water.',
            result: [at('☀️', 80, 18, 14), at('💧', 50, 58, 22, { fx: 'pop' })],
          },
          {
            icon: '❄️',
            label: 'Cold',
            caption: 'It is ice again.',
            result: [at('❄️', 80, 18, 14), at('🧊', 50, 52, 30, { fx: 'pop' })],
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
        bg: 'room',
        base: [at('📄', 42, 55, 24), at('🔥', 68, 48, 18)],
        options: [
          {
            icon: '🖤',
            label: 'No paper comes back',
            caption: 'It burns. No paper comes back.',
            result: [at('🖤', 50, 55, 24, { fx: 'fade' })],
          },
          { icon: '📄', label: 'The paper comes back', caption: 'The paper comes back.' },
          { icon: '🌈', label: 'It grows big', caption: 'It grows big.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Ice melts. It comes back.',
      visual: {
        kind: 'evidence-text',
        title: 'Back',
        sentences: [
          'Ice melts to water. Cold makes the ice come back.',
          'Burned paper does not come back.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-melt', [
      {
        bg: 'day',
        base: [at('🧊', 50, 52, 26), at('☀️', 80, 18, 16)],
        cards: [
          { icon: '💧', label: 'The ice melts' },
          { icon: '🧊', label: 'It stays ice' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'room',
        base: [at('💧', 50, 55, 20), at('❄️', 80, 18, 16)],
        cards: [
          { icon: '🧊', label: 'It is ice again' },
          { icon: '💧', label: 'It stays water' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🍫', 50, 52, 24), at('☀️', 80, 18, 14)],
        cards: [
          { icon: '🟤', label: 'It melts' },
          { icon: '🍫', label: 'It stays' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🟤', 50, 58, 22), at('❄️', 80, 18, 14)],
        cards: [
          { icon: '🍫', label: 'It comes back' },
          { icon: '🟤', label: 'It stays melted' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'room',
        base: [at('📄', 40, 55, 22), at('🔥', 70, 48, 18)],
        cards: [
          { icon: '🖤', label: 'The paper burns' },
          { icon: '📄', label: 'The paper stays' },
          { icon: '🐟', label: 'It swims' },
        ],
      },
      {
        bg: 'room',
        base: [at('🖤', 50, 55, 24), at('❄️', 80, 18, 14)],
        cards: [
          { icon: '🚫', label: 'It does not come back' },
          { icon: '📄', label: 'The paper comes back' },
          { icon: '🌸', label: 'A flower comes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🥛', 50, 55, 26), at('☀️', 80, 18, 14)],
        cards: [
          { icon: '💧', label: 'It stays water' },
          { icon: '🧊', label: 'It turns to ice' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
      {
        bg: 'room',
        base: [at('🚪', 62, 48, 24), at('❄️', 28, 20, 14), at('🥛', 40, 58, 18)],
        cards: [
          { icon: '🧊', label: 'The water turns to ice' },
          { icon: '🔥', label: 'It burns' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
    ]),
  ],
};
