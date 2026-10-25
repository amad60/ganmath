import type { ContentModule } from '../../types';

/**
 * Miskonsepsi terbesar di seluruh unit: "angka bawah lebih besar berarti pecahannya
 * lebih besar" (1/8 > 1/2). Karena itu tahap pictorial-nya justru menunjukkan
 * seperdelapan yang mungil, dan seluruh soal `compare-symbol` di sini memakai
 * pembilang satu — supaya yang diuji benar-benar pemahaman itu.
 */
export const compareFractions: ContentModule = {
  id: 'g3-u5-m4',
  unitId: 'g3-u5',
  grade: 3,
  title: 'Compare Fractions',
  icon: '⚖️',
  prereq: ['g3-u5-m3'],
  skills: ['compare-fraction'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['compare-symbol', 'choose-text'],
  visuals: ['fraction-shape'],
  vocab: ['eighth'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap two equal parts.',
      visual: { kind: 'fraction', parts: 2, shaded: 0, tap: true },
      action: 'tap-count',
      target: 2,
      hint: 'Two parts make halves.',
    },
    {
      stage: 'pictorial',
      prompt: 'Half is big. One eighth is small.',
      visual: { kind: 'bars', lengths: [0.5, 0.125], labels: ['1/2', '1/8'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'More parts means each part is smaller.',
      visual: { kind: 'fraction', parts: 2, shaded: 1 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'compare-symbol',
      skill: 'compare-fraction',
      params: { a: [2, 8], b: [2, 8] },
      // Pembilang satu di kedua sisi: yang lebih besar adalah yang penyebutnya KECIL.
      answer: (p) => Math.sign((p.b as number) - (p.a as number)),
      text: (p) => `1/${p.a} ? 1/${p.b}`,
    },
    {
      type: 'choose-text',
      skill: 'compare-fraction',
      params: { p: [3, 8], s: [1, 6] },
      answer: () => 0,
      text: () => 'How much is shaded?',
      visual: (p) => ({ kind: 'fraction', parts: p.p as number, shaded: p.s as number }),
      // Pilihan tidak boleh kembar: 1/p = s/p saat s = 1, (p−s)/p = s/p saat p = 2s,
      // dan 1/p = (p−s)/p saat s = p − 1.
      exclude: (p) => {
        const s = p.s as number;
        const n = p.p as number;
        return s >= n || s === 1 || n === 2 * s || s === n - 1;
      },
      options: (p) => [
        `${p.s}/${p.p}`,
        `${p.p}/${p.s}`,
        `1/${p.p}`,
        `${(p.p as number) - (p.s as number)}/${p.p}`,
      ],
    },
  ],
};
