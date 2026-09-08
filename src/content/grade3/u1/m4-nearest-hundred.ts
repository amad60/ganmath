import type { ContentModule } from '../../types';

export const nearestHundred: ContentModule = {
  id: 'g3-u1-m4',
  unitId: 'g3-u1',
  grade: 3,
  title: 'Nearest Hundred',
  icon: '🎯',
  prereq: ['g3-u1-m3'],
  skills: ['round-hundred'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'number-line-drop'],
  visuals: ['number-line'],
  vocab: ['nearest', 'round', 'halfway'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 470 on the line.',
      visual: { kind: 'number-line', min: 400, max: 500, value: null },
      action: 'drop-on-line',
      target: 470,
      hint: 'Between four and five hundred.',
    },
    {
      stage: 'pictorial',
      prompt: '470 is nearer to 500.',
      visual: { kind: 'number-line', min: 400, max: 500, value: 470, marks: [450] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Halfway goes up.',
      visual: { kind: 'number-line', min: 400, max: 500, value: 450, marks: [450] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      distractorUnit: 100,
      skill: 'round-hundred',
      params: { n: [11, 99] },
      answer: (p) => Math.round((p.n as number) / 10) * 100,
      text: (p) => `Round ${(p.n as number) * 10} to the nearest hundred.`,
      exclude: (p) => (p.n as number) % 10 === 0,
      distractors: 'near',
      misconception: (p) => Math.floor((p.n as number) / 10) * 100,
    },
    {
      type: 'number-line-drop',
      skill: 'round-hundred',
      params: { n: [1, 9] },
      range: [400, 500],
      answer: (p) => 400 + (p.n as number) * 10,
      text: (p) => `Put ${400 + (p.n as number) * 10} on the line.`,
    },
  ],
};
