import type { ContentModule } from '../../types';

/**
 * Sifat komutatif tidak dihafal di sini — anak MELIHAT bahwa array yang sama
 * bisa dibaca sebagai baris atau kolom.
 */
export const arrays: ContentModule = {
  id: 'g2-u4-m2',
  unitId: 'g2-u4',
  grade: 2,
  title: 'Rows and Columns',
  icon: '🔲',
  prereq: ['g2-u4-m1'],
  skills: ['arrays'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'missing-number'],
  visuals: ['array-grid'],
  vocab: ['array', 'rows', 'column', 'columns', 'turn', 'turned'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four in a row.',
      visual: { kind: 'counter-objects', count: 6, icon: '🔵' },
      action: 'tap-count',
      target: 4,
      hint: 'One row of four.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three rows of four.',
      visual: { kind: 'array', rows: 3, cols: 4, highlightRow: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Turned around, it is the same.',
      visual: { kind: 'array', rows: 4, cols: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'arrays',
      params: { r: [2, 8], c: [2, 8] },
      answer: (p) => (p.r as number) * (p.c as number),
      text: () => 'How many dots?',
      visual: (p) => ({ kind: 'array', rows: p.r as number, cols: p.c as number }),
      exclude: (p) => (p.r as number) * (p.c as number) > 40,
      distractors: 'near',
      misconception: (p) => (p.r as number) + (p.c as number),
    },
    {
      type: 'missing-number',
      skill: 'arrays',
      params: { r: [2, 8], c: [2, 8] },
      answer: (p) => p.r as number,
      text: (p) => `? rows of ${p.c} = ${(p.r as number) * (p.c as number)}`,
      exclude: (p) => (p.r as number) * (p.c as number) > 40,
    },
    {
      type: 'choose-number',
      skill: 'arrays',
      story: true,
      params: { r: [2, 8], c: [2, 8] },
      answer: (p) => (p.r as number) * (p.c as number),
      text: (p) => `${p.r} rows of seats. ${p.c} seats in each row. How many seats?`,
      exclude: (p) => (p.r as number) * (p.c as number) > 40,
      distractors: 'near',
    },
    {
      type: 'choose-number',
      skill: 'arrays',
      story: true,
      params: { r: [2, 8], c: [2, 8] },
      answer: (p) => (p.r as number) * (p.c as number),
      text: (p) => `A garden has ${p.r} rows. ${p.c} flowers in each row. How many flowers?`,
      exclude: (p) => (p.r as number) * (p.c as number) > 40,
      distractors: 'near',
    },
  ],
};
