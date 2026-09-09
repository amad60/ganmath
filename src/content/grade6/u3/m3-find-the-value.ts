import type { ContentModule } from '../../types';

/** Tanda minus yang DILIHAT anak: U+2212, sama dengan tombol `−` di keypad. */
const MINUS = '−';

/**
 * Arah kebalikan dari `m2`: nilai hurufnya diberikan, bentuknya yang harus
 * dihitung. **Ganti hurufnya dengan angkanya, lalu hitung seperti biasa.**
 *
 * Ini modul yang paling mudah terlihat sepele dan paling sering salah. Dua
 * kesalahan yang dijaga di sini, dua-duanya dipasang sebagai pengecoh:
 *  - `n + n` dijawab `n × n` (4 + 4 dijawab 16) — "dua n" dibaca sebagai
 *    "n dikali n";
 *  - `n + 3` dan `3 × n` dianggap sama besar, karena keduanya "n dengan 3".
 *
 * Aturan `compare-symbol` mengurus yang kedua. Ia memaksa anak menghitung DUA
 * bentuk lalu membandingkannya, dan jawabannya benar-benar berubah-ubah:
 * n = 1 membuat n + b lebih besar, n = b = 2 membuat keduanya sama, sisanya
 * membuat b × n lebih besar. Tidak ada tanda yang bisa ditebak.
 *
 * Aturan pengurangan sengaja dibiarkan berjawaban negatif (n = 2, n − 9 = −7).
 * Itu bukan kelalaian: `g6-u1` baru saja mengajarkan bilangan di kiri nol, dan
 * inilah tempat pertama keterampilan itu terpakai untuk sesuatu yang lain.
 * Jawaban negatif hanya boleh lewat soal ketik — pengecoh soal pilihan dipagari
 * ≥0 oleh generator — jadi aturan itu bertipe `missing-number`.
 */
export const findTheValue: ContentModule = {
  id: 'g6-u3-m3',
  unitId: 'g6-u3',
  grade: 6,
  title: 'Find the Value',
  icon: '🔎',
  prereq: ['g6-u3-m2'],
  skills: ['evaluate-expression'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'missing-number', 'choose-number', 'compare-symbol'],
  visuals: ['counter-objects', 'bar-model', 'number-bond', 'array-grid'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four dots.',
      visual: { kind: 'counter-objects', count: 12, icon: '🟠' },
      action: 'tap-count',
      target: 4,
      hint: 'Here n stands for four.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three bars. Each bar is n.',
      visual: { kind: 'bars', lengths: [0.4, 0.4, 0.4], labels: ['n', 'n', 'n'] },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'n is 4. So n + 3 is 7.',
      visual: { kind: 'number-bond', whole: 7, parts: [4, 3] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'n is 4. So 3 × n is 12.',
      visual: { kind: 'array', rows: 3, cols: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Change n to the value. Then count.',
      visual: { kind: 'bars', lengths: [0.4, 0.4, 0.4], labels: ['4', '4', '4'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'keypad',
      skill: 'evaluate-expression',
      params: { v: [2, 12], b: [2, 9] },
      answer: (p) => (p.v as number) + (p.b as number),
      text: (p) => `n is ${p.v}. What is n + ${p.b}?`,
    },
    {
      // Perkalian ditulis dengan hurufnya di belakang (`3 × n`), bentuk yang
      // akan ditemui anak di buku. Nilainya diisi lebih dulu, baru dikalikan.
      type: 'keypad',
      skill: 'evaluate-expression',
      params: { v: [2, 9], b: [2, 9] },
      answer: (p) => (p.v as number) * (p.b as number),
      text: (p) => `n is ${p.v}. What is ${p.b} × n?`,
    },
    {
      // Boleh berjawaban negatif — dan memang harus. Ini sambungan langsung
      // ke `g6-u1`: bentuk aljabar tidak berhenti bekerja di bawah nol.
      type: 'missing-number',
      skill: 'evaluate-expression',
      params: { v: [2, 12], b: [2, 9] },
      answer: (p) => (p.v as number) - (p.b as number),
      text: (p) => `n is ${p.v}. n ${MINUS} ${p.b} = ?`,
    },
    {
      // "Dua n" bukan "n kali n". Pengecoh miskonsepsinya persis kesalahan itu.
      type: 'choose-number',
      skill: 'evaluate-expression',
      params: { v: [2, 12] },
      answer: (p) => 2 * (p.v as number),
      text: (p) => `n is ${p.v}. What is n + n?`,
      distractors: 'near',
      misconception: (p) => (p.v as number) * (p.v as number),
    },
    {
      // Dua bentuk dihitung, lalu dibandingkan. Tandanya benar-benar berubah:
      // n = 1 → lebih besar, n = b = 2 → sama, sisanya → lebih kecil.
      type: 'compare-symbol',
      skill: 'evaluate-expression',
      params: { v: [1, 9], b: [2, 9] },
      answer: (p) =>
        Math.sign((p.v as number) + (p.b as number) - (p.b as number) * (p.v as number)),
      text: (p) => `n is ${p.v}. n + ${p.b} ? ${p.b} × n`,
    },
  ],
};
