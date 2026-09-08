import type { ContentModule } from '../../types';

export const numberLine10000: ContentModule = {
  id: 'g3-u1-m5',
  unitId: 'g3-u1',
  grade: 3,
  title: 'Number Line to 10.000',
  icon: '📏',
  prereq: ['g3-u1-m4'],
  skills: ['line-10000'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['number-line-drop', 'choose-number'],
  visuals: ['number-line'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 3000 on the line.',
      visual: { kind: 'number-line', min: 0, max: 10000, value: null },
      action: 'drop-on-line',
      target: 3000,
      hint: 'Three thousands.',
    },
    {
      stage: 'pictorial',
      prompt: 'Halfway is five thousand.',
      visual: { kind: 'number-line', min: 0, max: 10000, value: 5000, marks: [2500, 7500] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Big jumps first, then small.',
      visual: { kind: 'number-line', min: 0, max: 10000, value: 6000, marks: [5000] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'number-line-drop',
      skill: 'line-10000',
      params: { n: [1, 10] },
      range: [0, 10000],
      answer: (p) => (p.n as number) * 1000,
      text: (p) => `Put ${(p.n as number) * 1000} on the line.`,
    },
    {
      type: 'choose-number',
      distractorUnit: 1000,
      skill: 'line-10000',
      params: { n: [1, 9] },
      answer: (p) => (p.n as number) * 1000 + 1000,
      text: (p) => `${(p.n as number) * 1000} + 1000 = ?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) * 1000 + 100,
    },
  ],
};
