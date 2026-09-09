import type { ContentModule } from '../../types';

/**
 * Strategi nilai tempat / distributif — jembatan antara tabel perkalian Grade 3
 * dan perkalian bersusun. Anak belum diminta menyimpan apa pun di sini: dia hanya
 * memecah 24 × 3 menjadi 20 × 3 dan 4 × 3, lalu menjumlahkannya.
 */
export const splitToMultiply: ContentModule = {
  id: 'g4-u2-m2',
  unitId: 'g4-u2',
  grade: 4,
  title: 'Split to Multiply',
  icon: '✂️',
  prereq: ['g4-u2-m1'],
  skills: ['split-multiply'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twenty dots.',
      visual: { kind: 'counter-objects', count: 24, icon: '🍎' },
      action: 'tap-count',
      target: 20,
      hint: 'Twenty first, then four more.',
    },
    {
      stage: 'pictorial',
      prompt: 'Split 24 into 20 and 4.',
      visual: { kind: 'base10', tens: 2, ones: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Times each part, then add them.',
      visual: { kind: 'base10', tens: 2, ones: 4 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Bagian puluhan sengaja diberikan: yang diuji adalah langkah keduanya.
      type: 'choose-number',
      skill: 'split-multiply',
      params: { t: [2, 9], o: [1, 9], b: [3, 9] },
      answer: (p) => ((p.t as number) * 10 + (p.o as number)) * (p.b as number),
      text: (p) =>
        `${(p.t as number) * 10} × ${p.b} = ${(p.t as number) * 10 * (p.b as number)}. So ${
          (p.t as number) * 10 + (p.o as number)
        } × ${p.b} = ?`,
      distractors: 'near',
      // Miskonsepsi khas: satuannya ikut ditambahkan, bukan dikalikan dulu.
      misconception: (p) => (p.t as number) * 10 * (p.b as number) + (p.o as number),
    },
    {
      // Dua hasil bagian ditulis penuh — anak hanya menjumlahkannya.
      type: 'keypad',
      skill: 'split-multiply',
      params: { t: [2, 9], o: [1, 9], b: [3, 9] },
      answer: (p) => ((p.t as number) * 10 + (p.o as number)) * (p.b as number),
      text: (p) => `${(p.t as number) * 10} × ${p.b} + ${p.o} × ${p.b} = ?`,
    },
  ],
};
