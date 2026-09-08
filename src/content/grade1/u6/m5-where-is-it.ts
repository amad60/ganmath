import type { ContentModule } from '../../types';

export const whereIsIt: ContentModule = {
  id: 'g1-u6-m5',
  unitId: 'g1-u6',
  grade: 1,
  title: 'Where Is It?',
  icon: '🧭',
  prereq: ['g1-u6-m1'],
  skills: ['position'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['shape-2d', 'counter-objects'],
  vocab: ['left', 'above', 'below', 'beside', 'position', 'order'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three in a row.',
      visual: { kind: 'counter-objects', count: 5, icon: '🟠' },
      action: 'tap-count',
      target: 3,
      hint: 'Count from the left.',
    },
    {
      stage: 'pictorial',
      prompt: 'This shape is above that one.',
      visual: { kind: 'shape2d', name: 'triangle' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Position words tell us where.',
      visual: { kind: 'shape2d', name: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'position',
      params: { i: [0, 3] },
      answer: (p) => p.i as number,
      text: () => 'Which word means the same?',
      options: () => ['left', 'right', 'above', 'below'],
      visual: (p) => ({
        kind: 'bars',
        lengths: [0.3 + (p.i as number) * 0.2],
        labels: [(['A', 'B', 'C', 'D'] as const)[p.i as number] ?? 'A'],
      }),
    },
    {
      type: 'choose-number',
      skill: 'position',
      params: { n: [1, 9] },
      answer: (p) => p.n as number,
      text: (p) => `Count from the left. ${'🟠'.repeat(p.n as number)}`,
      distractors: 'near',
    },
  ],
};
