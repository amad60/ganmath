import type { ContentModule } from '../../types';

/**
 * Subitizing — mengenali jumlah tanpa menghitung satu per satu. Ini modul `fact`
 * pertama, jadi modul pertama yang dinilai kecepatannya.
 */
export const quickLook: ContentModule = {
  id: 'g1-u1-m4',
  unitId: 'g1-u1',
  grade: 1,
  title: 'Quick Look',
  icon: '👀',
  prereq: ['g1-u1-m2'],
  skills: ['subitize-6'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'count-tap'],
  visuals: ['ten-frame'],
  vocab: ['quick', 'look'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill four boxes.',
      visual: { kind: 'ten-frame', value: 0 },
      action: 'tap-fill',
      target: 4,
      hint: 'Four, not five.',
    },
    {
      stage: 'pictorial',
      prompt: 'You can see four at once.',
      visual: { kind: 'ten-frame', value: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Look fast. Say the number.',
      visual: { kind: 'ten-frame', value: 6 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'subitize-6',
      params: { n: [1, 6] },
      answer: (p) => p.n as number,
      text: (p) => `${'●'.repeat(p.n as number)}`,
      distractors: 'near',
      misconception: (p) => (p.n as number) - 1,
    },
    {
      type: 'count-tap',
      skill: 'subitize-6',
      params: { n: [2, 6] },
      answer: (p) => p.n as number,
      text: (p) => `How many? ${'🔵'.repeat(p.n as number)}`,
    },
  ],
};
