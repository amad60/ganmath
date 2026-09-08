import type { ContentModule } from '../../types';

export const metres: ContentModule = {
  id: 'g2-u6-m2',
  unitId: 'g2-u6',
  grade: 2,
  title: 'Metres',
  icon: '🚶',
  prereq: ['g2-u6-m1', 'g2-u1-m1'],
  skills: ['measure-m'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'choose-text'],
  visuals: ['bar-model', 'base10-blocks'],
  vocab: ['metre', 'metres', 'long', 'room'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill ten boxes.',
      visual: { kind: 'ten-frame', value: 0 },
      action: 'tap-fill',
      target: 10,
      hint: 'Ten tens make one hundred.',
    },
    {
      stage: 'pictorial',
      prompt: 'One metre is one hundred centimetres.',
      visual: { kind: 'base10', hundreds: 1, tens: 0, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Use metres for big things.',
      visual: { kind: 'bars', lengths: [0.9, 0.2], labels: ['A', 'B'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'measure-m',
      params: { m: [1, 9] },
      answer: (p) => (p.m as number) * 100,
      text: (p) => `${p.m} metres = ? centimetres`,
      distractors: 'near',
      misconception: (p) => (p.m as number) * 10,
    },
    {
      type: 'choose-text',
      skill: 'measure-m',
      params: { i: [0, 3] },
      answer: (p) => ((p.i as number) < 2 ? 0 : 1),
      text: (p) =>
        `Would you measure ${(['a pencil', 'a shoe', 'a room', 'a street'] as const)[p.i as number]} in metres or centimetres?`,
      options: () => ['centimetres', 'metres', 'both', 'neither'],
    },
  ],
};
