import type { ContentModule } from '../../types';

export const numbersTo1000000: ContentModule = {
  id: 'g4-u1-m2',
  unitId: 'g4-u1',
  grade: 4,
  title: 'Numbers to 1.000.000',
  icon: '🗺️',
  prereq: ['g4-u1-m1'],
  skills: ['place-value-1000000'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks', 'number-line'],
  vocab: ['hundred', 'thousands'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 20000 on the line.',
      visual: { kind: 'number-line', min: 0, max: 100000, value: null },
      action: 'drop-on-line',
      target: 20000,
      hint: 'Two ten thousands.',
    },
    {
      stage: 'pictorial',
      prompt: 'Hundred thousands, ten thousands, thousands.',
      visual: { kind: 'base10', hundreds: 3, tens: 4, ones: 2 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 342000.',
      visual: { kind: 'base10', hundreds: 3, tens: 4, ones: 2 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      distractorUnit: 10000,
      skill: 'place-value-1000000',
      params: { ht: [1, 9], t: [0, 9] },
      answer: (p) => (p.ht as number) * 100000 + (p.t as number) * 10000,
      text: (p) => `${p.ht} hundred thousands and ${p.t} ten thousands = ?`,
      distractors: 'digit-swap',
      // Miskonsepsi khas: tiap tempat digeser satu nol ke bawah.
      misconception: (p) => (p.ht as number) * 10000 + (p.t as number) * 1000,
    },
    {
      // Jawaban sengaja dijaga ≤ 2 digit: keypad app ini menerima 3 digit.
      type: 'keypad',
      skill: 'place-value-1000000',
      params: { ht: [1, 9], t: [0, 9] },
      answer: (p) => (p.ht as number) * 10 + (p.t as number),
      text: (p) =>
        `How many ten thousands in ${(p.ht as number) * 100000 + (p.t as number) * 10000}?`,
    },
  ],
};
