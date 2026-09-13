import { ALSO_TRUE } from '../../options';
import type { ContentModule } from '../../types';

const NAMES = ['triangle', 'square', 'rectangle', 'pentagon', 'hexagon'] as const;

/** Persegi JUGA persegi panjang — tombol "rectangle" tidak ikut saat jawabannya persegi. */
const nameOptions = (i: number) =>
  NAMES.filter((n, j) => j === i || !(ALSO_TRUE[NAMES[i]!] ?? []).includes(n));

export const sidesAndCorners: ContentModule = {
  id: 'g3-u6-m1',
  unitId: 'g3-u6',
  grade: 3,
  title: 'Sides and Corners',
  icon: '🔷',
  prereq: ['g3-u5-m6'],
  skills: ['shape-parts'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'choose-text'],
  visuals: ['shape-2d'],
  vocab: ['side', 'sides', 'corner', 'corners'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four corners.',
      visual: { kind: 'counter-objects', count: 4, icon: '📍' },
      action: 'tap-count',
      target: 4,
      hint: 'One tap for each corner.',
    },
    {
      stage: 'pictorial',
      prompt: 'A square has four sides.',
      visual: { kind: 'shape2d', name: 'square', showCorners: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Same number of sides and corners.',
      visual: { kind: 'shape2d', name: 'pentagon', showCorners: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'shape-parts',
      params: { s: [0, 4] },
      answer: (p) => [3, 4, 4, 5, 6][p.s as number] as number,
      text: () => 'How many sides?',
      visual: (p) => ({
        kind: 'shape2d',
        name: (['triangle', 'square', 'rectangle', 'pentagon', 'hexagon'] as const)[
          p.s as number
        ] as 'triangle',
      }),
      distractors: 'near',
      misconception: (p) => ([3, 4, 4, 5, 6][p.s as number] as number) + 1,
    },
    {
      type: 'choose-text',
      skill: 'shape-parts',
      params: { s: [0, 4] },
      answer: (p) => nameOptions(p.s as number).indexOf(NAMES[p.s as number]!),
      text: () => 'What shape is this?',
      visual: (p) => ({
        kind: 'shape2d',
        name: (['triangle', 'square', 'rectangle', 'pentagon', 'hexagon'] as const)[
          p.s as number
        ] as 'triangle',
        showCorners: true,
      }),
      options: (p) => nameOptions(p.s as number),
    },
  ],
};
