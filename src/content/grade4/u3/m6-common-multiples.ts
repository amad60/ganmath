import type { ContentModule } from '../../types';

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

/**
 * KPK — juga hanya PENGENALAN: kelipatan persekutuan dicari dengan menghitung
 * kedua daftar kelipatan sampai bertemu, bukan dengan faktorisasi prima.
 *
 * Aturan kedua menutup miskonsepsi terbesarnya: kelipatan persekutuan tidak cuma
 * satu. Setelah yang pertama, mereka berulang terus — 12, 24, 36, ...
 */
export const commonMultiples: ContentModule = {
  id: 'g4-u3-m6',
  unitId: 'g4-u3',
  grade: 4,
  title: 'Common Multiples',
  icon: '🔁',
  prereq: ['g4-u3-m5'],
  skills: ['common-multiples'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twelve dots.',
      visual: { kind: 'counter-objects', count: 12, icon: '🟣' },
      action: 'tap-count',
      target: 12,
      hint: 'Count by two and three.',
    },
    {
      stage: 'pictorial',
      prompt: '12 is 6 rows of 2.',
      visual: { kind: 'array', rows: 6, cols: 2 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: '12 is 4 rows of 3.',
      visual: { kind: 'array', rows: 4, cols: 3 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '12 is the first common multiple.',
      visual: { kind: 'array', rows: 4, cols: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'common-multiples',
      params: { a: [2, 6], b: [2, 9] },
      answer: (p) => lcm(p.a as number, p.b as number),
      text: (p) => `What is the first common multiple of ${p.a} and ${p.b}?`,
      exclude: (p) => (p.a as number) >= (p.b as number),
      distractors: 'near',
      // Miskonsepsi khas: mengalikan kedua bilangan begitu saja. Benar hanya kalau
      // keduanya saling prima — dan di kasus itu pengecoh ini otomatis dibuang.
      misconception: (p) => (p.a as number) * (p.b as number),
    },
    {
      // Kelipatan persekutuan tidak berhenti di yang pertama.
      type: 'keypad',
      skill: 'common-multiples',
      params: { a: [2, 6], b: [2, 9] },
      answer: (p) => 2 * lcm(p.a as number, p.b as number),
      text: (p) =>
        `${p.a} and ${p.b} both go into ${lcm(p.a as number, p.b as number)}. What comes next?`,
      exclude: (p) => (p.a as number) >= (p.b as number),
    },
  ],
};
