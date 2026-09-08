import type { ContentModule } from '../../types';

export const countOnAndBack: ContentModule = {
  id: 'g2-u3-m5',
  unitId: 'g2-u3',
  grade: 2,
  title: 'Count On and Back',
  icon: '🦘',
  prereq: ['g2-u3-m3'],
  skills: ['count-on-back'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'number-line-drop'],
  visuals: ['number-line'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 55 on the line.',
      visual: { kind: 'number-line', min: 40, max: 80, value: null },
      action: 'drop-on-line',
      target: 55,
      hint: 'Halfway between fifty and sixty.',
    },
    {
      stage: 'pictorial',
      prompt: 'Jump ten, then jump ten again.',
      visual: { kind: 'number-line', min: 40, max: 80, value: 75, marks: [55, 65] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Big jumps first, small jumps after.',
      visual: { kind: 'number-line', min: 40, max: 80, value: 78, marks: [55, 75] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'count-on-back',
      params: { a: [21, 79], j: [2, 4] },
      answer: (p) => (p.a as number) + (p.j as number) * 10,
      text: (p) => `${p.a}, jump ${p.j} tens. Where are you?`,
      distractors: 'near',
      misconception: (p) => (p.a as number) + (p.j as number),
    },
    {
      type: 'number-line-drop',
      skill: 'count-on-back',
      params: { n: [41, 79] },
      range: [40, 80],
      answer: (p) => p.n as number,
      text: (p) => `Put ${p.n} on the line.`,
      exclude: (p) => (p.n as number) % 5 !== 0,
    },
  ],
};
