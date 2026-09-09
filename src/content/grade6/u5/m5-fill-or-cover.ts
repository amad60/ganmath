import { surfaceAreaOf, volumeOf } from '../../../components/manipulatives/solids';
import type { ContentModule } from '../../types';

/** Dua pekerjaan nyata yang memutuskan rumusnya. Indeksnya adalah parameter `job`. */
const FILL = 0;

/**
 * Modul penutup unit: rumusnya tidak lagi disebut dalam soal.
 *
 * m4 sudah memisahkan kedua bilangan, tapi di sana pertanyaannya masih memakai
 * kata "volume" dan "surface area" — anak tinggal mencocokkan kata dengan rumus.
 * Di luar app tidak ada yang bertanya begitu. Yang ada adalah **mengisi** (air,
 * pasir, kubus) dan **menutupi** (kertas kado, cat, kardus). Modul ini menaruh
 * keputusan itu di tempat sebenarnya: anak membaca apa yang dikerjakan, lalu
 * memilih sendiri bilangan mana yang dicari.
 *
 * Itu sebabnya modul ini `kind: 'application'` — dan karena `application`, urutan
 * CPA tidak diwajibkan linter. Ia tetap ditulis lengkap di sini: konteks baru
 * (air, kertas) tetap butuh jalan masuk yang konkret, sekalipun matematikanya
 * sudah dikuasai.
 *
 * Aturan pertama hanya meminta KEPUTUSANNYA, tanpa satu pun perkalian. Itu
 * disengaja: kalau anak salah memilih, kesalahannya harus terbaca sebagai salah
 * memilih — bukan tenggelam di antara kemungkinan salah hitung.
 *
 * Semua angka datang dari `volumeOf` dan `surfaceAreaOf` di `solids.ts`.
 */
export const fillOrCover: ContentModule = {
  id: 'g6-u5-m5',
  unitId: 'g6-u5',
  grade: 6,
  title: 'Fill or Cover',
  icon: '🎁',
  prereq: ['g6-u5-m4'],
  skills: ['pick-the-measure', 'fill-it', 'cover-it'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'keypad', 'choose-number'],
  visuals: ['shape-3d', 'counter-objects'],
  vocab: ['water', 'paper'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap eight cubes.',
      visual: { kind: 'counter-objects', count: 8, icon: '🧊' },
      action: 'tap-count',
      target: 8,
      hint: 'Cubes fill the box.',
    },
    {
      stage: 'pictorial',
      prompt: 'Water fills it. Use volume.',
      visual: { kind: 'solid', l: 3, w: 2, h: 4 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Paper covers it. Use surface area.',
      visual: { kind: 'solid', l: 3, w: 2, h: 4, cubes: false, showDimensions: true, unit: 'cm' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: `Fill it: volume is ${volumeOf(3, 2, 4)}.`,
      visual: {
        kind: 'solid',
        l: 3,
        w: 2,
        h: 4,
        cubes: false,
        showDimensions: true,
        showVolume: true,
        unit: 'cm',
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: `Cover it: ${surfaceAreaOf(3, 2, 4)} square cm.`,
      visual: { kind: 'solid', l: 3, w: 2, h: 4, cubes: false, showDimensions: true, unit: 'cm' },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Keputusannya saja, tanpa hitungan. Ukurannya tetap ditulis supaya teks
      // soalnya berbeda-beda — kunci dedupe generator memuat teks, dan pertanyaan
      // yang teksnya tetap akan menyusut jadi satu soal saja.
      type: 'choose-text',
      skill: 'pick-the-measure',
      params: { l: [2, 8], w: [2, 7], h: [2, 6], job: [0, 1] },
      answer: (p) => ((p.job as number) === FILL ? 0 : 1),
      text: (p) =>
        (p.job as number) === FILL
          ? `You fill a ${p.l} by ${p.w} by ${p.h} cm box with water. What do you need?`
          : `You cover a ${p.l} by ${p.w} by ${p.h} cm box with paper. What do you need?`,
      visual: (p) => ({
        kind: 'solid',
        l: p.l as number,
        w: p.w as number,
        h: p.h as number,
        cubes: false,
        showDimensions: true,
        unit: 'cm',
      }),
      options: () => ['the volume', 'the surface area', 'the longest edge', 'the number of faces'],
    },
    {
      // Keputusan DAN hitungannya, digabung. Ini bentuk soal yang akan ditemui
      // anak di luar app: rumusnya tidak pernah disebut.
      type: 'keypad',
      skill: 'fill-it',
      params: { l: [2, 8], w: [2, 7], h: [2, 6], job: [0, 1] },
      answer: (p) =>
        (p.job as number) === FILL
          ? volumeOf(p.l as number, p.w as number, p.h as number)
          : surfaceAreaOf(p.l as number, p.w as number, p.h as number),
      text: (p) =>
        (p.job as number) === FILL
          ? `A tank is ${p.l} by ${p.w} by ${p.h} cm. How much water fits?`
          : `A box is ${p.l} by ${p.w} by ${p.h} cm. How much paper covers it?`,
      visual: (p) => ({
        kind: 'solid',
        l: p.l as number,
        w: p.w as number,
        h: p.h as number,
        cubes: false,
        showDimensions: true,
        unit: 'cm',
      }),
    },
    {
      // Sama, tapi berpilihan — dan salah satu pilihannya adalah bilangan yang
      // SATUNYA lagi. Anak yang memilih pekerjaan yang salah akan menemukan
      // jawabannya tersedia di layar, dan itu memang yang ingin terlihat.
      type: 'choose-number',
      skill: 'cover-it',
      params: { l: [2, 7], w: [2, 7], h: [2, 7], job: [0, 1] },
      answer: (p) =>
        (p.job as number) === FILL
          ? volumeOf(p.l as number, p.w as number, p.h as number)
          : surfaceAreaOf(p.l as number, p.w as number, p.h as number),
      text: (p) =>
        (p.job as number) === FILL
          ? `Sand fills a ${p.l} × ${p.w} × ${p.h} cm box. How much sand?`
          : `Paint covers a ${p.l} × ${p.w} × ${p.h} cm box. How much paint?`,
      distractors: 'near',
      misconception: (p) =>
        (p.job as number) === FILL
          ? surfaceAreaOf(p.l as number, p.w as number, p.h as number)
          : volumeOf(p.l as number, p.w as number, p.h as number),
    },
  ],
};
