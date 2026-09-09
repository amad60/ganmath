import type { ContentModule } from '../../types';

/** Tanda minus yang DILIHAT anak: U+2212, sama dengan tombol `−` di keypad. */
const MINUS = '−';
const sgn = (n: number) => (n < 0 ? MINUS + String(-n) : String(n));

/**
 * Mengurangi melintasi nol — dan di sinilah janji Grade 1 akhirnya dicabut.
 * Selama lima kelas "3 take away 7" adalah soal yang tidak boleh ditulis; sejak
 * modul ini soal itu punya jawaban, dan jawabannya ada di sebelah kiri nol.
 *
 * Aturan gambarnya tetap satu: mengurangi adalah MELOMPAT KE KIRI. Dari situ
 * bentuk kedua jatuh dengan sendirinya — `a − (−b)` melompat ke kiri sebanyak
 * "minus b" langkah, dan melompat ke kiri sejauh langkah negatif berarti bergerak
 * ke KANAN. Itu satu-satunya tempat di unit ini yang benar-benar butuh dilihat
 * dulu sebelum bisa dihafal, dan karena itu layar Learn menutupnya dengan satu
 * kalimat pendek: "Minus a minus jumps right."
 *
 * Ketiga aturan ketik bisa berjawaban positif maupun negatif, jadi tombol `−` di
 * keypad selalu ada dan tidak pernah menjawab soalnya lebih dulu (`answerCaps`
 * menurunkan kapabilitas per ATURAN, bukan per soal).
 *
 * `speedTargetMs: 9000` — override paling longgar di unit ini, satu detik di atas
 * `m4`. Alasannya: pengurangan melintasi nol butuh satu langkah lebih banyak
 * daripada penjumlahan (turun sampai nol, lalu teruskan sisanya ke kiri), dan
 * bentuk `a − (−b)` menambahkan satu keputusan tanda sebelum berhitung sama
 * sekali. Presedennya `g4-u2-m3` (hitung dua langkah, 9000). Kecepatan tidak
 * pernah menggagalkan modul (CLAUDE.md §6) — ambang yang terlalu ketat hanya
 * membuat anak yang caranya benar dikirim ke Speed Round berulang kali.
 */
export const takeAwayAcrossZero: ContentModule = {
  id: 'g6-u1-m5',
  unitId: 'g6-u1',
  grade: 6,
  title: 'Take Away Across Zero',
  icon: '➖',
  prereq: ['g6-u1-m4'],
  skills: ['subtract-integers'],
  kind: 'fact',
  fluencyTracked: true,
  speedTargetMs: 9000,
  questionTypes: ['keypad', 'missing-number', 'choose-number'],
  visuals: ['counter-objects', 'number-line'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three red blocks.',
      visual: { kind: 'counter-objects', count: 7, icon: '🟥' },
      action: 'tap-count',
      target: 3,
      hint: 'Take away more than you have.',
    },
    {
      stage: 'pictorial',
      prompt: 'We start at 3.',
      visual: { kind: 'number-line', min: -10, max: 10, value: 3, marks: [0], step: 1 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: '3 take away 7. Show the answer.',
      visual: { kind: 'number-line', min: -10, max: 10, value: null, step: 1 },
      action: 'drop-on-line',
      target: -4,
      hint: 'Seven jumps left from 3.',
    },
    {
      stage: 'abstract',
      prompt: 'Jump left past zero.',
      visual: { kind: 'number-line', min: -10, max: 10, value: -4, marks: [3], step: 1 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Minus a minus jumps right.',
      visual: { kind: 'number-line', min: -10, max: 10, value: 5, marks: [3], step: 1 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Pengurang boleh jauh lebih besar daripada yang dikurangi (sampai 15),
      // supaya sebagian besar soal benar-benar melintasi nol dan bukan
      // pengurangan biasa yang sudah dikuasai anak sejak Grade 1.
      type: 'keypad',
      skill: 'subtract-integers',
      params: { a: [1, 9], b: [2, 15] },
      answer: (p) => (p.a as number) - (p.b as number),
      text: (p) => `${p.a} ${MINUS} ${p.b} = ?`,
    },
    {
      // Mengurangi bilangan negatif. Titik berangkatnya boleh negatif juga, jadi
      // "bergerak ke kanan" tidak selalu berarti "mendarat di angka positif" —
      // −9 − (−2) tetap −7, dan anak yang menghafal "minus minus jadi plus" tanpa
      // melihat garisnya akan tersandung persis di situ.
      type: 'keypad',
      skill: 'subtract-integers',
      params: { a: [-9, 9], b: [1, 9] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: (p) => `${sgn(p.a as number)} ${MINUS} (${MINUS}${p.b}) = ?`,
    },
    {
      // Yang hilang adalah PENGURANGNYA, dan hasilnya boleh negatif.
      type: 'missing-number',
      skill: 'subtract-integers',
      params: { a: [-9, 9], c: [-9, 9] },
      answer: (p) => (p.a as number) - (p.c as number),
      text: (p) => `${sgn(p.a as number)} ${MINUS} ? = ${sgn(p.c as number)}`,
    },
    {
      // Pengecoh miskonsepsi untuk modul `fact`: anak yang membaca `− (−b)`
      // sebagai `− b` akan menjawab a − b. Dijaga ≥0 lewat `exclude` supaya
      // pengecohnya benar-benar bisa muncul di tombol (generator memagari
      // pilihan angka di ≥0).
      type: 'choose-number',
      skill: 'subtract-integers',
      params: { a: [2, 9], b: [1, 8] },
      answer: (p) => (p.a as number) + (p.b as number),
      text: (p) => `What is ${p.a} ${MINUS} (${MINUS}${p.b})?`,
      exclude: (p) => (p.b as number) > (p.a as number),
      distractors: 'near',
      misconception: (p) => (p.a as number) - (p.b as number),
    },
  ],
};
