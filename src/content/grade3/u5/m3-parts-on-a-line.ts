import type { ContentModule } from '../../types';

/**
 * Pecahan pada garis bilangan, tanpa memerlukan label pecahan di garis: garisnya
 * dipotong menjadi N bagian sama besar dan anak menaruh penanda pada bagian ke-k.
 * Ini representasi "hitung bagiannya" yang dipakai Singapore Math sebelum notasi.
 */
export const partsOnALine: ContentModule = {
  id: 'g3-u5-m3',
  unitId: 'g3-u5',
  grade: 3,
  title: 'Parts on a Line',
  icon: '📍',
  prereq: ['g3-u5-m2'],
  skills: ['fraction-line'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['number-line-drop', 'choose-number'],
  visuals: ['number-line'],
  vocab: ['along'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Put 2 on the line.',
      visual: { kind: 'number-line', min: 0, max: 4, value: null },
      action: 'drop-on-line',
      target: 2,
      hint: 'Two parts along.',
    },
    {
      stage: 'pictorial',
      prompt: 'Four equal parts. Two of them.',
      visual: { kind: 'fraction', parts: 4, shaded: 2, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Two of four parts is 2/4.',
      visual: { kind: 'number-line', min: 0, max: 4, value: 2, marks: [2] },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'number-line-drop',
      skill: 'fraction-line',
      params: { p: [2, 8], s: [1, 7] },
      range: [0, 8],
      answer: (p) => p.s as number,
      text: (p) => `The line has ${p.p} parts. Show ${p.s}.`,
      exclude: (p) => (p.s as number) >= (p.p as number),
    },
    {
      type: 'choose-number',
      skill: 'fraction-line',
      params: { p: [2, 8], s: [1, 7] },
      answer: (p) => (p.p as number) - (p.s as number),
      text: (p) => `${p.s} of ${p.p} parts done. How many left?`,
      exclude: (p) => (p.s as number) >= (p.p as number),
      distractors: 'near',
      misconception: (p) => p.s as number, // mengulang yang sudah lewat
    },
  ],
};
