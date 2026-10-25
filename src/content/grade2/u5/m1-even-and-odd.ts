import { pl } from '../../plural';
import type { ContentModule } from '../../types';

export const evenAndOdd: ContentModule = {
  id: 'g2-u5-m1',
  unitId: 'g2-u5',
  grade: 2,
  title: 'Even and Odd',
  icon: '👣',
  prereq: ['g2-u4-m3'],
  skills: ['even-odd'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['array-grid'],
  vocab: ['even', 'odd', 'pair', 'pairs', 'partner', 'left over'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap six dots.',
      visual: { kind: 'counter-objects', count: 8, icon: '🔵' },
      action: 'tap-count',
      target: 6,
      hint: 'Can they all find a partner?',
    },
    {
      stage: 'pictorial',
      // Dua baris rata = genap. Baris yang tidak rata = ganjil. Terlihat, bukan dihafal.
      prompt: 'Six makes two equal rows.',
      visual: { kind: 'array', rows: 2, cols: 3, still: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      // Dulu 2 × 3 = 6 (genap) — tidak ada yang tersisa di gambarnya.
      prompt: 'Odd numbers have one left over.',
      visual: { kind: 'counter-objects', count: 7, icon: '🔵', columns: 2 },
      caption: '7',
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'even-odd',
      params: { n: [1, 40], k: [0, 1] },
      answer: (p) => ((p.n as number) % 2 === 0 ? 0 : 1),
      text: (p) => `Is ${p.n} even or odd?`,
      exclude: (p) => (p.k as number) !== 0,
      options: () => ['even', 'odd', 'both', 'neither'],
    },
    {
      type: 'choose-number',
      skill: 'even-odd',
      params: { n: [1, 20] },
      answer: (p) => (p.n as number) * 2,
      text: (p) => `${pl(p.n as number, 'pair')}. How many altogether?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) + 2,
    },
  ],
};
