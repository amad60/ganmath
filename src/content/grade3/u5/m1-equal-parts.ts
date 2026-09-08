import type { ContentModule } from '../../types';

/**
 * Gerbang seluruh unit pecahan: yang menentukan bukan BANYAK potongan, tapi potongan
 * yang SAMA BESAR. Karena itu setengah soal di sini memakai varian `unequal` —
 * anak yang mengira "dipotong 4" sudah berarti "seperempat" akan tersandung di sini,
 * bukan tiga modul kemudian.
 */
export const equalParts: ContentModule = {
  id: 'g3-u5-m1',
  unitId: 'g3-u5',
  grade: 3,
  title: 'Equal Parts',
  icon: '🍕',
  prereq: ['g3-u4-m5'],
  skills: ['equal-parts'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'choose-text'],
  visuals: ['fraction-shape'],
  vocab: ['third', 'thirds', 'sixth', 'sixths', 'cut'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three equal parts.',
      visual: { kind: 'counter-objects', count: 6, icon: '🍕' },
      action: 'tap-count',
      target: 3,
      hint: 'Three equal parts make thirds.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three equal parts. Each is one third.',
      visual: { kind: 'fraction', parts: 3, shaded: 1 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Not equal parts, not thirds.',
      visual: { kind: 'fraction', parts: 3, shaded: 1, unequal: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'equal-parts',
      params: { p: [2, 8] },
      answer: (p) => p.p as number,
      text: () => 'How many equal parts?',
      visual: (p) => ({ kind: 'fraction', parts: p.p as number, shaded: 1 }),
      distractors: 'near',
      misconception: (p) => (p.p as number) - 1, // lupa menghitung bagian yang diarsir
    },
    {
      type: 'choose-text',
      skill: 'equal-parts',
      params: { p: [2, 6], u: [0, 1] },
      answer: (p) => ((p.u as number) === 1 ? 1 : 0),
      text: () => 'Are the parts equal?',
      visual: (p) => ({
        kind: 'fraction',
        parts: p.p as number,
        shaded: 1,
        unequal: (p.u as number) === 1,
      }),
      options: () => ['yes', 'no', 'there are no parts'],
    },
  ],
};
