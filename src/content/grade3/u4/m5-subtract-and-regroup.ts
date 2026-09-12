import type { ContentModule } from '../../types';

export const subtractAndRegroup: ContentModule = {
  id: 'g3-u4-m5',
  unitId: 'g3-u4',
  grade: 3,
  title: 'Subtract and Regroup',
  icon: '🧮',
  prereq: ['g3-u4-m4'],
  skills: ['sub-regroup-1000'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 320 on the line.',
      visual: { kind: 'number-line', min: 0, max: 1000, value: null, step: 20 },
      action: 'drop-on-line',
      target: 320,
      hint: 'Three hundreds and two tens.',
    },
    {
      stage: 'pictorial',
      prompt: 'Open one hundred into ten tens.',
      visual: { kind: 'base10', hundreds: 2, tens: 12, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '320 - 90 = 230.',
      visual: { kind: 'base10', hundreds: 2, tens: 3, ones: 0 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'sub-regroup-1000',
      distractorUnit: 10,
      params: { a: [31, 99], b: [5, 29] },
      answer: (p) => ((p.a as number) - (p.b as number)) * 10,
      text: (p) => `${(p.a as number) * 10} - ${(p.b as number) * 10} = ?`,
      // Hanya soal yang BENAR-BENAR meminjam.
      exclude: (p) => (p.a as number) % 10 >= (p.b as number) % 10,
      distractors: 'near',
      misconception: (p) => ((p.a as number) - (p.b as number)) * 10 + 100, // lupa meminjam
    },
    {
      type: 'keypad',
      skill: 'sub-regroup-1000',
      params: { a: [31, 99], b: [5, 29] },
      answer: (p) => ((p.a as number) - (p.b as number)) * 10,
      text: (p) => `Take ${(p.b as number) * 10} from ${(p.a as number) * 10}.`,
      exclude: (p) => (p.a as number) % 10 >= (p.b as number) % 10,
    },
    {
      type: 'keypad',
      skill: 'sub-regroup-1000',
      story: true,
      params: { a: [31, 99], b: [5, 29] },
      answer: (p) => ((p.a as number) - (p.b as number)) * 10,
      text: (p) => `Ana has ${(p.a as number) * 10} marbles. She loses ${(p.b as number) * 10}. How many left?`,
      exclude: (p) => (p.a as number) % 10 >= (p.b as number) % 10,
    },
    {
      type: 'keypad',
      skill: 'sub-regroup-1000',
      story: true,
      params: { a: [31, 99], b: [5, 29] },
      answer: (p) => ((p.a as number) - (p.b as number)) * 10,
      text: (p) => `${(p.a as number) * 10} books in a shop. The class buys ${(p.b as number) * 10}. How many left?`,
      exclude: (p) => (p.a as number) % 10 >= (p.b as number) % 10,
    },
  ],
};
