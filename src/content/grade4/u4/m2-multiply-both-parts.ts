import type { ContentModule } from '../../types';

/**
 * Aturannya, setelah gambarnya dipercaya di m1: memotong setiap bagian jadi k
 * bagian mengalikan pembilang DAN penyebut dengan k sekaligus.
 *
 * Aturan ketiga (`missing-number`) sengaja menanyakan pengalinya, bukan hasilnya —
 * anak yang cuma mencocokkan pola angka akan tersandung di sana.
 */
export const multiplyBothParts: ContentModule = {
  id: 'g4-u4-m2',
  unitId: 'g4-u4',
  grade: 4,
  title: 'Multiply Both Parts',
  icon: '✖️',
  prereq: ['g4-u4-m1'],
  skills: ['equivalent-fraction-multiply'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'missing-number'],
  visuals: ['fraction-shape', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap six dots.',
      visual: { kind: 'counter-objects', count: 6, icon: '🔵' },
      action: 'tap-count',
      target: 6,
      hint: 'Cut each part in two.',
    },
    {
      stage: 'pictorial',
      prompt: 'One of three parts is shaded.',
      visual: { kind: 'fraction', parts: 3, shaded: 1, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Cut each part in two: 2/6.',
      visual: { kind: 'fraction', parts: 6, shaded: 2, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Times top and bottom by 2.',
      visual: { kind: 'fraction', parts: 6, shaded: 2, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'keypad',
      skill: 'equivalent-fraction-multiply',
      params: { s: [1, 5], p: [2, 9], k: [2, 6] },
      answer: (p) => (p.s as number) * (p.k as number),
      text: (p) => `${p.s}/${p.p} = ?/${(p.p as number) * (p.k as number)}`,
      exclude: (p) => (p.s as number) >= (p.p as number),
    },
    {
      type: 'choose-number',
      skill: 'equivalent-fraction-multiply',
      params: { s: [1, 5], p: [2, 9], k: [2, 6] },
      answer: (p) => (p.p as number) * (p.k as number),
      text: (p) => `${p.s}/${p.p} = ${(p.s as number) * (p.k as number)}/?`,
      exclude: (p) => (p.s as number) >= (p.p as number),
      distractors: 'near',
      // Miskonsepsi terbesar bab ini: MENAMBAH angka yang sama ke atas dan bawah
      // (2/3 → 4/5) alih-alih mengalikannya.
      misconception: (p) => (p.p as number) + (p.k as number),
    },
    {
      type: 'missing-number',
      skill: 'equivalent-fraction-multiply',
      params: { s: [1, 5], p: [2, 9], k: [2, 6] },
      answer: (p) => p.k as number,
      text: (p) =>
        `${p.s}/${p.p} = ${(p.s as number) * (p.k as number)}/${
          (p.p as number) * (p.k as number)
        }. Times both by ?`,
      exclude: (p) => (p.s as number) >= (p.p as number),
    },
  ],
};
