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
      prompt: 'Light on a mirror, or cloth.',
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
        ask: 'Why do you see a face?',
        base: [at('🧒', 26, 58, 22), at('😀', 72, 46, 22)],
        cards: [
          { icon: '🪞', label: 'A mirror bounced the light' },
          { icon: '⬛', label: 'A cloth made this face' },
          { icon: '🚫', label: 'Light went straight through' },
        ],
      },
      {
        bg: 'room',
        ask: 'Why is there no face?',
        base: [at('🧒', 22, 58, 20), at('⬛', 55, 52, 24), at('🌑', 82, 46, 16)],
        cards: [
          { icon: '🛑', label: 'The cloth stopped the light' },
          { icon: '🪞', label: 'The cloth bounced a face' },
          { icon: '😀', label: 'You should see a face' },
        ],
      },
      {
        bg: 'room',
        ask: 'What made light hit the wall?',
        base: [at('🧱', 62, 54, 24), at('💡', 78, 28, 16)],
        cards: [
          { icon: '🪞', label: 'A mirror bounced it' },
          { icon: '⬛', label: 'The cloth sent the light' },
          { icon: '🚫', label: 'Light cannot bounce' },
        ],
      },
      {
        bg: 'room',
        ask: 'What caused the dark spot?',
        base: [at('🔦', 16, 50, 16), at('🪵', 52, 52, 22), at('🌑', 84, 46, 14)],
        cards: [
          { icon: '🛑', label: 'The wood stopped the light' },
          { icon: '🪞', label: 'The wood bounced a face' },
          { icon: '😀', label: 'You should see a face' },
        ],
      },
      {
        bg: 'room',
        ask: 'What did the spoon do to light?',
        base: [at('🥄', 34, 52, 24), at('😀', 74, 46, 20)],
        cards: [
          { icon: '💡', label: 'It bounced the light' },
          { icon: '⬛', label: 'It stopped the light' },
          { icon: '🚫', label: 'Light went through it' },
        ],
      },
      {
        bg: 'room',
        ask: 'What keeps the far side dark?',
        base: [at('📖', 40, 52, 26), at('🌑', 78, 48, 16)],
        cards: [
          { icon: '🛑', label: 'The book stops the light' },
          { icon: '🪞', label: 'The book bounces a face' },
          { icon: '💡', label: 'Light goes through the book' },
        ],
      },
      {
        bg: 'day',
        ask: 'What helps you see this face?',
        base: [at('🌊', 50, 72, 28), at('😀', 50, 38, 22)],
        cards: [
          { icon: '💡', label: 'The puddle bounced light' },
          { icon: '⬛', label: 'The water stopped the light' },
          { icon: '🚫', label: 'Light went through the water' },
        ],
      },
      {
        bg: 'room',
        ask: 'What was missing for a face?',
        base: [at('🧒', 26, 56, 22), at('🧱', 70, 50, 24)],
        cards: [
          { icon: '🪞', label: 'A mirror to bounce light' },
          { icon: '⬛', label: 'Cloth is enough for a face' },
          { icon: '😀', label: 'A face needs no mirror' },
        ],
      },
    ]),
  ],
};
