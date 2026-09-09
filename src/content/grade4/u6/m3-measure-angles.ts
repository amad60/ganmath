import type { ContentModule } from '../../types';

/**
 * Busur derajat digambar dengan garis tiap 10° dan angka tiap 30°, jadi setiap
 * jawaban harus jatuh PERSIS di sebuah garis. Sudut 47° hanya bisa ditebak, dan
 * menebak bukan yang sedang dilatih.
 */
const step10 = (p: Record<string, number>) => (p.d as number) * 10;

/** Busur derajatnya ikut miring bersama sudutnya — persis seperti busur sungguhan
 *  yang diletakkan anak di atas garis yang tidak mendatar. */
const TURNS = [0, 15, 40];
const turnOf = (p: Record<string, number>) => TURNS[p.r as number] as number;

/**
 * Membaca besar sudut pada busur derajat.
 *
 * Miskonsepsi yang dibidik seluruh modul ada di pengecoh: membaca deretan angka
 * yang salah, sehingga 130° dibaca 50°. Karena itu `misconception` selalu
 * `180 − jawaban` — jawaban salah anak jadi bisa dibaca sebagai diagnosis, bukan
 * sekadar angka meleset.
 *
 * Sudut yang lebih dari 180° tidak diukur di sini: skalanya setengah lingkaran.
 */
export const measureAngles: ContentModule = {
  id: 'g4-u6-m3',
  unitId: 'g4-u6',
  grade: 4,
  title: 'Measure Angles',
  icon: '🧭',
  prereq: ['g4-u6-m2'],
  skills: ['measure-angle'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad'],
  visuals: ['angle-arc', 'counter-objects'],
  vocab: ['scale'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap ten small steps.',
      visual: { kind: 'counter-objects', count: 10, icon: '🔸' },
      action: 'tap-count',
      target: 10,
      hint: 'Each step is ten degrees.',
    },
    {
      stage: 'pictorial',
      prompt: 'The scale shows every ten degrees.',
      visual: { kind: 'angle', degrees: 60, showScale: true },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'This side stops at 60.',
      visual: { kind: 'angle', degrees: 60, showScale: true, showValue: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Read the scale: 130 degrees.',
      visual: { kind: 'angle', degrees: 130, rotate: 20, showScale: true, showValue: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-number',
      skill: 'measure-angle',
      params: { d: [2, 17], r: [0, 2] },
      answer: step10,
      text: () => 'How many degrees?',
      visual: (p) => ({
        kind: 'angle',
        degrees: step10(p),
        rotate: turnOf(p),
        showScale: true,
      }),
      distractors: 'near',
      // Jawaban selalu kelipatan sepuluh: pengecoh berjarak 1 (129, 131) bisa
      // dicoret anak tanpa membaca skalanya sama sekali.
      distractorUnit: 10,
      misconception: (p) => 180 - step10(p),
    },
    {
      // Tanpa pilihan: anak harus benar-benar membaca angkanya, bukan mengenali
      // mana dari empat tombol yang paling masuk akal.
      type: 'keypad',
      skill: 'measure-angle',
      params: { d: [2, 17], r: [0, 2] },
      answer: step10,
      text: () => 'Read the angle.',
      visual: (p) => ({
        kind: 'angle',
        degrees: step10(p),
        rotate: turnOf(p),
        showScale: true,
      }),
    },
  ],
};
