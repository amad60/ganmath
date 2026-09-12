import {
  PI,
  circumferenceFromDiameter,
  circumferenceOf,
  diameterFromRadius,
  radiusFromDiameter,
} from '../../../components/manipulatives/circles';
import type { ContentModule } from '../../types';

/** Simbol yang DILIHAT anak. Nilainya diambil dari `PI`, tidak pernah ditulis lepas. */
const PI_SIGN = 'π';

/**
 * Keliling dari JARI-JARI: C = 2 × π × r.
 *
 * Rumus ini tidak berdiri sendiri — ia lahir dari dua hal yang sudah dipegang
 * anak: diameter adalah dua jari-jari (`m1`), dan keliling adalah π diameter
 * (`m2`). Karena itu urutan modulnya begini dan bukan sebaliknya: kalau C = 2πr
 * diberikan lebih dulu, ia hanya jadi rumus ketiga yang harus dihafal dan
 * gampang tertukar dengan luas.
 *
 * **Kenapa tidak ada soal "diketahui C, ketik r".** Membalik keliling berarti
 * membagi dengan 6.28 — pembagian dengan desimal yang bukan materi unit ini dan
 * akan menutupi apa yang sebenarnya sedang diuji. Arah baliknya tetap dilatih,
 * tapi lewat `choose-number`: anak menguji pilihan dengan mengalikan, operasi
 * yang justru memperkuat rumusnya.
 *
 * Seluruh angka (jawaban maupun label di gambar) datang dari `circles.ts` —
 * `circumferenceOf`, `circumferenceFromDiameter`, `diameterFromRadius`,
 * `radiusFromDiameter`, dan `PI` itu sendiri.
 */
export const aroundACircle: ContentModule = {
  id: 'g6-u4-m3',
  unitId: 'g6-u4',
  grade: 6,
  title: 'Around a Circle',
  icon: '🔄',
  prereq: ['g6-u4-m2'],
  skills: ['circumference-from-radius', 'circumference-reverse'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'compare-symbol'],
  visuals: ['circle', 'counter-objects'],
  vocab: ['r'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four circles.',
      visual: { kind: 'counter-objects', count: 6, icon: '⭕' },
      action: 'tap-count',
      target: 4,
      hint: 'We walk around each one.',
    },
    {
      stage: 'pictorial',
      prompt: 'The radius is 5 cm.',
      visual: { kind: 'circle', r: 5 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: `The circumference is ${circumferenceOf(5)} cm.`,
      visual: { kind: 'circle', r: 5, showCircumference: true },
      action: 'watch',
    },
    {
      // Kedua ruas tampil sekaligus: 2r ADALAH diameternya, jadi 2 × π × r dan
      // π × d adalah kalimat yang sama persis, bukan dua rumus.
      stage: 'abstract',
      prompt: 'Circumference is 2 times pi times r.',
      visual: { kind: 'circle', r: 5, mark: 'both', showCircumference: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: `2 times ${PI} times 5 is ${circumferenceOf(5)}.`,
      visual: { kind: 'circle', r: 5, mark: 'both', showCircumference: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Bentuk pokok modul ini. Kelilingnya sengaja TIDAK ditulis di gambar —
      // itu jawabannya.
      type: 'keypad',
      skill: 'circumference-from-radius',
      params: { r: [1, 15] },
      answer: (p) => circumferenceOf(p.r as number),
      text: (p) => `Radius ${p.r} cm. C = 2 ${PI_SIGN} r. Find C.`,
      visual: (p) => ({ kind: 'circle', r: p.r as number }),
    },
    {
      // Diameter yang diberikan, bukan jari-jari. Anak yang menempelkan angka
      // yang terlihat ke rumus 2πr tanpa membaca namanya akan menjawab dua kali
      // lipat — dan itu memang yang harus terlihat sekarang, bukan nanti.
      type: 'keypad',
      skill: 'circumference-from-radius',
      params: { d: [2, 30] },
      answer: (p) => circumferenceFromDiameter(p.d as number),
      text: (p) => `Diameter ${p.d} cm. Find the circumference.`,
      visual: (p) => ({ kind: 'circle', d: p.d as number }),
    },
    {
      // Arah balik, lewat pilihan supaya anak menguji dengan mengalikan.
      // Miskonsepsinya: menyebut jari-jari saat yang diminta diameter.
      type: 'choose-number',
      skill: 'circumference-reverse',
      params: { d: [2, 30] },
      answer: (p) => p.d as number,
      text: (p) =>
        `The circumference is ${circumferenceFromDiameter(p.d as number)} cm. Which is the diameter?`,
      distractors: 'near',
      misconception: (p) => radiusFromDiameter(p.d as number),
    },
    {
      // Menaksir keliling tanpa menuliskannya. Gambar tidak menolong sama sekali
      // di sini — lingkarannya dinormalisasi, jadi besarnya tidak membocorkan apa
      // pun dan angkanya harus benar-benar dihitung.
      //
      // Jari-jari dipagari 2–9 supaya SETIAP jari-jari punya pembanding yang lebih
      // kecil maupun lebih besar. Tanpa pagar itu r = 10 selalu berjawaban ">",
      // dan anak bisa memilih tandanya dari besar jari-jarinya saja.
      type: 'compare-symbol',
      skill: 'circumference-from-radius',
      params: { r: [2, 9], x: [5, 60] },
      answer: (p) => Math.sign(circumferenceOf(p.r as number) - (p.x as number)),
      text: (p) =>
        `Radius ${p.r} cm, so diameter ${diameterFromRadius(p.r as number)} cm. C ? ${p.x} cm`,
      visual: (p) => ({ kind: 'circle', r: p.r as number, mark: 'both' }),
    },
    {
      type: 'keypad',
      skill: 'circumference-from-radius',
      story: true,
      params: { d: [2, 30] },
      answer: (p) => circumferenceFromDiameter(p.d as number),
      text: (p) => `A round plate has diameter ${p.d} cm. Find the circumference.`,
    },
    {
      type: 'keypad',
      skill: 'circumference-from-radius',
      story: true,
      params: { d: [2, 30] },
      answer: (p) => circumferenceFromDiameter(p.d as number),
      text: (p) => `A round cake has diameter ${p.d} cm. Find the circumference.`,
    },
  ],
};
