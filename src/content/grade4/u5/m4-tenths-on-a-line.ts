import type { ContentModule } from '../../types';

/**
 * Desimal pada garis bilangan — benang `number-line` untuk Grade 4
 * (docs/curriculum/grades-2-6.md, tabel "Benang merah").
 *
 * Garisnya sengaja MENGHITUNG PERSEPULUHAN, persis cara `g3-u5-m3` menghitung
 * bagian pecahan: domainnya 0–10 dengan langkah satu, jadi setiap tanda adalah
 * satu persepuluhan dan penanda anak jatuh tepat di tempatnya. Ini juga yang
 * menghindari bug `step` pada `NumberLine` yang masih terbuka — garis rentang
 * lebar dengan langkah pecahan belum bisa dijawab tepat.
 */
export const tenthsOnALine: ContentModule = {
  id: 'g4-u5-m4',
  unitId: 'g4-u5',
  grade: 4,
  title: 'Tenths on a Line',
  icon: '📏',
  prereq: ['g4-u5-m3'],
  skills: ['decimal-on-line'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['number-line-drop', 'choose-text', 'choose-number'],
  visuals: ['number-line', 'fraction-shape', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap seven of ten parts.',
      visual: { kind: 'counter-objects', count: 10, icon: '🟠' },
      action: 'tap-count',
      target: 7,
      hint: 'Seven tenths in all.',
    },
    {
      stage: 'pictorial',
      prompt: 'This line counts tenths. Show 7.',
      visual: { kind: 'number-line', min: 0, max: 10, value: null },
      action: 'drop-on-line',
      target: 7,
      hint: 'Seven jumps from zero.',
    },
    {
      stage: 'pictorial',
      prompt: 'Seven of ten parts are shaded.',
      visual: { kind: 'fraction', parts: 10, shaded: 7, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Seven tenths is 0.7.',
      visual: { kind: 'number-line', min: 0, max: 10, value: 7, marks: [7] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Garisnya menghitung persepuluhan, jadi yang diletakkan anak adalah
      // BANYAK persepuluhan — bilangan bulat, bukan nilai desimalnya.
      type: 'number-line-drop',
      skill: 'decimal-on-line',
      params: { s: [1, 9] },
      range: [0, 10],
      answer: (p) => p.s as number,
      text: (p) => `The line counts tenths. Show 0.${p.s}`,
    },
    {
      type: 'choose-text',
      skill: 'decimal-on-line',
      params: { a: [1, 6] },
      answer: () => 0,
      text: (p) => `Count on: 0.${p.a}, 0.${(p.a as number) + 1}, then what?`,
      options: (p) => [
        `0.${(p.a as number) + 2}`,
        `0.${(p.a as number) + 3}`,
        `0.${p.a}`,
        `${(p.a as number) + 2}.0`,
      ],
    },
    {
      type: 'choose-number',
      skill: 'decimal-on-line',
      params: { w: [1, 9] },
      answer: (p) => (p.w as number) * 10,
      text: (p) => `How many tenths make ${p.w}?`,
      distractors: 'near',
      distractorUnit: 10,
      // Miskonsepsi khas: membaca angka utuhnya sebagai jumlah persepuluhan.
      misconception: (p) => p.w as number,
    },
  ],
};
