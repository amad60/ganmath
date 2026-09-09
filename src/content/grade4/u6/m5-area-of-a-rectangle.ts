import type { ContentModule } from '../../types';

const areaOf = (p: Record<string, number>) => (p.w as number) * (p.h as number);
/** Persegi panjang selalu digambar mendatar supaya sisi panjangnya jelas mana. */
const tallerThanWide = (p: Record<string, number>) => (p.h as number) > (p.w as number);

/**
 * Rumus luas, dan sengaja BUKAN sebagai aturan baru yang harus dihafal: petak yang
 * dihitung anak di m4 tersusun dalam baris — jadi mengalikan kedua sisi hanyalah
 * cara cepat menghitung petak yang sama.
 *
 * Aturan ketiga (`missing-number`) membalik arahnya: diberi luas, cari sisi yang
 * hilang. Anak yang hanya menghafal "kali" tersandung di situ, dan itu memang
 * gunanya — pola yang sama sudah dipakai `g3-u6-m4` untuk keliling.
 */
export const areaOfARectangle: ContentModule = {
  id: 'g4-u6-m5',
  unitId: 'g4-u6',
  grade: 4,
  title: 'Area of a Rectangle',
  icon: '⬜',
  prereq: ['g4-u6-m4'],
  skills: ['area-rectangle'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'missing-number'],
  visuals: ['rectangle', 'array-grid', 'counter-objects'],
  vocab: ['wide'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four squares in a row.',
      visual: { kind: 'counter-objects', count: 4, icon: '🟦' },
      action: 'tap-count',
      target: 4,
      hint: 'This row is four long.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three rows of four squares.',
      visual: { kind: 'array', rows: 3, cols: 4, square: true },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Four cm long, three cm wide.',
      visual: { kind: 'rect', w: 4, h: 3 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Area is 4 times 3 = 12.',
      visual: { kind: 'rect', w: 4, h: 3 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'keypad',
      skill: 'area-rectangle',
      params: { w: [2, 9], h: [2, 9] },
      answer: areaOf,
      text: (p) => `${p.w} cm by ${p.h} cm. Area?`,
      visual: (p) => ({ kind: 'rect', w: p.w as number, h: p.h as number }),
      exclude: tallerThanWide,
    },
    {
      type: 'choose-number',
      skill: 'area-rectangle',
      params: { w: [2, 9], h: [2, 9] },
      answer: areaOf,
      text: () => 'What is the area?',
      visual: (p) => ({ kind: 'rect', w: p.w as number, h: p.h as number }),
      exclude: tallerThanWide,
      distractors: 'near',
      // Miskonsepsi terbesar unit ini: menjumlah keliling saat diminta luas.
      misconception: (p) => 2 * ((p.w as number) + (p.h as number)),
    },
    {
      type: 'missing-number',
      skill: 'area-rectangle',
      params: { w: [2, 9], h: [2, 9] },
      answer: (p) => p.h as number,
      text: (p) => `Area ${areaOf(p)}. Long side ${p.w}. Short side?`,
      exclude: (p) => (p.h as number) >= (p.w as number),
      distractors: 'near',
      // Mengurangi alih-alih membagi — kesalahan khas soal luas terbalik.
      misconception: (p) => areaOf(p) - (p.w as number),
    },
  ],
};
