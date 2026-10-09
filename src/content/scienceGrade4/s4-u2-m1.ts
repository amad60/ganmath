import type { ContentModule } from '../types';
import { at, whatHappensNext } from '../scienceScene';

export const bonesAndMuscles: ContentModule = {
  id: 's4-u2-m1',
  unitId: 's4-u2',
  grade: 4,
  title: 'Bones and Muscles',
  icon: '💪',
  prereq: ['s4-u1-m1'],
  skills: ['sci-muscle'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['muscle', 'pull', 'other', 'arm', 'bend', 'straight', 'bone', 'stay', 'finger'],

  learn: [
    // Otot hanya menarik. Otot yang satu membengkokkan lengan, otot yang lain meluruskannya.
    {
      stage: 'concrete',
      prompt: 'Pull one muscle, or the other.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('🦴', 50, 58, 28)],
        options: [
          {
            icon: '💪',
            label: 'Bend',
            caption: 'This muscle pulls. The arm bends.',
            result: [at('💪', 50, 48, 36, { fx: 'pop' }), at('🦴', 42, 62, 16)],
          },
          {
            icon: '🖐️',
            label: 'Straight',
            caption: 'That muscle pulls. The arm is straight.',
            result: [at('🖐️', 50, 52, 36, { fx: 'slide-right' })],
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
        base: [at('☝️', 50, 55, 32), at('💪', 68, 40, 16)],
        options: [
          {
            icon: '✊',
            label: 'The finger bends',
            caption: 'The finger bends.',
            result: [at('✊', 50, 52, 34, { fx: 'pop' })],
          },
          { icon: '🖐️', label: 'It stays straight', caption: 'It stays straight.' },
          { icon: '✈️', label: 'It goes away', caption: 'It goes away.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A muscle pulls a bone.',
      visual: {
        kind: 'evidence-text',
        title: 'Pull',
        sentences: [
          'A muscle pulls a bone. It does not push the bone.',
          'One muscle bends the arm. The other makes it straight.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-muscle', [
      {
        bg: 'room',
        base: [at('💪', 62, 42, 18), at('🦴', 48, 58, 26)],
        cards: [
          { icon: '✊', label: 'The arm bends' },
          { icon: '🖐️', label: 'It stays straight' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('✊', 50, 50, 28), at('💪', 28, 42, 16)],
        cards: [
          { icon: '🖐️', label: 'The arm is straight' },
          { icon: '✊', label: 'The arm bends' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'room',
        base: [at('🧒', 50, 55, 28)],
        cards: [
          { icon: '🖐️', label: 'It stays straight' },
          { icon: '💪', label: 'The arm bends' },
          { icon: '✈️', label: 'It goes away' },
        ],
      },
      {
        bg: 'room',
        base: [at('🧍', 50, 55, 30), at('💪', 72, 40, 16)],
        cards: [
          { icon: '✊', label: 'The leg bends' },
          { icon: '🧍', label: 'It stays straight' },
          { icon: '🧊', label: 'It freezes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🦵', 46, 58, 28), at('💪', 24, 46, 16)],
        cards: [
          { icon: '🧍', label: 'The leg is straight' },
          { icon: '🦵', label: 'The leg bends' },
          { icon: '🐟', label: 'It swims away' },
        ],
      },
      {
        bg: 'plain',
        base: [at('☝️', 50, 52, 28), at('💪', 74, 38, 16)],
        cards: [
          { icon: '✊', label: 'The finger bends' },
          { icon: '🖐️', label: 'It stays straight' },
          { icon: '🌻', label: 'A flower comes' },
        ],
      },
      {
        bg: 'plain',
        base: [at('✊', 50, 52, 26), at('💪', 26, 40, 16)],
        cards: [
          { icon: '🖐️', label: 'The finger is straight' },
          { icon: '✊', label: 'The finger bends' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'room',
        base: [at('🧒', 42, 58, 24), at('🧒', 68, 42, 18)],
        cards: [
          { icon: '🖐️', label: 'It stays straight' },
          { icon: '💪', label: 'It bends' },
          { icon: '❄️', label: 'It freezes' },
        ],
      },
    ]),
  ],
};
