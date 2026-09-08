import type { ContentModule } from '../../types';

export const barChart: ContentModule = {
  id: 'g2-u7-m5',
  unitId: 'g2-u7',
  grade: 2,
  title: 'Bar Chart',
  icon: '📊',
  prereq: ['g2-u5-m2'],
  skills: ['bar-chart'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['bar-chart', 'pictogram'],
  vocab: ['chart', 'bar', 'bars', 'most', 'fewest', 'taller', 'vote', 'votes'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five blocks.',
      visual: { kind: 'counter-objects', count: 7, icon: '🟦' },
      action: 'tap-count',
      target: 5,
      hint: 'Each block is one vote.',
    },
    {
      stage: 'pictorial',
      prompt: 'A taller bar means more.',
      visual: { kind: 'bars', lengths: [0.8, 0.5, 0.3], labels: ['A', 'B', 'C'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Read the bar, then the number.',
      visual: { kind: 'bars', lengths: [0.4, 0.9, 0.6], labels: ['A', 'B', 'C'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'bar-chart',
      params: { a: [1, 9], b: [1, 9], c: [1, 9] },
      answer: (p) => {
        const v = [p.a as number, p.b as number, p.c as number];
        return v.indexOf(Math.max(...v));
      },
      text: () => 'Which bar is tallest?',
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
      skill: 'bar-chart',
      params: { a: [1, 9], b: [1, 9] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: () => 'How many altogether?',
      visual: (p) => ({
        kind: 'bars',
        lengths: [(p.a as number) / 10, (p.b as number) / 10],
        labels: ['A', 'B'],
      }),
      distractors: 'near',
      misconception: (p) => Math.abs((p.a as number) - (p.b as number)),
    },
  ],
};
