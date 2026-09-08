import type { ContentModule } from '../../types';

export const nameTheFraction: ContentModule = {
  id: 'g3-u5-m2',
  unitId: 'g3-u5',
  grade: 3,
  title: 'Name the Fraction',
  icon: '🏷️',
  prereq: ['g3-u5-m1'],
  skills: ['name-fraction'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['fraction-shape'],
  vocab: ['top', 'bottom'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap one part.',
      visual: { kind: 'counter-objects', count: 4, icon: '🍫' },
      action: 'tap-count',
      target: 1,
      hint: 'One part of four.',
    },
    {
      stage: 'pictorial',
      prompt: 'One of four equal parts is shaded.',
      visual: { kind: 'fraction', parts: 4, shaded: 1, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Top counts shaded. Bottom counts parts.',
      visual: { kind: 'fraction', parts: 4, shaded: 3, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'name-fraction',
      params: { p: [2, 6], s: [1, 5] },
      // Pilihan dibuat dari soal itu sendiri, jadi jawabannya selalu indeks 0
      // setelah diacak layar soal — bukan pola yang bisa dihafal anak.
      answer: () => 0,
      text: () => 'How much is shaded?',
      visual: (p) => ({ kind: 'fraction', parts: p.p as number, shaded: p.s as number }),
      exclude: (p) => (p.s as number) >= (p.p as number),
      options: (p) => [
        `${p.s}/${p.p}`,
        `${p.p}/${p.s}`,
        `${(p.s as number) + 1}/${p.p}`,
        `${p.s}/${(p.p as number) + 1}`,
      ],
    },
    {
      type: 'choose-number',
      skill: 'name-fraction',
      params: { p: [2, 8], s: [1, 7] },
      answer: (p) => p.s as number,
      text: () => 'How many parts are shaded?',
      visual: (p) => ({ kind: 'fraction', parts: p.p as number, shaded: p.s as number }),
      exclude: (p) => (p.s as number) >= (p.p as number),
      distractors: 'near',
      misconception: (p) => p.p as number, // menyebut jumlah seluruh bagian
    },
  ],
};
