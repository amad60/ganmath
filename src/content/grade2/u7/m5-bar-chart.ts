import type { ContentModule } from '../../types';

/**
 * Diagram yang bisa DIBACA, bukan batang perbandingan.
 * Angka 1–9 jatuh di garis datar (`step: 1`, puncak 10). Nilai tidak ditulis
 * di ujung batang pada soal — itu yang ditanyakan. Menulisnya akan membocorkan
 * jawaban "How many altogether?".
 */
const chart = (values: number[], labels: string[], showValues = false) => ({
  kind: 'bars' as const,
  values,
  labels,
  max: 10,
  step: 1,
  columns: true as const,
  ...(showValues ? { showValues: true as const } : {}),
});

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
      visual: chart([8, 5, 3], ['A', 'B', 'C']),
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Read the bar, then the number.',
      visual: chart([4, 9, 6], ['A', 'B', 'C'], true),
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
      visual: (p) => chart([p.a as number, p.b as number, p.c as number], ['A', 'B', 'C']),
      exclude: (p) => new Set([p.a as number, p.b as number, p.c as number]).size < 3,
      options: () => ['A', 'B', 'C'],
    },
    {
      type: 'choose-number',
      skill: 'bar-chart',
      params: { a: [1, 9], b: [1, 9] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: () => 'How many altogether?',
      // Contoh bernomor di langkah abstract, bukan gambar soal ini.
      hint: () => 2,
      visual: (p) => chart([p.a as number, p.b as number], ['A', 'B']),
      distractors: 'near',
      misconception: (p) => Math.abs((p.a as number) - (p.b as number)),
    },
  ],
};
