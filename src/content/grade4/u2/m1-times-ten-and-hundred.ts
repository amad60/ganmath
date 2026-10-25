import type { ContentModule } from '../../types';

/**
 * Pintu masuk unit: mengalikan bilangan besar selalu dimulai dari mengalikan
 * puluhan dan ratusan. Ini satu-satunya bagian unit ini yang benar-benar
 * HAFALAN — 6 × 40 harus keluar tanpa dihitung, karena itulah yang dipakai
 * berulang-ulang di modul m2–m7.
 */
export const timesTenAndHundred: ContentModule = {
  id: 'g4-u2-m1',
  unitId: 'g4-u2',
  grade: 4,
  title: 'Times Ten and Hundred',
  icon: '💯',
  prereq: ['g4-u1-m5'],
  skills: ['times-10-100'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['array-grid', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Make three rows of ten.',
      visual: { kind: 'array', rows: 3, cols: 10 },
      action: 'watch',
      hint: 'Ten in each row.',
    },
    {
      stage: 'pictorial',
      prompt: 'Three rows of ten is thirty.',
      visual: { kind: 'array', rows: 3, cols: 10, still: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Times ten adds one zero.',
      visual: { kind: 'array', rows: 3, cols: 10, still: true },
      action: 'watch',
      caption: '3 × 10 = 30',
    },
    {
      stage: 'abstract',
      prompt: 'Times a hundred adds two zeros.',
      visual: { kind: 'base10', hundreds: 3, tens: 0, ones: 0 },
      action: 'watch',
      caption: '3 × 100 = 300',
    },
    {
      stage: 'abstract',
      prompt: 'So 40 × 6 = 240.',
      visual: { kind: 'base10', hundreds: 2, tens: 4, ones: 0 },
      action: 'watch',
      caption: '4 × 6 = 24, so 240',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      // Jawaban selalu kelipatan sepuluh: pengecoh berjarak 1 bisa dicoret tanpa berpikir.
      distractorUnit: 10,
      skill: 'times-10-100',
      params: { n: [2, 9], k: [1, 2] },
      answer: (p) => (p.n as number) * ((p.k as number) === 1 ? 10 : 100),
      text: (p) => `${p.n} × ${(p.k as number) === 1 ? 10 : 100} = ?`,
      distractors: 'near',
      // Miskonsepsi khas: satu nol hilang — 7 × 100 dijawab 70.
      misconception: (p) => (p.n as number) * ((p.k as number) === 1 ? 1 : 10),
    },
    {
      // Arah yang dipakai unit ini: puluhan bulat dikali satu digit (40 × 6).
      type: 'keypad',
      skill: 'times-10-100',
      params: { n: [2, 9], t: [2, 9] },
      answer: (p) => (p.n as number) * (p.t as number) * 10,
      text: (p) => `${(p.n as number) * 10} × ${p.t} = ?`,
    },
  ],
};
