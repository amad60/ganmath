import type { ContentModule } from '../../types';

/**
 * Persamaan satu langkah dengan × dan ÷. Aturannya sama persis dengan `m4`,
 * hanya kebalikannya yang berganti: **bagi untuk membatalkan kali, kali untuk
 * membatalkan bagi.**
 *
 * Karena bentuknya mirip, yang berbahaya di sini justru kemiripan itu. Anak
 * yang baru saja lulus `m4` cenderung membawa kebiasaannya: melihat dua angka,
 * lalu mengurangi. `4 × n = 12` dijawab 8. Itulah pengecoh miskonsepsi aturan
 * terakhir, dan itu satu-satunya cara kesalahan tersebut terbaca sebagai
 * diagnosis alih-alih sekadar angka salah.
 *
 * Semua angka dibangun sebagai **hasil kali lebih dulu** (`a × q`), jadi setiap
 * pembagian pasti pas dan tidak ada satu pun soal berjawaban pecahan — keypad
 * tidak bisa menerimanya untuk jawaban seperti 1/3, dan pecahan bukan materi
 * modul ini. Siasat yang sama dipakai `g6-u2-m7`.
 *
 * Gambarnya `array-grid` dan `bar-model`, bukan tulisan: 4 × n = 12 adalah
 * empat baris sama panjang yang bersama-sama membentuk 12. Dari gambar itu
 * "bagi 12 dengan 4" terlihat sebagai sesuatu yang wajar, bukan aturan hafalan.
 */
export const undoTimesAndDivide: ContentModule = {
  id: 'g6-u3-m5',
  unitId: 'g6-u3',
  grade: 6,
  title: 'Undo Times and Divide',
  icon: '✖️',
  prereq: ['g6-u3-m4'],
  skills: ['solve-times-divide'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['missing-number', 'keypad', 'choose-number'],
  visuals: ['counter-objects', 'array-grid', 'bar-model'],
  vocab: ['undoes'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three dots in one group.',
      visual: { kind: 'counter-objects', count: 12, icon: '🟣' },
      action: 'tap-count',
      target: 3,
      hint: 'Four groups of three make twelve.',
    },
    {
      stage: 'pictorial',
      prompt: 'Four rows. Each row is n.',
      visual: { kind: 'array', rows: 4, cols: 3, highlightRow: 0 },
      action: 'watch',
    },
    {
      // Batang utuh dipotong jadi empat bagian yang SAMA BESAR — itu seluruh
      // isi soalnya. Panjangnya model, bukan skala; angkanya ada di label.
      stage: 'pictorial',
      prompt: 'Four n make 12.',
      visual: {
        kind: 'bars',
        lengths: [1, 0.25, 0.25, 0.25, 0.25],
        labels: ['12', 'n', 'n', 'n', 'n'],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '4 × n = 12. Share 12 by 4.',
      visual: { kind: 'array', rows: 4, cols: 3 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Divide undoes times. n is 3.',
      visual: { kind: 'array', rows: 4, cols: 3, highlightRow: 0 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Bentuk pokok. Hasil kalinya dibangun dari `a × q`, jadi pembagiannya
      // selalu pas dan jawabannya selalu bilangan bulat yang bisa diketik.
      type: 'missing-number',
      skill: 'solve-times-divide',
      params: { a: [2, 9], q: [2, 9] },
      answer: (p) => p.q as number,
      text: (p) => `${p.a} × n = ${(p.a as number) * (p.q as number)}. n = ?`,
    },
    {
      // n yang DIBAGI → n lebih besar dari hasilnya. Kebalikan dari aturan
      // pertama, dan kesalahan paling umum adalah membagi lagi.
      type: 'keypad',
      skill: 'solve-times-divide',
      params: { b: [2, 9], q: [2, 9] },
      answer: (p) => (p.b as number) * (p.q as number),
      text: (p) => `n ÷ ${p.b} = ${p.q}. n = ?`,
    },
    {
      // n sebagai PEMBAGI. Bentuk ketiga yang tidak boleh dilewati: kalau
      // hanya dua bentuk pertama yang dilatih, anak menyimpulkan bahwa huruf
      // selalu berada di depan tanda bagi.
      type: 'keypad',
      skill: 'solve-times-divide',
      params: { a: [2, 9], q: [2, 9] },
      answer: (p) => p.a as number,
      text: (p) => `${(p.a as number) * (p.q as number)} ÷ n = ${p.q}. n = ?`,
    },
    {
      // Pengecoh miskonsepsinya adalah kebiasaan yang dibawa dari `m4`:
      // dua angka dilihat, lalu dikurangi. 4 × n = 12 dijawab 8.
      type: 'choose-number',
      skill: 'solve-times-divide',
      params: { a: [2, 9], q: [2, 9] },
      answer: (p) => p.q as number,
      text: (p) => `${p.a} × n = ${(p.a as number) * (p.q as number)}. What is n?`,
      distractors: 'near',
      misconception: (p) => (p.a as number) * (p.q as number) - (p.a as number),
    },
  ],
};
