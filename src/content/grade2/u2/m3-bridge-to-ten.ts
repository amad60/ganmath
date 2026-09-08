import type { ContentModule } from '../../types';

/**
 * Strategi, bukan hafalan — sama seperti Make Ten to Add di Grade 1, jadi
 * `concept` dan tidak dinilai kecepatannya.
 */
export const bridgeToTen: ContentModule = {
  id: 'g2-u2-m3',
  unitId: 'g2-u2',
  grade: 2,
  title: 'Bridge to the Next Ten',
  icon: '🌉',
  prereq: ['g2-u2-m2'],
  skills: ['bridge-ten'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'missing-number'],
  visuals: ['number-line', 'number-bond'],
  vocab: ['bridge', 'jump', 'jumps'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 38 on the line.',
      visual: { kind: 'number-line', min: 30, max: 50, value: null },
      action: 'drop-on-line',
      target: 38,
      hint: 'Two more makes forty.',
    },
    {
      stage: 'pictorial',
      prompt: 'Jump to forty first.',
      visual: { kind: 'number-line', min: 30, max: 50, value: 40, marks: [38] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Split seven into two and five.',
      visual: { kind: 'number-bond', whole: 7, parts: [2, 5] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'bridge-ten',
      params: { a: [21, 89] },
      answer: (p) => 10 - ((p.a as number) % 10),
      text: (p) => `${p.a} needs ? to reach the next ten`,
      exclude: (p) => (p.a as number) % 10 === 0,
      distractors: 'near',
      misconception: (p) => (p.a as number) % 10,
    },
    {
      type: 'missing-number',
      skill: 'bridge-ten',
      params: { a: [21, 89], b: [3, 9] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: (p) => `${p.a} + ${p.b} = ?`,
      exclude: (p) => ((p.a as number) % 10) + (p.b as number) <= 10,
    },
  ],
};
