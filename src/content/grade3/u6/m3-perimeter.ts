import type { ContentModule } from '../../types';
import { pl } from '../../plural';

/**
 * Keliling diperkenalkan sebagai "jalan mengelilingi tepi", bukan sebagai rumus.
 * Aturan soalnya memakai persegi panjang berlabel supaya anak bisa menjumlah
 * keempat sisinya sendiri sebelum menemukan jalan pintas 2 x (p + l).
 */
export const perimeter: ContentModule = {
  id: 'g3-u6-m3',
  unitId: 'g3-u6',
  grade: 3,
  title: 'Perimeter',
  icon: '🚶',
  prereq: ['g3-u6-m2'],
  skills: ['perimeter'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['rectangle'],
  vocab: ['perimeter', 'around', 'edge', 'walk', 'cm'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four sides.',
      visual: { kind: 'counter-objects', count: 4, icon: '📏' },
      action: 'tap-count',
      target: 4,
      hint: 'One tap for each side.',
    },
    {
      stage: 'pictorial',
      prompt: 'Walk around the edge. Add every side.',
      visual: { kind: 'rect', w: 4, h: 2 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '4 + 2 + 4 + 2 = 12 cm.',
      visual: { kind: 'rect', w: 4, h: 2 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'perimeter',
      params: { w: [2, 9], h: [1, 8] },
      answer: (p) => 2 * ((p.w as number) + (p.h as number)),
      text: () => 'What is the perimeter?',
      visual: (p) => ({ kind: 'rect', w: p.w as number, h: p.h as number }),
      exclude: (p) => (p.h as number) > (p.w as number),
      distractors: 'near',
      misconception: (p) => (p.w as number) + (p.h as number), // hanya dua sisi
    },
    {
      type: 'keypad',
      skill: 'perimeter',
      params: { w: [2, 9], h: [1, 8] },
      answer: (p) => 2 * ((p.w as number) + (p.h as number)),
      text: () => 'Add all four sides.',
      visual: (p) => ({ kind: 'rect', w: p.w as number, h: p.h as number }),
      exclude: (p) => (p.h as number) > (p.w as number),
    },
    {
      type: 'keypad',
      skill: 'perimeter',
      story: true,
      params: { w: [2, 9], h: [1, 8] },
      answer: (p) => 2 * ((p.w as number) + (p.h as number)),
      text: (p) => `A garden is ${pl(p.w as number, 'metre')} by ${pl(p.h as number, 'metre')}. What is the perimeter?`,
      exclude: (p) => (p.h as number) > (p.w as number),
    },
    {
      type: 'keypad',
      skill: 'perimeter',
      story: true,
      params: { w: [2, 9], h: [1, 8] },
      answer: (p) => 2 * ((p.w as number) + (p.h as number)),
      text: (p) => `A table is ${pl(p.w as number, 'metre')} by ${pl(p.h as number, 'metre')}. What is the perimeter?`,
      exclude: (p) => (p.h as number) > (p.w as number),
    },
  ],
};
