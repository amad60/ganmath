import type { ContentModule } from '../../types';

export const makeGroups: ContentModule = {
  id: 'g3-u3-m2',
  unitId: 'g3-u3',
  grade: 3,
  title: 'Make Groups',
  icon: '🧺',
  prereq: ['g3-u3-m1'],
  skills: ['group-divide'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap fifteen dots.',
      visual: { kind: 'counter-objects', count: 15, icon: '🥕' },
      action: 'tap-count',
      target: 15,
      hint: 'Count them all.',
    },
    {
      stage: 'pictorial',
      prompt: 'Put 15 into groups of 5.',
      visual: { kind: 'array', rows: 3, cols: 5 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Three groups. 15 ÷ 5 = 3.',
      visual: { kind: 'array', rows: 3, cols: 5 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'group-divide',
      params: { g: [2, 6], each: [2, 6] },
      answer: (p) => p.g as number,
      text: (p) => `${(p.g as number) * (p.each as number)} in groups of ${p.each}. How many groups?`,
      visual: (p) => ({ kind: 'array', rows: p.g as number, cols: p.each as number }),
      distractors: 'near',
      misconception: (p) => p.each as number, // menyebut isi kelompok, bukan banyak kelompok
    },
    {
      type: 'keypad',
      skill: 'group-divide',
      params: { g: [2, 9], each: [2, 6] },
      answer: (p) => p.g as number,
      text: (p) => `${(p.g as number) * (p.each as number)} ÷ ${p.each} = ?`,
    },
    {
      type: 'keypad',
      skill: 'group-divide',
      story: true,
      params: { g: [2, 9], each: [2, 6] },
      answer: (p) => p.g as number,
      text: (p) => `${(p.g as number) * (p.each as number)} apples in bags of ${p.each}. How many bags?`,
    },
    {
      type: 'keypad',
      skill: 'group-divide',
      story: true,
      params: { g: [2, 9], each: [2, 6] },
      answer: (p) => p.g as number,
      text: (p) => `Ana puts ${(p.g as number) * (p.each as number)} eggs in boxes of ${p.each}. How many boxes?`,
    },
  ],
};
