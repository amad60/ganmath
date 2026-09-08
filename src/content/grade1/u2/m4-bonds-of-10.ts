import type { ContentModule } from '../../types';

/**
 * MODUL KUNCI GRADE 1. Kalau anak lemah di sini, seluruh penjumlahan dalam 20 jadi
 * lambat — karena strategi "make ten" bertumpu pada ini. Ambang akurasinya sengaja
 * dinaikkan di atas ambang grade (docs/curriculum/grade-1.md).
 */
export const bondsOf10: ContentModule = {
  id: 'g1-u2-m4',
  unitId: 'g1-u2',
  grade: 1,
  title: 'Bonds of 10',
  icon: '🔟',
  prereq: ['g1-u2-m2'],
  skills: ['bonds-of-10'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'missing-number'],
  visuals: ['ten-frame', 'number-bond'],
  vocab: ['bond', 'bonds', 'needs'],
  masteryOverride: { accuracy: 0.9 },

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill boxes to make ten.',
      visual: { kind: 'ten-frame', value: 0 },
      action: 'tap-fill',
      target: 10,
      hint: 'A full frame is ten.',
    },
    {
      stage: 'pictorial',
      prompt: 'Six and four make ten.',
      visual: { kind: 'ten-frame', value: 10, split: 6 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Six needs four more.',
      visual: { kind: 'number-bond', whole: 10, parts: [6, 4] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'bonds-of-10',
      params: { a: [1, 9] },
      answer: (p) => 10 - (p.a as number),
      text: (p) => `${p.a} and ? make 10`,
      distractors: 'near',
      // miskonsepsi khas: anak mengulang angka yang diberikan
      misconception: (p) => p.a as number,
    },
    {
      type: 'missing-number',
      skill: 'bonds-of-10',
      params: { a: [1, 9] },
      answer: (p) => 10 - (p.a as number),
      text: (p) => `${p.a} + ? = 10`,
    },
  ],
};
