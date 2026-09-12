import type { ContentModule } from '../../types';

export const timesTableCheck: ContentModule = {
  id: 'g3-u2-m8',
  unitId: 'g3-u2',
  grade: 3,
  title: 'Times Table Check',
  icon: '🏅',
  prereq: ['g3-u2-m7'],
  skills: ['times-mixed'],
  kind: 'fact',
  fluencyTracked: true,
  // Ini modul `fact` terbesar di seluruh app: seluruh tabel 2–10 dicampur.
  // Kelancaran di sini menopang pembagian, pecahan, luas, dan semua kelas
  // berikutnya — jadi satu sesi sempurna belum cukup untuk menyatakan hafal.
  masteryOverride: { accuracy: 0.95, sessions: 2 },
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid'],
  vocab: ['fact', 'mix'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twenty dots.',
      visual: { kind: 'counter-objects', count: 20, icon: '⭐' },
      action: 'tap-count',
      target: 20,
      hint: 'Four groups of five.',
    },
    {
      stage: 'pictorial',
      prompt: 'Every fact is an array.',
      visual: { kind: 'array', rows: 4, cols: 5 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Now mix all the tables.',
      visual: { kind: 'array', rows: 5, cols: 4 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'times-mixed',
      params: { a: [2, 10], b: [2, 10] },
      answer: (p) => (p.a as number) * (p.b as number),
      text: (p) => `${p.a} × ${p.b} = ?`,
      distractors: 'near',
      misconception: (p) => (p.a as number) * (p.b as number) - (p.a as number),
    },
    {
      type: 'keypad',
      skill: 'times-mixed',
      params: { a: [2, 10], b: [2, 10] },
      answer: (p) => (p.a as number) * (p.b as number),
      text: (p) => `${p.b} × ${p.a} = ?`,
    },
    {
      type: 'keypad',
      skill: 'times-check',
      story: true,
      params: { a: [2, 10], b: [2, 10] },
      answer: (p) => (p.a as number) * (p.b as number),
      text: (p) => `${p.a} baskets. ${p.b} apples in each basket. How many apples?`,
    },
    {
      type: 'keypad',
      skill: 'times-check',
      story: true,
      params: { a: [2, 10], b: [2, 10] },
      answer: (p) => (p.a as number) * (p.b as number),
      text: (p) => `${p.a} rows of seats. ${p.b} seats in each row. How many seats?`,
    },
  ],
};
