import type { ContentModule } from '../../types';

/**
 * Gerbang seluruh unit desimal, dan sengaja BELUM memakai notasi desimal sama sekali.
 *
 * Yang dibangun di sini adalah satu keyakinan: satu utuh bisa dipotong menjadi
 * sepuluh bagian sama besar, dan bagian itu punya nama — persepuluhan. Anak sudah
 * punya seluruh alatnya dari `g4-u4` (pecahan senilai), jadi tenths cukup
 * diperkenalkan sebagai pecahan berpenyebut sepuluh, bukan sebagai hal baru.
 *
 * Titik desimal baru muncul di m2. Kalau notasi datang sebelum idenya, "0.7"
 * hanyalah dua simbol yang harus dihafal urutannya.
 */
export const tenths: ContentModule = {
  id: 'g4-u5-m1',
  unitId: 'g4-u5',
  grade: 4,
  title: 'Tenths',
  icon: '🔟',
  prereq: ['g4-u4-m7'],
  skills: ['tenths-fraction'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'choose-text', 'keypad'],
  visuals: ['fraction-shape', 'counter-objects'],
  vocab: ['tenth', 'tenths'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap seven of ten parts.',
      visual: { kind: 'counter-objects', count: 10, icon: '🍫' },
      action: 'tap-count',
      target: 7,
      hint: 'Ten equal parts here.',
    },
    {
      stage: 'pictorial',
      prompt: 'Seven of ten parts are shaded.',
      visual: { kind: 'fraction', parts: 10, shaded: 7, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'One part is one tenth.',
      visual: { kind: 'fraction', parts: 10, shaded: 1, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Seven tenths is 7/10.',
      visual: { kind: 'fraction', parts: 10, shaded: 7, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'tenths-fraction',
      params: { s: [1, 9] },
      answer: (p) => p.s as number,
      // Teksnya tetap, tapi gambarnya berubah — kunci dedupe generator memuat
      // gambar, jadi sembilan soal ini tetap sembilan soal berbeda.
      text: () => 'How many tenths are shaded?',
      visual: (p) => ({ kind: 'fraction', parts: 10, shaded: p.s as number, shape: 'square' }),
      distractors: 'near',
      // Miskonsepsi khas: yang dihitung justru bagian yang tidak diarsir.
      misconception: (p) => 10 - (p.s as number),
    },
    {
      type: 'choose-text',
      skill: 'tenths-fraction',
      params: { s: [1, 9] },
      answer: () => 0,
      text: () => 'Which fraction is shaded?',
      visual: (p) => ({ kind: 'fraction', parts: 10, shaded: p.s as number, shape: 'square' }),
      options: (p) => [
        `${p.s}/10`,
        `10/${p.s}`,
        `${p.s}/100`,
        `${(p.s as number) + 1}/10`,
      ],
    },
    {
      // Yang diketik selalu bilangan bulat: banyaknya persepuluhan, bukan pecahannya.
      type: 'keypad',
      skill: 'tenths-fraction',
      params: { s: [1, 9] },
      answer: (p) => 10 - (p.s as number),
      text: (p) => `${p.s}/10 is shaded. How many tenths are left?`,
    },
  ],
};
