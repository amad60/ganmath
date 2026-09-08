import type { ContentModule } from '../../types';

/**
 * Inti Grade 2. "Menyimpan" dijelaskan lewat blok: sepuluh satuan berkumpul jadi
 * satu batang puluhan — itu yang membuat aturannya masuk akal, bukan dihafal.
 */
export const addWithRegrouping: ContentModule = {
  id: 'g2-u2-m4',
  unitId: 'g2-u2',
  grade: 2,
  title: 'Add with Regrouping',
  icon: '🔀',
  prereq: ['g2-u2-m3'],
  skills: ['add-regroup'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks'],
  vocab: ['regroup', 'regrouping', 'carry'],
  masteryOverride: { accuracy: 0.9 },

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill ten boxes.',
      visual: { kind: 'ten-frame', value: 0 },
      action: 'tap-fill',
      target: 10,
      hint: 'Ten ones become one ten.',
    },
    {
      stage: 'pictorial',
      prompt: 'Ten ones become one ten.',
      visual: { kind: 'base10', tens: 8, ones: 5 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 47 + 38 = 85.',
      visual: { kind: 'base10', tens: 8, ones: 5 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'add-regroup',
      params: { a: [15, 89], b: [15, 89] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: (p) => `${p.a} + ${p.b} = ?`,
      // wajib menyimpan, dan hasilnya tetap di bawah 100
      exclude: (p) =>
        ((p.a as number) % 10) + ((p.b as number) % 10) < 10 ||
        (p.a as number) + (p.b as number) > 99,
      distractors: 'near',
      // menulis satuan tanpa menyimpan: 47+38 jadi 715
      misconception: (p) =>
        (Math.floor((p.a as number) / 10) + Math.floor((p.b as number) / 10)) * 10 +
        (((p.a as number) % 10) + ((p.b as number) % 10)) -
        10,
    },
    {
      type: 'keypad',
      skill: 'add-regroup',
      params: { a: [16, 79], b: [16, 79] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: (p) => `${p.a} + ${p.b} = ?`,
      exclude: (p) =>
        ((p.a as number) % 10) + ((p.b as number) % 10) < 10 ||
        (p.a as number) + (p.b as number) > 99,
    },
  ],
};
