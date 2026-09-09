import type { ContentModule } from '../../types';

/** Tanda minus yang DILIHAT anak: U+2212, sama dengan tombol `−` di keypad. */
const MINUS = '−';
const sgn = (n: number) => (n < 0 ? MINUS + String(-n) : String(n));

/** "1 step", "6 steps" — supaya bacaannya tetap wajar untuk setiap angka. */
const steps = (n: number) => `${n} step${n === 1 ? '' : 's'}`;

/**
 * Penutup unit: JARAK dari nol — nilai mutlak, sebelum lambang `|n|` diperkenalkan.
 *
 * Lambangnya sengaja tidak dipakai. Yang dipasang di sini adalah gagasannya, dan
 * gagasannya bisa dikatakan dalam satu kalimat yang sudah punya gambarnya sejak
 * `m2`: −6 dan 6 sama jauh dari nol, jadi jaraknya sama. Menambahkan notasi baru
 * di modul terakhir sebuah unit hanya akan menguji lambang, bukan idenya.
 *
 * Modul ini juga yang menutup lingkaran unit. `m1` mengajarkan bahwa sebuah angka
 * membawa arah; di sini arah itu dilepas lagi dengan sadar, dan anak melihat
 * kedua bagian sebuah bilangan bulat sebagai dua hal yang bisa dipisahkan:
 * seberapa jauh, dan ke mana.
 *
 * `speedTargetMs: 6000` — override, tapi jauh lebih ketat daripada `m4`/`m5`.
 * "Berapa jauh −7 dari nol" adalah pengenalan langsung (4 detik sudah cukup),
 * tetapi "berapa jauh −3 dari 4" adalah satu langkah hitungan pendek. Enam detik
 * adalah titik tengah yang jujur untuk campuran keduanya: cukup longgar untuk
 * soal jarak antar dua bilangan, tanpa memberi kelonggaran sebesar penjumlahan
 * melintasi nol.
 */
export const howFarFromZero: ContentModule = {
  id: 'g6-u1-m6',
  unitId: 'g6-u1',
  grade: 6,
  title: 'How Far From Zero',
  icon: '📏',
  prereq: ['g6-u1-m5'],
  skills: ['integer-distance'],
  kind: 'fact',
  fluencyTracked: true,
  speedTargetMs: 6000,
  questionTypes: ['keypad', 'choose-number', 'missing-number', 'number-line-drop'],
  visuals: ['counter-objects', 'number-line'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap six blue dots.',
      visual: { kind: 'counter-objects', count: 10, icon: '🔵' },
      action: 'tap-count',
      target: 6,
      hint: 'Six steps away from zero.',
    },
    {
      stage: 'pictorial',
      prompt: '−6 and 6 are both six away.',
      visual: { kind: 'number-line', min: -10, max: 10, value: -6, marks: [6], step: 1 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Show six steps left of zero.',
      visual: { kind: 'number-line', min: -10, max: 10, value: null, step: 1 },
      action: 'drop-on-line',
      target: -6,
      hint: 'Count six jumps back from zero.',
    },
    {
      stage: 'abstract',
      prompt: 'We keep the number, not the sign.',
      visual: { kind: 'number-line', min: -10, max: 10, value: -6, step: 1 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '−4 and 4 are four from zero.',
      visual: { kind: 'number-line', min: -10, max: 10, value: 0, marks: [-4, 4], step: 1 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Satu-satunya aturan ketik di seluruh unit yang TIDAK memunculkan tombol
      // minus — dan itu bukan kelalaian, itu materinya: jarak tidak pernah
      // negatif, jadi `answerCaps` memang tidak boleh melihat jawaban di bawah
      // nol di sini.
      type: 'keypad',
      skill: 'integer-distance',
      params: { a: [-9, 9] },
      answer: (p) => Math.abs(p.a as number),
      text: (p) => `How far is ${sgn(p.a as number)} from zero?`,
      exclude: (p) => (p.a as number) === 0,
    },
    {
      // Jarak antara DUA bilangan, bukan hanya dari nol. Miskonsepsinya: anak
      // mengurangkan angkanya saja tanpa memperhatikan bahwa keduanya berseberangan
      // (jarak −3 ke 4 dijawab 1, bukan 7). Kalau kedua tandanya sama, pengecoh itu
      // kebetulan sama dengan jawabannya dan generator melewatinya — persis
      // seperti yang seharusnya.
      type: 'choose-number',
      skill: 'integer-distance',
      params: { a: [-9, 9], b: [-9, 9] },
      answer: (p) => Math.abs((p.a as number) - (p.b as number)),
      text: (p) => `How far apart are ${sgn(p.a as number)} and ${sgn(p.b as number)}?`,
      exclude: (p) => (p.a as number) === (p.b as number),
      distractors: 'near',
      misconception: (p) => Math.abs(Math.abs(p.a as number) - Math.abs(p.b as number)),
    },
    {
      // Arah dipasang kembali ke jaraknya: "6 langkah ke kiri dari nol" adalah −6.
      // Dua arah dalam satu aturan, jadi tombol minus tidak membocorkan tandanya.
      type: 'missing-number',
      skill: 'integer-distance',
      params: { n: [1, 9], d: [0, 1] },
      answer: (p) => ((p.d as number) === 1 ? -(p.n as number) : (p.n as number)),
      text: (p) =>
        `Which number is ${steps(p.n as number)} ` +
        `${(p.d as number) === 1 ? 'left' : 'right'} of zero?`,
    },
    {
      // Jaraknya diletakkan di garis yang bermin negatif: anak melihat bilangan
      // negatifnya di soal, lalu menaruh penanda di sisi kanan nol. Jawabannya
      // positif — lint melarang jawaban negatif pada tipe soal non-ketik.
      type: 'number-line-drop',
      skill: 'integer-distance',
      params: { a: [-9, 9] },
      range: [-10, 10],
      step: 1,
      answer: (p) => Math.abs(p.a as number),
      text: (p) => `${sgn(p.a as number)} is how far from zero? Show it.`,
      exclude: (p) => (p.a as number) === 0,
    },
  ],
};
