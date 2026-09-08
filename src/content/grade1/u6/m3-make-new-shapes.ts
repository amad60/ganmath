import type { ContentModule } from '../../types';

export const makeNewShapes: ContentModule = {
  id: 'g1-u6-m3',
  unitId: 'g1-u6',
  grade: 1,
  title: 'Make New Shapes',
  icon: '🧩',
  prereq: ['g1-u6-m2'],
  skills: ['compose-shapes'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['shape-2d'],
  vocab: ['join', 'joined', 'half', 'halves', 'part', 'pieces'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap the four sides.',
      visual: { kind: 'shape2d', name: 'square', showCorners: true },
      action: 'tap-count',
      target: 4,
      hint: 'A square has four sides.',
    },
    {
      stage: 'pictorial',
      prompt: 'Two triangles join into a square.',
      visual: { kind: 'shape2d', name: 'triangle', showCorners: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Small shapes make bigger shapes.',
      visual: { kind: 'shape2d', name: 'hexagon' },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'compose-shapes',
      params: { i: [0, 3] },
      answer: (p) => p.i as number,
      text: () => 'What shape is this?',
      visual: (p) => ({
        kind: 'shape2d',
        name: (['triangle', 'square', 'pentagon', 'hexagon'] as const)[p.i as number] ?? 'square',
      }),
      options: () => ['triangle', 'square', 'pentagon', 'hexagon'],
    },
    {
      type: 'choose-number',
      skill: 'compose-shapes',
      params: { i: [0, 3] },
      answer: (p) => [3, 4, 5, 6][p.i as number] ?? 4,
      text: () => 'How many sides?',
      visual: (p) => ({
        kind: 'shape2d',
        name: (['triangle', 'square', 'pentagon', 'hexagon'] as const)[p.i as number] ?? 'square',
        showCorners: true,
      }),
      distractors: 'near',
    },
    {
      type: 'choose-number',
      skill: 'compose-shapes',
      params: { n: [2, 6] },
      answer: (p) => (p.n as number) * 2,
      text: (p) => `${p.n} shapes joined twice. How many?`,
      distractors: 'near',
    },
  ],
};
