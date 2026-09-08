import type { ContentModule } from '../../types';

const FRUITS = [
  { label: 'apple', icon: '🍎' },
  { label: 'banana', icon: '🍌' },
  { label: 'grape', icon: '🍇' },
];

export const pictureGraph: ContentModule = {
  id: 'g1-u8-m3',
  unitId: 'g1-u8',
  grade: 1,
  title: 'Picture Graph',
  icon: '📊',
  prereq: ['g1-u8-m2'],
  skills: ['pictogram'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['pictogram'],
  vocab: ['graph', 'most', 'fewest', 'apple', 'banana', 'grape', 'row', 'rows', 'fruit'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four apples.',
      visual: { kind: 'counter-objects', count: 6, icon: '🍎' },
      action: 'tap-count',
      target: 4,
      hint: 'One tap, one apple.',
    },
    {
      stage: 'pictorial',
      prompt: 'Each picture is one fruit.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'apple', icon: '🍎', count: 4 },
          { label: 'banana', icon: '🍌', count: 2 },
        ],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'The longest row has the most.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'apple', icon: '🍎', count: 5 },
          { label: 'banana', icon: '🍌', count: 2 },
          { label: 'grape', icon: '🍇', count: 3 },
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'pictogram',
      params: { a: [1, 6], b: [1, 6], c: [1, 6] },
      answer: (p) => {
        const v = [p.a as number, p.b as number, p.c as number];
        return v.indexOf(Math.max(...v));
      },
      text: () => 'Which has the most?',
      visual: (p) => ({
        kind: 'pictogram',
        rows: FRUITS.map((f, i) => ({
          ...f,
          count: [p.a as number, p.b as number, p.c as number][i] ?? 1,
        })),
      }),
      exclude: (p) => new Set([p.a as number, p.b as number, p.c as number]).size < 3,
      options: () => FRUITS.map((f) => f.label),
    },
    {
      type: 'choose-number',
      skill: 'pictogram',
      params: { a: [1, 6], b: [1, 6] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: () => 'How many altogether?',
      visual: (p) => ({
        kind: 'pictogram',
        rows: [
          { ...(FRUITS[0] as { label: string; icon: string }), count: p.a as number },
          { ...(FRUITS[1] as { label: string; icon: string }), count: p.b as number },
        ],
      }),
      distractors: 'near',
      misconception: (p) => Math.abs((p.a as number) - (p.b as number)),
    },
  ],
};
