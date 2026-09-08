import type { ContentModule } from '../../types';

const rp = (v: number) => `Rp${v.toLocaleString('id-ID')}`;

export const shopping: ContentModule = {
  id: 'g3-u7-m4',
  unitId: 'g3-u7',
  grade: 3,
  title: 'Shopping',
  icon: '🛒',
  prereq: ['g3-u7-m3'],
  skills: ['money-problem'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'choose-text'],
  visuals: ['money'],
  vocab: ['each', 'enough', 'thing', 'things'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three things.',
      visual: { kind: 'counter-objects', count: 5, icon: '🍞' },
      action: 'tap-count',
      target: 3,
      hint: 'Three of the same thing.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three things at 5.000 each.',
      visual: { kind: 'money', items: [5000, 5000, 5000] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '3 × 5.000 = 15.000.',
      visual: { kind: 'money', items: [10000, 5000] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'money-problem',
      distractorUnit: 1000,
      params: { n: [2, 9], c: [1, 9] },
      answer: (p) => (p.n as number) * (p.c as number) * 1000,
      text: (p) => `${p.n} things at ${rp((p.c as number) * 1000)} each. Total?`,
      distractors: 'near',
      misconception: (p) => ((p.n as number) + (p.c as number)) * 1000, // menjumlah, bukan mengali
    },
    {
      type: 'choose-text',
      skill: 'money-problem',
      params: { n: [2, 6], c: [1, 9], pay: [2, 9] },
      answer: (p) =>
        (p.n as number) * (p.c as number) <= (p.pay as number) * 10 ? 0 : 1,
      text: (p) =>
        `You have ${rp((p.pay as number) * 10000)}. ${p.n} things at ${rp((p.c as number) * 1000)}. Enough?`,
      options: () => ['yes', 'no', 'there is no money'],
    },
  ],
};
