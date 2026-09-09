import type { ContentModule } from '../../types';

/**
 * Pangkat dua sampai 12² — dan ini modul pertama unit ini yang benar-benar
 * **hafalan**, jadi ambang kecepatannya sengaja TIDAK dilonggarkan.
 *
 * `m1` dan `m2` adalah perhitungan bertahap: mereka diberi `speedTargetMs`
 * longgar (atau tidak dinilai kecepatannya sama sekali) karena mengukurnya
 * dengan ambang ingatan hanya menghukum anak yang mengerjakan tiap langkah
 * dengan benar. 7 × 7 tidak begitu. Ia satu petak di tabel perkalian yang sudah
 * dikuasai sejak `g3-u2`, hanya diberi nama baru dan lambang baru — dan justru
 * gunanya ada pada kecepatannya: pangkat dua yang keluar seketika adalah yang
 * membuat akar kuadrat di `m5`, luas persegi, dan (nanti) Pythagoras terasa
 * ringan. Karena itu modul ini memakai ambang Grade 5 apa adanya, 5 detik.
 *
 * Batas isi dijaga di 12²: seratus empat puluh empat adalah ujung tabel
 * perkalian yang memang dihafalkan. Aturan ketiga menambahkan pola puluhan
 * (30² = 900) — itu bukan hafalan baru, hanya 3 × 3 dengan dua nol, jadi ia
 * tetap muat di ambang yang ketat.
 *
 * Catatan gambar: `array-grid` menggambar penanda **bulat**, bukan kotak. Jadi
 * teks materi tidak pernah menyebut penandanya "squares" — yang berbentuk
 * persegi adalah SUSUNANNYA (baris dan kolom sama banyak), dan itu yang
 * dikatakan.
 */
export const squareNumbers: ContentModule = {
  id: 'g5-u4-m4',
  unitId: 'g5-u4',
  grade: 5,
  title: 'Square Numbers',
  icon: '⏹️',
  prereq: ['g5-u4-m3'],
  skills: ['squares'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad', 'compare-symbol'],
  visuals: ['counter-objects', 'array-grid'],
  vocab: ['sixteen', 'square', 'squared', 'equal', 'columns', 'itself', 'times'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap sixteen dots.',
      visual: { kind: 'counter-objects', count: 16, icon: '🟦' },
      action: 'tap-count',
      target: 16,
      hint: 'Four rows of four.',
    },
    {
      stage: 'pictorial',
      prompt: 'Four rows of four make sixteen.',
      visual: { kind: 'array', rows: 4, cols: 4 },
      action: 'watch',
    },
    {
      // Penandanya bulat; yang persegi adalah susunannya. Teksnya menyebut itu.
      stage: 'pictorial',
      prompt: 'Equal rows and columns make a square.',
      visual: { kind: 'array', rows: 6, cols: 6 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write 4 × 4 as 4².',
      visual: { kind: 'array', rows: 4, cols: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A number times itself is squared.',
      visual: { kind: 'array', rows: 9, cols: 9 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Bentuk lama (n × n) supaya anak menyambungkannya ke tabel perkalian yang
      // sudah dia punya. Pengecoh miskonsepsi: MELIPATDUAKAN, bukan mengalikan
      // dengan dirinya sendiri — 7² dijawab 14. Itu kesalahan nomor satu di sini.
      type: 'choose-number',
      skill: 'squares',
      params: { n: [2, 12] },
      answer: (p) => (p.n as number) * (p.n as number),
      text: (p) => `${p.n} × ${p.n} = ?`,
      distractors: 'near',
      misconception: (p) => (p.n as number) * 2,
    },
    {
      // Lambangnya. Sengaja tanpa pilihan: yang dilatih adalah ingatan, bukan
      // kemampuan mencoret tiga pilihan.
      type: 'keypad',
      skill: 'squares',
      params: { n: [2, 12] },
      answer: (p) => (p.n as number) * (p.n as number),
      text: (p) => `${p.n}² = ?`,
    },
    {
      // Pola puluhan: 3 × 3 dengan dua nol. Jawaban terbesar 90² = 8100.
      type: 'keypad',
      skill: 'squares',
      params: { n: [2, 9] },
      answer: (p) => (p.n as number) * (p.n as number) * 100,
      text: (p) => `${(p.n as number) * 10}² = ?`,
    },
    {
      // Menyerang miskonsepsi yang sama dari arah lain: n² dibandingkan dengan
      // n × sesuatu. Yang sama besar (k = n) memang ada — anak harus tahu bahwa
      // pangkat dua BUKAN selalu lebih besar dari perkalian biasa.
      type: 'compare-symbol',
      skill: 'squares',
      params: { n: [2, 12], k: [2, 9] },
      answer: (p) => Math.sign((p.n as number) - (p.k as number)),
      text: (p) => `${p.n}² ? ${p.n} × ${p.k}`,
    },
  ],
};
