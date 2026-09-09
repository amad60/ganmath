import type { ContentModule } from '../../types';

/**
 * Menjumlah dan mengurang pecahan berpenyebut BEDA — kasus termudahnya lebih dulu:
 * satu penyebut adalah kelipatan penyebut yang lain (1/2 + 1/6), jadi hanya SATU
 * pecahan yang perlu diubah. Kasus yang menuntut KPK dua arah menunggu m3.
 *
 * Urutan ini disengaja: kalau kedua pecahan harus diubah sekaligus di soal
 * pertama, anak menghadapi dua langkah baru dalam satu tarikan napas dan yang
 * tersisa hanyalah ritual menghafal langkah.
 *
 * Hasilnya dijaga tidak melewati satu utuh; pecahan campuran adalah m4.
 */
export const addUnlikeBottoms: ContentModule = {
  id: 'g5-u1-m2',
  unitId: 'g5-u1',
  grade: 5,
  title: 'Add Unlike Bottoms',
  icon: '➕',
  prereq: ['g5-u1-m1'],
  skills: ['add-unlike-bottom', 'subtract-unlike-bottom'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number'],
  visuals: ['fraction-shape', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap two parts.',
      visual: { kind: 'counter-objects', count: 8, icon: '🍕' },
      action: 'tap-count',
      target: 2,
      hint: 'Then tap two more parts.',
    },
    {
      stage: 'pictorial',
      prompt: 'One of four parts is shaded.',
      visual: { kind: 'fraction', parts: 4, shaded: 1, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: '1/4 is the same as 2/8.',
      visual: { kind: 'fraction', parts: 8, shaded: 2, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Add three more parts: 5/8.',
      visual: { kind: 'fraction', parts: 8, shaded: 5, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Make the bottoms equal, then add tops.',
      visual: { kind: 'fraction', parts: 8, shaded: 5, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'keypad',
      skill: 'add-unlike-bottom',
      params: { b: [2, 6], k: [2, 3], a: [1, 5], c: [1, 9] },
      answer: (p) => (p.a as number) * (p.k as number) + (p.c as number),
      text: (p) =>
        `${p.a}/${p.b} + ${p.c}/${(p.b as number) * (p.k as number)} = ?/${
          (p.b as number) * (p.k as number)
        }`,
      exclude: (p) => {
        const b = p.b as number;
        const k = p.k as number;
        const a = p.a as number;
        const c = p.c as number;
        // Hasil dijaga tidak melewati satu utuh — pecahan campuran adalah m4.
        return a >= b || c >= b * k || a * k + c > b * k;
      },
    },
    {
      type: 'keypad',
      skill: 'subtract-unlike-bottom',
      params: { b: [2, 6], k: [2, 3], a: [1, 5], c: [1, 9] },
      answer: (p) => (p.a as number) * (p.k as number) - (p.c as number),
      text: (p) =>
        `${p.a}/${p.b} − ${p.c}/${(p.b as number) * (p.k as number)} = ?/${
          (p.b as number) * (p.k as number)
        }`,
      exclude: (p) => {
        const b = p.b as number;
        const k = p.k as number;
        const a = p.a as number;
        const c = p.c as number;
        return a >= b || c >= b * k || a * k - c < 1;
      },
    },
    {
      // Penyebut bersamanya, ditanya terpisah. Ini langkah yang paling sering
      // dilewati anak, dan sekaligus tempat miskonsepsi terbesarnya tinggal.
      type: 'choose-number',
      skill: 'add-unlike-bottom',
      params: { b: [2, 6], k: [2, 3], a: [1, 5], c: [1, 9] },
      answer: (p) => (p.b as number) * (p.k as number),
      text: (p) =>
        `${p.a}/${p.b} + ${p.c}/${(p.b as number) * (p.k as number)} = ${
          (p.a as number) * (p.k as number) + (p.c as number)
        }/?`,
      exclude: (p) => {
        const b = p.b as number;
        const k = p.k as number;
        const a = p.a as number;
        const c = p.c as number;
        return a >= b || c >= b * k || a * k + c > b * k;
      },
      distractors: 'near',
      // Miskonsepsi khas: kedua penyebut ikut dijumlahkan.
      misconception: (p) => (p.b as number) + (p.b as number) * (p.k as number),
    },
  ],
};
