import type { ContentModule } from '../../types';

/**
 * Pecahan campuran yang DIHITUNG, bukan sekadar dibaca (g4-u4-m7 berhenti di
 * membacanya). Dua hal baru: menyimpan ketika bagian pecahannya melewati satu
 * utuh, dan meminjam satu utuh ketika bagian pecahannya kurang.
 *
 * Kedua langkah itu ditanya terpisah — banyak utuhnya, lalu sisa bagiannya —
 * karena keypad hanya bisa menerima SATU bilangan bulat, dan karena memisahkannya
 * membuat jawaban salah anak terbaca: lupa menyimpan terlihat berbeda dari salah
 * menghitung sisa.
 */
export const mixedNumberSums: ContentModule = {
  id: 'g5-u1-m4',
  unitId: 'g5-u1',
  grade: 5,
  title: 'Mixed Number Sums',
  icon: '🥧',
  prereq: ['g5-u1-m3'],
  skills: ['mixed-number-add', 'mixed-number-subtract'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number'],
  visuals: ['fraction-shape', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five parts.',
      visual: { kind: 'counter-objects', count: 5, icon: '🍰' },
      action: 'tap-count',
      target: 5,
      hint: 'Five fourths is more than one.',
    },
    {
      stage: 'pictorial',
      prompt: 'Four fourths make one whole.',
      visual: { kind: 'fraction', parts: 4, shaded: 4, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'One fourth is left over.',
      visual: { kind: 'fraction', parts: 4, shaded: 1, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'So 5/4 is 1 and 1/4.',
      visual: { kind: 'fraction', parts: 4, shaded: 1, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Add the wholes, then add the tops.',
      visual: { kind: 'fraction', parts: 4, shaded: 3, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Pecahan campuran menjadi satu pecahan — bentuk yang paling mudah dihitung.
      type: 'keypad',
      skill: 'mixed-number-add',
      params: { d: [2, 6], w: [1, 4], r: [1, 5] },
      answer: (p) => (p.w as number) * (p.d as number) + (p.r as number),
      text: (p) => `${p.w} and ${p.r}/${p.d} = ?/${p.d}`,
      exclude: (p) => (p.r as number) >= (p.d as number),
    },
    {
      // Menyimpan: jumlah bagiannya melewati satu utuh, sisanya yang ditanya.
      type: 'keypad',
      skill: 'mixed-number-add',
      params: { d: [3, 8], a: [1, 7], b: [1, 7] },
      answer: (p) => ((p.a as number) + (p.b as number)) % (p.d as number),
      text: (p) => `${p.a}/${p.d} + ${p.b}/${p.d} = 1 and ?/${p.d}`,
      exclude: (p) => {
        const d = p.d as number;
        const a = p.a as number;
        const b = p.b as number;
        return a >= d || b >= d || a + b <= d || (a + b) % d === 0;
      },
    },
    {
      // Banyak utuhnya. Pengecohnya adalah lupa menyimpan satu utuh dari pecahannya.
      type: 'choose-number',
      skill: 'mixed-number-add',
      params: { d: [3, 6], w: [1, 3], x: [1, 3], r: [1, 5], s: [1, 5] },
      answer: (p) => (p.w as number) + (p.x as number) + 1,
      text: (p) =>
        `${p.w} and ${p.r}/${p.d} + ${p.x} and ${p.s}/${p.d}. How many wholes?`,
      exclude: (p) => {
        const d = p.d as number;
        const r = p.r as number;
        const s = p.s as number;
        return r >= d || s >= d || r + s < d;
      },
      distractors: 'near',
      // Miskonsepsi khas: utuhnya dijumlah, pecahan yang penuh satu utuh diabaikan.
      misconception: (p) => (p.w as number) + (p.x as number),
    },
    {
      // Meminjam: bagian pecahannya kurang, satu utuh dipecah menjadi d bagian.
      type: 'keypad',
      skill: 'mixed-number-subtract',
      params: { d: [3, 8], w: [2, 4], r: [1, 7], s: [1, 7] },
      answer: (p) => (p.r as number) + (p.d as number) - (p.s as number),
      text: (p) => `${p.w} and ${p.r}/${p.d} − ${p.s}/${p.d} = ${(p.w as number) - 1} and ?/${p.d}`,
      exclude: (p) => {
        const d = p.d as number;
        const r = p.r as number;
        const s = p.s as number;
        return r >= d || s >= d || s <= r;
      },
    },
  ],
};
