import type { ContentModule } from '../../types';

/**
 * Membagi dengan pecahan. Aturan "balik lalu kali" adalah salah satu ritual paling
 * kosong di sekolah dasar, jadi ia TIDAK diperkenalkan lebih dulu di sini.
 *
 * Yang diperkenalkan lebih dulu adalah pertanyaannya: "ada berapa setengahan di
 * dalam 3?" Anak bisa menghitungnya dengan gambar dan menemukan 6 sendiri — dan
 * begitu dia melihat bahwa membagi dengan 1/2 memberi hasil yang LEBIH BESAR,
 * aturan membaliknya menjadi masuk akal, bukan mengejutkan.
 *
 * Miskonsepsi yang dijaga: lupa membalik, yaitu mengali lurus seperti m6. Pengecoh
 * b·d ada persis untuk itu, dan ia tidak pernah menabrak jawaban benar b·c karena
 * pembilang pembaginya selalu lebih kecil daripada penyebutnya.
 */
export const divideByAFraction: ContentModule = {
  id: 'g5-u1-m7',
  unitId: 'g5-u1',
  grade: 5,
  title: 'Divide by a Fraction',
  icon: '➗',
  prereq: ['g5-u1-m6'],
  skills: ['divide-by-fraction'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'choose-text'],
  visuals: ['fraction-shape', 'counter-objects'],
  vocab: ['flip'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap six halves.',
      visual: { kind: 'counter-objects', count: 6, icon: '🍕' },
      action: 'tap-count',
      target: 6,
      hint: 'Three wholes make six halves.',
    },
    {
      stage: 'pictorial',
      prompt: 'One whole is two halves.',
      visual: { kind: 'fraction', parts: 2, shaded: 2, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'How many halves are in 3?',
      visual: { kind: 'fraction', parts: 2, shaded: 1, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'So 3 ÷ 1/2 is 6.',
      visual: { kind: 'fraction', parts: 2, shaded: 1, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Flip it over, then multiply.',
      visual: { kind: 'fraction', parts: 2, shaded: 1, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Bentuk yang bisa dihitung anak dengan menggambar: berapa banyak 1/d di dalam n.
      type: 'keypad',
      skill: 'divide-by-fraction',
      params: { n: [1, 9], d: [2, 6] },
      answer: (p) => (p.n as number) * (p.d as number),
      text: (p) => `${p.n} ÷ 1/${p.d} = ?`,
    },
    {
      type: 'keypad',
      skill: 'divide-by-fraction',
      params: { a: [1, 5], b: [2, 6], c: [1, 5], d: [2, 6] },
      answer: (p) => (p.a as number) * (p.d as number),
      text: (p) => `${p.a}/${p.b} ÷ ${p.c}/${p.d} = ?/${(p.b as number) * (p.c as number)}`,
      exclude: (p) => (p.a as number) >= (p.b as number) || (p.c as number) >= (p.d as number),
    },
    {
      type: 'choose-number',
      skill: 'divide-by-fraction',
      params: { a: [1, 5], b: [2, 6], c: [1, 5], d: [2, 6] },
      answer: (p) => (p.b as number) * (p.c as number),
      text: (p) =>
        `${p.a}/${p.b} ÷ ${p.c}/${p.d} = ${(p.a as number) * (p.d as number)}/?`,
      exclude: (p) => (p.a as number) >= (p.b as number) || (p.c as number) >= (p.d as number),
      distractors: 'near',
      // Miskonsepsi khas: lupa membalik, penyebutnya dikali lurus seperti di m6.
      misconception: (p) => (p.b as number) * (p.d as number),
    },
    {
      type: 'choose-text',
      skill: 'divide-by-fraction',
      params: { a: [1, 5], b: [2, 6], c: [1, 5], d: [2, 6] },
      answer: () => 0,
      text: (p) => `What is ${p.a}/${p.b} ÷ ${p.c}/${p.d}?`,
      exclude: (p) => {
        const a = p.a as number;
        const b = p.b as number;
        const c = p.c as number;
        const d = p.d as number;
        // a·d = b·c dibuang: di sana pilihan "dibalik" dan "benar" jadi teks kembar.
        return a >= b || c >= d || a * d === b * c;
      },
      options: (p) => {
        const a = p.a as number;
        const b = p.b as number;
        const c = p.c as number;
        const d = p.d as number;
        return [`${a * d}/${b * c}`, `${a * c}/${b * d}`, `${b * c}/${a * d}`];
      },
    },
  ],
};
