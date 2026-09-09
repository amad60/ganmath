import type { ContentModule } from '../../types';

/**
 * Gerbang unit persen. Satu kalimat isinya: **persen adalah perseratusan yang
 * diberi nama lain**. Anak sudah punya perseratusan sejak `g4-u5-m3` (kisi 10 × 10)
 * dan sudah menulisnya sebagai desimal di `g5-u2` — yang benar-benar baru di sini
 * hanyalah lambang `%` dan kebiasaan bahwa penyebutnya selalu 100.
 *
 * Karena itu materinya membuka dengan kisi yang sama persis, bukan dengan definisi:
 * satu baris kisi = sepuluh perseratusan = 10%. Yang dilihat anak tidak berubah,
 * hanya cara menyebutnya.
 *
 * Batang (`bars`) mulai dipakai di sini sebagai **bar model persen** — itu benang
 * merah `bar-model` untuk Grade 5 di grades-2-6.md. Batang atas selalu satu utuh
 * (100%), batang bawah bagian yang dibicarakan. Batangnya sengaja tidak pernah jadi
 * satu-satunya sumber jawaban: `Bars` belum punya sumbu berangka (lihat utang
 * kualitas di BUILD-STATE.md), jadi ia menunjukkan BESARAN, sementara angka
 * pastinya selalu ada di teks soal.
 *
 * Gagasan yang paling sering hilang di modul persen: **satu utuh = 100%**, jadi
 * bagian yang tersisa adalah 100 dikurangi bagiannya. Dua aturan menyerangnya dari
 * dua arah (`missing-number` dan `choose-number`) karena itulah yang dipakai lagi
 * di `m4` saat diskon: "20% off" berarti yang dibayar 80%.
 */
export const outOfOneHundred: ContentModule = {
  id: 'g5-u3-m1',
  unitId: 'g5-u3',
  grade: 5,
  title: 'Out of One Hundred',
  icon: '💯',
  prereq: ['g5-u2-m6'],
  skills: ['percent-meaning'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'missing-number', 'choose-text', 'choose-number'],
  visuals: ['counter-objects', 'array-grid', 'bar-model'],
  vocab: ['percent', 'hundred', 'whole', 'means', 'out', 'part', 'parts'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap ten small parts.',
      visual: { kind: 'counter-objects', count: 10, icon: '🟩' },
      action: 'tap-count',
      target: 10,
      hint: 'Ten of one hundred parts.',
    },
    {
      // Kisi yang sama dengan g4-u5-m3. Anak sudah tahu ini seratus bagian;
      // yang ditambahkan hanya namanya.
      stage: 'pictorial',
      prompt: 'One hundred parts make one whole.',
      visual: { kind: 'array', rows: 10, cols: 10 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'One row is ten percent.',
      visual: { kind: 'array', rows: 10, cols: 10, highlightRow: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Percent means out of one hundred.',
      visual: { kind: 'bars', lengths: [1, 0.25], labels: ['1', '%'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '25 percent and 75 percent make 100.',
      visual: { kind: 'bars', lengths: [1, 0.25, 0.75], labels: ['1', 'a', 'b'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Definisinya sendiri, ditulis dua arah dalam satu baris. Sengaja mudah:
      // ini gerbang unit, dan anak harus keluar dari sini yakin bahwa penyebut
      // persen SELALU seratus. Batangnya memberi besaran, angkanya ada di teks.
      type: 'keypad',
      skill: 'percent-meaning',
      params: { p: [1, 99] },
      answer: (p) => p.p as number,
      text: (p) => `${p.p}/100 = ?%`,
      visual: (p) => ({ kind: 'bars', lengths: [1, (p.p as number) / 100], labels: ['1', '?'] }),
    },
    {
      // Satu utuh = 100%. Inilah yang dipakai ulang di m4 (diskon), jadi ia
      // dilatih di sini lebih dulu tanpa uang yang ikut membebani.
      type: 'missing-number',
      skill: 'percent-meaning',
      params: { p: [1, 99] },
      answer: (p) => 100 - (p.p as number),
      text: (p) => `${p.p}% + ?% = 100%`,
    },
    {
      // Pilihan kedua adalah persepuluhan (penyebut 10 dipakai karena "persen
      // terdengar seperti sepuluh"), ketiga pecahan yang dibalik, keempat
      // persen dibaca sebagai perkalian.
      type: 'choose-text',
      skill: 'percent-meaning',
      params: { p: [1, 99] },
      answer: () => 0,
      text: (p) => `Which one means ${p.p}%?`,
      options: (p) => [`${p.p}/100`, `${p.p}/10`, `100/${p.p}`, `${p.p} × 100`],
    },
    {
      // Kisi 10 × 10 dibaca sebagai persen. Miskonsepsi yang dibidik: menjawab
      // jumlah BARIS, bukan jumlah kotak — 3 baris dijawab 3%, bukan 30%.
      type: 'choose-number',
      skill: 'percent-meaning',
      params: { r: [1, 9] },
      answer: (p) => (p.r as number) * 10,
      text: (p) => `A 10 by 10 grid has ${p.r} rows shaded. What percent?`,
      distractors: 'near',
      distractorUnit: 10,
      misconception: (p) => p.r as number,
    },
  ],
};
