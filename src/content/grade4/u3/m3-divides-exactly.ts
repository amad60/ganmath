import type { ContentModule } from '../../types';

/** Pembagi yang punya uji cepat di Grade 4. */
const DIVISORS = [2, 5, 10];

/**
 * Uji habis dibagi. Tanpa ini, mencari faktor bilangan dua digit berubah jadi
 * mencoba satu per satu — dan itulah yang bikin anak menyerah di FPB nanti.
 *
 * Dua uji diajarkan: melihat angka terakhir (2, 5, 10) dan menjumlahkan digit (3).
 * Aturan kedua sengaja hanya meminta jumlah digitnya — keputusan "habis dibagi 3"
 * baru diambil anak sesudah itu, jadi satu soal tetap satu langkah.
 */
export const dividesExactly: ContentModule = {
  id: 'g4-u3-m3',
  unitId: 'g4-u3',
  grade: 4,
  title: 'Divides Exactly',
  icon: '✅',
  prereq: ['g4-u3-m2'],
  skills: ['divides-exactly', 'digit-sum'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'keypad'],
  visuals: ['base10-blocks', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twenty dots.',
      visual: { kind: 'counter-objects', count: 20, icon: '🟢' },
      action: 'tap-count',
      target: 20,
      hint: 'Two rows of ten.',
    },
    {
      stage: 'pictorial',
      prompt: 'Thirty ends in zero.',
      visual: { kind: 'base10', tens: 3, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Ten divides thirty exactly.',
      visual: { kind: 'base10', tens: 3, ones: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Digits of 156 add to 12.',
      visual: { kind: 'base10', hundreds: 1, tens: 5, ones: 6 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Ketiga pengecoh bersisa 1 terhadap pembaginya: hanya satu pilihan yang
      // benar-benar habis dibagi, dan letaknya tidak bisa ditebak dari jaraknya.
      type: 'choose-text',
      skill: 'divides-exactly',
      params: { d: [0, 2], a: [11, 60] },
      answer: () => 0,
      text: (p) => `Which number divides exactly by ${DIVISORS[p.d as number]}?`,
      options: (p) => {
        const dv = DIVISORS[p.d as number] as number;
        const n = dv * (p.a as number);
        return [`${n}`, `${n + 1}`, `${n + dv + 1}`, `${n + 2 * dv + 1}`];
      },
    },
    {
      // Uji habis dibagi 3: jumlahkan digitnya dulu.
      type: 'keypad',
      skill: 'digit-sum',
      params: { h: [1, 9], t: [0, 9], o: [0, 9] },
      answer: (p) => (p.h as number) + (p.t as number) + (p.o as number),
      text: (p) =>
        `Add the digits of ${(p.h as number) * 100 + (p.t as number) * 10 + (p.o as number)}.`,
    },
  ],
};
