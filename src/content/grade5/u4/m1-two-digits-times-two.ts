import type { ContentModule } from '../../types';

/**
 * Gerbang unit kelancaran Grade 5: **dua digit dikali dua digit**.
 *
 * Grade 4 berhenti di 2–3 digit × 1 digit (`g4-u2-m3`, `m4`) dan mengajarkan
 * memecah bilangan lebih dulu (`g4-u2-m2`). Yang benar-benar baru di sini hanya
 * satu hal: pengalinya ikut dipecah, jadi hasil kalinya ada EMPAT, bukan dua.
 *
 * Karena itu aturan pertama sengaja bukan soal utuh melainkan tangganya —
 * mengali dengan bilangan puluhan bulat (47 × 30). Anak yang bisa 47 × 3 hanya
 * perlu tahu ke mana nolnya pergi; itu setengah pekerjaan 47 × 34, dan setengah
 * itu dilatih terpisah supaya kesalahannya bisa dibaca: salah di sini berarti
 * nilai tempat, bukan tabel perkalian.
 *
 * **Kenapa `speedTargetMs` dilonggarkan jauh.** Modul ini `fact` karena ia target
 * kelancaran unit, tetapi 34 × 26 adalah PERHITUNGAN empat langkah plus satu
 * penjumlahan — bukan sesuatu yang diambil dari ingatan. Ambang 5 detik Grade 5
 * akan menandai hampir setiap anak yang jawabannya benar sebagai "belum lancar"
 * dan menawarinya Speed Round tanpa henti. `g4-u2-m3` sudah menemui persoalan
 * yang sama dan memakai 9 detik untuk dua langkah; pekerjaan di sini kira-kira
 * dua kali lipatnya, jadi 15 detik. CLAUDE.md §6 mengizinkan ambang disetel per
 * modul di data konten, dan §6 juga menegaskan kecepatan tidak pernah
 * menggagalkan modul — longgar di sini tidak menurunkan standar akurasi.
 *
 * Batas lebar input dijaga dengan sengaja: jawaban terbesar aturan mana pun di
 * modul ini adalah 89 × 29 = 2581, jauh di bawah `MAX_ANSWER_DIGITS` (6).
 */
export const twoDigitsTimesTwo: ContentModule = {
  id: 'g5-u4-m1',
  unitId: 'g5-u4',
  grade: 5,
  title: 'Two Digits Times Two',
  icon: '✖️',
  prereq: ['g5-u3-m5'],
  skills: ['multiply-by-tens', 'multiply-2x2'],
  kind: 'fact',
  fluencyTracked: true,
  speedTargetMs: 15000,
  questionTypes: ['keypad', 'choose-number', 'missing-number'],
  visuals: ['counter-objects', 'array-grid', 'base10-blocks'],
  vocab: ['split', 'twelve', 'twenty', 'hundred', 'tens', 'ones'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twenty four dots.',
      visual: { kind: 'counter-objects', count: 24, icon: '🔵' },
      action: 'tap-count',
      target: 24,
      hint: 'Count them all.',
    },
    {
      // 12 × 12 masih bisa dihitung satu-satu kalau anak mau memeriksa. Itu
      // penting: hasil kali dua digit harus pernah dilihat sebagai benda nyata
      // satu kali, bukan hanya sebagai angka di ujung sebuah cara.
      stage: 'pictorial',
      prompt: 'Twelve rows of twelve make 144.',
      visual: { kind: 'array', rows: 12, cols: 12 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'One hundred, four tens, four ones.',
      visual: { kind: 'base10', hundreds: 1, tens: 4, ones: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Split 23 × 14 into four parts.',
      visual: { kind: 'array', rows: 10, cols: 10 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Add the four parts together.',
      visual: { kind: 'base10', hundreds: 3, tens: 2, ones: 2 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Tangga pertama: pengali puluhan bulat. Salah di sini = nilai tempat.
      type: 'keypad',
      skill: 'multiply-by-tens',
      params: { a: [12, 49], t: [2, 9] },
      answer: (p) => (p.a as number) * (p.t as number) * 10,
      text: (p) => `${p.a} × ${(p.t as number) * 10} = ?`,
    },
    {
      // Soal utuh. Pengecoh miskonsepsi: hanya puluhan × puluhan ditambah
      // satuan × satuan (34 × 26 dijawab 600 + 24 = 624) — kesalahan paling
      // sering di 2 digit × 2 digit, karena dua hasil kali silangnya hilang.
      type: 'choose-number',
      skill: 'multiply-2x2',
      params: { a: [12, 49], b: [12, 39] },
      answer: (p) => (p.a as number) * (p.b as number),
      text: (p) => `${p.a} × ${p.b} = ?`,
      // Pengali kelipatan sepuluh sudah punya aturannya sendiri di atas.
      exclude: (p) => (p.b as number) % 10 === 0,
      distractors: 'near',
      misconception: (p) => {
        const a = p.a as number;
        const b = p.b as number;
        return Math.floor(a / 10) * 10 * (Math.floor(b / 10) * 10) + (a % 10) * (b % 10);
      },
    },
    {
      // Rentang yang berbeda dari aturan di atas supaya bukan soal yang sama
      // dengan baju lain: pengali pertama puluhan besar.
      type: 'keypad',
      skill: 'multiply-2x2',
      params: { x: [51, 89], y: [11, 29] },
      answer: (p) => (p.x as number) * (p.y as number),
      text: (p) => `${p.x} × ${p.y} = ?`,
      exclude: (p) => (p.y as number) % 10 === 0,
    },
    {
      // Arah terbalik: hasil kalinya diketahui, salah satu pengalinya dicari.
      // Ini yang menyiapkan m2 — membagi dengan pembagi dua digit adalah
      // pertanyaan yang sama persis, ditulis dengan cara lain.
      type: 'missing-number',
      skill: 'multiply-2x2',
      params: { a: [12, 29], b: [11, 29] },
      answer: (p) => p.b as number,
      text: (p) => `${p.a} × ? = ${(p.a as number) * (p.b as number)}`,
    },
    {
      type: 'keypad',
      skill: 'multiply-by-tens',
      story: true,
      params: { a: [12, 49], t: [2, 9] },
      answer: (p) => (p.a as number) * (p.t as number) * 10,
      text: (p) => `A shop has ${(p.t as number) * 10} boxes. Each box has ${p.a} pencils. How many pencils?`,
    },
    {
      type: 'keypad',
      skill: 'multiply-by-tens',
      story: true,
      params: { a: [12, 49], t: [2, 9] },
      answer: (p) => (p.a as number) * (p.t as number) * 10,
      text: (p) => `${(p.t as number) * 10} baskets. ${p.a} apples in each basket. How many apples?`,
    },
  ],
};
