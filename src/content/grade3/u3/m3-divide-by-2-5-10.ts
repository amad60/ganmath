import type { ContentModule } from '../../types';

export const divideBy2510: ContentModule = {
  id: 'g3-u3-m3',
  unitId: 'g3-u3',
  grade: 3,
  title: 'Divide by 2, 5, 10',
  icon: '➗',
  prereq: ['g3-u3-m2'],
  skills: ['divide-2-5-10'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid'],
  vocab: ['halving', 'dividing'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap ten dots.',
      visual: { kind: 'counter-objects', count: 20, icon: '🔵' },
      action: 'tap-count',
      target: 10,
      hint: 'Two rows of five.',
    },
    {
      stage: 'pictorial',
      prompt: 'Twenty in two rows is ten.',
      visual: { kind: 'array', rows: 2, cols: 10 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Halving is dividing by two.',
      visual: { kind: 'array', rows: 2, cols: 10 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'divide-2-5-10',
      params: { d: [1, 3], n: [1, 10] },
      answer: (p) => p.n as number,
      text: (p) => {
        const d = [2, 5, 10][(p.d as number) - 1] as number;
        return `${(p.n as number) * d} ÷ ${d} = ?`;
      },
      distractors: 'near',
      misconception: (p) => (p.n as number) * 2, // menggandakan, bukan membagi
    },
    {
      type: 'keypad',
      skill: 'divide-2-5-10',
      params: { d: [1, 3], n: [2, 10] },
      answer: (p) => p.n as number,
      text: (p) => {
        const d = [2, 5, 10][(p.d as number) - 1] as number;
        return `Share ${(p.n as number) * d} between ${d}.`;
      },
    },
  ],
};
