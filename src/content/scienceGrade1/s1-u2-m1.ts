import type { ContentModule } from '../types';
import { at, ground, whatHappensNext } from '../scienceScene';

export const bodyAndSenses: ContentModule = {
  id: 's1-u2-m1',
  unitId: 's1-u2',
  grade: 1,
  title: 'Body and Senses',
  icon: '👂',
  prereq: ['s1-u1-m1'],
  skills: ['sci-senses'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['pick-picture'],
  visuals: ['evidence-text', 'science-scene'],
  vocab: ['eye', 'ear', 'hear', 'nose', 'smell', 'skin', 'feel', 'hot', 'cold', 'look', 'part', 'body', 'bell', 'ring', 'bright', 'lamp', 'drum', 'taste', 'tongue'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap each part of the body.',
      visual: {
        kind: 'science-scene',
        mode: 'tap-part',
        bg: 'room',
        base: [
          at('🧒', 50, 46, 30),
          at('👀', 18, 18, 14, { part: 0 }),
          at('👂', 82, 18, 14, { part: 1 }),
          at('👃', 18, 56, 14, { part: 2 }),
          at('✋', 50, 86, 14, { part: 3 }),
          at('👅', 82, 56, 14, { part: 4 }),
        ],
        options: [
          { icon: '👀', label: 'Eyes', caption: 'Eyes see the bright lamp.' },
          { icon: '👂', label: 'Ears', caption: 'Ears hear the drum.' },
          { icon: '👃', label: 'Nose', caption: 'The nose smells food.' },
          { icon: '✋', label: 'Skin', caption: 'Skin feels hot or cold.' },
          { icon: '👅', label: 'Tongue', caption: 'The tongue tastes food.' },
        ],
      },
      action: 'explore',
      target: 5,
    },
    {
      stage: 'pictorial',
      prompt: 'A bell rings. Which part knows?',
      visual: {
        kind: 'science-scene',
        mode: 'predict',
        bg: 'room',
        base: [at('🔔', 28, 36, 22), at('🧒', 70, 58, 30)],
        options: [
          {
            icon: '👂',
            label: 'Ears',
            caption: 'Ears hear the bell.',
            result: [
              at('🔔', 28, 36, 22, { fx: 'shake' }),
              at('🎵', 48, 22, 12, { fx: 'pop' }),
              at('🧒', 70, 58, 30),
              at('👂', 88, 30, 14, { fx: 'pulse' }),
            ],
          },
          { icon: '👅', label: 'Tongue', caption: 'The tongue tastes.' },
          { icon: '👃', label: 'Nose', caption: 'The nose smells.' },
        ],
        correct: 0,
      },
      action: 'explore',
      target: 1,
    },
    {
      stage: 'abstract',
      prompt: 'Skin feels hot or cold.',
      visual: {
        kind: 'evidence-text',
        title: 'Five ways',
        sentences: ['Eyes see, ears hear, the nose smells, the tongue tastes, and skin feels.'],
      },
      action: 'watch',
    },
  ],

  rules: [
    whatHappensNext('sci-senses', [
      {
        ask: 'A bell is ringing. Which part hears it?',
        bg: 'room',
        base: [at('🔔', 50, 50, 30), at('🎵', 76, 28, 12)],
        cards: [
          { icon: '👂', label: 'Ears' },
          { icon: '🦷', label: 'Teeth' },
          { icon: '👃', label: 'Nose' },
        ],
      },
      {
        ask: 'The lamp is bright. Which part sees it?',
        bg: 'room',
        base: [at('💡', 50, 48, 32)],
        cards: [
          { icon: '👀', label: 'Eyes' },
          { icon: '👂', label: 'Ears' },
          { icon: '👄', label: 'Mouth' },
        ],
      },
      {
        ask: 'This flower smells sweet. Which part knows?',
        bg: 'day',
        base: [at('🌸', 46, 56, 30), at('💨', 74, 40, 14)],
        cards: [
          { icon: '👃', label: 'Nose' },
          { icon: '👅', label: 'Tongue' },
          { icon: '👀', label: 'Eyes' },
        ],
      },
      {
        ask: 'The ice is cold. Which part feels it?',
        bg: 'room',
        base: [at('🧊', 50, 54, 30)],
        cards: [
          { icon: '✋', label: 'Skin' },
          { icon: '💇', label: 'Hair' },
          { icon: '👂', label: 'Ears' },
        ],
      },
      {
        ask: 'The lemon is sour. Which part tastes it?',
        bg: 'room',
        base: [at('🍋', 50, 54, 30)],
        cards: [
          { icon: '👅', label: 'Tongue' },
          { icon: '👃', label: 'Nose' },
          { icon: '🦷', label: 'Teeth' },
        ],
      },
      {
        ask: 'What helps you hear the drum?',
        bg: 'room',
        base: [at('🥁', 50, 54, 32), at('🎵', 78, 30, 12)],
        cards: [
          { icon: '👂', label: 'Ears' },
          { icon: '👀', label: 'Eyes' },
          { icon: '🦶', label: 'Foot' },
        ],
      },
      {
        ask: 'The cup is hot. Which part feels that?',
        bg: 'room',
        base: [at('☕', 50, 56, 28), at('♨️', 74, 32, 14)],
        cards: [
          { icon: '✋', label: 'Skin' },
          { icon: '👅', label: 'Tongue' },
          { icon: '👄', label: 'Mouth' },
        ],
      },
      {
        ask: 'Which part sees the goat?',
        bg: 'day',
        base: [at('🐐', 50, 58, 32), ground()],
        cards: [
          { icon: '👀', label: 'Eyes' },
          { icon: '🦶', label: 'Foot' },
          { icon: '💋', label: 'Lips' },
        ],
      },
    ]),
  ],
};
