import type { ContentModule } from '../../types';

/**
 * Sengaja `concept`, BUKAN `fact`, meski isinya aritmetika: anak sedang belajar
 * STRATEGI. Menuntut kecepatan di sini justru mematikan strateginya. Kecepatan
 * baru dituntut di modul sesudahnya (docs/curriculum/grade-1.md).
 */
export const makeTenToAdd: ContentModule = {
  id: 'g1-u4-m4',
  unitId: 'g1-u4',
  grade: 1,
  title: 'Make Ten to Add',
  icon: '🧠',
  prereq: ['g1-u2-m4', 'g1-u4-m1'],
  skills: ['make-ten'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'missing-number'],
  visuals: ['ten-frame', 'number-bond'],
  vocab: ['split', 'first'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill eight, then five more.',
      visual: { kind: 'ten-frame', value: 0, capacity: 20 },
      action: 'tap-fill',
      target: 13,
      hint: 'Fill the first frame first.',
    },
    {
      stage: 'pictorial',
      prompt: 'Eight needs two to make ten.',
      visual: { kind: 'number-bond', whole: 5, parts: [2, 3] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Split five into two and three.',
      visual: { kind: 'ten-frame', value: 13, capacity: 20, split: 10 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'make-ten',
      params: { a: [6, 9] },
      answer: (p) => 10 - (p.a as number),
      text: (p) => `${p.a} needs ? to make 10`,
      distractors: 'near',
      misconception: (p) => p.a as number,
    },
    {
      type: 'missing-number',
      skill: 'make-ten',
      params: { a: [6, 9], b: [3, 9] },
      answer: (p) => (p.a as number) + (p.b as number) - 10,
      text: (p) => `${p.a} + ${p.b} = 10 + ?`,
      exclude: (p) => (p.a as number) + (p.b as number) <= 10 || (p.a as number) + (p.b as number) > 20,
    },
  ],
};
