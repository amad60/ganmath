import type { ContentModule } from '../../types';

export const numberPatterns: ContentModule = {
  id: 'g2-u5-m4',
  unitId: 'g2-u5',
  grade: 2,
  title: 'Missing in the Pattern',
  icon: '🔎',
  prereq: ['g2-u5-m3'],
  skills: ['pattern-missing'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['missing-number', 'choose-number'],
  visuals: ['number-line'],
  vocab: ['hiding'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 12 on the line.',
      visual: { kind: 'number-line', min: 0, max: 30, value: null },
      action: 'drop-on-line',
      target: 12,
      hint: 'Count by threes.',
    },
    {
      stage: 'pictorial',
      prompt: 'One number is hiding.',
      visual: { kind: 'number-line', min: 0, max: 30, value: 15, marks: [3, 6, 9] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Use the rule to find it.',
      visual: { kind: 'number-line', min: 0, max: 30, value: 18, marks: [12, 15] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'missing-number',
      skill: 'pattern-missing',
      params: { start: [1, 9], step: [2, 7] },
      answer: (p) => (p.start as number) + (p.step as number) * 2,
      text: (p) =>
        `${p.start}, ${(p.start as number) + (p.step as number)}, ?, ${(p.start as number) + (p.step as number) * 3}`,
    },
    {
      type: 'choose-number',
      skill: 'pattern-missing',
      params: { start: [2, 9], step: [3, 8] },
      answer: (p) => (p.start as number) + (p.step as number),
      text: (p) =>
        `${p.start}, ?, ${(p.start as number) + (p.step as number) * 2}`,
      distractors: 'near',
      misconception: (p) => (p.start as number) + (p.step as number) * 2,
    },
  ],
};
