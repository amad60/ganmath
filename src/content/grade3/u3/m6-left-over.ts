import type { ContentModule } from '../../types';

export const leftOver: ContentModule = {
  id: 'g3-u3-m6',
  unitId: 'g3-u3',
  grade: 3,
  title: 'Left Over',
  icon: '🍬',
  prereq: ['g3-u3-m5'],
  skills: ['remainder'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['counter-objects'],
  vocab: ['remainder'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap thirteen dots.',
      visual: { kind: 'counter-objects', count: 13, icon: '🍬' },
      action: 'tap-count',
      target: 13,
      hint: 'Count them all.',
    },
    {
      stage: 'pictorial',
      prompt: 'Share 13 between 4. One is left over.',
      visual: { kind: 'array', rows: 4, cols: 3 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'The one left over is the remainder.',
      visual: { kind: 'counter-objects', count: 1, icon: '🍬' },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'remainder',
      params: { d: [2, 5], q: [2, 6], r: [1, 4] },
      answer: (p) => p.r as number,
      text: (p) =>
        `Share ${(p.d as number) * (p.q as number) + (p.r as number)} between ${p.d}. How many left over?`,
      exclude: (p) => (p.r as number) >= (p.d as number),
      distractors: 'near',
      misconception: (p) => p.q as number, // menyebut isi tiap kelompok, bukan sisanya
    },
    {
      type: 'keypad',
      skill: 'remainder',
      params: { d: [2, 5], q: [2, 6], r: [1, 4] },
      answer: (p) => p.q as number,
      text: (p) =>
        `Share ${(p.d as number) * (p.q as number) + (p.r as number)} between ${p.d}. How many each?`,
      exclude: (p) => (p.r as number) >= (p.d as number),
    },
    {
      type: 'keypad',
      skill: 'remainder',
      story: true,
      params: { d: [2, 5], q: [2, 6], r: [1, 4] },
      answer: (p) => p.q as number,
      text: (p) => `${(p.d as number) * (p.q as number) + (p.r as number)} cookies in bags of ${p.d}. How many full bags?`,
      exclude: (p) => (p.r as number) >= (p.d as number),
    },
    {
      type: 'keypad',
      skill: 'remainder',
      story: true,
      params: { d: [2, 5], q: [2, 6], r: [1, 4] },
      answer: (p) => p.q as number,
      text: (p) => `Ana puts ${(p.d as number) * (p.q as number) + (p.r as number)} eggs in boxes of ${p.d}. How many boxes are full?`,
      exclude: (p) => (p.r as number) >= (p.d as number),
    },
  ],
};
