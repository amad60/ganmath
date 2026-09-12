import type { ContentModule } from '../../types';

const allUnique = (o: string[]) => new Set(o).size === o.length;

/** Pilihan "harga untuk dua kali banyaknya", dipakai `options` dan `exclude`. */
const doubleOptions = (n: number, u: number) => [
  `${2 * n * u} coins`,
  `${n * u + n} coins`,
  `${n * u} coins`,
  `${n * u + 2 * u} coins`,
];

/**
 * Perbandingan senilai. Judulnya sengaja kalimat, bukan istilah: **More Means
 * More.** Anak berumur dua belas tahun tidak butuh kata "proporsi" untuk
 * memakainya; dia butuh tahu kapan sebuah situasi berperilaku begitu.
 *
 * Isinya adalah rasio senilai (`m3`) yang dipasang pada dua besaran yang berbeda
 * jenis — banyaknya barang dan harganya. Yang baru bukan hitungannya, melainkan
 * satu strategi yang dipakai seumur hidup: **cari nilai satu dulu, baru
 * kalikan.** Karena itu ada aturan tersendiri yang hanya menanyakan harga satu
 * barang; anak yang melompatinya akan menebak dengan menambah selisih, kesalahan
 * yang sama persis dengan yang dijebak di `m3`.
 *
 * Angkanya kecil dan satuannya netral ("coins"), bukan rupiah: unit ini tentang
 * hubungan antara dua besaran, dan harga lima digit hanya menambah beban
 * berhitung tanpa menambah apa pun pada gagasannya. Diskon dan harga sungguhan
 * sudah punya rumahnya sendiri di `g5-u3-m4`.
 *
 * Semua jawaban ketik bilangan bulat: harga dibangun sebagai `n × u`, jadi harga
 * satuannya selalu pas.
 */
export const moreMeansMore: ContentModule = {
  id: 'g6-u2-m6',
  unitId: 'g6-u2',
  grade: 6,
  title: 'More Means More',
  icon: '📈',
  prereq: ['g6-u2-m5'],
  skills: ['direct-proportion', 'unit-rate'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'missing-number', 'choose-number', 'choose-text'],
  visuals: ['counter-objects', 'bar-model', 'number-bond'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap two pencils.',
      visual: { kind: 'counter-objects', count: 6, icon: '✏️' },
      action: 'tap-count',
      target: 2,
      hint: 'Two pencils cost four coins.',
    },
    {
      stage: 'pictorial',
      prompt: 'Two pencils, then four pencils.',
      visual: { kind: 'bars', lengths: [0.5, 1], labels: ['2', '4'] },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Twice the pencils, twice the cost.',
      visual: { kind: 'number-bond', whole: 8, parts: [4, 4] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'More pencils means more cost.',
      visual: { kind: 'bars', lengths: [0.25, 0.5, 1], labels: ['1', '2', '4'] },
      action: 'watch',
    },
    {
      // Kalimat kunci modul ini, dan alasan aturan `One pencil costs?` ada.
      stage: 'abstract',
      prompt: 'Find one first, then times it.',
      visual: { kind: 'bars', lengths: [0.25, 1], labels: ['1', '4'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Dari sekian barang ke sekian barang lain. Dua langkah: bagi, lalu kali.
      type: 'keypad',
      skill: 'direct-proportion',
      params: { u: [2, 9], n: [2, 9], m: [2, 9] },
      answer: (p) => (p.m as number) * (p.u as number),
      text: (p) =>
        `${p.n} pens cost ${(p.n as number) * (p.u as number)} coins. ` +
        `What do ${p.m} pens cost?`,
      exclude: (p) => (p.n as number) === (p.m as number),
    },
    {
      // Arah sebaliknya: harganya diketahui, banyaknya yang dicari.
      type: 'missing-number',
      skill: 'direct-proportion',
      params: { u: [2, 9], n: [2, 9], m: [2, 9] },
      answer: (p) => p.m as number,
      text: (p) =>
        `${p.n} boxes hold ${(p.n as number) * (p.u as number)} balls. ` +
        `? boxes hold ${(p.m as number) * (p.u as number)} balls.`,
      exclude: (p) => (p.n as number) === (p.m as number),
    },
    {
      // Nilai SATU barang — langkah yang membuat sisanya jadi mudah, dan yang
      // paling sering dilompati. Pengecoh miskonsepsinya adalah jawaban anak
      // yang MENGURANGI banyaknya barang dari harganya alih-alih membagi.
      type: 'choose-number',
      skill: 'unit-rate',
      params: { u: [2, 9], n: [2, 9] },
      answer: (p) => p.u as number,
      text: (p) =>
        `${p.n} cakes cost ${(p.n as number) * (p.u as number)} coins. One cake costs?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) * (p.u as number) - (p.n as number),
    },
    {
      // Dua kali banyaknya. Pengecoh kedua menambahkan selisih banyaknya
      // (berpikir aditif), ketiga membiarkan harganya tetap, keempat menambah
      // satu langkah harga satuan saja.
      type: 'choose-text',
      skill: 'direct-proportion',
      params: { u: [2, 9], n: [2, 9] },
      answer: () => 0,
      text: (p) =>
        `${p.n} pens cost ${(p.n as number) * (p.u as number)} coins. ` +
        `What do ${2 * (p.n as number)} pens cost?`,
      options: (p) => doubleOptions(p.n as number, p.u as number),
      exclude: (p) => !allUnique(doubleOptions(p.n as number, p.u as number)),
    },
    {
      type: 'keypad',
      skill: 'direct-proportion',
      story: true,
      params: { u: [2, 9], n: [2, 9], m: [2, 9] },
      answer: (p) => (p.m as number) * (p.u as number),
      text: (p) => `${p.n} cakes cost ${(p.n as number) * (p.u as number)} coins. What do ${p.m} cakes cost?`,
      exclude: (p) => (p.n as number) === (p.m as number),
    },
    {
      type: 'keypad',
      skill: 'direct-proportion',
      story: true,
      params: { u: [2, 9], n: [2, 9], m: [2, 9] },
      answer: (p) => (p.m as number) * (p.u as number),
      text: (p) => `${p.n} bags cost ${(p.n as number) * (p.u as number)} coins. What do ${p.m} bags cost?`,
      exclude: (p) => (p.n as number) === (p.m as number),
    },
  ],
};
