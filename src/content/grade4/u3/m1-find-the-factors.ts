import type { ContentModule } from '../../types';

/**
 * Pintu masuk unit. Faktor diperkenalkan sebagai PASANGAN yang menghasilkan satu
 * bilangan — persis number bond yang sudah dipakai anak sejak Grade 1, hanya isinya
 * kini perkalian, bukan penjumlahan (lihat tabel "Benang merah" di grades-2-6.md).
 *
 * Prasyaratnya tabel perkalian (g3-u2) dan pembagian (g3-u3): tanpa keduanya,
 * mencari faktor cuma jadi menebak.
 */
export const findTheFactors: ContentModule = {
  id: 'g4-u3-m1',
  unitId: 'g4-u3',
  grade: 4,
  title: 'Find the Factors',
  icon: '🧩',
  prereq: ['g4-u2-m7'],
  skills: ['factors'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'missing-number'],
  visuals: ['array-grid', 'number-bond', 'counter-objects'],
  vocab: ['factor'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twelve dots.',
      visual: { kind: 'counter-objects', count: 12, icon: '🟠' },
      action: 'tap-count',
      target: 12,
      hint: 'Three rows of four.',
    },
    {
      stage: 'pictorial',
      prompt: '3 rows of 4 make 12.',
      visual: { kind: 'array', rows: 3, cols: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '3 and 4 are factors of 12.',
      visual: { kind: 'number-bond', whole: 12, parts: [3, 4] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Pengecoh sengaja ada di dua arah (lebih besar DAN lebih kecil), supaya
      // anak tidak bisa lulus dengan siasat "pilih yang paling kecil".
      type: 'choose-text',
      skill: 'factors',
      params: { a: [2, 9], b: [3, 9] },
      answer: () => 0,
      text: (p) => `Which pair makes ${(p.a as number) * (p.b as number)}?`,
      options: (p) => {
        const a = p.a as number;
        const b = p.b as number;
        return [`${a} × ${b}`, `${a} × ${b - 1}`, `${a + 1} × ${b}`, `${a - 1} × ${b}`];
      },
    },
    {
      // Arah sebaliknya: satu faktor diberikan, faktor pasangannya dicari.
      type: 'missing-number',
      skill: 'factors',
      params: { a: [2, 9], b: [2, 9] },
      answer: (p) => p.b as number,
      text: (p) => `${p.a} × ? = ${(p.a as number) * (p.b as number)}`,
    },
  ],
};
