import {
  NET_SOLIDS,
  SOLID_FACES,
  layerOf,
  netFaces,
  netLayoutCount,
  surfaceAreaOf,
  volumeOf,
  type SolidName,
} from '../../../components/manipulatives/solids';
import type { ContentModule } from '../../types';

/** Bangun yang punya bentangan, dipakai sebagai indeks parameter soal. */
const solidAt = (i: number): SolidName => NET_SOLIDS[i] as SolidName;

/**
 * Susunan jaring yang tidak ada tidak boleh jadi soal: `netFaces` membungkus nomor
 * di luar rentang, jadi tanpa pagar ini layout 3 sama persis dengan layout 0 dan
 * dua gambar identik lolos sebagai dua soal berbeda.
 */
const tooManyLayouts = (p: Record<string, number>): boolean =>
  (p.y as number) >= netLayoutCount(solidAt(p.s as number));

/**
 * Luas permukaan, diperkenalkan lewat **jaring-jaring** — bukan lewat rumus.
 *
 * Rumus 2(pl + pt + lt) adalah cara tercepat menghasilkan angka yang benar dan cara
 * tercepat pula kehilangan maknanya: anak yang bertemu rumus lebih dulu akan
 * mengalikan tiga angka apa pun yang tertulis di gambar (persis kekeliruan volume
 * di `g5-u5-m1`), dan tidak punya cara memeriksa dirinya sendiri. Jaring memberi
 * pemeriksa itu: bangunnya dibuka sampai datar, sisinya kelihatan semua, dan luas
 * permukaan hanyalah **luas seluruh kertas itu**. Tidak ada yang perlu dihafal —
 * yang perlu hanya tidak ada sisi yang terlewat.
 *
 * Karena itu urutannya: hitung sisinya (jaring), hitung luas SATU sisi, baru
 * jumlahkan semuanya. Aturan "luas satu muka" bukan selingan — ia yang membuat
 * "menambahkan enam luas" jadi pekerjaan yang benar-benar bisa dilakukan anak.
 *
 * `g5-u6` sudah mengajarkan membaca jaring, jadi di sini jaring dipakai sebagai
 * ALAT, bukan sebagai materi baru.
 *
 * **Semua angka datang dari `solids.ts`**: `surfaceAreaOf` untuk luas permukaan,
 * `layerOf` untuk luas satu muka, `netFaces(...).length` untuk banyak sisi yang
 * tergambar, `volumeOf` untuk pengecoh miskonsepsinya. Tidak ada satu pun yang
 * dihitung sendiri di file ini.
 */
export const addEveryFace: ContentModule = {
  id: 'g6-u5-m2',
  unitId: 'g6-u5',
  grade: 6,
  title: 'Add Every Face',
  icon: '📄',
  prereq: ['g6-u5-m1'],
  skills: ['one-face-area', 'surface-area-box', 'count-faces-to-add', 'surface-area-meaning'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'choose-text'],
  visuals: ['shape-3d', 'shape-net', 'counter-objects'],
  vocab: ['surface'],

  learn: [
    {
      stage: 'concrete',
      prompt: `Tap the ${SOLID_FACES.cube} faces of a cube.`,
      visual: { kind: 'counter-objects', count: SOLID_FACES.cube, icon: '⬜' },
      action: 'tap-count',
      target: SOLID_FACES.cube,
      hint: 'Surface area covers every face.',
    },
    {
      // Sisi diberi nomor HANYA di sini. Begitu jadi soal nomornya dimatikan —
      // kalau tidak, gambarnya menjawab pertanyaannya sendiri.
      stage: 'pictorial',
      prompt: `A net shows all ${netFaces('cube').length} faces.`,
      visual: { kind: 'net', solid: 'cube', numberFaces: true },
      action: 'watch',
    },
    {
      // Balok, bukan kubus: enam sisi tapi hanya TIGA ukuran berbeda, masing-masing
      // muncul dua kali. Itu yang membuat menjumlahkan enam luas tidak melelahkan.
      stage: 'pictorial',
      prompt: 'Faces are equal pairs.',
      visual: { kind: 'solid', l: 3, w: 2, h: 4, cubes: false, showDimensions: true, unit: 'cm' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: `Add the six faces: ${surfaceAreaOf(3, 2, 4)} square cm.`,
      visual: { kind: 'solid', l: 3, w: 2, h: 4, cubes: false, showDimensions: true, unit: 'cm' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: `Surface area of this box: ${surfaceAreaOf(2, 3, 5)} square cm.`,
      visual: { kind: 'solid', l: 2, w: 3, h: 5, cubes: false, showDimensions: true, unit: 'cm' },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Satu muka dulu. Tanpa langkah ini "jumlahkan semua sisi" adalah perintah
      // yang tidak bisa dikerjakan — dan anak akan kembali ke rumus hafalan.
      type: 'keypad',
      skill: 'one-face-area',
      params: { l: [2, 8], w: [2, 7], h: [2, 6] },
      answer: (p) => layerOf(p.l as number, p.w as number),
      text: (p) => `Box ${p.l} by ${p.w} by ${p.h} cm. Area of the bottom?`,
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
      // Seluruh permukaan, dengan gambar berlabel ukuran.
      type: 'keypad',
      skill: 'surface-area-box',
      params: { l: [2, 8], w: [2, 6], h: [2, 6] },
      answer: (p) => surfaceAreaOf(p.l as number, p.w as number, p.h as number),
      text: (p) => `Box ${p.l} by ${p.w} by ${p.h} cm. Find the surface area.`,
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
      // Tanpa gambar: luas permukaan harus bertahan sebagai cara berpikir, bukan
      // sebagai kebiasaan membaca kotak di layar.
      type: 'choose-number',
      skill: 'surface-area-box',
      params: { l: [2, 7], w: [2, 7], h: [2, 7] },
      answer: (p) => surfaceAreaOf(p.l as number, p.w as number, p.h as number),
      text: (p) => `A ${p.l} × ${p.w} × ${p.h} cm box. Total area of all faces?`,
      distractors: 'near',
      // Luas permukaan balok selalu genap. Pengecoh berjarak 1 akan ganjil semua
      // dan bisa dicoret tanpa berhitung, jadi jaraknya dinaikkan jadi 2.
      distractorUnit: 2,
      // Miskonsepsi utama seluruh unit ini: yang dijawab volumenya. Pada balok
      // 6×6×6 dan 4×8×8 angkanya kebetulan sama dengan jawaban benar — generator
      // membuang pengecoh yang sama dengan kunci, jadi tidak perlu dipagari lagi.
      misconception: (p) => volumeOf(p.l as number, p.w as number, p.h as number),
    },
    {
      // Kembali ke jaring: berapa luas yang harus dijumlahkan. Jawabannya diambil
      // dari `netFaces(...).length`, jadi ia benar-benar jumlah sisi yang TERGAMBAR.
      type: 'choose-number',
      skill: 'count-faces-to-add',
      params: { s: [0, 4], y: [0, 2] },
      answer: (p) => netFaces(solidAt(p.s as number), {}, p.y as number).length,
      text: () => 'This net folds up. How many faces do you add?',
      visual: (p) => ({ kind: 'net', solid: solidAt(p.s as number), layout: p.y as number }),
      exclude: tooManyLayouts,
      distractors: 'near',
    },
    {
      // Maknanya, bukan hitungannya. Teksnya tetap dan pilihannya tetap, tapi
      // GAMBARNYA berganti — kunci dedupe generator memuat gambar, jadi sembilan
      // jaring ini tetap sembilan soal, bukan menyusut jadi satu.
      type: 'choose-text',
      skill: 'surface-area-meaning',
      params: { s: [0, 3], y: [0, 2] },
      answer: () => 0,
      text: () => 'What is the surface area of this solid?',
      visual: (p) => ({ kind: 'net', solid: solidAt(p.s as number), layout: p.y as number }),
      exclude: tooManyLayouts,
      options: () => [
        'the area of every face',
        'the space inside it',
        'the number of edges',
        'the longest edge',
      ],
    },
  ],
};
