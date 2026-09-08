import type { ContentModule } from '../../types';

export const thousands: ContentModule = {
  id: 'g3-u1-m1',
  unitId: 'g3-u1',
  grade: 3,
  title: 'Thousands',
  icon: '🏔️',
  // Kelas 3 harus bisa dimasuki langsung, tanpa menempuh kelas sebelumnya.
  prereq: [],
  skills: ['thousands'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'missing-number'],
  visuals: ['base10-blocks', 'number-line'],
  vocab: ['thousand', 'thousands'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 500 on the line.',
      visual: { kind: 'number-line', min: 0, max: 1000, value: null },
      action: 'drop-on-line',
      target: 500,
      hint: 'Five hundreds.',
    },
    {
      stage: 'pictorial',
      prompt: 'Ten hundreds make one thousand.',
      visual: { kind: 'base10', hundreds: 4, tens: 0, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 1000.',
      visual: { kind: 'number-line', min: 0, max: 1000, value: 1000 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      distractorUnit: 1000,
      skill: 'thousands',
      params: { t: [1, 9] },
      answer: (p) => (p.t as number) * 1000,
      text: (p) => `${p.t} thousands = ?`,
      distractors: 'near',
      misconception: (p) => (p.t as number) * 100,
    },
    {
      type: 'missing-number',
      distractorUnit: 10,
      skill: 'thousands',
      params: { t: [1, 9] },
      answer: (p) => (p.t as number) * 10,
      text: (p) => `? hundreds = ${(p.t as number) * 1000}`,
    },
  ],
};
