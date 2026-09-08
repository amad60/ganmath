import type { ContentModule } from '../../types';

export const missingSide: ContentModule = {
  id: 'g3-u6-m4',
  unitId: 'g3-u6',
  grade: 3,
  title: 'Missing Side',
  icon: '❓',
  prereq: ['g3-u6-m3'],
  skills: ['perimeter-inverse'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['missing-number', 'keypad'],
  visuals: ['rectangle'],
  vocab: ['still'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three sides.',
      visual: { kind: 'counter-objects', count: 4, icon: '📏' },
      action: 'tap-count',
      target: 3,
      hint: 'One side is still hiding.',
    },
    {
      stage: 'pictorial',
      prompt: 'Perimeter 14. One side is 5.',
      visual: { kind: 'rect', w: 5, h: 2 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '14 - 5 - 5 = 4, so each short side is 2.',
      visual: { kind: 'rect', w: 5, h: 2 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'missing-number',
      skill: 'perimeter-inverse',
      params: { w: [2, 9], h: [1, 8] },
      answer: (p) => p.h as number,
      text: (p) => `Perimeter ${2 * ((p.w as number) + (p.h as number))}. Long side ${p.w}. Short side?`,
      visual: (p) => ({ kind: 'rect', w: p.w as number, h: p.h as number }),
      exclude: (p) => (p.h as number) >= (p.w as number),
      distractors: 'near',
      misconception: (p) => 2 * (p.h as number), // lupa membagi dua sisi
    },
    {
      type: 'keypad',
      skill: 'perimeter-inverse',
      params: { w: [2, 9], h: [1, 8] },
      answer: (p) => p.w as number,
      text: (p) => `Perimeter ${2 * ((p.w as number) + (p.h as number))}. Short side ${p.h}. Long side?`,
      exclude: (p) => (p.h as number) >= (p.w as number),
    },
  ],
};
