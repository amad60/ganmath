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
      visual: { kind: 'bars', lengths: [0.5], labels: ['A'] },
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
      skill: 'estimate',
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 10,
      text: (p) => `About ${p.n} tens. About how many?`,
      distractors: 'near',
      misconception: (p) => p.n as number,
    },
    {
      type: 'choose-text',
      skill: 'estimate',
      params: { i: [0, 3] },
      answer: (p) => ((p.i as number) < 2 ? 0 : 1),
      text: (p) =>
        `Is ${(['your thumb', 'a crayon', 'a door', 'a car'] as const)[p.i as number]} about centimetres or metres?`,
      options: () => ['centimetres', 'metres', 'both', 'neither'],
    },
  ],
};
