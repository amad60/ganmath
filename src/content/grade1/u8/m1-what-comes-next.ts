import type { ContentModule } from '../../types';

const COLORS = ['🔴', '🔵', '🟡', '🟢'];

export const whatComesNext: ContentModule = {
  id: 'g1-u8-m1',
  unitId: 'g1-u8',
  grade: 1,
  title: 'What Comes Next?',
  icon: '🔁',
  prereq: ['g1-u6-m1'],
  skills: ['pattern-ab'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['shape-2d', 'counter-objects'],
  vocab: ['pattern', 'repeat', 'repeats', 'times'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four in a row.',
      visual: { kind: 'counter-objects', count: 6, icon: '🔴' },
      action: 'tap-count',
      target: 4,
      hint: 'A pattern repeats.',
    },
    {
      stage: 'pictorial',
      prompt: 'This pattern repeats again and again.',
      visual: { kind: 'shape2d', name: 'circle' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Say what comes next.',
      visual: { kind: 'shape2d', name: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'pattern-ab',
      params: { a: [0, 3], b: [0, 3] },
      // Pola AB AB → yang berikutnya selalu A.
      answer: (p) => p.a as number,
      text: (p) =>
        `${COLORS[p.a as number]}${COLORS[p.b as number]}${COLORS[p.a as number]}${COLORS[p.b as number]} ?`,
      exclude: (p) => p.a === p.b,
      options: () => COLORS,
    },
    {
      type: 'choose-number',
      skill: 'pattern-ab',
      params: { n: [2, 5] },
      answer: (p) => (p.n as number) * 2,
      text: (p) => `A pattern of 2 repeats ${p.n} times. How many?`,
      distractors: 'near',
    },
  ],
};
