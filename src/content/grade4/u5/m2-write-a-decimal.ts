import type { ContentModule } from '../../types';

/**
 * Notasi desimal masuk di sini, dan HANYA sebagai nama kedua untuk sesuatu yang
 * anak sudah percaya ada: 3/10 dan 0.3 adalah barang yang sama.
 *
 * Keypad app ini tidak punya titik desimal, jadi anak tidak pernah MENGETIK "0.3".
 * Yang diketik selalu bilangan bulat — banyaknya persepuluhan — sedangkan bentuk
 * desimal utuhnya selalu dipilih dari tombol teks. Itu justru pas untuk Grade 4,
 * yang tuntutannya membaca dan mengenali; menuliskan sendiri desimal baru jadi
 * tuntutan Grade 5.
 */
export const writeADecimal: ContentModule = {
  id: 'g4-u5-m2',
  unitId: 'g4-u5',
  grade: 4,
  title: 'Write a Decimal',
  icon: '✏️',
  prereq: ['g4-u5-m1'],
  skills: ['write-decimal'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'keypad'],
  visuals: ['fraction-shape', 'counter-objects'],
  vocab: ['decimal'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three of ten parts.',
      visual: { kind: 'counter-objects', count: 10, icon: '🟦' },
      action: 'tap-count',
      target: 3,
      hint: 'Three tenths in all.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three of ten parts are shaded.',
      visual: { kind: 'fraction', parts: 10, shaded: 3, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'We write 3/10 as 0.3.',
      visual: { kind: 'fraction', parts: 10, shaded: 3, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'The dot shows parts of one.',
      visual: { kind: 'fraction', parts: 10, shaded: 3, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'write-decimal',
      params: { s: [1, 9] },
      answer: () => 0,
      // Angkanya ikut ditulis di soal: teks yang tetap tanpa gambar akan
      // dipangkas generator jadi satu soal saja.
      text: (p) => `Which one is ${p.s}/10?`,
      options: (p) => [`0.${p.s}`, `${p.s}.0`, `0.0${p.s}`, `1.${p.s}`],
    },
    {
      type: 'choose-text',
      skill: 'write-decimal',
      params: { s: [1, 9] },
      answer: () => 0,
      text: (p) => `Read 0.${p.s}.`,
      options: (p) => [
        `${p.s} tenths`,
        `${p.s} ones`,
        `${p.s} hundredths`,
        `${p.s} tens`,
      ],
    },
    {
      type: 'keypad',
      skill: 'write-decimal',
      params: { s: [1, 9] },
      answer: (p) => p.s as number,
      text: (p) => `0.${p.s} = ?/10`,
    },
  ],
};
