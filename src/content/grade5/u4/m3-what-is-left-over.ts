import type { ContentModule } from '../../types';

/**
 * Pembagian yang **tidak habis**, dengan pembagi dua digit.
 *
 * `g3-u3-m6` memperkenalkan sisa pada bilangan kecil dan `g4-u2-m6` memperbesarnya;
 * yang baru di sini adalah pembagi dua digit — jadi anak harus menaksir dulu
 * (keterampilan `m2`) baru bisa tahu berapa yang tersisa.
 *
 * **Keputusan sadar: sisa, bukan desimal.** Pembagian tak habis punya dua jawaban
 * yang sama-sama benar (7 sisa 5, atau 7,25) dan mencampurnya dalam satu aturan
 * membuat anak tidak pernah tahu bentuk mana yang diminta — kotak jawaban yang
 * sama menerima dua hal berbeda. Unit ini memilih **sisa** dan memakainya
 * konsisten di ketiga aturan: hasil bagi selalu bilangan bulat, sisa selalu
 * bilangan bulat, keypad tidak pernah butuh titik desimal. Sisi desimalnya sudah
 * punya rumahnya sendiri di `g5-u2-m4` (membagi desimal), jadi tidak ada yang
 * hilang — yang dihindari hanyalah dua bentuk jawaban di satu tempat.
 *
 * Dua aturan pertama menanyakan dua bagian jawaban yang BERBEDA dari soal yang
 * bentuknya sama — sisa dan hasil bagi — karena tertukarnya kedua bilangan itu
 * adalah kesalahan paling sering di sini. Aturan ketiga menulis hubungan itu
 * secara utuh (pembagi × hasil bagi + sisa = yang dibagi), yang juga cara anak
 * memeriksa jawabannya sendiri.
 */
export const whatIsLeftOver: ContentModule = {
  id: 'g5-u4-m3',
  unitId: 'g5-u4',
  grade: 5,
  title: 'What Is Left Over',
  icon: '🍬',
  prereq: ['g5-u4-m2'],
  skills: ['divide-remainder-2-digit'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad', 'missing-number'],
  visuals: ['counter-objects', 'array-grid'],
  vocab: ['seventeen', 'remainder', 'divisor', 'always'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap seventeen dots.',
      visual: { kind: 'counter-objects', count: 17, icon: '🍬' },
      action: 'tap-count',
      target: 17,
      hint: 'Count them all.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three rows of five. Two left over.',
      visual: { kind: 'array', rows: 3, cols: 5 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write 17 ÷ 5 = 3 remainder 2.',
      visual: { kind: 'array', rows: 3, cols: 5 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'The remainder is always less than the divisor.',
      visual: { kind: 'array', rows: 3, cols: 5, highlightRow: 2 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Yang ditanya: SISA. Pengecoh miskonsepsi: hasil baginya — dua bilangan
      // yang paling sering tertukar di modul ini.
      type: 'choose-number',
      skill: 'divide-remainder-2-digit',
      params: { d: [11, 29], q: [3, 9], r: [1, 28] },
      answer: (p) => p.r as number,
      text: (p) =>
        `Share ${(p.d as number) * (p.q as number) + (p.r as number)} into ${p.d} groups. What is left?`,
      exclude: (p) => (p.r as number) >= (p.d as number),
      distractors: 'near',
      misconception: (p) => p.q as number,
    },
    {
      // Soal yang bentuknya sama, tapi yang ditanya HASIL BAGI. Anak harus
      // membaca, bukan mengenali bentuk soal.
      type: 'keypad',
      skill: 'divide-remainder-2-digit',
      params: { d: [11, 29], q: [3, 9], r: [1, 28] },
      answer: (p) => p.q as number,
      text: (p) =>
        `Share ${(p.d as number) * (p.q as number) + (p.r as number)} into ${p.d} groups. How many each?`,
      exclude: (p) => (p.r as number) >= (p.d as number),
    },
    {
      // Hubungan pembagiannya ditulis utuh — dan ini juga cara memeriksa jawaban.
      type: 'missing-number',
      skill: 'divide-remainder-2-digit',
      params: { d: [11, 25], q: [3, 9], r: [1, 24] },
      answer: (p) => p.q as number,
      text: (p) =>
        `${p.d} × ? + ${p.r} = ${(p.d as number) * (p.q as number) + (p.r as number)}`,
      exclude: (p) => (p.r as number) >= (p.d as number),
    },
    {
      type: 'keypad',
      skill: 'divide-remainder-2-digit',
      story: true,
      params: { d: [11, 29], q: [3, 9], r: [1, 28] },
      answer: (p) => p.q as number,
      text: (p) => `${(p.d as number) * (p.q as number) + (p.r as number)} cookies in bags of ${p.d}. How many full bags?`,
      exclude: (p) => (p.r as number) >= (p.d as number),
    },
    {
      type: 'keypad',
      skill: 'divide-remainder-2-digit',
      story: true,
      params: { d: [11, 29], q: [3, 9], r: [1, 28] },
      answer: (p) => p.q as number,
      text: (p) => `Ana puts ${(p.d as number) * (p.q as number) + (p.r as number)} books in boxes of ${p.d}. How many boxes are full?`,
      exclude: (p) => (p.r as number) >= (p.d as number),
    },
  ],
};
