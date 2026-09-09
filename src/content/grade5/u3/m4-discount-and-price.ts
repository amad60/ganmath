import type { ContentModule } from '../../types';

/** Rupiah seperti yang tercetak di label harga: Rp30.000. */
const rp = (v: number) => `Rp${v.toLocaleString('id-ID')}`;

/** Diskon yang benar-benar ada di toko, dan semuanya membagi 100 dengan rapi. */
const OFF = [10, 20, 25, 50];

/**
 * Persen di tempat anak paling sering bertemu dengannya: label diskon.
 *
 * **Uangnya Rupiah** — keputusan yang sama dengan modul uang `g2-u7`/`g3-u7`
 * (lihat docs/curriculum/README.md, "Yang masih menunggu user"): bahasa app
 * memang English, tapi uang yang dipegang anak bukan Dollar. Harga dipilih
 * Rp10.000–Rp90.000 karena itu rentang jajan yang masuk akal, DAN karena
 * jawabannya harus muat di keypad: harga terbesar × 90% = 81.000, lima digit dari
 * jatah enam (`MAX_ANSWER_DIGITS`). Rp150.000 sudah memakan enam digit sendirian
 * dan tidak menyisakan ruang untuk salah ketik.
 *
 * `kind: 'application'` — ini memakai persen di situasi nyata, bukan konsep baru,
 * jadi kecepatannya tidak dinilai (CLAUDE.md §6). Materi tetap ditulis melewati
 * concrete → pictorial → abstract meski linter tidak mewajibkannya untuk
 * `application`: anak yang baru bertemu kata "discount" tetap butuh gambarnya.
 *
 * Inti pedagogisnya satu kalimat, dan itu langsung memakai `m1`: **"20% off"
 * berarti yang dibayar 80%.** Dua langkah (cari diskon, lalu kurangi) dan satu
 * langkah (langsung cari 80%) sama-sama benar; keduanya muncul sebagai aturan
 * terpisah supaya anak melihat bahwa keduanya bertemu di angka yang sama.
 *
 * Kesalahan yang paling sering: menjawab besar diskonnya saat yang ditanya harga
 * akhirnya. Itu dipasang sebagai `misconception` pada aturan pilihan, jadi
 * jawaban salah anak bisa dibaca sebagai diagnosis, bukan sekadar angka.
 */
export const discountAndPrice: ContentModule = {
  id: 'g5-u3-m4',
  unitId: 'g5-u3',
  grade: 5,
  title: 'Discount and Price',
  icon: '🏷️',
  prereq: ['g5-u3-m3'],
  skills: ['discount', 'sale-price'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'choose-text'],
  visuals: ['counter-objects', 'money', 'bar-model'],
  vocab: ['percent', 'money', 'note', 'notes', 'bag', 'cost', 'costs', 'off', 'leaves', 'discount', 'price', 'means', 'pay'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five money notes.',
      visual: { kind: 'counter-objects', count: 10, icon: '💵' },
      action: 'tap-count',
      target: 5,
      hint: 'Half of ten notes.',
    },
    {
      stage: 'pictorial',
      prompt: 'The bag costs 20.000.',
      visual: { kind: 'money', items: [20000] },
      action: 'watch',
    },
    {
      // Gambar yang membawa seluruh gagasan modul: yang dipotong kecil, yang
      // dibayar besar, dan keduanya satu batang yang sama.
      stage: 'pictorial',
      prompt: '25 percent off leaves 75 percent.',
      visual: { kind: 'bars', lengths: [1, 0.25, 0.75], labels: ['1', 'a', 'b'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Take the discount from the price.',
      visual: { kind: 'money', items: [20000, 5000] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '20 percent off means you pay 80 percent.',
      visual: { kind: 'bars', lengths: [1, 0.8], labels: ['1', '?'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Langkah pertama saja: berapa yang dipotong. Yang diketik adalah rupiah
      // polos (2500), bukan "Rp2.500" — keypad hanya punya angka, dan titik
      // ribuan bukan matematika yang sedang diuji.
      type: 'keypad',
      skill: 'discount',
      params: { i: [0, 3], k: [1, 9] },
      answer: (p) => (p.k as number) * 100 * (OFF[p.i as number] as number),
      text: (p) => `${rp((p.k as number) * 10000)} bag, ${OFF[p.i as number]}% off. Discount?`,
    },
    {
      // Harga akhir. Batangnya menunjukkan bagian yang DIBAYAR, bukan yang
      // dipotong — itu pengingat visual bahwa 20% off = 80% dibayar.
      type: 'keypad',
      skill: 'sale-price',
      params: { i: [0, 3], k: [1, 9] },
      answer: (p) => (p.k as number) * 100 * (100 - (OFF[p.i as number] as number)),
      text: (p) => `${rp((p.k as number) * 10000)} shoes, ${OFF[p.i as number]}% off. New price?`,
      visual: (p) => ({
        kind: 'bars',
        lengths: [1, (100 - (OFF[p.i as number] as number)) / 100],
        labels: ['1', '?'],
      }),
    },
    {
      // Miskonsepsi khas seluruh modul: menjawab besar diskonnya padahal yang
      // ditanya harga yang dibayar. Jawaban selalu kelipatan 500, jadi pengecoh
      // berjarak 1 akan mustahil — `distractorUnit` menjaganya.
      type: 'choose-number',
      skill: 'sale-price',
      params: { i: [0, 3], k: [1, 9] },
      answer: (p) => (p.k as number) * 100 * (100 - (OFF[p.i as number] as number)),
      text: (p) => `${rp((p.k as number) * 10000)} cake, ${OFF[p.i as number]}% off. Pay how much?`,
      distractors: 'near',
      distractorUnit: 1000,
      misconception: (p) => (p.k as number) * 100 * (OFF[p.i as number] as number),
    },
    {
      // Diskon dipakai untuk memutuskan, bukan sekadar dihitung: harga bertanda
      // diskon lawan harga polos. Pilihan ketiga ("same") benar-benar bisa
      // terjadi (Rp20.000 diskon 50% = Rp10.000), jadi ia bukan pilihan hiasan.
      type: 'choose-text',
      skill: 'sale-price',
      params: { i: [0, 3], k: [1, 9], m: [1, 9] },
      answer: (p) => {
        const a = (p.k as number) * 100 * (100 - (OFF[p.i as number] as number));
        const b = (p.m as number) * 10000;
        return a < b ? 0 : a > b ? 1 : 2;
      },
      text: (p) =>
        `Shop A: ${rp((p.k as number) * 10000)}, ${OFF[p.i as number]}% off. Shop B: ${rp((p.m as number) * 10000)}. Cheaper?`,
      options: () => ['shop A', 'shop B', 'both the same'],
    },
  ],
};
