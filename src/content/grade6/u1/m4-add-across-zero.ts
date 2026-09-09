import type { ContentModule } from '../../types';

/** Tanda minus yang DILIHAT anak: U+2212, sama dengan tombol `−` di keypad. */
const MINUS = '−';
const sgn = (n: number) => (n < 0 ? MINUS + String(-n) : String(n));

/**
 * Menjumlah melintasi nol. Satu gambar membawa seluruh materinya: menjumlah
 * adalah MELOMPAT KE KANAN di garis bilangan, dan aturan itu tidak berubah
 * sedikit pun ketika titik berangkatnya ada di sebelah kiri nol.
 *
 * Dua bentuk yang diajarkan bersama, karena keduanya lompatan yang sama:
 * - `−5 + 7` — berangkat dari kiri, mendarat di kanan.
 * - `4 + (−7)` — menambah bilangan negatif, yaitu melompat ke KIRI.
 *
 * Anak mengetik sendiri jawabannya, termasuk yang negatif. Setiap aturan ketik
 * sengaja bisa berjawaban positif maupun negatif, jadi tombol `−` selalu ada di
 * keypad (`answerCaps` menurunkannya per aturan, bukan per soal) dan tidak pernah
 * memberi tahu anak tanda jawaban soal yang sedang tampil.
 *
 * `speedTargetMs: 8000` — override, dan alasannya sama persis dengan `g5-u2-m1`
 * dan `g4-u2-m3`: ini PERHITUNGAN dua langkah (naik dulu sampai nol, baru
 * teruskan sisanya), bukan fakta yang diingat seperti 7+5. Ambang 4 detik Grade 6
 * akan memicu Speed Round terus-menerus pada anak yang jawabannya sudah benar
 * dan caranya sudah tepat. CLAUDE.md §6 mengizinkan ambang disetel per modul.
 */
export const addAcrossZero: ContentModule = {
  id: 'g6-u1-m4',
  unitId: 'g6-u1',
  grade: 6,
  title: 'Add Across Zero',
  icon: '➕',
  prereq: ['g6-u1-m3'],
  skills: ['add-integers'],
  kind: 'fact',
  fluencyTracked: true,
  speedTargetMs: 8000,
  questionTypes: ['keypad', 'missing-number', 'choose-number'],
  visuals: ['counter-objects', 'number-line'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five blue blocks.',
      visual: { kind: 'counter-objects', count: 9, icon: '🟦' },
      action: 'tap-count',
      target: 5,
      hint: 'Five jumps right from −5.',
    },
    {
      stage: 'pictorial',
      prompt: 'We start at −5.',
      visual: { kind: 'number-line', min: -10, max: 10, value: -5, marks: [0], step: 1 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: '−5 plus 7. Show the answer.',
      visual: { kind: 'number-line', min: -10, max: 10, value: null, step: 1 },
      action: 'drop-on-line',
      target: 2,
      hint: 'Seven jumps right from −5.',
    },
    {
      stage: 'abstract',
      prompt: 'First jump up to zero.',
      visual: { kind: 'number-line', min: -10, max: 10, value: 0, marks: [-5], step: 1 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Then jump two more.',
      visual: { kind: 'number-line', min: -10, max: 10, value: 2, marks: [0], step: 1 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Berangkat dari kiri nol. `a === b` sengaja TIDAK dibuang: −4 + 4 = 0
      // adalah soal terpenting di aturan ini, karena di situlah anak melihat
      // sepasang lawan saling menghapus.
      type: 'keypad',
      skill: 'add-integers',
      params: { a: [1, 9], b: [1, 9] },
      answer: (p) => (p.b as number) - (p.a as number),
      text: (p) => `${MINUS}${p.a} + ${p.b} = ?`,
    },
    {
      // Menambah bilangan negatif = melompat ke kiri. Bentuk kurungnya ditulis
      // apa adanya supaya anak terbiasa membacanya sebelum bertemu di `g6-u3`.
      type: 'keypad',
      skill: 'add-integers',
      params: { a: [1, 9], b: [1, 9] },
      answer: (p) => (p.a as number) - (p.b as number),
      text: (p) => `${p.a} + (${MINUS}${p.b}) = ?`,
    },
    {
      // Bagian yang hilang ada di DEPAN, dan hasilnya boleh negatif — anak harus
      // berjalan mundur dari hasil, bukan menjumlahkan dua angka yang terlihat.
      type: 'missing-number',
      skill: 'add-integers',
      params: { b: [1, 9], c: [-9, 9] },
      answer: (p) => (p.c as number) - (p.b as number),
      text: (p) => `? + ${p.b} = ${sgn(p.c as number)}`,
    },
    {
      // Satu aturan pilihan supaya pengecoh miskonsepsi punya tempat (syarat
      // modul `fact`). Jawabannya dijaga positif — pengecoh soal pilihan angka
      // dipagari ≥0 oleh generator.
      //
      // Miskonsepsinya: tanda minus diabaikan dan kedua angka dijumlahkan
      // begitu saja (−3 + 7 dijawab 10). Salah yang terbaca sebagai diagnosis.
      type: 'choose-number',
      skill: 'add-integers',
      params: { a: [1, 8], b: [2, 9] },
      answer: (p) => (p.b as number) - (p.a as number),
      text: (p) => `What is ${MINUS}${p.a} + ${p.b}?`,
      exclude: (p) => (p.b as number) <= (p.a as number),
      distractors: 'near',
      misconception: (p) => (p.a as number) + (p.b as number),
    },
  ],
};
