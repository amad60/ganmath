import type { ContentModule } from '../../types';

const NOTES = [1000, 2000, 5000, 10000, 20000];
const rp = (v: number) => `Rp${v.toLocaleString('id-ID')}`;

function sumOptions(a: number, b: number, correctAt: number): string[] {
  const correct = a + b;
  const cands = [a, b, Math.abs(a - b) || a * 2, correct + a].filter(
    (v, i, arr) => v !== correct && v > 0 && arr.indexOf(v) === i,
  );
  const out: string[] = [];
  let ci = 0;
  for (let i = 0; i < 4; i++) {
    out.push(i === correctAt ? rp(correct) : rp(cands[ci++] ?? correct + 1000 * (i + 1)));
  }
  return out;
}

export const moneyTo20000: ContentModule = {
  id: 'g2-u7-m3',
  unitId: 'g2-u7',
  grade: 2,
  title: 'Money to 20.000',
  icon: '💰',
  prereq: ['g2-u1-m3'],
  skills: ['money-2'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['money'],
  vocab: ['money', 'note', 'notes', 'buy', 'cost'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap two notes.',
      visual: { kind: 'counter-objects', count: 4, icon: '💵' },
      action: 'tap-count',
      target: 2,
      hint: 'Add the bigger note first.',
    },
    {
      stage: 'pictorial',
      prompt: 'Five thousand and two thousand.',
      visual: { kind: 'money', items: [5000, 2000] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Together that is seven thousand.',
      visual: { kind: 'money', items: [5000, 2000] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'money-2',
      params: { i: [0, 4], j: [0, 4], k: [0, 3] },
      answer: (p) => p.k as number,
      text: () => 'How much money?',
      visual: (p) => ({
        kind: 'money',
        items: [NOTES[p.i as number] ?? 0, NOTES[p.j as number] ?? 0],
      }),
      exclude: (p) => (p.i as number) > (p.j as number),
      options: (p) => sumOptions(NOTES[p.i as number] ?? 0, NOTES[p.j as number] ?? 0, p.k as number),
    },
    {
      type: 'choose-number',
      skill: 'money-2',
      params: { n: [2, 6] },
      answer: (p) => p.n as number,
      text: () => 'How many notes?',
      visual: (p) => ({
        kind: 'money',
        items: Array.from({ length: p.n as number }, (_, i) => NOTES[i % NOTES.length] ?? 1000),
      }),
      distractors: 'near',
    },
  ],
};
