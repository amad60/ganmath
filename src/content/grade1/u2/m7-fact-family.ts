import type { ContentModule } from '../../types';

export const factFamily: ContentModule = {
  id: 'g1-u2-m7',
  unitId: 'g1-u2',
  grade: 1,
  title: 'Fact Family',
  icon: '👨‍👩‍👧',
  prereq: ['g1-u2-m6'],
  skills: ['fact-family'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'missing-number'],
  visuals: ['number-bond', 'ten-frame'],
  vocab: ['family', 'back'],

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
      prompt: 'Three and four make seven.',
      visual: { kind: 'number-bond', whole: 7, parts: [3, 4] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Take three away. Four comes back.',
      visual: { kind: 'number-bond', whole: 7, parts: [3, 4] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'fact-family',
      params: { a: [1, 5], b: [1, 5] },
      answer: (p) => p.b as number,
      text: (p) => `${(p.a as number) + (p.b as number)} - ${p.a} = ?`,
      exclude: (p) => (p.a as number) + (p.b as number) > 10,
      distractors: 'near',
      misconception: (p) => (p.a as number) + (p.b as number),
    },
    {
      type: 'missing-number',
      skill: 'fact-family',
      params: { a: [1, 5], b: [1, 5] },
      answer: (p) => p.a as number,
      text: (p) => `? + ${p.b} = ${(p.a as number) + (p.b as number)}`,
      exclude: (p) => (p.a as number) + (p.b as number) > 10,
    },
  ],
};
