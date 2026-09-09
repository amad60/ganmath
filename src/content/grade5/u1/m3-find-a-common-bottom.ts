import type { ContentModule } from '../../types';

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

/**
 * Kasus yang tersisa: penyebut yang TIDAK berkelipatan satu sama lain (2/3 + 1/4).
 * Di sinilah KPK dari g4-u3-m6 akhirnya dipakai untuk sesuatu — kedua pecahan
 * harus diubah, bukan hanya salah satunya.
 *
 * Miskonsepsi yang dijaga: "kali saja kedua penyebutnya". Itu selalu MENGHASILKAN
 * penyebut yang sah, jadi anak tidak pernah tersandung karenanya — dia hanya
 * mendapat angka yang lebih besar dari perlunya. Karena itu pengecohnya adalah
 * b·d, dan ia otomatis hilang di pasangan yang saling prima (di sana b·d memang
 * jawabannya).
 *
 * Garis bilangan berpetak dua belas dipakai sebagai model konkretnya: 1/3 dan 1/4
 * dua-duanya bisa didaratkan di garis yang sama persis. `step: 1` ditulis eksplisit
 * karena langkah otomatis untuk rentang 0–12 adalah 2 dan penanda tidak akan
 * pernah mendarat di 3.
 */
export const findACommonBottom: ContentModule = {
  id: 'g5-u1-m3',
  unitId: 'g5-u1',
  grade: 5,
  title: 'Find a Common Bottom',
  icon: '🔗',
  prereq: ['g5-u1-m2'],
  skills: ['common-denominator-lcm', 'add-unlike-bottom'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad', 'number-line-drop'],
  visuals: ['fraction-shape', 'number-line', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twelve dots.',
      visual: { kind: 'counter-objects', count: 12, icon: '🟡' },
      action: 'tap-count',
      target: 12,
      hint: 'Cut into halves, thirds and fourths.',
    },
    {
      stage: 'pictorial',
      prompt: 'Put 1/3 on the line.',
      visual: { kind: 'number-line', min: 0, max: 12, value: null, step: 1 },
      action: 'drop-on-line',
      target: 4,
      hint: 'Four of twelve parts.',
    },
    {
      stage: 'pictorial',
      prompt: '1/3 is the same as 4/12.',
      visual: { kind: 'fraction', parts: 12, shaded: 4, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: '1/4 is the same as 3/12.',
      visual: { kind: 'fraction', parts: 12, shaded: 3, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '12 is a common multiple of 3 and 4.',
      visual: { kind: 'fraction', parts: 12, shaded: 7, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'common-denominator-lcm',
      params: { b: [2, 6], d: [3, 9] },
      answer: (p) => lcm(p.b as number, p.d as number),
      text: (p) => `What bottom fits ${p.b} and ${p.d}?`,
      // Penyebut yang berkelipatan sudah dikerjakan di m2.
      exclude: (p) =>
        (p.b as number) >= (p.d as number) || (p.d as number) % (p.b as number) === 0,
      distractors: 'near',
      // Miskonsepsi khas: mengalikan kedua penyebut begitu saja.
      misconception: (p) => (p.b as number) * (p.d as number),
    },
    {
      type: 'keypad',
      skill: 'common-denominator-lcm',
      params: { b: [2, 6], d: [3, 9], a: [1, 5] },
      answer: (p) => (p.a as number) * (lcm(p.b as number, p.d as number) / (p.b as number)),
      text: (p) => `${p.a}/${p.b} = ?/${lcm(p.b as number, p.d as number)}`,
      exclude: (p) =>
        (p.b as number) >= (p.d as number) ||
        (p.d as number) % (p.b as number) === 0 ||
        (p.a as number) >= (p.b as number),
    },
    {
      type: 'keypad',
      skill: 'add-unlike-bottom',
      params: { b: [2, 6], d: [3, 9], a: [1, 5], c: [1, 8] },
      answer: (p) => {
        const b = p.b as number;
        const d = p.d as number;
        const L = lcm(b, d);
        return (p.a as number) * (L / b) + (p.c as number) * (L / d);
      },
      text: (p) => `${p.a}/${p.b} + ${p.c}/${p.d} = ?/${lcm(p.b as number, p.d as number)}`,
      exclude: (p) => {
        const b = p.b as number;
        const d = p.d as number;
        const a = p.a as number;
        const c = p.c as number;
        if (b >= d || d % b === 0 || a >= b || c >= d) return true;
        const L = lcm(b, d);
        return a * (L / b) + c * (L / d) > L;
      },
    },
    {
      // Model konkretnya: satu garis, dua belas petak, dua pecahan yang berbeda
      // penyebutnya sama-sama bisa mendarat di sana.
      type: 'number-line-drop',
      skill: 'common-denominator-lcm',
      params: { b: [2, 6], a: [1, 5] },
      range: [0, 12],
      step: 1,
      answer: (p) => (p.a as number) * (12 / (p.b as number)),
      text: (p) => `The line has 12 parts. Show ${p.a}/${p.b}.`,
      exclude: (p) => 12 % (p.b as number) !== 0 || (p.a as number) >= (p.b as number),
    },
  ],
};
