import type { ContentModule } from '../../types';

/**
 * Sisa pembagian, kali ini pada bilangan yang tidak lagi muat di tabel perkalian
 * (g3-u3-m6 berhenti di angka kecil). Dua aturannya sengaja menanyakan dua bagian
 * jawaban yang berbeda dari soal yang sama — sisa dan hasil bagi — karena tertukarnya
 * kedua bilangan itu adalah kesalahan paling sering di sini.
 */
export const divideWithRemainder: ContentModule = {
  id: 'g4-u2-m6',
  unitId: 'g4-u2',
  grade: 4,
  title: 'Divide with Remainder',
  icon: '🍬',
  prereq: ['g4-u2-m5'],
  skills: ['divide-remainder'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid', 'counter-objects'],
  vocab: ['remainder'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap nineteen dots.',
      visual: { kind: 'counter-objects', count: 19, icon: '🍬' },
      action: 'tap-count',
      target: 19,
      hint: 'Count them all.',
    },
    {
      stage: 'pictorial',
      prompt: 'Share 19 between 5. Four left over.',
      visual: { kind: 'array', rows: 5, cols: 3 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write 19 ÷ 5 = 3 remainder 4.',
      visual: { kind: 'array', rows: 5, cols: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'divide-remainder',
      params: { d: [3, 9], q: [2, 9], r: [1, 8] },
      answer: (p) => p.r as number,
      text: (p) =>
        `Share ${(p.d as number) * (p.q as number) + (p.r as number)} between ${p.d}. How many left over?`,
      exclude: (p) => (p.r as number) >= (p.d as number),
      distractors: 'near',
      // Miskonsepsi khas: menyebut hasil baginya, bukan sisanya.
      misconception: (p) => p.q as number,
    },
    {
      type: 'keypad',
      skill: 'divide-remainder',
      params: { d: [3, 9], q: [2, 9], r: [1, 8] },
      answer: (p) => p.q as number,
      text: (p) =>
        `Share ${(p.d as number) * (p.q as number) + (p.r as number)} between ${p.d}. How many each?`,
      exclude: (p) => (p.r as number) >= (p.d as number),
    },
  ],
};
