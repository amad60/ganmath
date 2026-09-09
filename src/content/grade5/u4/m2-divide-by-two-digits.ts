import type { ContentModule } from '../../types';

/**
 * Pembagian panjang dengan **pembagi dua digit** — 168 ÷ 24.
 *
 * `g4-u2-m7` sudah membuka pembagian panjang, tapi pembaginya selalu satu digit,
 * jadi tiap langkah masih bisa dijawab dari tabel perkalian. Begitu pembaginya
 * dua digit, tabel perkalian tidak cukup lagi: anak harus MENAKSIR dulu
 * (24 dibulatkan ke 20, 168 ÷ 20 kira-kira 8), lalu memeriksa dan membetulkan.
 * Menaksir-lalu-memeriksa itulah isi modul ini, dan aturan pertamanya memakai
 * taksiran yang meleset sebagai pengecoh, bukan angka acak.
 *
 * Modul ini **`concept`, bukan `fact`** — sama dengan seluruh sisi pembagian di
 * `g4-u2` (`m5`, `m6`, `m7`). Pembagian panjang adalah prosedur bertingkat yang
 * dikerjakan di atas kertas; mengukurnya dengan ambang hafalan berarti menghukum
 * anak yang mengerjakan tiap langkah dengan benar. Kelancaran unit ini diambil
 * dari sisi perkalian (`m1`) dan dari pangkat dua & akar (`m4`, `m5`), yang
 * memang pantas diingat di luar kepala.
 *
 * Semua pembagian di sini **habis**. Yang tidak habis punya modulnya sendiri di
 * `m3`, dan di sana jawabannya selalu **sisa**, tidak pernah desimal — lihat
 * catatan di modul itu.
 */
export const divideByTwoDigits: ContentModule = {
  id: 'g5-u4-m2',
  unitId: 'g5-u4',
  grade: 5,
  title: 'Divide by Two Digits',
  icon: '➗',
  prereq: ['g5-u4-m1'],
  skills: ['divide-2-digit-divisor'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad', 'missing-number'],
  visuals: ['counter-objects', 'array-grid', 'base10-blocks'],
  vocab: ['twelve', 'fifteen', 'group', 'groups', 'try', 'round', 'guess'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap fifteen dots.',
      visual: { kind: 'counter-objects', count: 15, icon: '🟠' },
      action: 'tap-count',
      target: 15,
      hint: 'Count them all.',
    },
    {
      stage: 'pictorial',
      prompt: 'Twelve rows of eight make 96.',
      visual: { kind: 'array', rows: 12, cols: 8 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'So 96 ÷ 12 = 8.',
      visual: { kind: 'array', rows: 12, cols: 8, highlightRow: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'How many groups of 24 in 168?',
      visual: { kind: 'base10', hundreds: 1, tens: 6, ones: 8 },
      action: 'watch',
    },
    {
      // Inti modul: taksir dengan puluhannya, lalu periksa dengan mengalikan.
      stage: 'abstract',
      prompt: 'Round 24 to 20. Guess 8. Try it.',
      visual: { kind: 'base10', hundreds: 1, tens: 6, ones: 8 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Hasil bagi satu digit, pembagi dua digit. Pengecoh miskonsepsi:
      // taksiran dengan pembagi yang dibulatkan ke bawah dipakai apa adanya
      // tanpa diperiksa — 168 ÷ 24 dijawab 8 karena 168 ÷ 20 mendekati 8.
      type: 'choose-number',
      skill: 'divide-2-digit-divisor',
      params: { d: [11, 29], q: [3, 9] },
      answer: (p) => p.q as number,
      text: (p) => `${(p.d as number) * (p.q as number)} ÷ ${p.d} = ?`,
      distractors: 'near',
      misconception: (p) => {
        const d = p.d as number;
        return Math.floor((d * (p.q as number)) / (Math.floor(d / 10) * 10));
      },
    },
    {
      // Hasil bagi dua digit: dua langkah, jadi anak tidak bisa menebak
      // panjang jawabannya dari panjang soalnya.
      type: 'keypad',
      skill: 'divide-2-digit-divisor',
      params: { d: [11, 25], q: [11, 39] },
      answer: (p) => p.q as number,
      text: (p) => `${(p.d as number) * (p.q as number)} ÷ ${p.d} = ?`,
    },
    {
      // Pembaginya yang hilang. Bentuk ini memaksa hubungan × ↔ ÷ dipakai,
      // bukan prosedur pembagian panjang dijalankan tanpa dimengerti.
      type: 'missing-number',
      skill: 'divide-2-digit-divisor',
      params: { d: [12, 29], q: [4, 9] },
      answer: (p) => p.d as number,
      text: (p) => `${(p.d as number) * (p.q as number)} ÷ ? = ${p.q}`,
    },
  ],
};
