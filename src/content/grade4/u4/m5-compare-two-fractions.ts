import type { ContentModule } from '../../types';

/**
 * Membandingkan pecahan berpenyebut BEDA, tapi hanya kasus yang bisa diselesaikan
 * dengan alat Grade 4: satu penyebut adalah kelipatan penyebut yang lain, jadi
 * cukup satu langkah "senilai" untuk menyamakannya.
 *
 * Penyebut yang tidak berkelipatan (2/3 vs 3/5) sengaja TIDAK diambil — itu butuh
 * KPK dua arah dan menjadi materi Grade 5.
 */
export const compareTwoFractions: ContentModule = {
  id: 'g4-u4-m5',
  unitId: 'g4-u4',
  grade: 4,
  title: 'Compare Two Fractions',
  icon: '⚖️',
  prereq: ['g4-u4-m4'],
  skills: ['compare-unlike-fraction'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['compare-symbol', 'choose-text', 'choose-number'],
  visuals: ['fraction-shape', 'bar-model', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three parts.',
      visual: { kind: 'counter-objects', count: 6, icon: '🍰' },
      action: 'tap-count',
      target: 3,
      hint: 'Three of six is half.',
    },
    {
      stage: 'pictorial',
      prompt: '1/2 is smaller than 3/4.',
      visual: { kind: 'bars', lengths: [0.5, 0.75] },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: '1/2 is the same as 2/4.',
      visual: { kind: 'fraction', parts: 4, shaded: 2, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Make bottoms equal, then compare tops.',
      visual: { kind: 'fraction', parts: 4, shaded: 3, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      // a/b dibanding c/(b·k). Setelah disamakan: a·k dibanding c.
      type: 'compare-symbol',
      skill: 'compare-unlike-fraction',
      params: { b: [2, 6], k: [2, 3], a: [1, 5], c: [1, 11] },
      answer: (p) => Math.sign((p.a as number) * (p.k as number) - (p.c as number)),
      text: (p) => `${p.a}/${p.b} ? ${p.c}/${(p.b as number) * (p.k as number)}`,
      exclude: (p) =>
        (p.a as number) >= (p.b as number) ||
        (p.c as number) >= (p.b as number) * (p.k as number),
    },
    {
      type: 'choose-text',
      skill: 'compare-unlike-fraction',
      params: { b: [2, 6], k: [2, 3], a: [1, 5], c: [1, 11] },
      answer: (p) => {
        const left = (p.a as number) * (p.k as number);
        const right = p.c as number;
        return left > right ? 0 : left < right ? 1 : 2;
      },
      // Pecahannya ikut ditulis di soal: kalau hanya "Which one is bigger?", seluruh
      // kombinasi menghasilkan teks yang sama dan generator memangkasnya jadi satu soal.
      text: (p) => `Which is bigger: ${p.a}/${p.b} or ${p.c}/${(p.b as number) * (p.k as number)}?`,
      exclude: (p) =>
        (p.a as number) >= (p.b as number) ||
        (p.c as number) >= (p.b as number) * (p.k as number),
      options: (p) => [
        `${p.a}/${p.b}`,
        `${p.c}/${(p.b as number) * (p.k as number)}`,
        'they are the same',
      ],
    },
    {
      // Langkah yang membuat perbandingannya mungkin, dilatih terpisah.
      type: 'choose-number',
      skill: 'compare-unlike-fraction',
      params: { b: [2, 6], k: [2, 3], a: [1, 5] },
      answer: (p) => (p.a as number) * (p.k as number),
      text: (p) => `${p.a}/${p.b} = ?/${(p.b as number) * (p.k as number)}`,
      exclude: (p) => (p.a as number) >= (p.b as number),
      distractors: 'near',
      misconception: (p) => p.a as number,
    },
  ],
};
