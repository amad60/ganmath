import type { ContentModule } from '../../types';

/** Banyaknya faktor sebuah bilangan. Prima = tepat dua. */
function factorCount(n: number): number {
  let count = 0;
  for (let d = 1; d <= n; d++) if (n % d === 0) count++;
  return count;
}

/** Faktor terkecil di atas 1. Sama dengan n sendiri kalau n prima. */
function smallestFactor(n: number): number {
  for (let d = 2; d <= n; d++) if (n % d === 0) return d;
  return n;
}

/**
 * Prima & komposit, dibangun dari dua modul sebelumnya: prima adalah bilangan
 * yang daftar faktornya berhenti di 1 dan dirinya sendiri.
 *
 * Definisinya sengaja diuji lewat MENGHITUNG faktor, bukan lewat menghafal daftar
 * bilangan prima — kalau anak menghafal daftarnya, dia tidak akan bisa memakainya
 * pada bilangan yang tidak ada di daftar itu.
 */
export const primeOrNot: ContentModule = {
  id: 'g4-u3-m4',
  unitId: 'g4-u3',
  grade: 4,
  title: 'Prime or Not',
  icon: '🔑',
  prereq: ['g4-u3-m3'],
  skills: ['prime'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid', 'counter-objects'],
  vocab: ['prime'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap seven dots.',
      visual: { kind: 'counter-objects', count: 7, icon: '🔴' },
      action: 'tap-count',
      target: 7,
      hint: 'Only one row of seven.',
    },
    {
      stage: 'pictorial',
      prompt: 'Seven makes only one row.',
      visual: { kind: 'array', rows: 1, cols: 7 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Twelve makes many rows. Not prime.',
      visual: { kind: 'array', rows: 3, cols: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Prime numbers have only two factors.',
      visual: { kind: 'array', rows: 1, cols: 7 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'prime',
      params: { n: [2, 30] },
      answer: (p) => factorCount(p.n as number),
      text: (p) => `How many factors has ${p.n}?`,
      distractors: 'near',
      // Miskonsepsi khas: setiap bilangan dianggap punya dua faktor saja.
      misconception: () => 2,
    },
    {
      // Uji prima yang sebenarnya: cari pembagi pertama di atas 1. Kalau tidak
      // ketemu sampai bilangannya sendiri, bilangan itu prima.
      //
      // Bilangannya SELALU ganjil (n = 2k + 1, jadi 9 sampai 49). Kalau bilangan
      // genap ikut masuk, separuh soal berjawaban 2 dan anak bisa lulus dengan
      // mengetik 2 terus tanpa menguji apa pun.
      type: 'keypad',
      skill: 'prime',
      params: { k: [4, 24] },
      answer: (p) => smallestFactor(2 * (p.k as number) + 1),
      text: (p) => `What is the smallest factor of ${2 * (p.k as number) + 1} above 1?`,
    },
  ],
};
