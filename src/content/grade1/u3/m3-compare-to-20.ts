import type { ContentModule } from '../../types';

export const compareTo20: ContentModule = {
  id: 'g1-u3-m3',
  unitId: 'g1-u3',
  grade: 1,
  title: 'Compare to 20',
  icon: '⚖️',
  prereq: ['g1-u3-m2'],
  skills: ['compare-to-20'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['compare-symbol', 'choose-number'],
  visuals: ['base10-blocks', 'number-line'],
  vocab: ['fifteen'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill fifteen boxes.',
      visual: { kind: 'ten-frame', value: 0, capacity: 20 },
      action: 'tap-fill',
      target: 15,
      hint: 'Ten and five.',
    },
    {
      stage: 'pictorial',
      // 15 dan 12 sama-sama satu puluhan — yang membedakan satuannya.
      prompt: 'Same tens. More ones is bigger.',
      visual: { kind: 'bars', values: [15, 12], labels: ['15', '12'], showValues: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 15 > 12.',
      visual: { kind: 'bars', values: [15, 12], labels: ['15', '12'], showValues: true },
      action: 'watch',
    },
    {
      // Soal compare-symbol juga berjawaban < dan =.
      stage: 'abstract',
      prompt: 'Twelve is less than fifteen: 12 < 15.',
      visual: { kind: 'bars', values: [12, 15], labels: ['12', '15'], showValues: true },
      action: 'watch',
      caption: '12 < 15',
    },
    {
      stage: 'abstract',
      prompt: 'Same tens, same ones: 14 = 14.',
      visual: { kind: 'bars', values: [14, 14], labels: ['14', '14'], showValues: true },
      action: 'watch',
      caption: '14 = 14',
    },
  ],

  rules: [
    {
      type: 'compare-symbol',
      skill: 'compare-to-20',
      params: { a: [10, 20], b: [10, 20] },
      answer: (p) => Math.sign((p.a as number) - (p.b as number)),
      text: (p) => `${p.a} ? ${p.b}`,
    },
    {
      type: 'choose-number',
      skill: 'compare-to-20',
      params: { a: [11, 20], b: [10, 19] },
      answer: (p) => Math.max(p.a as number, p.b as number),
      text: (p) => `Which is bigger: ${p.a} or ${p.b}?`,
      exclude: (p) => p.a === p.b,
      distractors: 'near',
      misconception: (p) => Math.min(p.a as number, p.b as number),
    },
  ],
};
