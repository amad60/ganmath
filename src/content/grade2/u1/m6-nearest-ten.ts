import type { ContentModule } from '../../types';

export const nearestTen: ContentModule = {
  id: 'g2-u1-m6',
  unitId: 'g2-u1',
  grade: 2,
  title: 'Nearest Ten',
  icon: '🎯',
  prereq: ['g2-u1-m5'],
  skills: ['round-ten'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'number-line-drop'],
  visuals: ['number-line'],
  vocab: ['nearest', 'nearer', 'round', 'halfway'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 47 on the line.',
      visual: { kind: 'number-line', min: 40, max: 50, value: null },
      action: 'drop-on-line',
      target: 47,
      hint: 'Between forty and fifty.',
    },
    {
      stage: 'pictorial',
      // Garis bilangan membuat "lebih dekat ke mana" terlihat, bukan dihafal.
      prompt: '47 is nearer to 50.',
      visual: { kind: 'number-line', min: 40, max: 50, value: 47, marks: [45] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Halfway goes up.',
      visual: { kind: 'number-line', min: 40, max: 50, value: 45, marks: [45] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'round-ten',
      params: { n: [11, 99] },
      answer: (p) => Math.round((p.n as number) / 10) * 10,
      text: (p) => `Round ${p.n} to the nearest ten.`,
      exclude: (p) => (p.n as number) % 10 === 0,
      distractors: 'near',
      misconception: (p) => Math.floor((p.n as number) / 10) * 10, // selalu turun
    },
    {
      type: 'number-line-drop',
      skill: 'round-ten',
      params: { n: [1, 9] },
      range: [40, 50],
      answer: (p) => 40 + (p.n as number),
      text: (p) => `Put ${40 + (p.n as number)} on the line.`,
    },
  ],
};
