import type { ContentModule } from '../../types';

const rp = (v: number) => `Rp${v.toLocaleString('id-ID')}`;

export const moneyTo100000: ContentModule = {
  id: 'g3-u7-m3',
  unitId: 'g3-u7',
  grade: 3,
  title: 'Money to 100.000',
  icon: '💵',
  prereq: ['g3-u7-m2'],
  skills: ['money-100000'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['money'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap two notes.',
      visual: { kind: 'counter-objects', count: 3, icon: '💵' },
      action: 'tap-count',
      target: 2,
      hint: 'Two notes in your hand.',
    },
    {
      stage: 'pictorial',
      prompt: 'Two notes of fifty thousand.',
      visual: { kind: 'money', items: [50000, 50000] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Together they make 100.000.',
      visual: { kind: 'money', items: [50000, 50000] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'money-100000',
      params: { a: [1, 5], b: [1, 9] },
      answer: () => 0,
      text: () => 'How much money?',
      visual: (p) => ({
        kind: 'money',
        items: [
          ...Array.from({ length: p.a as number }, () => 10000),
          ...Array.from({ length: p.b as number }, () => 1000),
        ],
      }),
      options: (p) => {
        const a = p.a as number;
        const b = p.b as number;
        return [rp(a * 10000 + b * 1000), rp(a + b), rp(a * 1000 + b * 10000), rp(a * 10000)];
      },
    },
    {
      type: 'choose-number',
      skill: 'money-100000',
      distractorUnit: 1000,
      params: { a: [1, 9], b: [1, 9] },
      answer: (p) => (p.a as number) * 10000 + (p.b as number) * 1000,
      text: (p) => `${rp((p.a as number) * 10000)} and ${rp((p.b as number) * 1000)} together?`,
      distractors: 'near',
      misconception: (p) => (p.a as number) * 1000 + (p.b as number) * 10000,
    },
  ],
};
