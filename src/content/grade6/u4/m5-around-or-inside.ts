import {
  areaOf,
  circumferenceFromDiameter,
  circumferenceOf,
  diameterFromRadius,
  radiusFromDiameter,
} from '../../../components/manipulatives/circles';
import type { ContentModule } from '../../types';

/**
 * Empat pilihan yang SAMA untuk kedua pertanyaan — hanya jawaban benarnya yang
 * berpindah. Anak tidak bisa lulus dengan mengenali "yang paling besar" atau
 * "yang berkoma"; dia harus membaca apa yang ditanyakan.
 *
 * Pilihan ketiga dan keempat bukan angka asal: `diameterFromRadius` adalah
 * jawaban anak yang berhenti di langkah pertama, dan `circumferenceFromDiameter(r)`
 * adalah π × r — jawaban anak yang memasukkan jari-jari ke rumus yang meminta
 * diameter. Dua-duanya kesalahan nyata yang sudah dipagari `m2` dan `m4`.
 */
const OPTIONS = (p: Record<string, number>) => [
  `${areaOf(p.r as number)}`,
  `${circumferenceOf(p.r as number)}`,
  `${diameterFromRadius(p.r as number)}`,
  `${circumferenceFromDiameter(p.r as number)}`,
];

/**
 * Modul penutup unit: memisahkan keliling dari luas.
 *
 * Yang keliru pada tahap ini hampir tidak pernah hitungannya — anak sudah bisa
 * mengerjakan keduanya sejak `m3` dan `m4`. Yang keliru adalah **memilih**:
 * melihat satu angka pada lingkaran lalu memakai rumus yang paling terakhir
 * dilatih, apa pun yang ditanya. Karena itu setiap aturan di sini menanyakan
 * keliling dan luas SECARA BERGANTIAN pada gambar yang bentuknya sama persis.
 * Pola dan alasannya identik dengan `g4-u6-m6` (luas atau keliling persegi
 * panjang) — unit ini hanya menggantinya dengan lingkaran.
 *
 * Jari-jari mulai dari 3, bukan 1. Pada r = 1 luas dan π × r bertemu di angka
 * yang sama, dan pada r = 2 luas dan kelilingnya sama-sama 12.56 — dua pilihan
 * yang sama-sama benar di soal yang hanya boleh punya satu jawaban.
 *
 * Semua angka datang dari `circles.ts`. Tidak ada satu pun keliling, luas, atau
 * π yang dihitung di file ini.
 */
export const aroundOrInside: ContentModule = {
  id: 'g6-u4-m5',
  unitId: 'g6-u4',
  grade: 6,
  title: 'Around or Inside',
  icon: '⚖️',
  prereq: ['g6-u4-m4'],
  skills: ['circle-formula-choice'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'keypad'],
  visuals: ['circle', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five dots on the edge.',
      visual: { kind: 'counter-objects', count: 5, icon: '🔵' },
      action: 'tap-count',
      target: 5,
      hint: 'Walk around the circle.',
    },
    {
      stage: 'pictorial',
      prompt: 'Circumference is the walk around.',
      visual: { kind: 'circle', r: 6, showCircumference: true },
      action: 'watch',
    },
    {
      // Lingkaran yang sama persis, angka yang berbeda. Dua gambar berdampingan
      // di layar yang berurutan itulah pemisahnya — bukan dua kalimat.
      stage: 'pictorial',
      prompt: 'Area is all the parts inside.',
      visual: { kind: 'circle', r: 6, showArea: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Circumference needs 2 times pi times r.',
      visual: { kind: 'circle', r: 6, mark: 'both', showCircumference: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Area needs pi times r times r.',
      visual: { kind: 'circle', r: 6, showArea: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Pilihannya sama untuk kedua pertanyaan; yang berpindah cuma kuncinya.
      type: 'choose-text',
      skill: 'circle-formula-choice',
      params: { r: [3, 12], q: [0, 1] },
      answer: (p) => ((p.q as number) === 1 ? 1 : 0),
      text: (p) =>
        `This circle has radius ${p.r} cm. Which is the ${
          (p.q as number) === 1 ? 'circumference' : 'area'
        }?`,
      visual: (p) => ({ kind: 'circle', r: p.r as number }),
      options: OPTIONS,
    },
    {
      // Sama seperti di atas, tapi diketik. Tanpa pilihan di layar, tidak ada
      // yang bisa dieliminasi — rumusnya harus benar-benar dipilih sendiri.
      type: 'keypad',
      skill: 'circle-formula-choice',
      params: { r: [3, 12], q: [0, 1] },
      answer: (p) =>
        (p.q as number) === 1 ? circumferenceOf(p.r as number) : areaOf(p.r as number),
      text: (p) =>
        `Radius ${p.r} cm. Find the ${(p.q as number) === 1 ? 'circumference' : 'area'}.`,
      visual: (p) => ({ kind: 'circle', r: p.r as number }),
    },
    {
      // Diameter yang diberikan. Dua keputusan dalam satu soal: rumus mana, dan
      // jari-jari mana — gabungan yang akan ditemui anak di soal sesungguhnya.
      type: 'keypad',
      skill: 'circle-formula-choice',
      params: { d: [6, 24], q: [0, 1] },
      answer: (p) =>
        (p.q as number) === 1
          ? circumferenceFromDiameter(p.d as number)
          : areaOf(radiusFromDiameter(p.d as number)),
      text: (p) =>
        `Diameter ${p.d} cm. Find the ${(p.q as number) === 1 ? 'circumference' : 'area'}.`,
      visual: (p) => ({ kind: 'circle', d: p.d as number }),
      exclude: (p) => (p.d as number) % 2 !== 0,
    },
  ],
};
