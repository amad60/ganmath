import type { ContentModule } from '../../types';

const allUnique = (o: string[]) => new Set(o).size === o.length;

/** Pilihan "tulis skalanya", dipakai bersama oleh `options` dan `exclude`. */
const scaleOptions = (s: number) => [`1 : ${s}`, `${s} : 1`, `1 : ${s * 1000}`, `${s} : ${s}`];

/**
 * Rasio yang keluar dari halaman: **skala.** Peta, denah rumah, gambar mainan —
 * semuanya satu kalimat yang sama, "1 cm di gambar berdiri untuk sekian di dunia
 * nyata", dan kalimat itu adalah sebuah rasio.
 *
 * Modul ini sengaja memakai bentuk **"1 cm stands for N km"**, bukan notasi
 * 1 : 100.000 yang dipakai peta sungguhan. Alasannya batas grade, bukan
 * penyederhanaan: 1 : 100.000 menuntut konversi cm → km di dalam kepala (dua
 * lompatan satuan sekaligus) yang bukan materi unit ini. Notasi titik dua tetap
 * diperkenalkan, tapi lewat aturan tersendiri (`Write the ratio`) di mana
 * satuannya sudah disepakati — jadi anak melihat hubungannya tanpa harus
 * mengerjakan konversinya.
 *
 * Garis bilangan dipakai untuk dua tahap `pictorial` karena di sinilah PANJANG
 * benar-benar bisa dibaca berangka — kebalikan dari batang. Dua garis dengan
 * rentang berbeda (0–10 cm di peta, 0–30 km sungguhan) menunjukkan bahwa yang
 * berubah adalah satuannya, bukan tempatnya.
 *
 * Ketiga arah dilatih: gambar → nyata, nyata → gambar, dan mencari skalanya
 * sendiri. Yang terakhir itu yang paling sering hilang, dan yang paling dipakai
 * orang: memegang peta yang skalanya harus disimpulkan dari satu jarak yang
 * sudah diketahui. Semua jawaban ketik bilangan bulat.
 */
export const mapScale: ContentModule = {
  id: 'g6-u2-m5',
  unitId: 'g6-u2',
  grade: 6,
  title: 'Map Scale',
  icon: '🗺️',
  prereq: ['g6-u2-m4'],
  skills: ['map-scale'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'missing-number', 'choose-number', 'choose-text'],
  visuals: ['counter-objects', 'number-line', 'bar-model'],
  vocab: ['map', 'real'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three of eight marks.',
      visual: { kind: 'counter-objects', count: 8, icon: '📍' },
      action: 'tap-count',
      target: 3,
      hint: 'Each mark stands for one kilometre.',
    },
    {
      // Garis peta: 0–10 cm, langkah satu satuan.
      stage: 'pictorial',
      prompt: 'The map shows three centimetres.',
      visual: { kind: 'number-line', min: 0, max: 10, value: 3, step: 1 },
      action: 'watch',
    },
    {
      // Garis yang sama, satuan yang berbeda. `step: 5` ditulis eksplisit supaya
      // labelnya jatuh di 0, 5, 10 ... dan 15 benar-benar bertanda.
      stage: 'pictorial',
      prompt: 'Real distance is fifteen kilometres.',
      visual: { kind: 'number-line', min: 0, max: 30, value: 15, step: 5 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '1 cm on the map is 5 km.',
      visual: { kind: 'bars', lengths: [0.2, 1], labels: ['1', '5'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Times the map length by five.',
      visual: { kind: 'bars', lengths: [0.2, 1], labels: ['1', '5'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Gambar → nyata. Arah yang paling sering dipakai anak saat membaca peta.
      type: 'keypad',
      skill: 'map-scale',
      params: { s: [2, 9], d: [1, 9] },
      answer: (p) => (p.s as number) * (p.d as number),
      text: (p) => `1 cm on the map is ${p.s} km. How far is ${p.d} cm?`,
      // d = 1 hanya membacakan skalanya kembali — soal tanpa isi.
      exclude: (p) => (p.d as number) === 1,
    },
    {
      // Nyata → gambar. Pembagiannya selalu pas karena jaraknya dibangun dari
      // `s × d`, jadi jawabannya tidak pernah berkoma.
      type: 'missing-number',
      skill: 'map-scale',
      params: { s: [2, 9], d: [1, 9] },
      answer: (p) => p.d as number,
      text: (p) =>
        `1 cm is ${p.s} km. How many cm for ${(p.s as number) * (p.d as number)} km?`,
    },
    {
      // Mencari skalanya sendiri. Pengecoh miskonsepsinya adalah jarak
      // seluruhnya — anak yang membaca "sekian km" tanpa membaginya dengan
      // banyaknya cm. d = 1 dibuang: di sana skalanya sudah tertulis di soal.
      type: 'choose-number',
      skill: 'map-scale',
      params: { s: [2, 9], d: [1, 9] },
      answer: (p) => p.s as number,
      text: (p) =>
        `${p.d} cm on the map is ${(p.s as number) * (p.d as number)} km. ` +
        `1 cm is how many km?`,
      exclude: (p) => (p.d as number) === 1,
      distractors: 'near',
      misconception: (p) => (p.s as number) * (p.d as number),
    },
    {
      // Notasi titik dua untuk skala. Pengecoh kedua membalik urutannya
      // (gambar dan dunia nyata tertukar), ketiga menambahkan konversi satuan
      // yang tidak diminta, keempat membaca skala sebagai "sama besar".
      type: 'choose-text',
      skill: 'map-scale',
      params: { s: [2, 9] },
      answer: () => 0,
      text: (p) => `1 cm stands for ${p.s} km. Write the ratio.`,
      options: (p) => scaleOptions(p.s as number),
      exclude: (p) => !allUnique(scaleOptions(p.s as number)),
    },
    {
      type: 'keypad',
      skill: 'map-scale',
      story: true,
      params: { s: [2, 9], d: [1, 9] },
      answer: (p) => (p.s as number) * (p.d as number),
      text: (p) => `On a map 1 cm is ${p.s} km. Ana walks ${p.d} cm on the map. How far in km?`,
      exclude: (p) => (p.d as number) === 1,
    },
    {
      type: 'keypad',
      skill: 'map-scale',
      story: true,
      params: { s: [2, 9], d: [1, 9] },
      answer: (p) => (p.s as number) * (p.d as number),
      text: (p) => `A map shows 1 cm for ${p.s} km. Budi sees ${p.d} cm. How far in km?`,
      exclude: (p) => (p.d as number) === 1,
    },
  ],
};
