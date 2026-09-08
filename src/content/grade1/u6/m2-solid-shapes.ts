import type { ContentModule } from '../../types';

const SOLIDS = [
  { name: 'ball', icon: '🔴' },
  { name: 'box', icon: '📦' },
  { name: 'cone', icon: '🍦' },
  { name: 'can', icon: '🥫' },
];

export const solidShapes: ContentModule = {
  id: 'g1-u6-m2',
  unitId: 'g1-u6',
  grade: 1,
  title: 'Solid Shapes',
  icon: '📦',
  prereq: ['g1-u6-m1'],
  skills: ['shape-3d'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['shape-3d', 'counter-objects'],
  vocab: ['solid', 'ball', 'cone', 'can', 'roll', 'rolls', 'stack', 'stacks', 'faces'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap the six faces of a box.',
      visual: { kind: 'counter-objects', count: 6, icon: '📦' },
      action: 'tap-count',
      target: 6,
      hint: 'A box has six flat faces.',
    },
    {
      stage: 'pictorial',
      prompt: 'A ball rolls. A box stacks.',
      visual: { kind: 'ten-frame', value: 6 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Solid shapes are not flat.',
      visual: { kind: 'ten-frame', value: 6 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'shape-3d',
      params: { i: [0, 3] },
      answer: (p) => p.i as number,
      text: (p) => `Which one is a ${SOLIDS[p.i as number]?.name}?`,
      options: () => SOLIDS.map((s) => s.icon),
    },
    {
      type: 'choose-number',
      skill: 'shape-3d',
      params: { n: [2, 6] },
      answer: (p) => p.n as number,
      text: (p) => `How many? ${'📦'.repeat(p.n as number)}`,
      distractors: 'near',
    },
  ],
};
