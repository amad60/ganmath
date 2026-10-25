import { pl } from '../../plural';
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
  visuals: ['counter-objects', 'pictogram'],
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
      // Berat digambar sebagai banyak balok, bukan batang panjang:
      // batang mengajarkan "lebih panjang = lebih berat".
      prompt: 'More blocks means heavier.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'A', icon: '🪨', count: 5 },
          { label: 'B', icon: '🪨', count: 2 },
        ],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Heavy and light are opposites.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'A', icon: '🪨', count: 6 },
          { label: 'B', icon: '🪨', count: 1 },
        ],
      },
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
        kind: 'pictogram',
        rows: (['A', 'B', 'C'] as const).map((label, i) => ({
          label,
          icon: '🪨',
          count: [p.a as number, p.b as number, p.c as number][i] ?? 1,
        })),
      }),
      exclude: (p) => new Set([p.a as number, p.b as number, p.c as number]).size < 3,
      options: () => ['A', 'B', 'C'],
    },
    {
      type: 'choose-number',
      skill: 'compare-weight',
      params: { a: [4, 9], b: [1, 5] },
      // Dulu "7 blocks take away 3" — pengurangan, bukan membandingkan berat.
      answer: (p) => Math.max(p.a as number, p.b as number),
      text: (p) =>
        `Box A weighs ${pl(p.a as number, 'block')}. Box B weighs ${pl(p.b as number, 'block')}. Tap the heavier weight.`,
      exclude: (p) => p.a === p.b,
      distractors: 'near',
      misconception: (p) => Math.min(p.a as number, p.b as number),
    },
  ],
};
