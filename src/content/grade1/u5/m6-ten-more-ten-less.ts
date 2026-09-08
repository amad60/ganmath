import type { ContentModule } from '../../types';

export const tenMoreTenLess: ContentModule = {
  id: 'g1-u5-m6',
  unitId: 'g1-u5',
  grade: 1,
  title: 'Ten More, Ten Less',
  icon: '🎈',
  prereq: ['g1-u5-m4'],
  skills: ['ten-more-less'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks', 'number-line'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 50 on the line.',
      visual: { kind: 'number-line', min: 0, max: 100, value: null },
      action: 'drop-on-line',
      target: 50,
      hint: 'Five tens.',
    },
    {
      stage: 'pictorial',
      prompt: 'One more ten makes sixty.',
      visual: { kind: 'base10', tens: 6, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Only the tens change.',
      visual: { kind: 'base10', tens: 6, ones: 4 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'ten-more-less',
      params: { n: [11, 89] },
      answer: (p) => (p.n as number) + 10,
      text: (p) => `Ten more than ${p.n} = ?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) + 1, // menambah satuan, bukan puluhan
    },
    {
      type: 'keypad',
      skill: 'ten-more-less',
      params: { n: [15, 95] },
      answer: (p) => (p.n as number) - 10,
      text: (p) => `Ten less than ${p.n} = ?`,
    },
  ],
};
