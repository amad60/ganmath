import type { ContentModule } from '../../types';

/**
 * Fase A Kurikulum Merdeka: "memahami setengah dan seperempat".
 * Yang menentukan bukan jumlah potongan, tapi potongan yang SAMA BESAR — karena itu
 * ada soal dengan pembagian tidak sama besar sebagai pengecoh miskonsepsi.
 *
 * Kalimat di atas sempat berbohong: tidak ada satu pun soal maupun langkah materi
 * yang memakai pembagian tidak sama besar, dan langkah pertamanya meminta "Tap two
 * equal parts." di atas empat emoji pizza — mengetuk dua pizza mana saja lolos.
 * Sekarang anak mengetuk bagian lingkarannya sendiri, materi menunjukkan dua potong
 * yang TIDAK sama besar, dan soalnya punya jawaban "not equal". Tombol Hint menunjuk langkah materi yang
 * mengajarkan jawaban soal itu (`TEACHES`), bukan selalu gambar seperempat.
 */

/**
 * Tanpa "three fourths": Fase A hanya setengah dan seperempat, dan materi modul ini
 * tidak pernah menunjukkan tiga perempat — soal yang jawabannya belum diajarkan
 * melanggar prinsip pertama app ini. Empat label pas empat tombol.
 */
const LABELS = ['half', 'one fourth', 'whole', 'not equal'] as const;
type Label = (typeof LABELS)[number];

/**
 * Nama yang benar untuk gambar ini, diturunkan dari NILAI-nya.
 *
 * Versi yang bercabang ("kalau bukan utuh dan bukan dua bagian, maka satu bagian =
 * seperempat, selain itu = tiga perempat") pernah menjawab 2 dari 4 bagian dengan
 * "three fourths" — anak yang menjawab "half" (yang BENAR) dinyatakan salah. Dihitung
 * dari shaded/parts, tidak ada cabang yang bisa lupa satu kasus.
 */
function labelOf(parts: number, shaded: number, unequal: boolean): Label {
  if (unequal) return 'not equal';
  const value = shaded / parts;
  if (value === 1) return 'whole';
  if (value === 0.5) return 'half'; // termasuk 2 dari 4 bagian
  if (value === 0.25) return 'one fourth';
  throw new Error(`g1-u6-m4 tidak mengajarkan ${shaded}/${parts}`);
}

/** Langkah Learn yang mengajarkan tiap jawaban — dipanggil ulang tombol Hint. */
const TEACHES = { half: 1, notEqual: 2, fourth: 3, twoFourths: 4, whole: 5 };

export const halvesAndFourths: ContentModule = {
  id: 'g1-u6-m4',
  unitId: 'g1-u6',
  grade: 1,
  title: 'Halves and Fourths',
  icon: '🍕',
  prereq: ['g1-u6-m3'],
  skills: ['halves-fourths'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['fraction-shape'],
  vocab: ['equal', 'fourth', 'fourths', 'quarter', 'whole', 'shaded'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap each equal part.',
      visual: { kind: 'fraction', parts: 2, shaded: 0, tap: true },
      action: 'tap-count',
      target: 2,
      hint: 'Two equal parts make halves.',
    },
    {
      stage: 'pictorial',
      prompt: 'One of two equal parts is half.',
      visual: { kind: 'fraction', parts: 2, shaded: 1 },
      action: 'watch',
    },
    {
      // Miskonsepsi paling khas di topik ini: "dipotong dua = setengah".
      stage: 'pictorial',
      prompt: 'These parts are not equal. Not half.',
      visual: { kind: 'fraction', parts: 2, shaded: 1, unequal: true },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'One of four equal parts is a fourth.',
      visual: { kind: 'fraction', parts: 4, shaded: 1 },
      action: 'watch',
    },
    {
      // Soal menanyakan 2 dari 4 bagian, jadi materinya harus menunjukkannya dulu.
      stage: 'abstract',
      prompt: 'Two of four equal parts is half.',
      visual: { kind: 'fraction', parts: 4, shaded: 2 },
      action: 'watch',
    },
    {
      // Soal bisa berjawaban "whole"; dulu kata itu tidak pernah diajarkan.
      stage: 'abstract',
      prompt: 'Both equal parts shaded is the whole.',
      visual: { kind: 'fraction', parts: 2, shaded: 2 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'halves-fourths',
      params: { p: [2, 4], s: [1, 2], u: [0, 1] },
      answer: (p) => LABELS.indexOf(labelOf(p.p!, p.s!, p.u === 1)),
      text: () => 'How much is shaded?',
      visual: (p) => ({
        kind: 'fraction',
        parts: p.p as number,
        shaded: p.s as number,
        ...(p.u === 1 ? { unequal: true } : {}),
      }),
      // Tidak sama besar hanya dengan SATU bagian diarsir: yang ditanyakan cukup
      // "sama besar atau tidak", bukan membaca pecahan dari potongan yang miring.
      exclude: (p) => p.p === 3 || (p.u === 1 && p.s !== 1),
      options: () => [...LABELS],
      hint: (p) => {
        const label = labelOf(p.p!, p.s!, p.u === 1);
        if (label === 'not equal') return TEACHES.notEqual;
        if (label === 'whole') return TEACHES.whole;
        if (label === 'one fourth') return TEACHES.fourth;
        return p.p === 4 ? TEACHES.twoFourths : TEACHES.half;
      },
    },
    {
      type: 'choose-number',
      skill: 'halves-fourths',
      params: { p: [2, 4], sq: [0, 1] },
      answer: (p) => p.p as number,
      text: () => 'How many equal parts?',
      visual: (p) => ({
        kind: 'fraction',
        parts: p.p as number,
        shaded: 1,
        shape: p.sq === 1 ? 'square' : 'circle',
      }),
      distractors: 'near',
      // Miskonsepsi khas: menghitung GARIS potongnya, bukan bagiannya. Pada persegi
      // yang dipotong lurus garisnya selalu satu kurang dari bagiannya; pada lingkaran
      // tidak (4 bagian = 2 garis), jadi di sana tidak ditebak.
      misconception: (p) => (p.sq === 1 ? (p.p as number) - 1 : null),
      choiceRange: [1, 9],
      hint: () => TEACHES.fourth,
    },
  ],
};
