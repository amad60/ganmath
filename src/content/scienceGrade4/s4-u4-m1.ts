import type { ContentModule } from '../types';
import { at, whatHappensNext } from '../scienceScene';

export const lightBounces: ContentModule = {
  id: 's4-u4-m1',
  unitId: 's4-u4',
  grade: 4,
  title: 'Light Bounces',
  icon: '🪞',
  prereq: ['s4-u3-m1'],
  skills: ['sci-mirror'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['light', 'mirror', 'cloth', 'bounce', 'face'],

  learn: [
    // Cahaya yang sama. Yang berubah: cermin memantulkan, kain gelap menahannya.
    {
      stage: 'concrete',
      prompt: 'Light on a mirror, or cloth.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('💡', 18, 40, 16), at('🧒', 78, 58, 22)],
        options: [
          {
            icon: '🪞',
            label: 'Mirror',
            caption: 'Light bounces. You see a face.',
            result: [at('💡', 18, 36, 14), at('🪞', 50, 50, 22), at('😀', 78, 48, 20, { fx: 'pop' })],
          },
          {
            icon: '⬛',
            label: 'Cloth',
            caption: 'The cloth stops the light.',
            result: [at('💡', 18, 40, 14), at('⬛', 50, 52, 24), at('🌑', 76, 48, 16, { fx: 'fade' })],
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
        base: [at('☀️', 16, 28, 16), at('🪞', 48, 52, 20), at('🧱', 82, 52, 18)],
        options: [
          {
            icon: '💡',
            label: 'The light bounces',
            caption: 'The light bounces.',
            result: [at('☀️', 16, 28, 14), at('🪞', 48, 52, 20), at('💡', 82, 36, 16, { fx: 'pop' })],
          },
          { icon: '🌑', label: 'The light stops', caption: 'The light stops.' },
          { icon: '🌳', label: 'It grows big', caption: 'It grows big.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A mirror bounces light.',
      visual: {
        kind: 'evidence-text',
        title: 'Mirror',
        sentences: [
          'A mirror bounces light, so you see a face.',
          'A dark cloth stops the light. No face.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-mirror', [
      {
        bg: 'room',
        base: [at('🧒', 22, 58, 22), at('🪞', 62, 50, 22)],
        cards: [
          { icon: '😀', label: 'You see a face' },
          { icon: '🌑', label: 'It stays dark' },
          { icon: '🌈', label: 'A rainbow comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('💡', 18, 40, 16), at('⬛', 55, 52, 24)],
        cards: [
          { icon: '🌑', label: 'The light stops' },
          { icon: '😀', label: 'You see a face' },
          { icon: '🔥', label: 'It burns' },
        ],
      },
      {
        bg: 'room',
        base: [at('🔦', 16, 48, 16), at('🪞', 50, 50, 18), at('🧱', 84, 50, 16)],
        cards: [
          { icon: '💡', label: 'Light hits the wall' },
          { icon: '🌑', label: 'The light stops' },
          { icon: '🐟', label: 'It swims away' },
        ],
      },
      {
        bg: 'room',
        base: [at('🔦', 18, 48, 16), at('🪵', 58, 52, 22)],
        cards: [
          { icon: '🌑', label: 'The light stops' },
          { icon: '💡', label: 'The light bounces' },
          { icon: '❄️', label: 'It freezes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🪞', 28, 48, 18), at('🌱', 74, 62, 20)],
        cards: [
          { icon: '🌿', label: 'The plant gets light' },
          { icon: '🌑', label: 'It stays dark' },
          { icon: '🍎', label: 'It makes fruit' },
        ],
      },
      {
        bg: 'room',
        base: [at('🌱', 70, 60, 22), at('🧱', 30, 52, 20)],
        cards: [
          { icon: '🌑', label: 'The plant stays dark' },
          { icon: '🌿', label: 'The plant gets light' },
          { icon: '🔔', label: 'It rings' },
        ],
      },
      {
        bg: 'room',
        base: [at('🧒', 24, 50, 20), at('🪞', 68, 50, 24)],
        cards: [
          { icon: '😀', label: 'You see a face' },
          { icon: '🧱', label: 'You see a wall' },
          { icon: '🚢', label: 'A boat comes' },
        ],
      },
      {
        bg: 'room',
        base: [at('🧒', 24, 50, 20), at('🧱', 68, 50, 24)],
        cards: [
          { icon: '🌑', label: 'No face' },
          { icon: '😀', label: 'You see a face' },
          { icon: '🌸', label: 'A flower comes' },
        ],
      },
    ]),
  ],
};
