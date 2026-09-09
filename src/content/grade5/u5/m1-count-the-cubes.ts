import {
  SOLID_FACES,
  SOLID_NAMES,
  layerOf,
  solidFromDims,
  volumeOf,
} from '../../../components/manipulatives/solids';
import type { ContentModule } from '../../types';

/**
 * Gerbang unit volume. Satu ide saja: **volume adalah banyaknya kubus satuan yang
 * memenuhi sebuah bangun** — dihitung, bukan dihitungkan dengan rumus.
 *
 * Rumus p × l × t sengaja belum muncul di sini. Anak yang bertemu rumus lebih dulu
 * akan mengalikan tiga angka apa pun yang tertulis di gambar, persis seperti yang
 * terjadi pada luas di `g4-u6-m4` (karena itu luas pun dimulai dari "menutupi dan
 * menghitung", bukan dari p × l). Yang dibangun di sini adalah kepercayaan bahwa
 * angkanya memang bisa dihitung satu per satu; m2 baru menawarkan jalan pintasnya.
 *
 * Jembatan ke rumus sudah dipasang diam-diam lewat **lapis**: `highlightLayer`
 * menyorot lapis paling bawah, jadi "satu lapis, lalu ditumpuk" terlihat sebagai
 * gambar sebelum pernah ditulis sebagai kalimat.
 *
 * **Seluruh angka di modul ini datang dari `solids.ts`** (`volumeOf`, `layerOf`,
 * `solidFromDims`, `SOLID_NAMES`, `SOLID_FACES`) — fungsi yang sama yang dipakai
 * `Solid3D` dan `ShapeNet` untuk menggambar. Ini pola `angleKind` di `g4-u6`, dan
 * alasannya sama: soal yang bilang "24" di atas gambar berisi 18 kubus adalah
 * kesalahan yang tidak pernah ketahuan sampai seorang anak menghitungnya.
 */
export const countTheCubes: ContentModule = {
  id: 'g5-u5-m1',
  unitId: 'g5-u5',
  grade: 5,
  title: 'Count the Cubes',
  icon: '🧊',
  prereq: ['g5-u4-m6'],
  skills: ['count-unit-cubes', 'volume-layers', 'name-solids'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad', 'choose-text'],
  visuals: ['shape-3d', 'shape-net', 'counter-objects'],
  vocab: ['cube', 'cubes', 'volume', 'layer', 'layers', 'prism', 'net', 'folds'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap eight cubes.',
      visual: { kind: 'counter-objects', count: 8, icon: '🧊' },
      action: 'tap-count',
      target: 8,
      hint: 'Each cube is one unit.',
    },
    {
      // Satu-satunya jaring di unit ini. Bentangan adalah materi utama g5-u6, jadi
      // di sini ia hanya dipakai sekali, untuk hal yang memang milik modul ini:
      // kubus satuan itu benda pejal bersisi enam, bukan kotak di atas kertas.
      stage: 'concrete',
      prompt: `A net folds into a cube. ${SOLID_FACES.cube} faces.`,
      visual: { kind: 'net', solid: 'cube', numberFaces: true },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: `One layer holds ${layerOf(3, 2)} cubes.`,
      visual: { kind: 'solid', l: 3, w: 2, h: 1 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: `Two layers of ${layerOf(3, 2)} make ${volumeOf(3, 2, 2)}.`,
      visual: { kind: 'solid', l: 3, w: 2, h: 2, highlightLayer: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: `Volume is ${volumeOf(4, 3, 2)} cubes.`,
      visual: { kind: 'solid', l: 4, w: 3, h: 2, showVolume: true, showName: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Teks tetap, gambar berubah — kunci dedupe generator memuat gambarnya,
      // jadi 36 balok ini tetap 36 soal berbeda.
      type: 'choose-number',
      skill: 'count-unit-cubes',
      params: { l: [2, 5], w: [2, 4], h: [1, 3] },
      answer: (p) => volumeOf(p.l as number, p.w as number, p.h as number),
      text: () => 'How many cubes make this solid?',
      visual: (p) => ({
        kind: 'solid',
        l: p.l as number,
        w: p.w as number,
        h: p.h as number,
      }),
      distractors: 'near',
      // Miskonsepsi khas gambar isometrik: hanya lapis atas yang dihitung, karena
      // itu yang paling jelas terlihat. Untuk balok setinggi satu lapis angkanya
      // sama dengan jawaban benar — generator membuangnya sendiri.
      misconception: (p) => layerOf(p.l as number, p.w as number),
    },
    {
      // Lapis dinyatakan terang-terangan dan disorot di gambar. Ini pertanyaan
      // yang sama dengan aturan di atas, tapi ditanya lewat jalan yang menuju rumus.
      type: 'keypad',
      skill: 'volume-layers',
      params: { l: [2, 5], w: [2, 4], h: [2, 4] },
      answer: (p) => volumeOf(p.l as number, p.w as number, p.h as number),
      text: (p) =>
        `One layer has ${layerOf(p.l as number, p.w as number)} cubes. ` +
        `How many in ${p.h} layers?`,
      visual: (p) => ({
        kind: 'solid',
        l: p.l as number,
        w: p.w as number,
        h: p.h as number,
        highlightLayer: 0,
      }),
    },
    {
      // Nama bangun diambil dari `solidFromDims`, bukan ditebak penulis konten:
      // 3×3×2 BUKAN kubus, dan modul yang menuliskannya sebagai kubus mengajarkan
      // hal yang salah sejak hari pertama.
      type: 'choose-text',
      skill: 'name-solids',
      params: { l: [2, 5], w: [2, 5], h: [2, 5] },
      answer: () => 0,
      text: () => 'What is this solid called?',
      visual: (p) => ({
        kind: 'solid',
        l: p.l as number,
        w: p.w as number,
        h: p.h as number,
      }),
      options: (p) => [
        SOLID_NAMES[solidFromDims(p.l as number, p.w as number, p.h as number)],
        SOLID_NAMES['square-pyramid'],
        SOLID_NAMES.cylinder,
        SOLID_NAMES['triangular-prism'],
      ],
    },
  ],
};
