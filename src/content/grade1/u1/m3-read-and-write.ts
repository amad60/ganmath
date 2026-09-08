import type { ContentModule } from '../../types';

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

export const readAndWrite: ContentModule = {
  id: 'g1-u1-m3',
  unitId: 'g1-u1',
  grade: 1,
  title: 'Read and Write',
  icon: '🔤',
  prereq: ['g1-u1-m2'],
  skills: ['numeral-word'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'count-tap'],
  visuals: ['ten-frame', 'counter-objects'],
  vocab: ['zero', 'word', 'write'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap to make three.',
      visual: { kind: 'counter-objects', count: 6, icon: '🟡' },
      action: 'tap-count',
      target: 3,
      hint: 'Stop at three.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three dots. Three boxes.',
      visual: { kind: 'ten-frame', value: 3 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 3.',
      visual: { kind: 'ten-frame', value: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'numeral-word',
      params: { n: [0, 10] },
      answer: (p) => p.n as number,
      text: (p) => `Which one is ${WORDS[p.n as number]}?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) + 1,
    },
    {
      type: 'count-tap',
      skill: 'numeral-word',
      params: { n: [1, 10] },
      answer: (p) => p.n as number,
      text: (p) => `How many? ${'🟡'.repeat(p.n as number)}`,
    },
  ],
};
