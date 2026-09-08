import type { ContentModule } from '../../types';

export const measureWithUnits: ContentModule = {
  id: 'g1-u7-m2',
  unitId: 'g1-u7',
  grade: 1,
  title: 'Measure with Units',
  icon: '🧮',
  prereq: ['g1-u7-m1'],
  skills: ['measure-nonstandard'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['counter-objects'],
  vocab: ['measure', 'unit', 'units', 'block', 'blocks'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap six blocks to measure.',
      visual: { kind: 'counter-objects', count: 8, icon: '🟦' },
      action: 'tap-count',
      target: 6,
      hint: 'Count every block.',
    },
    {
      stage: 'pictorial',
      prompt: 'This bar is six units long.',
      visual: { kind: 'bars', lengths: [0.6], labels: ['A'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We measure with the same unit.',
      visual: { kind: 'bars', lengths: [0.6, 0.3], labels: ['A', 'B'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'measure-nonstandard',
      params: { n: [2, 10] },
      answer: (p) => p.n as number,
      text: (p) => `How many blocks? ${'🟦'.repeat(p.n as number)}`,
      distractors: 'near',
      misconception: (p) => (p.n as number) + 1,
    },
    {
      type: 'keypad',
      skill: 'measure-nonstandard',
      params: { n: [3, 12] },
      answer: (p) => p.n as number,
      text: (p) => `How many units? ${'🟩'.repeat(p.n as number)}`,
    },
  ],
};
