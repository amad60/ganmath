import type { ContentModule } from '../../types';

export const heavyAndLight: ContentModule = {
  id: 'g1-u7-m3',
  unitId: 'g1-u7',
  grade: 1,
  title: 'Heavy and Light',
  icon: '🪶',
  prereq: ['g1-u7-m1'],
  skills: ['compare-weight'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['counter-objects'],
  vocab: ['heavy', 'heavier', 'light', 'lighter', 'weight', 'full', 'empty', 'opposites'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five heavy blocks.',
      visual: { kind: 'counter-objects', count: 7, icon: '🪨' },
      action: 'tap-count',
      target: 5,
      hint: 'More blocks means heavier.',
    },
    {
      stage: 'pictorial',
      prompt: 'More blocks means heavier.',
      visual: { kind: 'bars', lengths: [0.8, 0.4], labels: ['A', 'B'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Heavy and light are opposites.',
      visual: { kind: 'bars', lengths: [0.9, 0.3], labels: ['A', 'B'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'compare-weight',
      params: { a: [3, 9], b: [2, 8], c: [1, 7] },
      answer: (p) => {
        const v = [p.a as number, p.b as number, p.c as number];
        return v.indexOf(Math.max(...v));
      },
      text: () => 'Which one is heaviest?',
      visual: (p) => ({
        kind: 'bars',
        lengths: [(p.a as number) / 10, (p.b as number) / 10, (p.c as number) / 10],
        labels: ['A', 'B', 'C'],
      }),
      exclude: (p) => new Set([p.a as number, p.b as number, p.c as number]).size < 3,
      options: () => ['A', 'B', 'C'],
    },
    {
      type: 'choose-number',
      skill: 'compare-weight',
      params: { a: [4, 9], b: [1, 5] },
      answer: (p) => (p.a as number) - (p.b as number),
      text: (p) => `${p.a} blocks take away ${p.b}. How many?`,
      exclude: (p) => (p.b as number) >= (p.a as number),
      distractors: 'near',
      misconception: (p) => (p.a as number) + (p.b as number),
    },
  ],
};
