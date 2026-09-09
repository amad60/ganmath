import type { ContentModule } from '../../types';

/** 68 → "6.8". */
const t = (n: number) => String(n / 10);

/**
 * Pembagi yang hasilnya selalu berhenti (tidak berulang), jadi jawabannya
 * benar-benar bisa dituliskan anak di keypad. 1/3 sengaja tidak ada di sini —
 * `input-width` memang menolaknya, dan itu benar: 0.333333… bukan soal, itu jebakan.
 */
const DIVISORS = [2, 4, 5, 8, 20, 25];

/**
 * Pembagian desimal, dan satu-satunya tempat di seluruh app anak melihat bahwa
 * pembagian tidak harus berhenti di sisa.
 *
 * Dua keterampilan yang berbeda dijalin di sini:
 *  1. desimal ÷ bilangan bulat (6.8 ÷ 2) — titiknya tinggal turun di tempatnya;
 *  2. bilangan bulat ÷ bilangan bulat yang TIDAK habis (3 ÷ 4 = 0.75) — ini yang
 *     menggantikan "sisa 3" dari `g4-u2-m6`, dan yang membuka jalan ke `m5`.
 *
 * Keduanya diketik anak sebagai desimal. Yang kedua itulah alasan modul ini harus
 * ada sebelum konversi pecahan→desimal: "bagi atas dengan bawah" tidak berarti
 * apa-apa sampai anak pernah benar-benar melakukannya.
 */
export const divideDecimals: ContentModule = {
  id: 'g5-u2-m4',
  unitId: 'g5-u2',
  grade: 5,
  title: 'Divide Decimals',
  icon: '➗',
  prereq: ['g5-u2-m3'],
  skills: ['divide-decimal-whole', 'whole-divided-to-decimal'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'choose-text'],
  visuals: ['counter-objects', 'array-grid', 'number-line'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap eight small parts.',
      visual: { kind: 'counter-objects', count: 8, icon: '🟠' },
      action: 'tap-count',
      target: 8,
      hint: 'Share them into four groups.',
    },
    {
      stage: 'pictorial',
      prompt: 'Eight tenths in four equal groups.',
      visual: { kind: 'array', rows: 4, cols: 2 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Each group is two tenths.',
      visual: { kind: 'number-line', min: 0, max: 1, value: 0.2, marks: [0.2], step: 0.1 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Divide, then keep the point in place.',
      visual: { kind: 'array', rows: 4, cols: 2 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Share 3 into 4 parts: 0.75.',
      visual: { kind: 'number-line', min: 0, max: 1, value: 0.75, marks: [0.75], step: 0.25 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Desimal ÷ bilangan bulat, selalu habis: titiknya turun apa adanya.
      type: 'keypad',
      skill: 'divide-decimal-whole',
      params: { a: [11, 99], b: [2, 9] },
      answer: (p) => (p.a as number) / 10,
      text: (p) => `${t((p.a as number) * (p.b as number))} ÷ ${p.b} = ?`,
      exclude: (p) => (p.a as number) % 10 === 0,
    },
    {
      // Bilangan bulat yang tidak habis dibagi. Jawabannya desimal, dan tidak ada
      // jalan lain selain mengetiknya — ini yang menggantikan "sisa".
      type: 'keypad',
      skill: 'whole-divided-to-decimal',
      params: { i: [0, 5], a: [1, 40] },
      answer: (p) => (p.a as number) / (DIVISORS[p.i as number] as number),
      text: (p) => `${p.a} ÷ ${DIVISORS[p.i as number]} = ?`,
      // Yang habis dibagi dibuang: itu soal Grade 3, bukan soal modul ini.
      exclude: (p) => (p.a as number) % (DIVISORS[p.i as number] as number) === 0,
    },
    {
      // Pembagiannya sendiri, dalam satuan persepuluhan: jawabannya bilangan bulat.
      type: 'choose-number',
      skill: 'divide-decimal-whole',
      params: { q: [2, 9], b: [2, 9] },
      answer: (p) => p.q as number,
      text: (p) => `${(p.q as number) * (p.b as number)} tenths ÷ ${p.b} = ? tenths`,
      distractors: 'near',
      // Miskonsepsi khas: tanda ÷ dibaca sebagai ×.
      misconception: (p) => (p.q as number) * (p.b as number),
    },
    {
      // Letak titik pada hasil bagi. Pilihan keempat adalah anak yang membagi
      // angkanya tapi lupa bahwa yang dibagi tadi sudah berupa desimal.
      type: 'choose-text',
      skill: 'divide-decimal-whole',
      params: { a: [11, 99], b: [2, 9] },
      answer: () => 0,
      text: (p) => `Which is ${t((p.a as number) * (p.b as number))} ÷ ${p.b}?`,
      exclude: (p) => (p.a as number) % 10 === 0,
      options: (p) => {
        const a = p.a as number;
        const b = p.b as number;
        return [String(a / 10), String(a), String(a / 100), String((a * b) / 100)];
      },
    },
  ],
};
