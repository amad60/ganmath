import type { ContentModule } from '../../types';

export const nearestThousand: ContentModule = {
  id: 'g4-u1-m5',
  unitId: 'g4-u1',
  grade: 4,
  title: 'Nearest Thousand',
  icon: '🎯',
  prereq: ['g4-u1-m4'],
  skills: ['round-thousand'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'missing-number'],
  visuals: ['number-line'],
  vocab: ['thousands', 'nearer', 'halfway'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 47000 on the line.',
      visual: { kind: 'number-line', min: 40000, max: 50000, value: null },
      action: 'drop-on-line',
      target: 47000,
      hint: 'Between four and five ten thousands.',
    },
    {
      stage: 'pictorial',
      prompt: '47300 is nearer to 47000.',
      visual: { kind: 'number-line', min: 47000, max: 48000, value: 47300, marks: [47500] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Halfway goes up.',
      visual: { kind: 'number-line', min: 47000, max: 48000, value: 47500, marks: [47500] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      distractorUnit: 1000,
      skill: 'round-thousand',
      params: { t: [10, 99], h: [1, 9] },
      answer: (p) => Math.round(((p.t as number) * 1000 + (p.h as number) * 100) / 1000) * 1000,
      text: (p) =>
        `Round ${(p.t as number) * 1000 + (p.h as number) * 100} to the nearest thousand.`,
      distractors: 'near',
      // Miskonsepsi khas: ratusan selalu dibuang, tidak pernah dibulatkan naik.
      misconception: (p) => (p.t as number) * 1000,
    },
    {
      // Jawaban 11–100: aman untuk keypad 3 digit.
      type: 'missing-number',
      skill: 'round-thousand',
      params: { t: [10, 99] },
      answer: (p) => (p.t as number) + 1,
      text: (p) => `${(p.t as number) * 1000 + 600} rounds up to ? thousands`,
    },
  ],
};
