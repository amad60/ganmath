import type { ContentModule } from '../../types';

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

/**
 * Penutup unit: hasil operasi belum selesai sampai ia ditulis dalam bentuk paling
 * sederhana. Ini bukan aturan baru — menyederhanakan sudah dikuasai di g4-u4-m4 —
 * melainkan KEBIASAAN yang ditempelkan pada akhir setiap perhitungan.
 *
 * Karena itu setiap soal di sini dimulai dari sebuah operasi, bukan dari pecahan
 * yang jatuh dari langit: yang dilatih adalah langkah terakhir, di tempat langkah
 * terakhir itu sebenarnya berada.
 *
 * Pecahan yang ditanyakan selalu dibangun dari pasangan s/p yang sudah paling
 * sederhana lalu dikali g — jadi bentuk paling sederhananya tunggal dan pasti.
 */
export const tidyUpTheAnswer: ContentModule = {
  id: 'g5-u1-m8',
  unitId: 'g5-u1',
  grade: 5,
  title: 'Tidy Up the Answer',
  icon: '✨',
  prereq: ['g5-u1-m7'],
  skills: ['simplify-result'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'keypad', 'choose-number'],
  visuals: ['fraction-shape', 'counter-objects'],
  vocab: ['answer'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twelve dots.',
      visual: { kind: 'counter-objects', count: 12, icon: '🟠' },
      action: 'tap-count',
      target: 12,
      hint: 'Make groups of four.',
    },
    {
      stage: 'pictorial',
      prompt: 'Eight of twelve parts are shaded.',
      visual: { kind: 'fraction', parts: 12, shaded: 8, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Divide both by four: 2/3.',
      visual: { kind: 'fraction', parts: 3, shaded: 2, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '2/3 is the simplest form.',
      visual: { kind: 'fraction', parts: 3, shaded: 2, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Write the answer in simplest form.',
      visual: { kind: 'fraction', parts: 3, shaded: 2, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Hasil penjumlahan yang belum disederhanakan. Pilihan kedua adalah hasil
      // mentahnya — jawaban yang benar isinya tapi belum selesai dikerjakan.
      type: 'choose-text',
      skill: 'simplify-result',
      params: { s: [1, 7], p: [2, 9], g: [2, 4], x: [1, 6] },
      answer: () => 0,
      text: (p) => {
        const total = (p.s as number) * (p.g as number);
        const bottom = (p.p as number) * (p.g as number);
        return `${p.x}/${bottom} + ${total - (p.x as number)}/${bottom}. Simplest form?`;
      },
      exclude: (p) => {
        const s = p.s as number;
        const g = p.g as number;
        return s >= (p.p as number) || gcd(s, p.p as number) !== 1 || (p.x as number) >= s * g;
      },
      options: (p) => {
        const s = p.s as number;
        const q = p.p as number;
        const g = p.g as number;
        return [`${s}/${q}`, `${s * g}/${q * g}`, `${s * g}/${q}`, `${s}/${q * g}`];
      },
    },
    {
      type: 'keypad',
      skill: 'simplify-result',
      params: { s: [1, 7], p: [2, 9], g: [2, 4] },
      answer: (p) => p.s as number,
      text: (p) =>
        `${(p.s as number) * (p.g as number)}/${(p.p as number) * (p.g as number)} = ?/${p.p}`,
      exclude: (p) =>
        (p.s as number) >= (p.p as number) || gcd(p.s as number, p.p as number) !== 1,
    },
    {
      type: 'choose-number',
      skill: 'simplify-result',
      params: { s: [1, 7], p: [2, 9], g: [2, 4] },
      answer: (p) => p.p as number,
      text: (p) =>
        `${(p.s as number) * (p.g as number)}/${(p.p as number) * (p.g as number)} = ${p.s}/?`,
      exclude: (p) =>
        (p.s as number) >= (p.p as number) || gcd(p.s as number, p.p as number) !== 1,
      distractors: 'near',
      // Miskonsepsi khas: atasnya disederhanakan, bawahnya dibiarkan apa adanya.
      misconception: (p) => (p.p as number) * (p.g as number),
    },
    {
      // Hasil yang melewati satu utuh juga belum selesai: ia ditulis campuran.
      type: 'keypad',
      skill: 'simplify-result',
      params: { d: [3, 8], a: [1, 7], b: [1, 7] },
      answer: (p) => (p.a as number) + (p.b as number) - (p.d as number),
      text: (p) => `${p.a}/${p.d} + ${p.b}/${p.d} = 1 and ?/${p.d}`,
      exclude: (p) => {
        const d = p.d as number;
        const a = p.a as number;
        const b = p.b as number;
        return a >= d || b >= d || a + b <= d;
      },
    },
  ],
};
