import type { ContentModule } from '../../types';

export const timesEight: ContentModule = {
  id: 'g3-u2-m6',
  unitId: 'g3-u2',
  grade: 3,
  title: 'Times Eight',
  icon: '8️⃣',
  prereq: ['g3-u2-m5'],
  skills: ['times-8'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Make eight rows of three.',
      visual: { kind: 'array', rows: 8, cols: 3 },
      action: 'watch',
      hint: 'Three in each row.',
    },
    {
      stage: 'pictorial',
      prompt: 'Eight rows of three is twenty four.',
      visual: { kind: 'array', rows: 8, cols: 3, still: true, highlightRow: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Double, double, double.',
      visual: { kind: 'array', rows: 8, cols: 3, still: true, gapAfter: 3 },
      action: 'watch',
      caption: '3 → 6 → 12 → 24',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'times-8',
      params: { n: [1, 10] },
      answer: (p) => (p.n as number) * 8,
      text: (p) => `8 × ${p.n} = ?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) * 4, // baru dua kali menggandakan
    },
    {
      type: 'keypad',
      skill: 'times-8',
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 8,
      text: (p) => `${p.n} × 8 = ?`,
    },
    {
      type: 'keypad',
      skill: 'times-8',
      story: true,
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 8,
      text: (p) => `${p.n} boxes. 8 pencils in each box. How many pencils?`,
    },
    {
      type: 'keypad',
      skill: 'times-8',
      story: true,
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 8,
      text: (p) => `A shop has ${p.n} shelves. 8 books on each shelf. How many books?`,
    },
  ],
};
