import {
  SOLID_FACES,
  layerOf,
  netFaces,
  surfaceAreaOf,
  volumeOf,
} from '../../../components/manipulatives/solids';
import type { ContentModule } from '../../types';

/**
 * Luas permukaan kubus. Bukan rumus keempat yang harus dihafal — justru
 * kebalikannya: kubus adalah kasus di mana "jumlahkan semua sisi" dari m2 runtuh
 * jadi satu perkalian, karena keenam sisinya kembar.
 *
 * Karena itu angka enam di modul ini SELALU datang dari `SOLID_FACES.cube`, tidak
 * pernah diketik sebagai angka. Enam bukan bagian dari rumus, ia banyaknya sisi
 * sebuah kubus; menuliskannya sebagai konstanta di data modul akan menyembunyikan
 * satu-satunya alasan rumus ini bekerja.
 *
 * Aturan terakhir menempuh arah pulang: luas permukaan diketahui, luas SATU muka
 * dicari. Itu pembagian dengan `SOLID_FACES.cube`, dan ia menguji apakah anak
 * benar-benar melihat enam muka kembar atau sekadar mengingat urutan tombol.
 * Aturan ketiga menempuh arah pulang yang lebih jauh lagi — sampai ke rusuknya.
 *
 * Rentang rusuk berhenti di 8 karena `Solid3D` menggambar paling besar 8 satuan
 * per arah; balok yang lebih besar akan digambar berbeda dari angka yang ditulis
 * soal, dan itu persis kesalahan yang dicegah seluruh pola `solids.ts` ini.
 */
export const sixEqualFaces: ContentModule = {
  id: 'g6-u5-m3',
  unitId: 'g6-u5',
  grade: 6,
  title: 'Six Equal Faces',
  icon: '🎲',
  prereq: ['g6-u5-m2'],
  skills: ['cube-surface-area', 'cube-edge-back', 'face-from-surface'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'missing-number'],
  visuals: ['shape-3d', 'shape-net', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: `Tap all ${SOLID_FACES.cube} faces.`,
      visual: { kind: 'counter-objects', count: SOLID_FACES.cube, icon: '⬜' },
      action: 'tap-count',
      target: SOLID_FACES.cube,
      hint: 'Every face of a cube is equal.',
    },
    {
      // Jaring kubus adalah buktinya: enam persegi yang sama besar, terlihat
      // sekaligus. Tidak ada kalimat yang bisa menggantikan gambar ini.
      stage: 'pictorial',
      prompt: `A cube net has ${netFaces('cube').length} equal faces.`,
      visual: { kind: 'net', solid: 'cube', numberFaces: true },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: `One face is ${layerOf(3, 3)} square cm.`,
      visual: {
        kind: 'solid',
        l: 3,
        w: 3,
        h: 3,
        cubes: false,
        showDimensions: true,
        showName: true,
        unit: 'cm',
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: `Six faces: ${surfaceAreaOf(3, 3, 3)} square cm.`,
      visual: { kind: 'solid', l: 3, w: 3, h: 3, cubes: false, showDimensions: true, unit: 'cm' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: `Edge 5 gives ${surfaceAreaOf(5, 5, 5)} square cm.`,
      visual: { kind: 'solid', l: 5, w: 5, h: 5, cubes: false, showDimensions: true, unit: 'cm' },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'keypad',
      skill: 'cube-surface-area',
      params: { s: [2, 8] },
      answer: (p) => surfaceAreaOf(p.s as number, p.s as number, p.s as number),
      text: (p) => `A cube has edge ${p.s} cm. Find the surface area.`,
      visual: (p) => ({
        kind: 'solid',
        l: p.s as number,
        w: p.s as number,
        h: p.s as number,
        cubes: false,
        showDimensions: true,
        showName: true,
        unit: 'cm',
      }),
    },
    {
      // Tanpa gambar. Rusuk boleh lebih besar daripada yang bisa digambar, justru
      // supaya rumusnya berdiri sendiri tanpa kotak di depan mata.
      type: 'choose-number',
      skill: 'cube-surface-area',
      params: { s: [2, 12] },
      answer: (p) => surfaceAreaOf(p.s as number, p.s as number, p.s as number),
      text: (p) => `Cube edge ${p.s} cm. Total area of all faces?`,
      distractors: 'near',
      // Luas permukaan kubus selalu kelipatan enam. Pengecoh berjarak 1 bisa
      // dicoret tanpa berhitung, jadi jaraknya disamakan dengan skala jawabannya.
      distractorUnit: SOLID_FACES.cube,
      // Miskonsepsi khas: yang dijawab volumenya. Pada rusuk 6 keduanya sama-sama
      // 216 — pengecoh yang sama dengan kunci dibuang generator, jadi soal rusuk 6
      // tetap sah dan tetap punya satu jawaban.
      misconception: (p) => volumeOf(p.s as number, p.s as number, p.s as number),
    },
    {
      // Arah pulang paling jauh: dari luas permukaan kembali ke rusuknya.
      type: 'missing-number',
      skill: 'cube-edge-back',
      params: { s: [2, 8] },
      answer: (p) => p.s as number,
      text: (p) =>
        `A cube has surface area ${surfaceAreaOf(
          p.s as number,
          p.s as number,
          p.s as number,
        )} square cm. Find the edge.`,
    },
    {
      // Pembagian dengan banyak sisi kubus — bukan dengan angka 6 yang dihafal.
      type: 'keypad',
      skill: 'face-from-surface',
      params: { s: [2, 12] },
      answer: (p) =>
        surfaceAreaOf(p.s as number, p.s as number, p.s as number) / SOLID_FACES.cube,
      text: (p) =>
        `A cube has surface area ${surfaceAreaOf(
          p.s as number,
          p.s as number,
          p.s as number,
        )} square cm. Area of one face?`,
    },
  ],
};
