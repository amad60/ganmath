import type { ContentModule } from '../../types';

const ANIMALS = [
  { label: 'cats', icon: '🐱' },
  { label: 'dogs', icon: '🐶' },
  { label: 'birds', icon: '🐦' },
] as const;

/**
 * Piktogram BERSKALA: satu gambar mewakili dua atau lima. Ini lompatan nyata dari
 * kelas 1, di mana satu gambar selalu berarti satu — dan miskonsepsinya persis itu:
 * anak menghitung gambarnya, bukan mengalikannya dengan kuncinya.
 */
export const graphsThatCount: ContentModule = {
  id: 'g3-u7-m5',
  unitId: 'g3-u7',
  grade: 3,
  title: 'Graphs that Count',
  icon: '📊',
  prereq: ['g3-u7-m4'],
  skills: ['scaled-pictogram'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'choose-text'],
  visuals: ['pictogram'],
  vocab: ['key', 'stands', 'graph', 'cats', 'dogs', 'birds'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap two cats.',
      visual: { kind: 'counter-objects', count: 4, icon: '🐱' },
      action: 'tap-count',
      target: 2,
      hint: 'One picture stands for two.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three pictures. Each one stands for two.',
      visual: {
        kind: 'pictogram',
        rows: [{ label: 'cats', icon: '🐱', count: 3 }],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '3 × 2 = 6 cats.',
      visual: {
        kind: 'pictogram',
        rows: [{ label: 'cats', icon: '🐱', count: 3 }],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'scaled-pictogram',
      params: { k: [2, 5], a: [1, 6], b: [1, 6] },
      answer: (p) => (p.a as number) * (p.k as number),
      text: (p) => `Each picture is ${p.k}. How many cats?`,
      visual: (p) => ({
        kind: 'pictogram',
        rows: [
          { ...ANIMALS[0], count: p.a as number },
          { ...ANIMALS[1], count: p.b as number },
        ],
      }),
      distractors: 'near',
      misconception: (p) => p.a as number, // menghitung gambar, lupa kuncinya
    },
    {
      type: 'choose-text',
      skill: 'scaled-pictogram',
      params: { a: [1, 6], b: [1, 6], c: [1, 6] },
      answer: (p) => {
        const v = [p.a as number, p.b as number, p.c as number];
        return v.indexOf(Math.min(...v));
      },
      text: () => 'Which row has the fewest?',
      visual: (p) => ({
        kind: 'pictogram',
        rows: ANIMALS.map((a, i) => ({
          ...a,
          count: [p.a as number, p.b as number, p.c as number][i] ?? 1,
        })),
      }),
      exclude: (p) => new Set([p.a as number, p.b as number, p.c as number]).size < 3,
      options: () => ANIMALS.map((a) => a.label),
    },
  ],
};
