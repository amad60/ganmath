import type { ContentModule } from '../../types';

export const addAndRegroup: ContentModule = {
  id: 'g3-u4-m3',
  unitId: 'g3-u4',
  grade: 3,
  title: 'Add and Regroup',
  icon: '🔀',
  prereq: ['g3-u4-m2'],
  skills: ['add-regroup-1000'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 180 on the line.',
      visual: { kind: 'number-line', min: 0, max: 1000, value: null, step: 20 },
      action: 'drop-on-line',
      target: 180,
      hint: 'One hundred and eight tens.',
    },
    {
      stage: 'pictorial',
      prompt: 'Ten tens make one hundred.',
      visual: { kind: 'base10', hundreds: 2, tens: 6, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '180 + 80 = 260.',
      visual: { kind: 'base10', hundreds: 2, tens: 6, ones: 0 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'add-regroup-1000',
      distractorUnit: 10,
      params: { a: [11, 60], b: [5, 39] },
      answer: (p) => ((p.a as number) + (p.b as number)) * 10,
      text: (p) => `${(p.a as number) * 10} + ${(p.b as number) * 10} = ?`,
      // Hanya soal yang BENAR-BENAR menyimpan: satuan puluhannya harus melewati sepuluh.
      exclude: (p) => ((p.a as number) % 10) + ((p.b as number) % 10) < 10,
      distractors: 'near',
      misconception: (p) => ((p.a as number) + (p.b as number)) * 10 - 100, // lupa menyimpan
    },
    {
      type: 'keypad',
      skill: 'add-regroup-1000',
      params: { a: [11, 60], b: [5, 39] },
      answer: (p) => ((p.a as number) + (p.b as number)) * 10,
      text: (p) => `${(p.b as number) * 10} + ${(p.a as number) * 10} = ?`,
      exclude: (p) => ((p.a as number) % 10) + ((p.b as number) % 10) < 10,
    },
  ],
};
