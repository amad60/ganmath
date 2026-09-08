import type { ContentModule } from '../../types';

export const hundreds: ContentModule = {
  id: 'g2-u1-m1',
  unitId: 'g2-u1',
  grade: 2,
  title: 'Hundreds',
  icon: '🧱',
  // Modul pembuka Grade 2 TIDAK boleh bergantung pada Grade 1: anak kelas 2 harus
  // bisa langsung masuk tanpa menempuh seluruh kelas sebelumnya.
  prereq: [],
  skills: ['hundreds'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'missing-number'],
  visuals: ['base10-blocks'],
  vocab: ['hundred', 'hundreds', 'flat', 'flats'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill ten boxes.',
      visual: { kind: 'ten-frame', value: 0 },
      action: 'tap-fill',
      target: 10,
      hint: 'Ten ones make one ten.',
    },
    {
      stage: 'pictorial',
      prompt: 'Ten tens make one hundred.',
      visual: { kind: 'base10', hundreds: 1, tens: 0, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 100.',
      visual: { kind: 'base10', hundreds: 1, tens: 0, ones: 0 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'hundreds',
      params: { h: [1, 9] },
      answer: (p) => (p.h as number) * 100,
      text: () => 'How many?',
      visual: (p) => ({ kind: 'base10', hundreds: p.h as number, tens: 0, ones: 0 }),
      distractors: 'near',
      misconception: (p) => (p.h as number) * 10, // membaca lempeng sebagai puluhan
    },
    {
      type: 'missing-number',
      skill: 'hundreds',
      params: { h: [1, 9] },
      answer: (p) => (p.h as number) * 10,
      text: (p) => `? tens = ${(p.h as number) * 100}`,
    },
  ],
};
