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
  vocab: ['muscle', 'pull', 'other', 'arm', 'bend', 'straight', 'bone', 'stay', 'finger', 'front', 'back'],

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
            caption: 'The front muscle pulls. The arm bends.',
            result: [at('💪', 50, 48, 36, { fx: 'pop' }), at('🦴', 42, 62, 16)],
          },
          {
            icon: '🖐️',
            label: 'Straight',
            caption: 'The back muscle pulls. The arm is straight.',
            result: [at('🖐️', 50, 52, 36, { fx: 'slide-right' })],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'The front muscle pulls the finger.',
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
        ask: 'Which part bent this arm?',
        base: [at('✊', 50, 52, 32)],
        cards: [
          { icon: '💪', label: 'The front muscle pulled' },
          { icon: '🦴', label: 'The bone pushed the arm' },
          { icon: '🖐️', label: 'The back muscle pushed' },
        ],
      },
      {
        bg: 'room',
        ask: 'What made this arm straight?',
        base: [at('🖐️', 50, 52, 32)],
        cards: [
          { icon: '💪', label: 'The back muscle pulled' },
          { icon: '✊', label: 'The front muscle pushed' },
          { icon: '🦴', label: 'The bone pushed it' },
        ],
      },
      {
        bg: 'room',
        ask: 'What keeps this arm straight?',
        base: [at('🧒', 50, 55, 30)],
        cards: [
          { icon: '💪', label: 'The back muscle pulled' },
          { icon: '✊', label: 'A muscle pushed it straight' },
          { icon: '🦴', label: 'The bone pushed it straight' },
        ],
      },
      {
        bg: 'room',
        ask: 'Which part bent this leg?',
        base: [at('🦵', 50, 55, 32)],
        cards: [
          { icon: '💪', label: 'The front muscle pulled' },
          { icon: '🦴', label: 'The bone pushed the leg' },
          { icon: '🦶', label: 'The foot pushed up' },
        ],
      },
      {
        bg: 'room',
        ask: 'What made this leg straight?',
        base: [at('🧍', 50, 52, 32)],
        cards: [
          { icon: '💪', label: 'The back muscle pulled' },
          { icon: '🦵', label: 'A muscle pushed the leg' },
          { icon: '🦴', label: 'The leg bone did the push' },
        ],
      },
      {
        bg: 'plain',
        ask: 'What did the front muscle do?',
        base: [at('🤌', 50, 52, 32)],
        cards: [
          { icon: '💪', label: 'It pulled the finger' },
          { icon: '🦴', label: 'It pushed the bone' },
          { icon: '🖐️', label: 'It pushed the finger' },
        ],
      },
      {
        bg: 'plain',
        ask: 'What keeps this finger straight?',
        base: [at('☝️', 50, 52, 32)],
        cards: [
          { icon: '💪', label: 'The back muscle pulled' },
          { icon: '✊', label: 'The front muscle pushed' },
          { icon: '🦴', label: 'The bone pushed it' },
        ],
      },
      {
        bg: 'room',
        ask: 'Why did this toe bend?',
        base: [at('🦶', 50, 55, 32)],
        cards: [
          { icon: '💪', label: 'The front muscle pulled' },
          { icon: '🦴', label: 'The toe bone pushed' },
          { icon: '🖐️', label: 'The back muscle pushed' },
        ],
      },
    ]),
  ],
};
