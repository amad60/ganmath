import type { ContentModule } from '../../types';

export const estimateLength: ContentModule = {
  id: 'g2-u6-m5',
  unitId: 'g2-u6',
  grade: 2,
  title: 'Estimate Length',
  icon: '👀',
  prereq: ['g2-u6-m4'],
  skills: ['estimate'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'choose-text'],
  visuals: ['bar-model'],
  vocab: ['guess', 'close', 'about'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four blocks.',
      visual: { kind: 'counter-objects', count: 8, icon: '🟩' },
      action: 'tap-count',
      target: 4,
      hint: 'Guess first, then check.',
    },
    {
      stage: 'pictorial',
      prompt: 'About five centimetres.',
      visual: { kind: 'bars', values: [5], max: 10, labels: ['A'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A good guess is close enough.',
      visual: { kind: 'number-line', min: 0, max: 10, value: 5 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      distractorUnit: 10,
      skill: 'estimate',
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 10,
      text: (p) => `A rope is about ${p.n} tens of centimetres long. About how many centimetres?`,
      distractors: 'near',
      misconception: (p) => p.n as number,
    },
    {
      type: 'choose-text',
      skill: 'estimate',
      params: { i: [0, 3] },
      answer: (p) => ((p.i as number) < 2 ? 0 : 1),
      text: (p) =>
        `Do we measure ${(['your thumb', 'a crayon', 'a door', 'a car'] as const)[p.i as number]} in centimetres or metres?`,
      options: () => ['centimetres', 'metres', 'both', 'neither'],
    },
  ],
};
