import type { ContentModule } from '../../types';

/** Semua pilihan `choose-text` harus berbeda — dua tombol bertulisan sama = soal rusak. */
const allUnique = (o: string[]) => new Set(o).size === o.length;

/** Pilihan untuk "tulis rasionya", dibuat sekali supaya `options` dan `exclude` sepakat. */
const ratioOptions = (r: number, b: number) => [
  `${r} : ${b}`,
  `${b} : ${r}`,
  `${r} : ${r + b}`,
  `${r + b} : ${b}`,
];

/**
 * Gerbang unit rasio. Satu gagasan saja isinya: **rasio adalah cara membandingkan
 * dua besaran, dan urutannya ikut menentukan artinya.**
 *
 * Anak sudah punya semua bahannya. `g5-u3` mengajarkan membandingkan lewat persen,
 * `g4-u4` lewat pecahan senilai, dan `g1-u2` sampai `g5-u1` memakai number bond
 * untuk part–whole. Yang benar-benar baru di sini hanya notasinya (`a : b`) dan
 * satu kebiasaan berpikir: yang dibandingkan bukan bagian dengan keseluruhan,
 * melainkan **bagian dengan bagian**.
 *
 * Karena itu dua benang merah `grades-2-6.md` dipasang bersama sejak layar pertama:
 *  - `number-bond` (di Grade 6 = rasio) memegang hubungan part–part–whole: 2 dan 3
 *    membentuk 5 bagian, jadi 2 : 3 punya lima bagian;
 *  - `bar-model` (di Grade 6 = puncak benangnya sejak Grade 2) memegang
 *    perbandingannya: dua batang berdampingan, satu 2 bagian, satu 3 bagian.
 *
 * **Batang di sini adalah model perbandingan, bukan grafik berskala.** `Bars` tidak
 * punya sumbu berangka (utang kualitas di BUILD-STATE.md), jadi anak tidak pernah
 * diminta membaca nilai dari panjangnya; yang dibaca adalah "yang mana lebih
 * banyak bagian". Untuk rasio itu pemakaian yang sah — persis seperti bar persen
 * di `g5-u3`, angka pastinya selalu ada di teks soal.
 *
 * **Bentuk rasio utuh (`3 : 5`) selalu lewat `choose-text`.** Keypad hanya menerima
 * satu bilangan, jadi yang boleh diketik anak selalu SATU angka: banyak bagian
 * seluruhnya, atau salah satu sisi rasionya.
 */
export const whatIsARatio: ContentModule = {
  id: 'g6-u2-m1',
  unitId: 'g6-u2',
  grade: 6,
  title: 'What Is a Ratio',
  icon: '⚖️',
  prereq: ['g6-u1-m6'],
  skills: ['ratio-meaning', 'ratio-total-parts'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'keypad', 'choose-number', 'compare-symbol'],
  visuals: ['counter-objects', 'bar-model', 'number-bond', 'pictogram'],
  vocab: ['ratio'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap two red dots.',
      visual: { kind: 'counter-objects', count: 6, icon: '🔴' },
      action: 'tap-count',
      target: 2,
      hint: 'Two red dots for three blue.',
    },
    {
      // Batang berdampingan = model perbandingan. Panjangnya hanya menunjukkan
      // "yang mana lebih banyak bagian"; angkanya ada di label dan di teks.
      stage: 'pictorial',
      prompt: 'Two red parts and three blue parts.',
      visual: { kind: 'bars', lengths: [0.4, 0.6], labels: ['2', '3'] },
      action: 'watch',
    },
    {
      // Benang `number-bond` Grade 6 = rasio (grades-2-6.md). Bentuk yang sama
      // yang dipakai anak sejak Grade 1 untuk part–whole sekarang memegang
      // banyaknya BAGIAN sebuah rasio — itu yang dipakai lagi di m4.
      stage: 'pictorial',
      prompt: 'Two and three make five parts.',
      visual: { kind: 'number-bond', whole: 5, parts: [2, 3] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'The ratio is 2 : 3.',
      visual: { kind: 'bars', lengths: [0.4, 0.6], labels: ['2', '3'] },
      action: 'watch',
    },
    {
      // Urutan itu bagian dari artinya. Tanpa layar ini anak membaca rasio
      // sebagai "dua angka", dan 3 : 2 akan terasa sama saja dengan 2 : 3.
      stage: 'abstract',
      prompt: '3 : 2 is a different ratio.',
      visual: { kind: 'bars', lengths: [0.6, 0.4], labels: ['3', '2'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Menuliskan rasionya. Pilihan kedua membalik urutan (miskonsepsi utama
      // modul ini), ketiga dan keempat memakai KESELURUHAN sebagai salah satu
      // sisi — kesalahan part-to-whole lawan part-to-part.
      type: 'choose-text',
      skill: 'ratio-meaning',
      params: { r: [1, 9], b: [1, 9] },
      answer: () => 0,
      text: (p) => `${p.r} red and ${p.b} blue. Which ratio?`,
      options: (p) => ratioOptions(p.r as number, p.b as number),
      exclude: (p) =>
        (p.r as number) === (p.b as number) ||
        !allUnique(ratioOptions(p.r as number, p.b as number)),
    },
    {
      // Satu angka yang boleh diketik: banyaknya bagian seluruhnya. Ini yang
      // dipakai kembali di m4 saat membagi jumlah menurut rasio, jadi ia
      // dilatih di sini lebih dulu tanpa jumlah yang ikut membebani.
      type: 'keypad',
      skill: 'ratio-total-parts',
      params: { a: [1, 9], b: [1, 9] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: (p) => `${p.a} : ${p.b} is how many parts in all?`,
    },
    {
      // Membaca rasio dari gambar yang benar-benar bisa dihitung satu-satu.
      // `d` membalik arah pertanyaannya, jadi anak tidak bisa lulus dengan
      // selalu menghitung baris pertama — dan pengecoh miskonsepsinya adalah
      // persis jawaban anak yang mengabaikan urutan.
      type: 'choose-number',
      skill: 'ratio-meaning',
      params: { r: [1, 8], b: [1, 8], d: [0, 1] },
      answer: (p) => ((p.d as number) === 0 ? (p.r as number) : (p.b as number)),
      text: (p) =>
        (p.d as number) === 0
          ? `Apples to berries is ? : ${p.b}. Count them.`
          : `Berries to apples is ? : ${p.r}. Count them.`,
      visual: (p) => ({
        kind: 'pictogram',
        rows: [
          { label: 'Apple', icon: '🍎', count: p.r as number },
          { label: 'Berry', icon: '🫐', count: p.b as number },
        ],
      }),
      exclude: (p) => (p.r as number) === (p.b as number),
      distractors: 'near',
      misconception: (p) => ((p.d as number) === 0 ? (p.b as number) : (p.r as number)),
    },
    {
      // Membaca sisi mana yang lebih banyak. Kasus seri sengaja dibiarkan
      // muncul supaya `=` benar-benar pernah jadi jawaban.
      type: 'compare-symbol',
      skill: 'ratio-meaning',
      params: { a: [1, 9], b: [1, 9] },
      answer: (p) => Math.sign((p.a as number) - (p.b as number)),
      text: (p) => `In ratio ${p.a} : ${p.b}, red ? blue`,
    },
  ],
};
