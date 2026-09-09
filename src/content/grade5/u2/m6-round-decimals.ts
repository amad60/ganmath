import type { ContentModule } from '../../types';

/** 34 → "3.4". */
const t = (n: number) => String(n / 10);
/** 463 → "4.63"; 47 → "0.47". */
const h = (n: number) => String(n / 100);

/**
 * Penutup unit: sebuah jawaban desimal belum selesai sampai ia ditulis sependek
 * yang diminta. Aturannya sendiri sudah dikuasai anak sejak `g2-u1-m6` dan
 * `g4-u1` (pembulatan bilangan bulat) — yang baru hanyalah tempat yang dilihat.
 *
 * Garis bilangan dipakai sebagai alat, bukan hiasan: 0.63 diletakkan di antara
 * 0.6 dan 0.7, dan pertanyaan "mana yang lebih dekat" terjawab dengan mata.
 * Ini benang `number-line` Grade 5 (pecahan & desimal) di grades-2-6.md, dan baru
 * mungkin sejak `178a9f6` — garis [0, 1] dengan `step: 0.1` sekarang benar-benar
 * bisa didaratkan penanda anak, dan lint `number-line-step` menjaganya.
 *
 * Batas sadar: modul ini TIDAK menguji angka nol di belakang. Jawaban dibandingkan
 * sebagai nilai (`sameAnswer`), jadi "1.0" dan "1" adalah jawaban yang sama, dan
 * membedakannya berarti menguji notasi — bukan pembulatan.
 *
 * Persen tidak diambil di sini; itu `g5-u3`.
 */
export const roundDecimals: ContentModule = {
  id: 'g5-u2-m6',
  unitId: 'g5-u2',
  grade: 5,
  title: 'Round Decimals',
  icon: '🎯',
  prereq: ['g5-u2-m5'],
  skills: ['round-decimal'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'number-line-drop', 'choose-text'],
  visuals: ['counter-objects', 'number-line'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap six of ten parts.',
      visual: { kind: 'counter-objects', count: 10, icon: '🟥' },
      action: 'tap-count',
      target: 6,
      hint: 'Six tenths in all.',
    },
    {
      stage: 'pictorial',
      prompt: 'Show 0.6 on the line.',
      visual: { kind: 'number-line', min: 0, max: 1, value: null, step: 0.1 },
      action: 'drop-on-line',
      target: 0.6,
      hint: 'Six jumps from zero.',
    },
    {
      stage: 'pictorial',
      prompt: '0.63 is nearer to 0.6.',
      visual: { kind: 'number-line', min: 0, max: 1, value: 0.63, marks: [0.6, 0.7], step: 0.1 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Look at the next digit.',
      visual: { kind: 'number-line', min: 0, max: 1, value: 0.6, marks: [0.6], step: 0.1 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Five or more rounds up.',
      visual: { kind: 'number-line', min: 0, max: 1, value: 0.7, marks: [0.7], step: 0.1 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Ke bilangan bulat terdekat: jawabannya bulat, jadi aturan ini tidak
      // memunculkan tombol titik sama sekali — kapabilitas keypad ikut ATURAN.
      type: 'keypad',
      skill: 'round-decimal',
      params: { a: [11, 99] },
      answer: (p) => Math.round((p.a as number) / 10),
      text: (p) => `Round ${t(p.a as number)} to the nearest whole.`,
      exclude: (p) => (p.a as number) % 10 === 0,
    },
    {
      // Ke persepuluhan terdekat: jawabannya desimal dan harus diketik anak.
      type: 'keypad',
      skill: 'round-decimal',
      params: { a: [101, 999] },
      answer: (p) => Math.round((p.a as number) / 10) / 10,
      text: (p) => `Round ${h(p.a as number)} to the nearest tenth.`,
      exclude: (p) => (p.a as number) % 10 === 0,
    },
    {
      type: 'choose-number',
      skill: 'round-decimal',
      params: { a: [11, 99] },
      answer: (p) => Math.round((p.a as number) / 10),
      text: (p) => `${t(p.a as number)} is nearest to which whole number?`,
      exclude: (p) => (p.a as number) % 10 === 0,
      distractors: 'near',
      // Miskonsepsi khas: bagian desimalnya dipotong, bukan dibulatkan —
      // 3.8 dijawab 3 karena "angka di depan titik adalah 3".
      misconception: (p) => Math.floor((p.a as number) / 10),
    },
    {
      // Pembulatan yang dilihat, bukan dihafal: penanda diletakkan di persepuluhan
      // terdekat. Garis [0, 1] dengan langkah 0.1 — jawabannya selalu mendarat.
      type: 'number-line-drop',
      skill: 'round-decimal',
      params: { a: [11, 99] },
      range: [0, 1],
      step: 0.1,
      answer: (p) => Math.round((p.a as number) / 10) / 10,
      text: (p) => `Round ${h(p.a as number)} to the nearest tenth. Show it.`,
      exclude: (p) => (p.a as number) % 10 === 0,
    },
    {
      // Pilihan kedua satu persepuluhan terlalu besar, ketiga angkanya tidak
      // dibulatkan sama sekali, keempat titiknya yang meleset.
      type: 'choose-text',
      skill: 'round-decimal',
      params: { a: [11, 99] },
      answer: () => 0,
      text: (p) => `Which is ${h(p.a as number)} rounded to a tenth?`,
      exclude: (p) => (p.a as number) % 10 === 0,
      options: (p) => {
        const a = p.a as number;
        const r = Math.round(a / 10);
        return [String(r / 10), String((r + 1) / 10), String(a / 100), String(r / 100)];
      },
    },
  ],
};
