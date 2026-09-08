import type { ContentModule } from '../../types';

export const readAndWrite1000: ContentModule = {
  id: 'g2-u1-m4',
  unitId: 'g2-u1',
  grade: 2,
  title: 'Read and Write',
  icon: '✏️',
  prereq: ['g2-u1-m3'],
  skills: ['read-write-1000'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks'],
  vocab: ['zero', 'holds'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 105 on the line.',
      visual: { kind: 'number-line', min: 100, max: 200, value: null },
      action: 'drop-on-line',
      target: 105,
      hint: 'One hundred and five.',
    },
    {
      stage: 'pictorial',
      prompt: 'One hundred, no tens, five ones.',
      visual: { kind: 'base10', hundreds: 1, tens: 0, ones: 5 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      // Nol sebagai penahan tempat: sumber kekeliruan terbesar saat menulis 105.
      prompt: 'Zero holds the empty place.',
      visual: { kind: 'base10', hundreds: 1, tens: 0, ones: 5 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'read-write-1000',
      params: { h: [1, 9], o: [1, 9] },
      answer: (p) => (p.h as number) * 100 + (p.o as number),
      text: () => 'How many?',
      visual: (p) => ({ kind: 'base10', hundreds: p.h as number, tens: 0, ones: p.o as number }),
      distractors: 'near',
      // menulis 15 untuk "seratus lima" — nolnya hilang
      misconception: (p) => (p.h as number) * 10 + (p.o as number),
    },
    {
      type: 'keypad',
      skill: 'read-write-1000',
      params: { h: [1, 9], t: [1, 9], o: [1, 9] },
      answer: (p) => (p.h as number) * 100 + (p.t as number) * 10 + (p.o as number),
      text: (p) => `${p.h} hundreds ${p.t} tens ${p.o} ones = ?`,
    },
  ],
};
