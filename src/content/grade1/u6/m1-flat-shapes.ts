import type { ShapeName } from '../../../engine/types';
import type { ContentModule } from '../../types';

const SHAPES: { name: ShapeName; sides: number }[] = [
  { name: 'circle', sides: 0 },
  { name: 'triangle', sides: 3 },
  { name: 'square', sides: 4 },
  { name: 'rectangle', sides: 4 },
];

const NAMES = SHAPES.map((s) => s.name);

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
  vocab: [
    'shape',
    'shapes',
    'flat',
    'circle',
    'triangle',
    'square',
    'rectangle',
    'side',
    'sides',
    'corner',
    'corners',
    'round',
  ],

  learn: [
    {
      stage: 'concrete',
      // Bangun digambar SVG dengan titik sudut, bukan emoji: emoji berbeda bentuk
      // di tiap HP dan tidak bisa dipakai menunjukkan sisi atau sudut.
      prompt: 'Tap the three corners.',
      visual: { kind: 'shape2d', name: 'triangle', showCorners: true, tap: 'corners' },
      action: 'tap-count',
      target: 3,
      hint: 'A triangle has three corners.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three corners, three sides.',
      visual: { kind: 'shape2d', name: 'triangle', showCorners: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A square has four sides.',
      visual: { kind: 'shape2d', name: 'square', showCorners: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Gambar yang ditampilkan, NAMA yang dipilih.
      // Bentuk sebaliknya ("Which one is a rectangle?" dengan pilihan berupa kata)
      // memberi jawabannya gratis — anak cukup mencocokkan tulisan.
      type: 'choose-text',
      skill: 'shape-2d',
      params: { i: [0, 3] },
      answer: (p) => p.i as number,
      text: () => 'What shape is this?',
      visual: (p) => ({ kind: 'shape2d', name: NAMES[p.i as number] as ShapeName }),
      options: () => NAMES,
    },
    {
      type: 'choose-number',
      skill: 'shape-2d',
      params: { i: [1, 3] },
      answer: (p) => SHAPES[p.i as number]?.sides ?? 0,
      text: () => 'How many sides?',
      visual: (p) => ({ kind: 'shape2d', name: NAMES[p.i as number] as ShapeName }),
      distractors: 'near',
    },
    {
      type: 'choose-number',
      skill: 'shape-2d',
      params: { i: [1, 3] },
      answer: (p) => SHAPES[p.i as number]?.sides ?? 0,
      text: () => 'How many corners?',
      visual: (p) => ({
        kind: 'shape2d',
        name: NAMES[p.i as number] as ShapeName,
        showCorners: true,
      }),
      distractors: 'near',
    },
  ],
};
