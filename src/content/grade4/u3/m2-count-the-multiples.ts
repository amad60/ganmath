import type { ContentModule } from '../../types';

/**
 * Sisi lain dari faktor. Kelipatan adalah tabel perkalian yang dibaca ke luar,
 * tanpa batas: 3, 6, 9, 12, ... Anak sudah punya skip counting sejak Grade 2 —
 * yang baru di sini hanya namanya dan kesadaran bahwa daftarnya tidak berhenti.
 */
export const countTheMultiples: ContentModule = {
  id: 'g4-u3-m2',
  unitId: 'g4-u3',
  grade: 4,
  title: 'Count the Multiples',
  icon: '🔢',
  prereq: ['g4-u3-m1'],
  skills: ['multiples'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid', 'counter-objects'],
  vocab: ['multiple'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap fifteen dots.',
      visual: { kind: 'counter-objects', count: 15, icon: '🔵' },
      action: 'tap-count',
      target: 15,
      hint: 'Five rows of three.',
    },
    {
      stage: 'pictorial',
      prompt: '5 rows of 3 make 15.',
      visual: { kind: 'array', rows: 5, cols: 3 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '3, 6, 9, 12 are multiples of 3.',
      visual: { kind: 'array', rows: 4, cols: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Deret tidak selalu dimulai dari kelipatan pertama: anak harus melihat
      // JARAKnya, bukan menghafal awal tabel perkalian.
      type: 'choose-number',
      skill: 'multiples',
      params: { n: [2, 9], s: [1, 4] },
      answer: (p) => (p.n as number) * ((p.s as number) + 3),
      text: (p) => {
        const n = p.n as number;
        const s = p.s as number;
        return `${n * s}, ${n * (s + 1)}, ${n * (s + 2)}, ?`;
      },
      distractors: 'near',
      // Miskonsepsi khas: melanjutkan dengan menambah satu, bukan melompat n.
      misconception: (p) => (p.n as number) * ((p.s as number) + 2) + 1,
    },
    {
      // Kelipatan dibaca mundur: bilangan mana ini di daftar kelipatan n?
      type: 'keypad',
      skill: 'multiples',
      params: { n: [2, 9], k: [2, 9] },
      answer: (p) => p.k as number,
      text: (p) => `How many ${p.n}s make ${(p.n as number) * (p.k as number)}?`,
    },
  ],
};
