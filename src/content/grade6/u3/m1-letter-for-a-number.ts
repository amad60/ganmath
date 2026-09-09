import type { ContentModule } from '../../types';

/**
 * Gerbang unit aljabar, dan sengaja BUKAN materi baru: ini kotak kosong yang
 * dipakai anak sejak `g1-u2-m8` (`8 + ? = 11`), sekarang kotaknya diberi nama.
 *
 * Satu gagasan saja isinya: **sebuah huruf adalah nama untuk bilangan yang belum
 * kita ketahui.** Bukan benda, bukan satuan, bukan "n apel" — melainkan sebuah
 * bilangan yang punya satu nilai tertentu dan bisa dicari. Anak yang melewatkan
 * gagasan ini akan memperlakukan huruf sebagai label barang, dan seluruh unit
 * ini berhenti masuk akal di modul ketiga.
 *
 * Karena itu aturan `compare-symbol` ada di sini. Kelihatannya sepele
 * ("8 + n = 14. n ? 5"), tapi ia satu-satunya soal yang menuntut anak
 * memperlakukan n sebagai **bilangan yang bisa dibandingkan** — sesuatu yang
 * mustahil dilakukan pada sebuah label.
 *
 * **Tidak ada tipe soal yang merender simbol aljabar.** Huruf `n` muncul sebagai
 * teks biasa di dalam kalimat soal, persis seperti angka. Itu bukan kekurangan
 * yang disiasati di sini: `n + 4 = 11` memang dibaca sebaris, dan bentuk
 * sebarisnya justru yang akan ditemui anak di buku. Yang menggantikan tata letak
 * persamaan adalah GAMBARnya — `number-bond` memegang hubungan part–whole
 * (bagian mana yang hilang), `bar-model` memegang perbandingannya (mana yang
 * utuh, mana yang sepotong). Dua benang yang sama persis dipakai `g6-u2`.
 *
 * Nama parameter sengaja menghindari `n`: `QuestionScreen` menampilkan ten-frame
 * bantuan kalau soal punya parameter bernama `n`, dan ten-frame berisi angka acak
 * di sebelah soal aljabar hanya akan membingungkan.
 */
export const letterForANumber: ContentModule = {
  id: 'g6-u3-m1',
  unitId: 'g6-u3',
  grade: 6,
  title: 'Letter for a Number',
  icon: '🔤',
  prereq: ['g6-u2-m7'],
  skills: ['letter-unknown', 'find-unknown'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['missing-number', 'keypad', 'choose-number', 'compare-symbol'],
  visuals: ['counter-objects', 'number-bond', 'bar-model'],
  vocab: ['n', 'letter', 'hidden', 'some'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five dots you can see.',
      visual: { kind: 'counter-objects', count: 9, icon: '🔵' },
      action: 'tap-count',
      target: 5,
      hint: 'Some dots are hidden in a bag.',
    },
    {
      // Kotak kosong yang sudah dikenal anak sejak Grade 1, sekarang dinamai.
      stage: 'pictorial',
      prompt: 'The bag holds n dots.',
      visual: { kind: 'number-bond', whole: 9, parts: [5, null], ask: 'part1' },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Nine in all. We see five.',
      visual: { kind: 'bars', lengths: [1, 0.55], labels: ['9', '5'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '5 + n = 9. n is 4.',
      visual: { kind: 'number-bond', whole: 9, parts: [5, 4] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A letter stands for a number.',
      visual: { kind: 'bars', lengths: [1, 0.55], labels: ['9', 'n'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Bentuk yang persis sama dengan `g1-u2-m8`, hanya kotaknya jadi huruf.
      // Diletakkan paling depan supaya anak mengenali bahwa ini bukan hal baru.
      type: 'missing-number',
      skill: 'find-unknown',
      params: { a: [1, 9], c: [2, 18] },
      answer: (p) => (p.c as number) - (p.a as number),
      text: (p) => `${p.a} + n = ${p.c}. n = ?`,
      exclude: (p) => (p.a as number) >= (p.c as number),
    },
    {
      // Huruf di DEPAN. Tanpa aturan ini anak belajar bahwa yang dicari selalu
      // ada di posisi kedua, dan posisi itulah yang dia baca, bukan hurufnya.
      type: 'keypad',
      skill: 'find-unknown',
      params: { b: [1, 9], c: [2, 18] },
      answer: (p) => (p.c as number) - (p.b as number),
      text: (p) => `n + ${p.b} = ${p.c}. n = ?`,
      exclude: (p) => (p.b as number) >= (p.c as number),
    },
    {
      // Situasi, bukan kalimat matematika: huruf lahir dari sesuatu yang memang
      // belum diketahui. Pengecoh miskonsepsinya adalah menjumlahkan dua angka
      // yang terlihat — kesalahan nomor satu anak yang berhenti membaca.
      type: 'choose-number',
      skill: 'letter-unknown',
      params: { a: [1, 9], c: [2, 18] },
      answer: (p) => (p.c as number) - (p.a as number),
      text: (p) => `A bag has n balls. ${p.a} more makes ${p.c}.`,
      exclude: (p) => (p.a as number) >= (p.c as number),
      distractors: 'near',
      misconception: (p) => (p.a as number) + (p.c as number),
    },
    {
      // Inti modul ini. n bisa dibandingkan, jadi n adalah BILANGAN — bukan
      // nama benda. Anak harus mencari nilainya lebih dulu sebelum memilih
      // tanda; tidak ada jalan pintas membaca angka yang terlihat.
      type: 'compare-symbol',
      skill: 'letter-unknown',
      params: { a: [1, 9], c: [2, 18], d: [1, 9] },
      answer: (p) => Math.sign((p.c as number) - (p.a as number) - (p.d as number)),
      text: (p) => `${p.a} + n = ${p.c}. n ? ${p.d}`,
      exclude: (p) => (p.a as number) >= (p.c as number),
    },
  ],
};
