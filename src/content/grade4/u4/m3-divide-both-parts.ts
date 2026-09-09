import type { ContentModule } from '../../types';

/**
 * Arah sebaliknya: menggabungkan bagian-bagian kembali. Ini prasyarat langsung
 * "simplest form" di m4 — di sana anak harus memilih pembaginya sendiri, jadi di
 * sini pembaginya masih diberikan.
 */
export const divideBothParts: ContentModule = {
  id: 'g4-u4-m3',
  unitId: 'g4-u4',
  grade: 4,
  title: 'Divide Both Parts',
  icon: '➗',
  prereq: ['g4-u4-m2'],
  skills: ['equivalent-fraction-divide'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'missing-number'],
  visuals: ['fraction-shape', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap eight dots.',
      visual: { kind: 'counter-objects', count: 8, icon: '🟩' },
      action: 'tap-count',
      target: 8,
      hint: 'Join them in pairs.',
    },
    {
      stage: 'pictorial',
      prompt: 'Four of eight parts are shaded.',
      visual: { kind: 'fraction', parts: 8, shaded: 4, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Join pairs of parts: 2/4.',
      visual: { kind: 'fraction', parts: 4, shaded: 2, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Divide top and bottom by 2.',
      visual: { kind: 'fraction', parts: 2, shaded: 1, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'keypad',
      skill: 'equivalent-fraction-divide',
      params: { s: [1, 5], p: [2, 9], k: [2, 5] },
      answer: (p) => p.s as number,
      text: (p) =>
        `Divide both by ${p.k}: ${(p.s as number) * (p.k as number)}/${
          (p.p as number) * (p.k as number)
        } = ?/${p.p}`,
      exclude: (p) => (p.s as number) >= (p.p as number),
    },
    {
      type: 'choose-number',
      skill: 'equivalent-fraction-divide',
      params: { s: [1, 5], p: [2, 9], k: [2, 5] },
      answer: (p) => p.p as number,
      text: (p) =>
        `Divide both by ${p.k}: ${(p.s as number) * (p.k as number)}/${
          (p.p as number) * (p.k as number)
        } = ${p.s}/?`,
      exclude: (p) => (p.s as number) >= (p.p as number),
      distractors: 'near',
      // Miskonsepsi khas: atasnya dibagi, bawahnya dibiarkan.
      misconception: (p) => (p.p as number) * (p.k as number),
    },
    {
      type: 'missing-number',
      skill: 'equivalent-fraction-divide',
      params: { s: [1, 5], p: [2, 9], k: [2, 5] },
      answer: (p) => p.k as number,
      text: (p) =>
        `${(p.s as number) * (p.k as number)}/${(p.p as number) * (p.k as number)} = ${p.s}/${
          p.p
        }. Divide both by ?`,
      exclude: (p) => (p.s as number) >= (p.p as number),
    },
  ],
};
