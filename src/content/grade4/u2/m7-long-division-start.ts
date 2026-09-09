import type { ContentModule } from '../../types';

/**
 * Pembagian panjang awal: pembagi satu digit, yang dibagi tiga digit.
 * Aturan pertama berhasil bagi dua digit (375 ÷ 5), aturan kedua tiga digit
 * (996 ÷ 4) — jadi anak harus benar-benar mengerjakan tiap tempat, bukan
 * menebak panjang jawabannya.
 */
export const longDivisionStart: ContentModule = {
  id: 'g4-u2-m7',
  unitId: 'g4-u2',
  grade: 4,
  title: 'Long Division Start',
  icon: '🪜',
  prereq: ['g4-u2-m6'],
  skills: ['long-division'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['base10-blocks', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twenty dots.',
      visual: { kind: 'counter-objects', count: 20, icon: '🔵' },
      action: 'tap-count',
      target: 20,
      hint: 'Five rows of four.',
    },
    {
      stage: 'pictorial',
      prompt: 'Split 468 into 400, 60 and 8.',
      visual: { kind: 'base10', hundreds: 4, tens: 6, ones: 8 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Divide the hundreds, then tens, then ones.',
      visual: { kind: 'base10', hundreds: 4, tens: 6, ones: 8 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Yang dibagi selalu tiga digit, hasil baginya dua digit.
      type: 'choose-number',
      skill: 'long-division',
      params: { q: [12, 99], d: [3, 9] },
      answer: (p) => p.q as number,
      text: (p) => `${(p.q as number) * (p.d as number)} ÷ ${p.d} = ?`,
      exclude: (p) => {
        const n = (p.q as number) * (p.d as number);
        return n < 100 || n > 999 || (p.q as number) % 10 === 0;
      },
      distractors: 'near',
      // Miskonsepsi khas: langkah terakhir dilewat — satuan hasil bagi jadi nol.
      misconception: (p) => Math.floor((p.q as number) / 10) * 10,
    },
    {
      // Hasil bagi tiga digit: tiap tempat harus dikerjakan.
      type: 'keypad',
      skill: 'long-division',
      params: { q: [102, 249], d: [2, 4] },
      answer: (p) => p.q as number,
      text: (p) => `Share ${(p.q as number) * (p.d as number)} between ${p.d}.`,
    },
  ],
};
