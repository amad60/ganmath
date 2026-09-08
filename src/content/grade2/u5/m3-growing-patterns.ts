import type { ContentModule } from '../../types';

export const growingPatterns: ContentModule = {
  id: 'g2-u5-m3',
  unitId: 'g2-u5',
  grade: 2,
  title: 'Growing Patterns',
  icon: '🌱',
  prereq: ['g2-u5-m2'],
  skills: ['growing-pattern'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'missing-number'],
  visuals: ['array-grid', 'number-line'],
  vocab: ['grows', 'growing', 'rule'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap two dots.',
      visual: { kind: 'counter-objects', count: 6, icon: '🟢' },
      action: 'tap-count',
      target: 2,
      hint: 'Then two more each time.',
    },
    {
      stage: 'pictorial',
      prompt: 'Each row grows by two.',
      visual: { kind: 'array', rows: 3, cols: 2 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Find the rule, then the next.',
      visual: { kind: 'number-line', min: 0, max: 20, value: 8, marks: [2, 4, 6] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'growing-pattern',
      params: { start: [1, 9], step: [2, 6] },
      answer: (p) => (p.start as number) + (p.step as number) * 3,
      text: (p) =>
        `${p.start}, ${(p.start as number) + (p.step as number)}, ${(p.start as number) + (p.step as number) * 2}, ?`,
      distractors: 'near',
      misconception: (p) => (p.start as number) + (p.step as number) * 2 + 1,
    },
    {
      type: 'missing-number',
      skill: 'growing-pattern',
      params: { start: [1, 9], step: [2, 6] },
      answer: (p) => p.step as number,
      text: (p) =>
        `${p.start}, ${(p.start as number) + (p.step as number)}, ${(p.start as number) + (p.step as number) * 2}. It grows by ?`,
    },
  ],
};
