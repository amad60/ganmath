import type { ContentModule } from '../../types';

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

const allUnique = (o: string[]) => new Set(o).size === o.length;

/** Pilihan "bentuk paling sederhana", dipakai bersama oleh `options` dan `exclude`. */
const simplestOptions = (a: number, b: number, k: number) => [
  `${a} : ${b}`,
  `${a} : ${b * k}`,
  `${a * k} : ${b}`,
  `${b} : ${a}`,
];

/**
 * Menyederhanakan rasio — dan itu bukan teknik baru sama sekali. Anak sudah
 * membagi kedua bagian sebuah pecahan di `g4-u4-m3`, sudah mencari faktor
 * persekutuan terbesar dengan mendaftar di `g4-u3-m5`, dan sudah menulis pecahan
 * bentuk paling sederhana di `g4-u4-m4`. Modul ini hanya menyatakan bahwa aturan
 * yang sama berlaku untuk `a : b`.
 *
 * Karena itu urutan materinya mundur dari yang sudah dikuasai: batang 4 : 6
 * dilihat lagi sebagai batang 2 : 3 yang sama panjangnya — perbandingannya tidak
 * berubah, hanya cara menyebutnya. Sekali lagi batang dipakai sebagai **model
 * perbandingan**, bukan grafik: dua batang dengan label berbeda tapi panjang
 * sama persis adalah gambar paling jujur untuk "rasio yang sama".
 *
 * Satu aturan sengaja menanyakan **FPB-nya sendiri** (`Biggest number that
 * divides ...`). Tanpa itu anak menyederhanakan dengan membagi dua berkali-kali
 * dan berhenti di 6 : 9 karena keduanya tidak genap — kesalahan yang sudah
 * dijawab `g4-u3`, tapi hanya kalau ia dipanggil kembali di sini.
 *
 * Yang diketik anak selalu SATU bilangan bulat (sisi pertama, sisi kedua, atau
 * pembaginya). Bentuk rasio utuh lewat `choose-text` — keypad hanya punya angka.
 */
export const simplestRatio: ContentModule = {
  id: 'g6-u2-m2',
  unitId: 'g6-u2',
  grade: 6,
  title: 'Simplest Ratio',
  icon: '✂️',
  prereq: ['g6-u2-m1'],
  skills: ['simplify-ratio'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-text', 'choose-number', 'missing-number'],
  visuals: ['counter-objects', 'bar-model', 'number-bond'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four of ten dots.',
      visual: { kind: 'counter-objects', count: 10, icon: '🟠' },
      action: 'tap-count',
      target: 4,
      hint: 'Four to six is two to three.',
    },
    {
      stage: 'pictorial',
      prompt: 'Four red parts and six blue parts.',
      visual: { kind: 'bars', lengths: [0.4, 0.6], labels: ['4', '6'] },
      action: 'watch',
    },
    {
      // Batang yang sama persis, label yang berbeda: gambar paling jujur untuk
      // "nilainya tidak berubah, hanya namanya".
      stage: 'pictorial',
      prompt: 'Same bars, now two and three.',
      visual: { kind: 'bars', lengths: [0.4, 0.6], labels: ['2', '3'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Divide both parts by two.',
      visual: { kind: 'number-bond', whole: 5, parts: [2, 3] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '2 : 3 is the simplest ratio.',
      visual: { kind: 'bars', lengths: [0.4, 0.6], labels: ['2', '3'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // `a : b` dijaga saling prima, jadi `a` benar-benar bentuk paling
      // sederhana dari `a·k`. Yang diketik satu angka: sisi pertamanya.
      type: 'keypad',
      skill: 'simplify-ratio',
      params: { a: [1, 9], b: [1, 9], k: [2, 9] },
      answer: (p) => p.a as number,
      text: (p) =>
        `Write ${(p.a as number) * (p.k as number)} : ${(p.b as number) * (p.k as number)} ` +
        `in simplest form. First number?`,
      exclude: (p) => gcd(p.a as number, p.b as number) !== 1,
    },
    {
      // Bentuk utuhnya, lewat pilihan. Pengecoh kedua dan ketiga membagi HANYA
      // satu sisi — kesalahan yang paling sering terjadi; keempat membalik
      // urutannya, menagih kembali pelajaran m1.
      type: 'choose-text',
      skill: 'simplify-ratio',
      params: { a: [1, 9], b: [1, 9], k: [2, 9] },
      answer: () => 0,
      text: (p) =>
        `Simplest form of ${(p.a as number) * (p.k as number)} : ` +
        `${(p.b as number) * (p.k as number)}?`,
      options: (p) => simplestOptions(p.a as number, p.b as number, p.k as number),
      exclude: (p) =>
        gcd(p.a as number, p.b as number) !== 1 ||
        !allUnique(simplestOptions(p.a as number, p.b as number, p.k as number)),
    },
    {
      // FPB-nya sendiri. Ini yang mencegah anak membagi dua berkali-kali lalu
      // berhenti di 6 : 9 karena keduanya sudah ganjil.
      type: 'choose-number',
      skill: 'simplify-ratio',
      params: { a: [1, 9], b: [1, 9], k: [2, 9] },
      answer: (p) => p.k as number,
      text: (p) =>
        `Biggest number that divides ${(p.a as number) * (p.k as number)} and ` +
        `${(p.b as number) * (p.k as number)}?`,
      exclude: (p) => gcd(p.a as number, p.b as number) !== 1,
      distractors: 'near',
    },
    {
      // Satu sisi sudah disederhanakan, sisi lainnya harus mengikuti. Bentuk
      // inilah yang jadi rasio senilai penuh di m3.
      type: 'missing-number',
      skill: 'simplify-ratio',
      params: { a: [1, 9], b: [1, 9], k: [2, 9] },
      answer: (p) => p.b as number,
      text: (p) =>
        `${(p.a as number) * (p.k as number)} : ${(p.b as number) * (p.k as number)} = ${p.a} : ?`,
      exclude: (p) => gcd(p.a as number, p.b as number) !== 1,
    },
  ],
};
