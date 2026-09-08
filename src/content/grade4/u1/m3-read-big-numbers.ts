import type { ContentModule } from '../../types';

export const readBigNumbers: ContentModule = {
  id: 'g4-u1-m3',
  unitId: 'g4-u1',
  grade: 4,
  title: 'Read Big Numbers',
  icon: '📖',
  prereq: ['g4-u1-m2'],
  skills: ['read-1000000'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['base10-blocks', 'number-line'],
  vocab: ['part', 'parts'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 30000 on the line.',
      visual: { kind: 'number-line', min: 0, max: 100000, value: null },
      action: 'drop-on-line',
      target: 30000,
      hint: 'Three ten thousands.',
    },
    {
      stage: 'pictorial',
      prompt: 'Read the big part first.',
      visual: { kind: 'base10', hundreds: 2, tens: 4, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as 240000.',
      visual: { kind: 'base10', hundreds: 2, tens: 4, ones: 0 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Menulis: satu bilangan besar dipecah jadi nilai tiap tempatnya.
      type: 'choose-text',
      skill: 'read-1000000',
      params: { a: [1, 9], b: [1, 9] },
      answer: () => 0,
      text: (p) => `Which makes ${(p.a as number) * 100000 + (p.b as number) * 10000}?`,
      options: (p) => {
        const a = p.a as number;
        const b = p.b as number;
        return [
          `${a * 100000} + ${b * 10000}`,
          `${a * 10000} + ${b * 1000}`,
          `${a * 100000} + ${b * 1000}`,
          `${a * 10000} + ${b * 10000}`,
        ];
      },
    },
    {
      // Membaca ke arah sebaliknya: bagian-bagiannya digabung jadi satu bilangan.
      type: 'choose-number',
      distractorUnit: 1000,
      skill: 'read-1000000',
      params: { a: [1, 9], b: [1, 9], c: [1, 9] },
      answer: (p) =>
        (p.a as number) * 100000 + (p.b as number) * 10000 + (p.c as number) * 1000,
      text: (p) =>
        `${(p.a as number) * 100000} + ${(p.b as number) * 10000} + ${(p.c as number) * 1000} = ?`,
      distractors: 'near',
      // Miskonsepsi khas: nilai tempat tengah dan akhir ikut turun satu nol.
      misconception: (p) =>
        (p.a as number) * 100000 + (p.b as number) * 1000 + (p.c as number) * 100,
    },
  ],
};
