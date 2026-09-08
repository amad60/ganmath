import type { ContentModule } from '../../types';

/**
 * Dua persegi panjang berbeda bentuk bisa punya keliling sama. Ini yang memutus
 * anggapan "lebih panjang berarti kelilingnya lebih besar", dan menyiapkan
 * perbedaan keliling vs luas di kelas 4.
 */
export const samePerimeter: ContentModule = {
  id: 'g3-u6-m5',
  unitId: 'g3-u6',
  grade: 3,
  title: 'Same Perimeter',
  icon: '🔁',
  prereq: ['g3-u6-m4'],
  skills: ['perimeter-compare'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'compare-symbol'],
  visuals: ['rectangle'],
  vocab: ['thin', 'different'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap six sides.',
      visual: { kind: 'counter-objects', count: 8, icon: '📏' },
      action: 'tap-count',
      target: 6,
      hint: 'Two shapes, but count only six.',
    },
    {
      stage: 'pictorial',
      prompt: 'This one is long and thin.',
      visual: { kind: 'rect', w: 7, h: 2 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Same perimeter 18, different shape.',
      visual: { kind: 'rect', w: 5, h: 4 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'perimeter-compare',
      params: { w: [3, 9], h: [1, 8] },
      // Persegi panjang lain dengan keliling SAMA: sisi panjangnya berkurang satu,
      // sisi pendeknya bertambah satu.
      answer: (p) => (p.h as number) + 1,
      text: (p) => `Same perimeter. Long side ${(p.w as number) - 1}. Short side?`,
      visual: (p) => ({ kind: 'rect', w: p.w as number, h: p.h as number }),
      exclude: (p) => (p.h as number) >= (p.w as number) - 1,
      distractors: 'near',
      misconception: (p) => p.h as number, // mengira bentuknya tidak berubah
    },
    {
      type: 'compare-symbol',
      skill: 'perimeter-compare',
      params: { a: [2, 9], b: [2, 9] },
      answer: (p) => Math.sign((p.a as number) - (p.b as number)),
      text: (p) => `Perimeter of 2 by ${p.a} ? Perimeter of 2 by ${p.b}`,
    },
  ],
};
