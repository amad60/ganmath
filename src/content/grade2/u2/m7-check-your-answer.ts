import type { ContentModule } from '../../types';

/**
 * Memeriksa hasil dengan operasi kebalikannya. Ini kebiasaan, bukan fakta —
 * jadi `concept` dan tidak dinilai kecepatannya.
 */
export const checkYourAnswer: ContentModule = {
  id: 'g2-u2-m7',
  unitId: 'g2-u2',
  grade: 2,
  title: 'Check Your Answer',
  icon: '🔍',
  prereq: ['g2-u2-m6'],
  skills: ['inverse-check'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['missing-number', 'choose-number'],
  visuals: ['number-bond'],
  vocab: ['check', 'backwards', 'subtraction'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill seven boxes.',
      visual: { kind: 'ten-frame', value: 0 },
      action: 'tap-fill',
      target: 7,
      hint: 'Three and four make seven.',
    },
    {
      stage: 'pictorial',
      prompt: 'Adding backwards gives the start.',
      visual: { kind: 'number-bond', whole: 7, parts: [3, 4] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Check subtraction by adding.',
      visual: { kind: 'number-bond', whole: 52, parts: [27, 25] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'missing-number',
      skill: 'inverse-check',
      params: { a: [21, 89], b: [11, 49] },
      answer: (p) => (p.a as number) - (p.b as number),
      text: (p) => `${p.b} + ? = ${p.a}`,
      exclude: (p) => (p.b as number) >= (p.a as number),
    },
    {
      type: 'choose-number',
      skill: 'inverse-check',
      params: { a: [21, 89], b: [11, 49] },
      answer: (p) => (p.a as number) - (p.b as number),
      text: (p) => `${p.a} - ${p.b} = ?  Check: what plus ${p.b} makes ${p.a}?`,
      exclude: (p) => (p.b as number) >= (p.a as number),
      distractors: 'near',
      misconception: (p) => (p.a as number) + (p.b as number),
    },
  ],
};
