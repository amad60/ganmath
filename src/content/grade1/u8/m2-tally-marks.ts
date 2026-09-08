import type { ContentModule } from '../../types';

export const tallyMarks: ContentModule = {
  id: 'g1-u8-m2',
  unitId: 'g1-u8',
  grade: 1,
  title: 'Tally Marks',
  icon: '✍️',
  prereq: ['g1-u5-m3'],
  skills: ['tally'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['tally-chart'],
  vocab: ['tally', 'group', 'groups', 'mark', 'marks'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five marks.',
      visual: { kind: 'counter-objects', count: 7, icon: '✏️' },
      action: 'tap-count',
      target: 5,
      hint: 'Five make one group.',
    },
    {
      stage: 'pictorial',
      prompt: 'Four marks, then one across.',
      visual: { kind: 'tally', count: 5 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Groups of five are faster to count.',
      visual: { kind: 'tally', count: 12 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'tally',
      params: { n: [3, 20] },
      answer: (p) => p.n as number,
      text: () => 'How many marks?',
      visual: (p) => ({ kind: 'tally', count: p.n as number }),
      distractors: 'near',
      misconception: (p) => Math.ceil((p.n as number) / 5), // menghitung kelompok, bukan garis
    },
    {
      type: 'keypad',
      skill: 'tally',
      params: { g: [1, 4], r: [0, 4] },
      answer: (p) => (p.g as number) * 5 + (p.r as number),
      text: (p) => `${p.g} groups of five and ${p.r} more. How many?`,
    },
  ],
};
