import type { ContentModule } from '../../types';

/**
 * Kompensasi: 47 + 19 dikerjakan sebagai 47 + 20 − 1. Strategi, jadi `concept`.
 */
export const nearTens: ContentModule = {
  id: 'g2-u3-m3',
  unitId: 'g2-u3',
  grade: 2,
  title: 'Almost a Ten',
  icon: '🧠',
  prereq: ['g2-u3-m1', 'g2-u2-m4'],
  skills: ['compensate'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'missing-number'],
  visuals: ['number-line'],
  vocab: ['back', 'easier', 'nineteen'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 47 on the line.',
      visual: { kind: 'number-line', min: 40, max: 70, value: null, step: 1 },
      action: 'drop-on-line',
      target: 47,
      hint: 'Nineteen is almost twenty.',
    },
    {
      stage: 'pictorial',
      prompt: 'Add twenty, then step back one.',
      visual: { kind: 'number-line', min: 40, max: 70, value: 67, marks: [47] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Round numbers are easier.',
      visual: { kind: 'number-line', min: 40, max: 70, value: 66, marks: [47, 67] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'compensate',
      params: { a: [21, 79], b: [1, 6] },
      answer: (p) => (p.a as number) + (p.b as number) * 10 - 1,
      text: (p) => `${p.a} + ${(p.b as number) * 10 - 1} = ?`,
      distractors: 'near',
      // lupa mundur satu setelah membulatkan
      misconception: (p) => (p.a as number) + (p.b as number) * 10,
    },
    {
      type: 'missing-number',
      distractorUnit: 10,
      skill: 'compensate',
      params: { b: [1, 9] },
      answer: (p) => (p.b as number) * 10,
      text: (p) => `${(p.b as number) * 10 - 1} + 1 = ?`,
    },
  ],
};
