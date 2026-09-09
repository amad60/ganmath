import type { ContentModule } from '../../types';

/**
 * 3 digit × 1 digit. Jawaban terbesarnya 999 × 9 = 8991 — empat digit, yang baru
 * bisa diketik setelah lebar keypad diturunkan per aturan (commit `e945cc3`).
 */
export const threeDigitsTimesOne: ContentModule = {
  id: 'g4-u2-m4',
  unitId: 'g4-u2',
  grade: 4,
  title: 'Three Digits Times One',
  icon: '🧮',
  prereq: ['g4-u2-m3'],
  skills: ['multiply-3x1'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap fifteen dots.',
      visual: { kind: 'counter-objects', count: 15, icon: '📦' },
      action: 'tap-count',
      target: 15,
      hint: 'Three rows of five.',
    },
    {
      stage: 'pictorial',
      prompt: 'Hundreds, tens and ones in 246.',
      visual: { kind: 'base10', hundreds: 2, tens: 4, ones: 6 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Times each place, then add them.',
      visual: { kind: 'base10', hundreds: 2, tens: 4, ones: 6 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'multiply-3x1',
      params: { h: [1, 9], t: [0, 9], o: [2, 9], b: [2, 9] },
      answer: (p) =>
        ((p.h as number) * 100 + (p.t as number) * 10 + (p.o as number)) * (p.b as number),
      text: (p) =>
        `${(p.h as number) * 100 + (p.t as number) * 10 + (p.o as number)} × ${p.b} = ?`,
      exclude: (p) => (p.o as number) * (p.b as number) < 10,
      distractors: 'near',
      // Miskonsepsi khas sama seperti m3, sekarang di bilangan tiga digit.
      misconception: (p) =>
        (p.h as number) * 100 * (p.b as number) +
        (p.t as number) * 10 * (p.b as number) +
        (((p.o as number) * (p.b as number)) % 10),
    },
    {
      type: 'keypad',
      skill: 'multiply-3x1',
      params: { h: [1, 9], t: [0, 9], o: [0, 9], b: [2, 9] },
      answer: (p) =>
        ((p.h as number) * 100 + (p.t as number) * 10 + (p.o as number)) * (p.b as number),
      text: (p) =>
        `${p.b} × ${(p.h as number) * 100 + (p.t as number) * 10 + (p.o as number)} = ?`,
    },
  ],
};
