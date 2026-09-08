import type { ContentModule } from '../../types';

export const centimetres: ContentModule = {
  id: 'g2-u6-m1',
  unitId: 'g2-u6',
  grade: 2,
  title: 'Centimetres',
  icon: '📏',
  prereq: ['g2-u2-m2'],
  skills: ['measure-cm'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['bar-model', 'counter-objects'],
  vocab: ['centimetre', 'centimetres', 'ruler', 'exactly'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap six blocks.',
      visual: { kind: 'counter-objects', count: 8, icon: '🟦' },
      action: 'tap-count',
      target: 6,
      hint: 'Each block is one centimetre.',
    },
    {
      stage: 'pictorial',
      // Satuan baku: yang berubah dari Grade 1 hanyalah namanya menjadi resmi.
      prompt: 'This bar is six centimetres.',
      visual: { kind: 'bars', lengths: [0.6], labels: ['A'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Start the ruler at zero.',
      visual: { kind: 'number-line', min: 0, max: 10, value: 6 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'measure-cm',
      params: { n: [2, 10] },
      answer: (p) => p.n as number,
      text: () => 'How many centimetres?',
      visual: (p) => ({ kind: 'number-line', min: 0, max: 10, value: p.n as number }),
      distractors: 'near',
      // membaca dari 1, bukan dari 0
      misconception: (p) => (p.n as number) - 1,
    },
    {
      type: 'keypad',
      skill: 'measure-cm',
      params: { a: [2, 9], b: [2, 9] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: (p) => `${p.a} cm and ${p.b} cm together = ?`,
    },
  ],
};
