import type { ContentModule } from '../../types';

/** 34 → "3.4". */
const t = (n: number) => String(n / 10);

/**
 * Desimal × desimal. Yang baru di sini bukan perkaliannya — itu sudah selesai di
 * `m2` — melainkan satu kenyataan yang berlawanan dengan seluruh pengalaman anak
 * sampai kelas lima: **hasilnya lebih KECIL daripada kedua angka yang dikalikan.**
 *
 * Karena itu tahap pictorial memakai kisi 10 × 10 (satu kotak = satu perseratusan,
 * persis seperti `g4-u5-m3`): 0.3 × 0.4 terlihat sebagai persegi 3 × 4 di dalam
 * kisi seratus kotak, dan kecilnya hasil menjadi sesuatu yang dilihat, bukan
 * sesuatu yang harus dipercaya.
 *
 * Aturannya sengaja tidak pernah melampaui dua tempat desimal di kedua faktor,
 * supaya jawaban tidak pernah lebih dari empat digit — batas ketik anak enam
 * digit, dan mengetik 48.51 sudah cukup panjang untuk anak sepuluh tahun.
 */
export const decimalTimesDecimal: ContentModule = {
  id: 'g5-u2-m3',
  unitId: 'g5-u2',
  grade: 5,
  title: 'Decimal Times Decimal',
  icon: '🔢',
  prereq: ['g5-u2-m2'],
  skills: ['multiply-decimals'],
  // Menghitung tempat desimal adalah penalaran nilai tempat, bukan fakta yang
  // diingat: modul ini sengaja TIDAK dinilai kecepatannya.
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'choose-text'],
  visuals: ['counter-objects', 'array-grid'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twelve small parts.',
      visual: { kind: 'counter-objects', count: 12, icon: '🟪' },
      action: 'tap-count',
      target: 12,
      hint: 'Three rows of four.',
    },
    {
      stage: 'pictorial',
      prompt: 'Ten rows of ten make one.',
      visual: { kind: 'array', rows: 10, cols: 10 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: '0.3 × 0.4 makes twelve hundredths.',
      visual: { kind: 'array', rows: 3, cols: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Tenths times tenths make hundredths.',
      visual: { kind: 'array', rows: 3, cols: 4 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Count the digits after the point.',
      visual: { kind: 'array', rows: 3, cols: 4 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Keduanya di bawah satu: inilah kasus yang hasilnya mengecil.
      type: 'keypad',
      skill: 'multiply-decimals',
      params: { a: [2, 9], b: [2, 9] },
      answer: (p) => ((p.a as number) * (p.b as number)) / 100,
      text: (p) => `0.${p.a} × 0.${p.b} = ?`,
    },
    {
      type: 'keypad',
      skill: 'multiply-decimals',
      params: { a: [11, 99], b: [11, 49] },
      answer: (p) => ((p.a as number) * (p.b as number)) / 100,
      text: (p) => `${t(p.a as number)} × ${t(p.b as number)} = ?`,
      exclude: (p) => (p.a as number) % 10 === 0 || (p.b as number) % 10 === 0,
    },
    {
      // Perkaliannya sendiri, dalam satuan perseratusan — jawabannya bilangan
      // bulat, jadi soalnya bisa dipilih dan letak titik tidak ikut diuji di sini.
      type: 'choose-number',
      skill: 'multiply-decimals',
      params: { a: [2, 9], b: [2, 9] },
      answer: (p) => (p.a as number) * (p.b as number),
      text: (p) => `0.${p.a} × 0.${p.b} is how many hundredths?`,
      distractors: 'near',
      // Miskonsepsi khas: tanda × dibaca sebagai +.
      misconception: (p) => (p.a as number) + (p.b as number),
    },
    {
      // Letak titiknya sendiri. Pilihan kedua adalah anak yang hanya menghitung
      // satu tempat desimal, bukan dua.
      type: 'choose-text',
      skill: 'multiply-decimals',
      params: { a: [11, 99], b: [2, 9] },
      answer: () => 0,
      text: (p) => `Which is ${t(p.a as number)} × 0.${p.b}?`,
      exclude: (p) => (p.a as number) % 10 === 0,
      options: (p) => {
        const n = (p.a as number) * (p.b as number);
        return [String(n / 100), String(n / 10), String(n), String(n / 1000)];
      },
    },
  ],
};
