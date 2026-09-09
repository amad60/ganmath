import type { ContentModule } from '../../types';

/** Tanda minus yang DILIHAT anak: U+2212, sama dengan tombol `−` di keypad. */
const MINUS = '−';
const sgn = (n: number) => (n < 0 ? MINUS + String(-n) : String(n));

/**
 * Puncak benang `number-line` yang dimulai di Grade 1 dengan garis 0–20:
 * garisnya kini menembus nol ke kiri (grades-2-6.md).
 *
 * Yang dipasang di sini hanya dua hal, dan keduanya tentang TEMPAT, bukan hitungan:
 * 1. Bilangan tumbuh ke kanan — aturan yang sudah dipakai anak sejak Grade 1
 *    ternyata tetap berlaku setelah melewati nol.
 * 2. Setiap bilangan punya lawan di seberang nol, sama jauh.
 *
 * **Semua garis di unit ini memakai `step: 1` eksplisit.** Langkah otomatis untuk
 * rentang [−10, 10] adalah 2 (`stepFor`: 20/10 dibulatkan ke deret 1/2/5), dan
 * garis yang melompat dua satuan tidak akan pernah bisa mendarat di −7. Lint
 * `number-line-step` yang menangkap hal itu, jadi step-nya ditulis, bukan ditebak.
 *
 * **Batas yang disadari:** aturan `number-line-drop` di unit ini selalu berjawaban
 * ≥0, karena lint melarang jawaban negatif pada tipe soal NON-KETIK — pengecoh
 * soal pilihan dibangun di sekitar jawaban dan dipagari ≥0. Jadi yang diminta di
 * garis adalah "letakkan LAWAN dari −6", sementara meletakkan bilangan negatifnya
 * sendiri dikerjakan anak di layar Learn (yang tidak dibatasi aturan itu), dan
 * menuliskan bilangan negatif dikerjakan lewat keypad.
 */
export const leftOfZero: ContentModule = {
  id: 'g6-u1-m2',
  unitId: 'g6-u1',
  grade: 6,
  title: 'Left of Zero',
  icon: '↔️',
  prereq: ['g6-u1-m1'],
  skills: ['place-integer', 'opposite-number'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['number-line-drop', 'keypad', 'choose-text'],
  visuals: ['counter-objects', 'number-line'],
  vocab: ['opposite'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four blue blocks.',
      visual: { kind: 'counter-objects', count: 9, icon: '🟦' },
      action: 'tap-count',
      target: 4,
      hint: 'Count four steps back from zero.',
    },
    {
      stage: 'pictorial',
      prompt: '4 and −4 are opposites.',
      visual: { kind: 'number-line', min: -10, max: 10, value: 4, marks: [-4], step: 1 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Show −7 on the line.',
      visual: { kind: 'number-line', min: -10, max: 10, value: null, step: 1 },
      action: 'drop-on-line',
      target: -7,
      hint: 'Seven jumps left from zero.',
    },
    {
      stage: 'abstract',
      prompt: 'Left of zero we count back.',
      visual: { kind: 'number-line', min: -10, max: 10, value: -7, step: 1 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Opposites are the same distance away.',
      visual: { kind: 'number-line', min: -10, max: 10, value: 0, marks: [-3, 3], step: 1 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Garisnya bermin negatif — itu materinya — tapi yang diletakkan anak adalah
      // lawan dari bilangan negatif, jadi jawabannya positif. Lihat catatan di
      // atas: jawaban negatif tidak sah untuk tipe soal non-ketik.
      type: 'number-line-drop',
      skill: 'opposite-number',
      params: { n: [1, 10] },
      range: [-10, 10],
      step: 1,
      answer: (p) => p.n as number,
      text: (p) => `Show the opposite of ${MINUS}${p.n}.`,
    },
    {
      // Dua arah dalam satu aturan: lawan dari −5 adalah 5, lawan dari 5 adalah −5.
      // Karena keduanya mungkin, tombol minus selalu muncul dan tidak membocorkan
      // tanda jawabannya — anak sendiri yang memutuskan menekannya.
      type: 'keypad',
      skill: 'opposite-number',
      params: { n: [1, 9], d: [0, 1] },
      answer: (p) => ((p.d as number) === 1 ? (p.n as number) : -(p.n as number)),
      text: (p) =>
        `What is the opposite of ${sgn((p.d as number) === 1 ? -(p.n as number) : (p.n as number))}?`,
    },
    {
      // Membaca posisi, bukan menuliskannya. Teksnya tetap sama di setiap soal,
      // tapi generator men-dedupe dengan kunci tipe + teks + GAMBAR — dan
      // gambarnya berbeda tiap soal, jadi soalnya tidak menyusut jadi satu.
      //
      // Pilihan kedua adalah lawannya (anak yang membaca jaraknya tapi lupa
      // arahnya), dua sisanya meleset satu langkah.
      type: 'choose-text',
      skill: 'place-integer',
      params: { n: [-9, 9] },
      answer: () => 0,
      text: () => 'Which number is the dot on?',
      exclude: (p) => (p.n as number) === 0,
      visual: (p) => ({
        kind: 'number-line',
        min: -10,
        max: 10,
        value: p.n as number,
        step: 1,
      }),
      options: (p) => {
        const n = p.n as number;
        return [sgn(n), sgn(-n), sgn(n + 1), sgn(n - 1)];
      },
    },
  ],
};
