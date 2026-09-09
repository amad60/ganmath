import type { ContentModule } from '../../types';

/** Cerita pendek → operasi yang benar. Indeksnya menunjuk ke OPS di bawah. */
const OPS = ['×', '÷', '+', '−'];

/** Jawaban tiap cerita, sebagai indeks di OPS. Urutannya mengikuti `k`. */
const STORY_ANSWER = [0, 0, 1, 1, 2, 3];

/**
 * Penutup unit: **langkah mana lebih dulu, dan operasi mana yang dipakai.**
 *
 * Lima modul sebelumnya melatih menghitung. Modul ini melatih memutuskan — dua
 * keputusan yang dipakai anak setiap kali dia bertemu soal yang bukan sudah
 * ditulis rapi untuknya:
 *  1. **Urutan.** Di 5 + 3 × 4, perkalian dikerjakan lebih dulu, dan tanda kurung
 *     bisa membalik itu. Ini konvensi, bukan hitungan — anak yang menghitung
 *     dari kiri ke kanan menjawab 32 dan hitungannya sendiri tidak salah satu pun.
 *     Karena itu 32 dipasang sebagai pengecoh miskonsepsi, bukan angka acak.
 *  2. **Operasi.** Cerita pendek dipetakan ke satu dari empat tanda. Empat-empatnya
 *     benar-benar pernah menjadi jawaban (lihat `STORY_ANSWER`), supaya tidak ada
 *     tanda yang bisa dicoret anak tanpa membaca ceritanya.
 *
 * Sengaja `concept`, bukan `fact`: memilih langkah adalah keputusan, dan menilai
 * kecepatan keputusan berarti mengajari anak menebak cepat.
 *
 * Batas grade dijaga ketat. Tidak ada huruf sebagai pengganti bilangan, tidak ada
 * persamaan yang harus diselesaikan, tidak ada pangkat di dalam urutan operasi —
 * itu semua `g6-u3`. Yang ada di sini hanya empat operasi, satu pasang tanda
 * kurung, dan bilangan yang muat di dua digit.
 */
export const whichStepFirst: ContentModule = {
  id: 'g5-u4-m6',
  unitId: 'g5-u4',
  grade: 5,
  title: 'Which Step First',
  icon: '🧭',
  prereq: ['g5-u4-m5'],
  skills: ['order-of-operations', 'choose-operation'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad', 'choose-text'],
  visuals: ['counter-objects', 'array-grid'],
  vocab: ['fourteen', 'multiply', 'brackets', 'order'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap fourteen dots.',
      visual: { kind: 'counter-objects', count: 14, icon: '🟣' },
      action: 'tap-count',
      target: 14,
      hint: 'Count them all.',
    },
    {
      stage: 'pictorial',
      prompt: 'Four rows of three, and two more.',
      visual: { kind: 'array', rows: 4, cols: 3 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Multiply first, then add.',
      visual: { kind: 'array', rows: 4, cols: 3 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Brackets first: (2 + 4) × 3 = 18.',
      visual: { kind: 'array', rows: 6, cols: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Urutan tanpa tanda kurung. Pengecoh miskonsepsi: dikerjakan dari kiri
      // ke kanan — (a + b) × c. Anak yang salah di sini tidak salah berhitung,
      // dia belum tahu aturannya, dan datanya harus bisa dibaca begitu.
      type: 'choose-number',
      skill: 'order-of-operations',
      params: { a: [2, 19], b: [2, 9], c: [2, 9] },
      answer: (p) => (p.a as number) + (p.b as number) * (p.c as number),
      text: (p) => `${p.a} + ${p.b} × ${p.c} = ?`,
      distractors: 'near',
      misconception: (p) => ((p.a as number) + (p.b as number)) * (p.c as number),
    },
    {
      // Soal yang sama persis dengan tanda kurung dipasang — jawabannya berubah.
      // Itulah gunanya tanda kurung, dan cara tercepat melihatnya.
      type: 'keypad',
      skill: 'order-of-operations',
      params: { a: [2, 19], b: [2, 9], c: [2, 9] },
      answer: (p) => ((p.a as number) + (p.b as number)) * (p.c as number),
      text: (p) => `(${p.a} + ${p.b}) × ${p.c} = ?`,
    },
    {
      // Perkalian lebih dulu, lalu pengurangan. Hasil negatif dibuang: keypad
      // modul ini tidak perlu tombol minus, dan bilangan bulat negatif adalah g6-u1.
      type: 'keypad',
      skill: 'order-of-operations',
      params: { a: [2, 9], b: [2, 9], c: [2, 30] },
      answer: (p) => (p.a as number) * (p.b as number) - (p.c as number),
      text: (p) => `${p.a} × ${p.b} − ${p.c} = ?`,
      exclude: (p) => (p.a as number) * (p.b as number) - (p.c as number) < 1,
    },
    {
      // Memilih operasinya. Ceritanya pendek dengan sengaja — yang diuji adalah
      // keputusan, bukan daya baca.
      type: 'choose-text',
      skill: 'choose-operation',
      params: { k: [0, 5], a: [2, 9], b: [2, 9] },
      answer: (p) => STORY_ANSWER[p.k as number] as number,
      options: () => [...OPS],
      text: (p) => {
        const a = p.a as number;
        const b = p.b as number;
        switch (p.k as number) {
          case 0:
            return `${a} boxes hold ${b} dots each. How many dots?`;
          case 1:
            return `${a} rows of ${b} dots. How many dots?`;
          case 2:
            return `${a * b} dots in ${a} rows. How many in each row?`;
          case 3:
            return `Share ${a * b} dots into ${b} groups. How many each?`;
          case 4:
            return `${a} dots and ${b} more dots. How many now?`;
          default:
            return `${a * b} dots. ${a} go away. How many are left?`;
        }
      },
    },
  ],
};
