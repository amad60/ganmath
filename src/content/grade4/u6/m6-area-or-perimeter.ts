import type { ContentModule } from '../../types';

const areaOf = (p: Record<string, number>) => (p.w as number) * (p.h as number);
const perimeterOf = (p: Record<string, number>) => 2 * ((p.w as number) + (p.h as number));

/**
 * Pilihan yang SAMA untuk kedua pertanyaan, hanya jawaban benarnya yang berpindah.
 * Anak tidak bisa lulus dengan mengenali "angka yang paling besar" atau "angka yang
 * genap" — dia harus membaca yang ditanyakan.
 */
const OPTIONS = (p: Record<string, number>) => [
  `${areaOf(p)}`,
  `${perimeterOf(p)}`,
  `${(p.w as number) + (p.h as number)}`,
  `${areaOf(p) * 2}`,
];

/**
 * Dua bilangan yang sama-sama sah tidak boleh muncul sebagai dua pilihan berbeda,
 * dan persegi panjang selalu dibuat mendatar supaya "sisi panjang" tidak ambigu.
 */
const badPair = (p: Record<string, number>) =>
  (p.h as number) >= (p.w as number) ||
  areaOf(p) === perimeterOf(p) ||
  areaOf(p) === (p.w as number) + (p.h as number);

/**
 * Modul penutup unit: memisahkan keliling dari luas.
 *
 * Kelirunya bukan pada hitungannya — anak bisa mengerjakan keduanya sejak m5 dan
 * sejak `g3-u6-m3`. Yang keliru adalah memilih operasi: melihat dua angka di gambar
 * lalu mengalikannya, apa pun yang ditanya. Karena itu setiap aturan di sini
 * menanyakan keliling dan luas SECARA BERGANTIAN pada gambar yang sama bentuknya.
 */
export const areaOrPerimeter: ContentModule = {
  id: 'g4-u6-m6',
  unitId: 'g4-u6',
  grade: 4,
  title: 'Area or Perimeter',
  icon: '⚖️',
  prereq: ['g4-u6-m5'],
  skills: ['area-vs-perimeter'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'keypad'],
  visuals: ['rectangle', 'array-grid', 'counter-objects'],
  vocab: ['inside'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four sides.',
      visual: { kind: 'counter-objects', count: 4, icon: '📏' },
      action: 'tap-count',
      target: 4,
      hint: 'Walk around the edge.',
    },
    {
      stage: 'pictorial',
      prompt: 'Perimeter is the walk around.',
      visual: { kind: 'rect', w: 5, h: 3 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Area is all the squares inside.',
      visual: { kind: 'array', rows: 3, cols: 5, square: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Perimeter 16 cm. Area 15 square cm.',
      visual: { kind: 'rect', w: 5, h: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'area-vs-perimeter',
      params: { w: [3, 9], h: [2, 8], q: [0, 1] },
      answer: (p) => ((p.q as number) === 1 ? 1 : 0),
      text: (p) =>
        `This ${p.w} by ${p.h} rectangle. Which is the ${(p.q as number) === 1 ? 'perimeter' : 'area'}?`,
      visual: (p) => ({ kind: 'rect', w: p.w as number, h: p.h as number }),
      exclude: badPair,
      options: OPTIONS,
    },
    {
      type: 'keypad',
      skill: 'area-vs-perimeter',
      params: { w: [3, 9], h: [2, 8], q: [0, 1] },
      answer: (p) => ((p.q as number) === 1 ? perimeterOf(p) : areaOf(p)),
      text: (p) =>
        `${p.w} cm by ${p.h} cm. Find the ${(p.q as number) === 1 ? 'perimeter' : 'area'}.`,
      visual: (p) => ({ kind: 'rect', w: p.w as number, h: p.h as number }),
      exclude: badPair,
    },
  ],
};
