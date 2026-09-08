import type { ContentModule } from '../../types';

export const turnAroundFacts: ContentModule = {
  id: 'g3-u2-m3',
  unitId: 'g3-u2',
  grade: 3,
  title: 'Turn Around Facts',
  icon: '🔁',
  prereq: ['g3-u2-m2'],
  skills: ['commutative'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid'],
  vocab: ['order', 'same', 'total'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twelve dots.',
      visual: { kind: 'counter-objects', count: 12, icon: '🟢' },
      action: 'tap-count',
      target: 12,
      hint: 'Count them all.',
    },
    {
      stage: 'pictorial',
      prompt: 'Turn the array. Same total.',
      visual: { kind: 'array', rows: 3, cols: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '3 × 4 and 4 × 3 are the same.',
      visual: { kind: 'array', rows: 4, cols: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'commutative',
      params: { a: [2, 10], b: [2, 10] },
      answer: (p) => (p.a as number) * (p.b as number),
      text: (p) => `${p.b} × ${p.a} = ${(p.a as number) * (p.b as number)}. So ${p.a} × ${p.b} = ?`,
      exclude: (p) => p.a === p.b,
      distractors: 'near',
      misconception: (p) => (p.a as number) + (p.b as number),
    },
    {
      type: 'keypad',
      skill: 'commutative',
      params: { a: [2, 10], b: [2, 10] },
      answer: (p) => (p.a as number) * (p.b as number),
      text: (p) => `${p.a} × ${p.b} = ?`,
      exclude: (p) => p.a === p.b,
    },
  ],
};
