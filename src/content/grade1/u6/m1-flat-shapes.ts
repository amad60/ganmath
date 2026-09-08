import type { ContentModule } from '../../types';

const SHAPES = [
  { name: 'circle', icon: '⚪', sides: 0 },
  { name: 'triangle', icon: '🔺', sides: 3 },
  { name: 'square', icon: '🟦', sides: 4 },
  { name: 'rectangle', icon: '▭', sides: 4 },
];

export const flatShapes: ContentModule = {
  id: 'g1-u6-m1',
  unitId: 'g1-u6',
  grade: 1,
  title: 'Flat Shapes',
  icon: '🔺',
  prereq: ['g1-u1-m2'],
  skills: ['shape-2d'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['shape-2d', 'counter-objects'],
  vocab: ['shape', 'shapes', 'flat', 'circle', 'triangle', 'square', 'rectangle', 'side', 'sides', 'corner', 'corners', 'round'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap the three corners.',
      visual: { kind: 'counter-objects', count: 3, icon: '🔺' },
      action: 'tap-count',
      target: 3,
      hint: 'A triangle has three corners.',
    },
    {
      stage: 'pictorial',
      prompt: 'Count the sides. Three sides.',
      visual: { kind: 'ten-frame', value: 3 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Three sides make a triangle.',
      visual: { kind: 'ten-frame', value: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'shape-2d',
      params: { i: [0, 3] },
      answer: (p) => p.i as number,
      text: (p) => `Which one is a ${SHAPES[p.i as number]?.name}?`,
      options: () => SHAPES.map((s) => s.icon),
    },
    {
      type: 'choose-number',
      skill: 'shape-2d',
      params: { i: [1, 3] },
      answer: (p) => SHAPES[p.i as number]?.sides ?? 0,
      text: (p) => `How many sides? ${SHAPES[p.i as number]?.icon}`,
      distractors: 'near',
    },
    {
      // Sudut = jumlah sisi untuk bangun ini; pertanyaan terpisah supaya anak
      // menghubungkan dua kata itu, dan supaya ruang soal cukup untuk satu sesi.
      type: 'choose-number',
      skill: 'shape-2d',
      params: { i: [1, 3] },
      answer: (p) => SHAPES[p.i as number]?.sides ?? 0,
      text: (p) => `How many corners? ${SHAPES[p.i as number]?.icon}`,
      distractors: 'near',
    },
  ],
};
