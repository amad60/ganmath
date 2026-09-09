import type { ContentModule } from '../../types';

/**
 * Tangga satuan panjang: mm → cm → m → km, masing-masing sepuluh, seratus, seribu.
 *
 * Grade 2 sudah memperkenalkan centimetre dan metre sebagai NAMA (`g2-u6-m1`,
 * `m2`); yang baru di sini adalah **berpindah di antaranya**. Dan pindahnya dua
 * arah: mengalikan (satuan besar → satuan kecil) dan membagi (sebaliknya).
 *
 * Arah membagi itulah alasan modul ini baru mungkin sekarang. Sampai `dae385c`
 * keypad tidak punya titik desimal, jadi "250 m = ? km" hanya bisa ditanyakan
 * lewat pilihan — dan anak tidak pernah menuliskan sendiri 0.25, padahal itu
 * justru keterampilannya. Sekarang bisa: `answerCaps` melihat seluruh aturan
 * berjawaban pecahan desimal dan memunculkan tombol titiknya. Kapabilitas itu
 * diturunkan PER ATURAN, jadi munculnya tombol tidak membocorkan jawaban soal
 * yang sedang tampil.
 *
 * Aturan pembanding sengaja dibuat berselisih tipis (dua satuan terkecil saja),
 * dengan alasan yang sama seperti di `m3`: "3 m ? 12 cm" tidak menguji konversi,
 * ia hanya menguji mana angka yang lebih besar.
 */
export const changeTheLengthUnit: ContentModule = {
  id: 'g5-u5-m4',
  unitId: 'g5-u5',
  grade: 5,
  title: 'Change the Length Unit',
  icon: '📏',
  prereq: ['g5-u5-m3'],
  skills: ['length-to-smaller', 'length-to-bigger', 'compare-length-units'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'compare-symbol'],
  visuals: ['counter-objects', 'number-line', 'bar-model'],
  vocab: ['millimetre', 'millimetres', 'mm', 'm', 'kilometre', 'kilometres', 'km'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap ten millimetres.',
      visual: { kind: 'counter-objects', count: 10, icon: '📏' },
      action: 'tap-count',
      target: 10,
      hint: 'Ten millimetres make one centimetre.',
    },
    {
      stage: 'pictorial',
      prompt: 'Ten mm make one cm.',
      visual: { kind: 'number-line', min: 0, max: 10, value: 10 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'One metre is 100 cm.',
      visual: { kind: 'bars', lengths: [1, 0.01], labels: ['m', 'cm'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '1000 m make one km.',
      visual: { kind: 'bars', lengths: [1, 0.001], labels: ['km', 'm'] },
      action: 'watch',
    },
    {
      // Aturan yang menjaga anak dari kesalahan arah: nilai bendanya tidak berubah,
      // yang berubah hanya satuannya — maka satuan kecil butuh angka besar.
      stage: 'abstract',
      prompt: 'A smaller unit needs a bigger number.',
      visual: { kind: 'bars', lengths: [1, 0.1], labels: ['m', 'cm'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Satuan besar → kecil: mengalikan. Jawabannya selalu bulat, jadi aturan ini
      // tidak memunculkan tombol titik sama sekali.
      type: 'keypad',
      skill: 'length-to-smaller',
      params: { n: [2, 99] },
      answer: (p) => (p.n as number) * 10,
      text: (p) => `${p.n} cm = ? mm`,
    },
    {
      type: 'keypad',
      skill: 'length-to-smaller',
      params: { n: [2, 60] },
      answer: (p) => (p.n as number) * 100,
      text: (p) => `${p.n} m = ? cm`,
    },
    {
      // Arah sebaliknya, dan di sinilah desimalnya: 700 m adalah 0.7 km, dan anak
      // yang menuliskan 7 km sedang menggeser titik satu tempat, bukan tiga.
      type: 'keypad',
      skill: 'length-to-bigger',
      params: { n: [1, 99] },
      answer: (p) => (p.n as number) / 10,
      text: (p) => `${(p.n as number) * 100} m = ? km`,
    },
    {
      // Arah membagi sekali lagi, satu tangga lebih pendek: mm → cm.
      type: 'keypad',
      skill: 'length-to-bigger',
      params: { n: [11, 199] },
      answer: (p) => (p.n as number) / 10,
      text: (p) => `${p.n} mm = ? cm`,
      exclude: (p) => (p.n as number) % 10 === 0,
    },
    {
      // Jawaban di sini SELALU kelipatan 100, jadi pengecoh berjarak 1 (299, 301)
      // bisa dicoret anak tanpa berpikir. `distractorUnit` menjaganya — aturan lint
      // `distractor-scale` yang menuntutnya.
      type: 'choose-number',
      skill: 'length-to-smaller',
      params: { n: [2, 9] },
      answer: (p) => (p.n as number) * 100,
      text: (p) => `How many cm are in ${p.n} m?`,
      distractorUnit: 100,
      distractors: 'near',
      // Miskonsepsi: tangga metre → centimetre dikira sepuluh, seperti cm → mm.
      misconception: (p) => (p.n as number) * 10,
    },
    {
      // Selisihnya paling jauh dua sentimeter: satu-satunya jalan menjawab adalah
      // benar-benar mengubah satuannya lebih dulu.
      type: 'compare-symbol',
      skill: 'compare-length-units',
      params: { a: [1, 9], d: [0, 4] },
      answer: (p) => Math.sign(2 - (p.d as number)),
      text: (p) => `${p.a} m ? ${(p.a as number) * 100 + ((p.d as number) - 2) * 10} cm`,
    },
    {
      type: 'compare-symbol',
      skill: 'compare-length-units',
      params: { a: [2, 20], d: [0, 4] },
      answer: (p) => Math.sign(2 - (p.d as number)),
      text: (p) => `${p.a} cm ? ${(p.a as number) * 10 + (p.d as number) - 2} mm`,
    },
  ],
};
