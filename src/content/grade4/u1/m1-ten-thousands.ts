import type { ContentModule } from '../../types';

export const tenThousands: ContentModule = {
  id: 'g4-u1-m1',
  unitId: 'g4-u1',
  grade: 4,
  title: 'Ten Thousands',
  icon: '🏙️',
  // Kelas 4 harus bisa dimasuki langsung, tanpa menempuh kelas sebelumnya.
  prereq: [],
  skills: ['ten-thousands'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'missing-number'],
  visuals: ['number-line'],
  vocab: ['thousand', 'thousands'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 5000 on the line.',
      visual: { kind: 'number-line', min: 0, max: 10000, value: null },
      action: 'drop-on-line',
      target: 5000,
      hint: 'Five thousands.',
    },
    {
      stage: 'pictorial',
      prompt: 'Ten thousands make 10000.',
      visual: { kind: 'number-line', min: 0, max: 10000, value: 10000, marks: [5000] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Ten of those make 100000.',
      visual: { kind: 'number-line', min: 0, max: 100000, value: 100000, marks: [50000] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      distractorUnit: 10000,
      skill: 'ten-thousands',
      params: { t: [1, 9] },
      answer: (p) => (p.t as number) * 10000,
      text: (p) => `${p.t} ten thousands = ?`,
      distractors: 'near',
      // Miskonsepsi khas: "ten thousand" dibaca sebagai seribu — satu nol hilang.
      misconception: (p) => (p.t as number) * 1000,
    },
    {
      type: 'missing-number',
      distractorUnit: 10,
      skill: 'ten-thousands',
      params: { t: [1, 9] },
      answer: (p) => (p.t as number) * 10,
      text: (p) => `? thousands = ${(p.t as number) * 10000}`,
    },
  ],
};
