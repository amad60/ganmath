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
      prompt: 'Warm the ice, or the paper.',
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
          { icon: '💧', label: 'The paper melts', caption: 'The paper melts.' },
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
        // Buktinya air. Yang ditanya sebab lelehnya, bukan langkah berikutnya.
        ask: 'The ice became water. What made it melt?',
        bg: 'day',
        base: [at('💧', 50, 58, 28)],
        cards: [
          { icon: '☀️', label: 'The warm melted it' },
          { icon: '❄️', label: 'The cold melted it' },
          { icon: '🔥', label: 'Burning melted it' },
        ],
      },
      {
        ask: 'The ice is back. What made it come back?',
        bg: 'room',
        base: [at('🧊', 50, 52, 28)],
        cards: [
          { icon: '❄️', label: 'The cold brought it back' },
          { icon: '☀️', label: 'The warm brought it back' },
          { icon: '🔥', label: 'Fire brought the ice back' },
        ],
      },
      {
        ask: 'The paper is ash. Why does it not come back?',
        bg: 'room',
        base: [at('🖤', 50, 55, 28)],
        cards: [
          { icon: '🚫', label: 'Burning does not come back' },
          { icon: '❄️', label: 'Cold brings the paper back' },
          { icon: '💧', label: 'It only melted' },
        ],
      },
      {
        // Cokelat meleleh bisa kembali. Bukan abu.
        ask: 'The chocolate melted. What caused it?',
        bg: 'day',
        base: [at('🟤', 50, 58, 26)],
        cards: [
          { icon: '☀️', label: 'The warm caused it' },
          { icon: '❄️', label: 'The cold caused it' },
          { icon: '🚫', label: 'Melting means it is gone' },
        ],
      },
      {
        ask: 'What keeps melted chocolate able to return?',
        bg: 'room',
        base: [at('🟤', 50, 58, 26)],
        cards: [
          { icon: '♻️', label: 'It melted, so cold can help' },
          { icon: '🔥', label: 'Burning would still return' },
          { icon: '🚫', label: 'Melted things are gone' },
        ],
      },
      {
        // Daun yang terbakar tidak kembali, sama seperti kertas.
        ask: 'The leaf is ash. Why is it missing?',
        bg: 'day',
        base: [at('🪴', 50, 58, 26), at('🖤', 50, 42, 16)],
        cards: [
          { icon: '🔥', label: 'A burned leaf stays gone' },
          { icon: '❄️', label: 'Cold will bring it back' },
          { icon: '💧', label: 'The leaf only melted' },
        ],
      },
      {
        ask: 'The butter went soft. What did the warm do?',
        bg: 'day',
        base: [at('🧈', 50, 58, 26)],
        cards: [
          { icon: '💧', label: 'It melted the butter' },
          { icon: '🔥', label: 'It burned the butter for good' },
          { icon: '❄️', label: 'It froze the butter' },
        ],
      },
      {
        ask: 'This water is not ice. What does it need?',
        bg: 'room',
        base: [at('💧', 50, 55, 26)],
        cards: [
          { icon: '❄️', label: 'It needs the cold' },
          { icon: '☀️', label: 'It needs the warm' },
          { icon: '🔥', label: 'Fire turns water to ice' },
        ],
      },
    ]),
  ],
};
