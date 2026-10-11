import type { ContentModule } from '../../types';

export const timesFour: ContentModule = {
  id: 'g3-u2-m2',
  unitId: 'g3-u2',
  grade: 3,
  title: 'Times Four',
  icon: '4️⃣',
  prereq: ['g3-u2-m1'],
  skills: ['times-4'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid'],
  vocab: ['double'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Make four rows of three.',
      visual: { kind: 'array', rows: 4, cols: 3 },
      action: 'watch',
      hint: 'Three in each row.',
    },
    {
      stage: 'pictorial',
      prompt: 'Four rows of three is twelve.',
      visual: { kind: 'array', rows: 4, cols: 3, still: true, highlightRow: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      // Dua pasang baris: 3 digandakan jadi 6, lalu 6 digandakan jadi 12.
      prompt: 'Times four is double, double.',
      visual: { kind: 'array', rows: 4, cols: 3, still: true, gapAfter: 1 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'times-4',
      params: { n: [1, 10] },
      answer: (p) => (p.n as number) * 4,
      text: (p) => `4 × ${p.n} = ?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) * 2, // baru sekali menggandakan
    },
    {
      type: 'keypad',
      skill: 'times-4',
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 4,
      text: (p) => `${p.n} × 4 = ?`,
    },
    {
      type: 'keypad',
      skill: 'times-4',
      story: true,
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 4,
      text: (p) => `${p.n} tables. 4 seats at each table. How many seats?`,
    },
    {
      type: 'keypad',
      skill: 'times-4',
      story: true,
      params: { n: [2, 10] },
      answer: (p) => (p.n as number) * 4,
      text: (p) => `A garden has ${p.n} rows. 4 flowers in each row. How many flowers?`,
    },
  ],
};
