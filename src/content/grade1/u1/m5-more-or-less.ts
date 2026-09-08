import type { ContentModule } from '../../types';

export const moreOrLess: ContentModule = {
  id: 'g1-u1-m5',
  unitId: 'g1-u1',
  grade: 1,
  title: 'More or Less',
  icon: '⚖️',
  prereq: ['g1-u1-m3'],
  skills: ['compare-to-10'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['compare-symbol', 'choose-number'],
  visuals: ['ten-frame', 'counter-objects'],
  vocab: ['more', 'less', 'same', 'bigger', 'smaller', 'means'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Make more than three.',
      visual: { kind: 'counter-objects', count: 8, icon: '🍓' },
      action: 'tap-count',
      target: 4,
      hint: 'More means a bigger number.',
    },
    {
      stage: 'pictorial',
      prompt: 'Six is more than four.',
      visual: { kind: 'ten-frame', value: 6, split: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 6 > 4.',
      visual: { kind: 'ten-frame', value: 6, split: 4 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'compare-symbol',
      skill: 'compare-to-10',
      // Jawaban: -1 berarti "<", 0 berarti "=", 1 berarti ">".
      params: { a: [1, 10], b: [1, 10] },
      answer: (p) => Math.sign((p.a as number) - (p.b as number)),
      text: (p) => `${p.a} ? ${p.b}`,
    },
    {
      type: 'choose-number',
      skill: 'compare-to-10',
      params: { a: [2, 10], b: [1, 9] },
      answer: (p) => Math.max(p.a as number, p.b as number),
      text: (p) => `Which is more: ${p.a} or ${p.b}?`,
      exclude: (p) => p.a === p.b,
      distractors: 'near',
      misconception: (p) => Math.min(p.a as number, p.b as number),
    },
  ],
};
