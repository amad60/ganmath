import type { ContentModule } from '../../types';

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

const allUnique = (o: string[]) => new Set(o).size === o.length;

/** Pilihan "rasio yang senilai", dipakai bersama oleh `options` dan `exclude`. */
const equalOptions = (a: number, b: number, k: number) => [
  `${a * k} : ${b * k}`,
  `${a + k} : ${b + k}`,
  `${a * k} : ${b}`,
  `${a} : ${b * k}`,
];

/**
 * Rasio senilai — arah kebalikan `m2`. Kalau menyederhanakan berarti membagi
 * kedua sisi, maka menaikkan berarti mengalikan kedua sisi, dan nilainya tetap.
 *
 * Ini pecahan senilai (`g4-u4-m2`) yang dituliskan dengan titik dua. Sengaja
 * dikatakan begitu, karena anak sudah menguasainya di sana: yang dilatih di sini
 * bukan tekniknya, melainkan satu kesalahan berpikir yang khas rasio dan sangat
 * keras kepala — **menambah, bukan mengalikan**. Anak yang melihat 2 : 3 menjadi
 * 6 : ? menjawab 7, karena "yang satu naik empat, jadi yang lain naik empat juga".
 *
 * Kesalahan itu tidak bisa dikoreksi dengan penjelasan; ia harus ditabrakkan
 * dengan jawabannya sendiri. Karena itu aturan `choose-number` menaruh persis
 * jawaban aditif itu (`b + a·(k−1)`) sebagai pengecoh miskonsepsi, dan aturan
 * `choose-text` menaruh `a+k : b+k` sebagai pilihan kedua. Anak yang berpikir
 * aditif akan menemukan jawabannya ada di tombol — dan salah.
 *
 * Batangnya lagi-lagi model perbandingan, bukan grafik: 1 : 3 dan 2 : 6 digambar
 * dengan pembagian batang yang sama, karena memang perbandingannya yang sama.
 */
export const equalRatios: ContentModule = {
  id: 'g6-u2-m3',
  unitId: 'g6-u2',
  grade: 6,
  title: 'Equal Ratios',
  icon: '🟰',
  prereq: ['g6-u2-m2'],
  skills: ['equal-ratios'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['missing-number', 'keypad', 'choose-number', 'choose-text'],
  visuals: ['counter-objects', 'bar-model', 'number-bond'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap two of eight dots.',
      visual: { kind: 'counter-objects', count: 8, icon: '🟢' },
      action: 'tap-count',
      target: 2,
      hint: 'One to three is two to six.',
    },
    {
      stage: 'pictorial',
      prompt: 'One part to three parts.',
      visual: { kind: 'bars', lengths: [0.25, 0.75], labels: ['1', '3'] },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Times both by two: 2 : 6.',
      visual: { kind: 'bars', lengths: [0.25, 0.75], labels: ['2', '6'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '1 : 3 and 2 : 6 are equal.',
      visual: { kind: 'number-bond', whole: 4, parts: [1, 3] },
      action: 'watch',
    },
    {
      // Kalimat yang harus dibawa keluar dari modul ini, dan lawan langsung
      // dari berpikir aditif.
      stage: 'abstract',
      prompt: 'Times both parts by the same number.',
      visual: { kind: 'bars', lengths: [0.25, 0.75], labels: ['3', '9'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Sisi kedua yang hilang. Diketik, satu bilangan bulat.
      type: 'missing-number',
      skill: 'equal-ratios',
      params: { a: [1, 9], b: [1, 9], k: [2, 6] },
      answer: (p) => (p.b as number) * (p.k as number),
      text: (p) => `${p.a} : ${p.b} = ${(p.a as number) * (p.k as number)} : ?`,
      exclude: (p) => gcd(p.a as number, p.b as number) !== 1,
    },
    {
      // Sisi pertama yang hilang — arah sebaliknya, supaya anak tidak belajar
      // bahwa yang kosong selalu di belakang.
      type: 'keypad',
      skill: 'equal-ratios',
      params: { a: [1, 9], b: [1, 9], k: [2, 6] },
      answer: (p) => (p.a as number) * (p.k as number),
      text: (p) => `${p.a} : ${p.b} = ? : ${(p.b as number) * (p.k as number)}`,
      exclude: (p) => gcd(p.a as number, p.b as number) !== 1,
    },
    {
      // Rasio senilai di dalam situasi, dan di sinilah berpikir aditif dijebak:
      // `b + a·(k−1)` adalah jawaban anak yang menambahkan selisihnya alih-alih
      // mengalikan. Kalau kebetulan sama dengan jawaban benar, generator
      // membuangnya sendiri.
      type: 'choose-number',
      skill: 'equal-ratios',
      params: { a: [1, 9], b: [1, 9], k: [2, 6] },
      answer: (p) => (p.b as number) * (p.k as number),
      text: (p) =>
        `Red to blue is ${p.a} : ${p.b}. There are ` +
        `${(p.a as number) * (p.k as number)} red. How many blue?`,
      exclude: (p) => gcd(p.a as number, p.b as number) !== 1,
      distractors: 'near',
      misconception: (p) => (p.b as number) + (p.a as number) * ((p.k as number) - 1),
    },
    {
      // Bentuk rasio utuh lewat pilihan. Pengecoh kedua = berpikir aditif,
      // ketiga dan keempat = hanya satu sisi yang dikalikan.
      type: 'choose-text',
      skill: 'equal-ratios',
      params: { a: [1, 9], b: [1, 9], k: [2, 6] },
      answer: () => 0,
      text: (p) => `Which ratio is equal to ${p.a} : ${p.b}?`,
      options: (p) => equalOptions(p.a as number, p.b as number, p.k as number),
      exclude: (p) =>
        gcd(p.a as number, p.b as number) !== 1 ||
        (p.a as number) === (p.b as number) ||
        !allUnique(equalOptions(p.a as number, p.b as number, p.k as number)),
    },
  ],
};
