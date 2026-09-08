import type { ContentModule } from '../../types';

export const compareBigNumbers: ContentModule = {
  id: 'g4-u1-m4',
  unitId: 'g4-u1',
  grade: 4,
  title: 'Compare Big Numbers',
  icon: '⚖️',
  prereq: ['g4-u1-m3'],
  skills: ['compare-1000000'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['compare-symbol', 'choose-number'],
  visuals: ['base10-blocks', 'number-line'],
  vocab: ['compare', 'biggest', 'place', 'thousands'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 40000 on the line.',
      visual: { kind: 'number-line', min: 0, max: 100000, value: null },
      action: 'drop-on-line',
      target: 40000,
      hint: 'Four ten thousands.',
    },
    {
      stage: 'pictorial',
      prompt: 'Compare the biggest place first.',
      visual: { kind: 'base10', hundreds: 4, tens: 2, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Same ten thousands? Compare thousands.',
      visual: { kind: 'base10', hundreds: 4, tens: 7, ones: 0 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'compare-symbol',
      skill: 'compare-1000000',
      // Parameter disimpan sebagai PULUHAN RIBU supaya ruang kombinasinya tetap kecil.
      params: { a: [11, 99], b: [11, 99] },
      answer: (p) => Math.sign((p.a as number) - (p.b as number)),
      text: (p) => `${(p.a as number) * 10000} ? ${(p.b as number) * 10000}`,
      // Selisih besar bisa dijawab tanpa melihat tempat yang menentukan.
      exclude: (p) => Math.abs((p.a as number) - (p.b as number)) > 12,
    },
    {
      type: 'choose-number',
      distractorUnit: 10000,
      skill: 'compare-1000000',
      params: { a: [11, 99], b: [10, 98] },
      answer: (p) => Math.max(p.a as number, p.b as number) * 10000,
      text: (p) => `Which is bigger: ${(p.a as number) * 10000} or ${(p.b as number) * 10000}?`,
      exclude: (p) => p.a === p.b || Math.abs((p.a as number) - (p.b as number)) > 9,
      distractors: 'near',
      // Miskonsepsi khas: anak memilih yang lebih kecil karena membaca digit terakhir.
      misconception: (p) => Math.min(p.a as number, p.b as number) * 10000,
    },
  ],
};
