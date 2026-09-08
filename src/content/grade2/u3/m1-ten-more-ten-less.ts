import type { ContentModule } from '../../types';

export const tenMoreLess100: ContentModule = {
  id: 'g2-u3-m1',
  unitId: 'g2-u3',
  grade: 2,
  title: 'Ten More, Ten Less',
  icon: '🎈',
  prereq: ['g2-u2-m1'],
  skills: ['mental-ten'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks', 'number-line'],
  vocab: ['mind', 'head'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 60 on the line.',
      visual: { kind: 'number-line', min: 0, max: 100, value: null },
      action: 'drop-on-line',
      target: 60,
      hint: 'Six tens.',
    },
    {
      stage: 'pictorial',
      prompt: 'One more ten, same ones.',
      visual: { kind: 'base10', tens: 7, ones: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Do it in your head.',
      visual: { kind: 'base10', tens: 7, ones: 4 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'mental-ten',
      params: { n: [15, 89] },
      answer: (p) => (p.n as number) + 10,
      text: (p) => `Ten more than ${p.n} = ?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) + 1,
    },
    {
      type: 'keypad',
      skill: 'mental-ten',
      params: { n: [25, 99] },
      answer: (p) => (p.n as number) - 10,
      text: (p) => `Ten less than ${p.n} = ?`,
    },
  ],
};
