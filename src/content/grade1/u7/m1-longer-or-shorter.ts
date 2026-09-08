import type { ContentModule } from '../../types';

export const longerOrShorter: ContentModule = {
  id: 'g1-u7-m1',
  unitId: 'g1-u7',
  grade: 1,
  title: 'Longer or Shorter',
  icon: '📐',
  prereq: ['g1-u3-m4'],
  skills: ['compare-length'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['counter-objects'],
  vocab: ['long', 'longer', 'longest', 'short', 'shorter', 'tall', 'bar', 'bars', 'unit', 'units', 'block', 'blocks'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five blocks in a row.',
      visual: { kind: 'counter-objects', count: 8, icon: '🟩' },
      action: 'tap-count',
      target: 5,
      hint: 'More blocks means longer.',
    },
    {
      stage: 'pictorial',
      prompt: 'This bar is longer than that.',
      visual: { kind: 'bars', lengths: [0.8, 0.4], labels: ['A', 'B'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Longer means more units.',
      visual: { kind: 'bars', lengths: [0.9, 0.5, 0.3], labels: ['A', 'B', 'C'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Tiga batang, bukan dua: dua pilihan berarti anak benar 50% hanya dengan menebak.
      type: 'choose-text',
      skill: 'compare-length',
      params: { a: [3, 9], b: [2, 8], c: [1, 7] },
      answer: (p) => {
        const v = [p.a as number, p.b as number, p.c as number];
        return v.indexOf(Math.max(...v));
      },
      text: () => 'Which bar is longest?',
      visual: (p) => ({
        kind: 'bars',
        lengths: [(p.a as number) / 10, (p.b as number) / 10, (p.c as number) / 10],
        labels: ['A', 'B', 'C'],
      }),
      exclude: (p) =>
        new Set([p.a as number, p.b as number, p.c as number]).size < 3,
      options: () => ['A', 'B', 'C'],
    },
    {
      type: 'choose-number',
      skill: 'compare-length',
      params: { a: [3, 9], b: [2, 8] },
      answer: (p) => Math.max(p.a as number, p.b as number),
      text: (p) => `One bar is ${p.a}. One is ${p.b}. Which is longer?`,
      exclude: (p) => p.a === p.b,
      distractors: 'near',
      misconception: (p) => Math.min(p.a as number, p.b as number),
    },
  ],
};
