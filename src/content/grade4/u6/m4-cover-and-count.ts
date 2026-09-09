import type { ContentModule } from '../../types';

const areaOf = (p: Record<string, number>) => (p.r as number) * (p.c as number);

/**
 * Luas diperkenalkan sebagai MENUTUPI, bukan sebagai rumus.
 *
 * Anak yang bertemu "panjang × lebar" lebih dulu akan mengalikan dua angka apa pun
 * yang tertulis di gambar — termasuk saat yang ditanya keliling. Karena itu di sini
 * belum ada perkalian sisi sama sekali: yang ada hanya petak yang menutupi bidang,
 * dan menghitungnya. Rumusnya baru datang di m5, sebagai jalan pintas untuk sesuatu
 * yang sudah anak percaya.
 *
 * Gambarnya memakai `array-grid` mode PERSEGI (`square`). Petak yang berdempetan
 * itulah gagasannya: bidang tertutup habis tanpa celah. Penanda bulat — bentuk lama
 * komponen ini — memaksa teksnya memakai kata "parts", dan kata itu justru menutupi
 * yang sedang diajarkan.
 */
export const coverAndCount: ContentModule = {
  id: 'g4-u6-m4',
  unitId: 'g4-u6',
  grade: 4,
  title: 'Cover and Count',
  icon: '🟦',
  prereq: ['g4-u6-m3'],
  skills: ['area-count'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid', 'rectangle', 'counter-objects'],
  vocab: ['area', 'cover'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap six squares.',
      visual: { kind: 'counter-objects', count: 6, icon: '🟦' },
      action: 'tap-count',
      target: 6,
      hint: 'Six squares cover this box.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three rows of four squares.',
      visual: { kind: 'array', rows: 3, cols: 4, square: true },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'One row holds four squares.',
      visual: { kind: 'array', rows: 3, cols: 4, highlightRow: 0, square: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Area is 12 square cm.',
      visual: { kind: 'rect', w: 4, h: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Teks tetap, gambar berubah: kunci dedupe generator memuat gambarnya.
      type: 'choose-number',
      skill: 'area-count',
      params: { r: [2, 6], c: [2, 8] },
      answer: areaOf,
      text: () => 'How many squares cover it?',
      visual: (p) => ({ kind: 'array', rows: p.r as number, cols: p.c as number, square: true }),
      distractors: 'near',
      // Miskonsepsi khas: menjumlah baris dan kolom alih-alih mengalikannya.
      misconception: (p) => (p.r as number) + (p.c as number),
    },
    {
      // Angkanya ditulis, jadi anak boleh berhenti menghitung satu-satu dan mulai
      // memakai baris × kolom — jembatan menuju rumus di m5.
      type: 'keypad',
      skill: 'area-count',
      params: { r: [2, 6], c: [2, 8] },
      answer: areaOf,
      text: (p) => `${p.r} rows of ${p.c}. What is the area?`,
      visual: (p) => ({ kind: 'array', rows: p.r as number, cols: p.c as number, square: true }),
    },
  ],
};
