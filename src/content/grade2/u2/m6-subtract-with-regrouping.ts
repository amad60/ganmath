import type { ContentModule } from '../../types';

export const subtractWithRegrouping: ContentModule = {
  id: 'g2-u2-m6',
  unitId: 'g2-u2',
  grade: 2,
  title: 'Subtract with Regrouping',
  icon: '🍁',
  prereq: ['g2-u2-m5', 'g2-u2-m4'],
  skills: ['sub-regroup'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks'],
  vocab: ['borrow', 'open', 'opened'],
  masteryOverride: { accuracy: 0.9 },

  learn: [
    {
      stage: 'concrete',
      prompt: 'Fill ten boxes.',
      visual: { kind: 'ten-frame', value: 0 },
      action: 'tap-fill',
      target: 10,
      hint: 'One ten opens into ten ones.',
    },
    {
      stage: 'pictorial',
      prompt: 'Open one ten into ten ones.',
      visual: { kind: 'base10', tens: 2, ones: 13 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 52 - 27 = 25.',
      visual: { kind: 'base10', tens: 2, ones: 5 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'sub-regroup',
      params: { a: [21, 99], b: [12, 89] },
      answer: (p) => (p.a as number) - (p.b as number),
      text: (p) => `${p.a} - ${p.b} = ?`,
      exclude: (p) =>
        (p.b as number) > (p.a as number) || ((p.a as number) % 10) >= ((p.b as number) % 10),
      distractors: 'near',
      // mengurangi angka kecil dari angka besar di tiap kolom: 52-27 jadi 35
      misconception: (p) =>
        Math.abs(Math.floor((p.a as number) / 10) - Math.floor((p.b as number) / 10)) * 10 +
        Math.abs(((p.a as number) % 10) - ((p.b as number) % 10)),
    },
    {
      type: 'keypad',
      skill: 'sub-regroup',
      params: { a: [31, 95], b: [13, 68] },
      answer: (p) => (p.a as number) - (p.b as number),
      text: (p) => `${p.a} - ${p.b} = ?`,
      exclude: (p) =>
        (p.b as number) > (p.a as number) || ((p.a as number) % 10) >= ((p.b as number) % 10),
    },
  ],
};
