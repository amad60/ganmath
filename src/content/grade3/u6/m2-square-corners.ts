import type { ContentModule } from '../../types';

export const squareCorners: ContentModule = {
  id: 'g3-u6-m2',
  unitId: 'g3-u6',
  grade: 3,
  title: 'Square Corners',
  icon: '📐',
  prereq: ['g3-u6-m1'],
  skills: ['right-angle'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'choose-text'],
  visuals: ['rectangle', 'shape-2d'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four corners.',
      visual: { kind: 'counter-objects', count: 4, icon: '📐' },
      action: 'tap-count',
      target: 4,
      hint: 'One tap for each corner.',
    },
    {
      stage: 'pictorial',
      prompt: 'A square corner looks like this.',
      visual: { kind: 'rect', w: 4, h: 3, showCorners: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A rectangle has four square corners.',
      visual: { kind: 'rect', w: 6, h: 2, showCorners: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'right-angle',
      params: { w: [2, 9], h: [1, 8] },
      answer: () => 4,
      text: () => 'How many square corners?',
      visual: (p) => ({ kind: 'rect', w: p.w as number, h: p.h as number, showCorners: true }),
      exclude: (p) => (p.h as number) > (p.w as number),
      distractors: 'near',
      misconception: () => 2, // hanya menghitung yang di atas
    },
    {
      type: 'choose-text',
      skill: 'right-angle',
      params: { s: [0, 3] },
      answer: (p) => ((p.s as number) < 2 ? 0 : 1),
      text: () => 'Does it have square corners?',
      visual: (p) => ({
        kind: 'shape2d',
        name: (['square', 'rectangle', 'triangle', 'hexagon'] as const)[p.s as number] as 'square',
        showCorners: true,
      }),
      options: () => ['yes', 'no', 'it has no corners'],
    },
  ],
};
