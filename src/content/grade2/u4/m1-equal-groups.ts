import type { ContentModule } from '../../types';

export const equalGroups: ContentModule = {
  id: 'g2-u4-m1',
  unitId: 'g2-u4',
  grade: 2,
  title: 'Equal Groups',
  icon: '🧺',
  prereq: ['g2-u2-m1'],
  skills: ['equal-groups'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'missing-number'],
  visuals: ['array-grid', 'counter-objects'],
  vocab: ['group', 'groups', 'equal', 'each'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three apples.',
      visual: { kind: 'counter-objects', count: 6, icon: '🍎' },
      action: 'tap-count',
      target: 3,
      hint: 'One group of three.',
    },
    {
      stage: 'pictorial',
      // Array: perkalian pertama kali masuk akal saat anak MELIHAT kelompoknya.
      prompt: 'Two groups of three.',
      visual: { kind: 'array', rows: 2, cols: 3, highlightRow: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Three and three make six.',
      visual: { kind: 'array', rows: 2, cols: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'equal-groups',
      params: { r: [2, 6], c: [2, 6] },
      answer: (p) => (p.r as number) * (p.c as number),
      text: () => 'How many altogether?',
      visual: (p) => ({ kind: 'array', rows: p.r as number, cols: p.c as number }),
      distractors: 'near',
      // menjumlahkan baris dan kolom, bukan mengalikan
      misconception: (p) => (p.r as number) + (p.c as number),
    },
    {
      type: 'missing-number',
      skill: 'equal-groups',
      params: { r: [2, 6], c: [2, 6] },
      answer: (p) => p.c as number,
      text: (p) => `${p.r} groups of ? = ${(p.r as number) * (p.c as number)}`,
    },
    {
      type: 'choose-number',
      skill: 'equal-groups',
      story: true,
      params: { r: [2, 6], c: [2, 6] },
      answer: (p) => (p.r as number) * (p.c as number),
      text: (p) => `${p.r} baskets. ${p.c} apples in each basket. How many apples?`,
      distractors: 'near',
    },
    {
      type: 'choose-number',
      skill: 'equal-groups',
      story: true,
      params: { r: [2, 6], c: [2, 6] },
      answer: (p) => (p.r as number) * (p.c as number),
      text: (p) => `${p.r} plates. ${p.c} cookies on each plate. How many cookies?`,
      distractors: 'near',
    },
  ],
};
