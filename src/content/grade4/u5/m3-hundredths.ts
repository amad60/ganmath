import type { ContentModule } from '../../types';

/**
 * Perseratusan lewat kisi 10 × 10 — satu baris kisi itulah jembatannya:
 * sepuluh perseratusan menutup persis satu persepuluhan.
 *
 * `fraction-shape` sengaja TIDAK dipakai untuk seratus bagian: seratus potongan
 * di dalam satu bentuk selebar layar HP menjadi garis-garis yang tidak bisa
 * dihitung anak. `array-grid` memang dibuat untuk baris × kolom, dan di sini
 * dipakai persis untuk itu.
 *
 * Miskonsepsi yang dibidik seluruh modul: mengira 0.07 dan 0.7 sama karena
 * sama-sama "tujuh".
 */
export const hundredths: ContentModule = {
  id: 'g4-u5-m3',
  unitId: 'g4-u5',
  grade: 4,
  title: 'Hundredths',
  icon: '💯',
  prereq: ['g4-u5-m2'],
  skills: ['hundredths'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'keypad', 'choose-number'],
  visuals: ['array-grid', 'counter-objects', 'fraction-shape'],
  vocab: ['hundredth', 'hundredths'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap ten small parts.',
      visual: { kind: 'counter-objects', count: 10, icon: '🟩' },
      action: 'tap-count',
      target: 10,
      hint: 'Ten of these make one tenth.',
    },
    {
      stage: 'pictorial',
      prompt: 'Ten rows of ten make one hundred.',
      visual: { kind: 'array', rows: 10, cols: 10 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'One row is one tenth: 0.1.',
      visual: { kind: 'array', rows: 10, cols: 10, highlightRow: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'One small part is one hundredth.',
      visual: { kind: 'fraction', parts: 10, shaded: 1, shape: 'square' },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Perseratusan dua digit. Pengecoh ketiga adalah digit yang tertukar —
      // itu yang membedakan anak yang membaca nilai tempat dari yang menebak.
      type: 'choose-text',
      skill: 'hundredths',
      params: { h: [11, 99] },
      answer: () => 0,
      text: (p) => `Which one is the same as ${p.h}/100?`,
      exclude: (p) =>
        (p.h as number) % 10 === 0 ||
        Math.floor((p.h as number) / 10) === (p.h as number) % 10,
      options: (p) => [
        `0.${p.h}`,
        `${p.h}.0`,
        `0.0${p.h}`,
        `0.${(p.h as number) % 10}${Math.floor((p.h as number) / 10)}`,
      ],
    },
    {
      // Perseratusan satu digit: inti seluruh modul, 0.07 lawan 0.7.
      type: 'choose-text',
      skill: 'hundredths',
      params: { d: [1, 9] },
      answer: () => 0,
      text: (p) => `Which one is ${p.d}/100?`,
      options: (p) => [`0.0${p.d}`, `0.${p.d}`, `${p.d}.0`, `${p.d}.00`],
    },
    {
      type: 'keypad',
      skill: 'hundredths',
      params: { h: [11, 99] },
      answer: (p) => p.h as number,
      text: (p) => `0.${p.h} = ?/100`,
      exclude: (p) =>
        (p.h as number) % 10 === 0 ||
        Math.floor((p.h as number) / 10) === (p.h as number) % 10,
    },
    {
      type: 'choose-number',
      skill: 'hundredths',
      params: { t: [1, 9] },
      answer: (p) => (p.t as number) * 10,
      text: (p) => `${p.t} tenth${(p.t as number) === 1 ? '' : 's'} = ? hundredths`,
      distractors: 'near',
      distractorUnit: 10,
      // Miskonsepsi khas: mengira namanya berganti tapi angkanya tetap.
      misconception: (p) => p.t as number,
    },
  ],
};
