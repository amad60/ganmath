import type { ContentModule } from '../types';
import { at, whatHappensNext } from '../scienceScene';

export const highOrLow: ContentModule = {
  id: 's5-u8-m1',
  unitId: 's5-u8',
  grade: 5,
  title: 'High or Low',
  icon: '🎸',
  prereq: ['s5-u7-m1'],
  skills: ['sci-pitch'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['tight', 'loose', 'string', 'high', 'low', 'sound'],

  learn: [
    // Talinya sama. Yang berubah ketegangannya: kencang bunyinya tinggi, kendor rendah.
    {
      stage: 'concrete',
      prompt: 'A tight string, or loose.',
      visual: {
        kind: 'science-scene',
        mode: 'change',
        bg: 'room',
        base: [at('🎸', 50, 55, 30)],
        options: [
          {
            icon: '💪',
            label: 'Tight',
            caption: 'Tight. The sound is high.',
            result: [at('🎸', 50, 52, 28), at('⬆️', 78, 28, 14, { fx: 'rise' })],
          },
          {
            icon: '〰️',
            label: 'Loose',
            caption: 'Loose. The sound is low.',
            result: [at('🎸', 50, 58, 26), at('⬇️', 78, 70, 14, { fx: 'fall' })],
          },
        ],
      },
      action: 'explore',
      target: 2,
    },
    {
      stage: 'pictorial',
      prompt: 'A tight string, or a loose one.',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'room',
        base: [at('〰️', 50, 55, 28)],
        options: [
          {
            icon: '⬇️',
            label: 'The sound is low',
            caption: 'The sound is low.',
            result: [at('〰️', 50, 55, 26), at('⬇️', 78, 68, 14, { fx: 'fall' })],
          },
          { icon: '⬆️', label: 'The sound is high', caption: 'The sound is high.' },
          { icon: '🔇', label: 'No sound', caption: 'No sound.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'A tight string. A high sound.',
      visual: {
        kind: 'evidence-text',
        title: 'Sound',
        sentences: [
          'A tight string makes a high sound.',
          'A loose string makes a low sound.',
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-pitch', [
      {
        // Yang tergambar bunyinya. Yang ditanya tali kencang atau kendor.
        ask: 'This sound is high. What made it high?',
        bg: 'room',
        base: [at('⬆️', 50, 42, 28)],
        cards: [
          { icon: '💪', label: 'A tight string' },
          { icon: '〰️', label: 'A loose string' },
          { icon: '🟰', label: 'Tight and loose match' },
        ],
      },
      {
        ask: 'This sound is low. Why is it low?',
        bg: 'room',
        base: [at('⬇️', 50, 58, 28)],
        cards: [
          { icon: '〰️', label: 'A loose string' },
          { icon: '💪', label: 'A tight string' },
          { icon: '⬆️', label: 'Loose string sounds high' },
        ],
      },
      {
        ask: 'The drum sound is high. What caused it?',
        bg: 'room',
        base: [at('🥁', 46, 55, 26), at('⬆️', 78, 32, 16)],
        cards: [
          { icon: '💪', label: 'The skin is tight' },
          { icon: '〰️', label: 'The skin is loose' },
          { icon: '🔇', label: 'Tight skin is silent' },
        ],
      },
      {
        ask: 'The jar band is low. What keeps it low?',
        bg: 'room',
        base: [at('🫙', 40, 58, 20), at('⬇️', 70, 48, 16)],
        cards: [
          { icon: '〰️', label: 'The band is loose' },
          { icon: '💪', label: 'The band is tight' },
          { icon: '⬆️', label: 'Loose band sounds high' },
        ],
      },
      {
        ask: 'What did tightening do to the sound?',
        bg: 'room',
        base: [at('🎸', 46, 55, 24), at('⬆️', 76, 32, 16)],
        cards: [
          { icon: '🎵', label: 'Made a high sound' },
          { icon: '⬇️', label: 'Made a low sound' },
          { icon: '🔇', label: 'It made no sound' },
        ],
      },
      {
        ask: 'Why does a loose string sound low?',
        bg: 'room',
        base: [at('〰️', 50, 52, 26)],
        cards: [
          { icon: '🎵', label: 'Loose makes it low' },
          { icon: '⬆️', label: 'Loose makes it high' },
          { icon: '💪', label: 'String is really tight' },
        ],
      },
      {
        ask: 'What helps a string sound high?',
        bg: 'plain',
        base: [at('🎸', 50, 55, 28)],
        cards: [
          { icon: '💪', label: 'Pulling it tight' },
          { icon: '〰️', label: 'Letting it hang loose' },
          { icon: '🟰', label: 'Tight and loose match' },
        ],
      },
      {
        ask: 'The sounds are not the same. What keeps them apart?',
        bg: 'room',
        base: [at('🎸', 36, 55, 22), at('〰️', 68, 50, 18), at('⬆️', 28, 28, 12), at('⬇️', 78, 72, 12)],
        cards: [
          { icon: '🎵', label: 'One tight, one loose' },
          { icon: '🟰', label: 'Both strings are tight' },
          { icon: '🔇', label: 'They sound the same' },
        ],
      },
    ]),
  ],
};
