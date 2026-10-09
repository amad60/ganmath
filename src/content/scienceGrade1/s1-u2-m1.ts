import type { ContentModule } from '../types';
import { at, whatHappensNext } from '../scienceScene';

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
    whatHappensNext(
      'sci-senses',
      [
        {
          bg: 'room',
          base: [at('🔔', 50, 50, 30), at('🎵', 78, 26, 12)],
          cards: [
            { icon: '👂', label: 'Ears' },
            { icon: '👅', label: 'Tongue' },
            { icon: '✋', label: 'Skin' },
          ],
        },
        {
          bg: 'day',
          base: [at('🌈', 50, 46, 40)],
          cards: [
            { icon: '👀', label: 'Eyes' },
            { icon: '👂', label: 'Ears' },
            { icon: '👅', label: 'Tongue' },
          ],
        },
        {
          bg: 'day',
          base: [at('🌸', 46, 56, 30), at('💨', 74, 40, 14)],
          cards: [
            { icon: '👃', label: 'Nose' },
            { icon: '👂', label: 'Ears' },
            { icon: '👅', label: 'Tongue' },
          ],
        },
        {
          bg: 'room',
          base: [at('🧊', 50, 54, 30)],
          cards: [
            { icon: '✋', label: 'Skin' },
            { icon: '👂', label: 'Ears' },
            { icon: '👃', label: 'Nose' },
          ],
        },
        {
          bg: 'room',
          base: [at('🍭', 50, 54, 30)],
          cards: [
            { icon: '👅', label: 'Tongue' },
            { icon: '👂', label: 'Ears' },
            { icon: '🦶', label: 'Foot' },
          ],
        },
      
      {
        bg: 'room',
        base: [at('🥁', 50, 52, 32)],
        cards: [
          { icon: '👂', label: 'Ears' },
          { icon: '👃', label: 'Nose' },
          { icon: '👀', label: 'Eyes' },
        ],
      },
      {
        bg: 'day',
        base: [at('🔥', 50, 54, 30)],
        cards: [
          { icon: '✋', label: 'Skin' },
          { icon: '👂', label: 'Ears' },
          { icon: '👅', label: 'Tongue' },
        ],
      },
      {
        bg: 'room',
        base: [at('🍞', 50, 54, 30)],
        cards: [
          { icon: '👃', label: 'Nose' },
          { icon: '👂', label: 'Ears' },
          { icon: '👀', label: 'Eyes' },
        ],
      },
    ],
      'Which part knows?',
    ),
  ],
};
