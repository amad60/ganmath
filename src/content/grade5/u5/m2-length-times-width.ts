import { layerOf, volumeOf } from '../../../components/manipulatives/solids';
import type { ContentModule } from '../../types';

/**
 * Jalan pintas untuk sesuatu yang sudah anak percaya: **p × l × t**.
 *
 * Urutannya persis mengikuti luas di Grade 4 (`g4-u6-m4` menghitung petak, `m5`
 * baru memberi rumusnya). Di sini luas alas itu sendiri yang jadi tangganya —
 * `layerOf` adalah p × l, yang sudah dikuasai anak sebagai LUAS sejak `g4-u6-m5`.
 * Volume hanyalah luas alas yang ditumpuk setinggi t. Menuliskannya begitu membuat
 * rumus baru ini bersandar pada rumus lama, bukan berdiri sendiri sebagai hafalan
 * ketiga yang gampang tertukar dengan keliling dan luas.
 *
 * Karena itu `cubes: false` mulai dipakai di sini: begitu anak memakai rumus, balok
 * tidak lagi digambar sebagai tumpukan kubus melainkan sebagai kotak berlabel
 * ukuran — sama seperti di buku, dan sama seperti soal yang akan dia temui.
 * Gambar kubus tetap ada di tahap concrete supaya jalan pulangnya tidak putus.
 *
 * Semua angka (jawaban maupun yang tertulis di gambar) datang dari `volumeOf` dan
 * `layerOf` di `solids.ts` — fungsi yang sama yang dipakai `Solid3D` menuliskan
 * label volumenya.
 */
export const lengthTimesWidth: ContentModule = {
  id: 'g5-u5-m2',
  unitId: 'g5-u5',
  grade: 5,
  title: 'Length Times Width',
  icon: '📦',
  prereq: ['g5-u5-m1'],
  skills: ['volume-formula', 'volume-missing-side'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'missing-number'],
  visuals: ['shape-3d', 'array-grid', 'counter-objects'],
  vocab: ['length', 'width', 'height', 'cubic'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twelve cubes.',
      visual: { kind: 'counter-objects', count: 12, icon: '🧊' },
      action: 'tap-count',
      target: 12,
      hint: 'Three rows of four cubes.',
    },
    {
      // Luas alas dulu, dan sengaja digambar dengan `array-grid` — komponen yang
      // sama yang dipakai luas di g4-u6. Penandanya BULAT, jadi kata yang dipakai
      // "parts", bukan "squares": kata dan gambar tidak boleh bertengkar.
      stage: 'pictorial',
      prompt: `One layer has ${layerOf(4, 3)} parts.`,
      visual: { kind: 'array', rows: 3, cols: 4 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: `Stack two layers. Volume is ${volumeOf(4, 3, 2)}.`,
      visual: { kind: 'solid', l: 4, w: 3, h: 2, highlightLayer: 0 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Length times width times height.',
      visual: { kind: 'solid', l: 4, w: 3, h: 2, cubes: false, showDimensions: true, unit: 'cm' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: `4 by 3 by 2 is ${volumeOf(4, 3, 2)}.`,
      visual: {
        kind: 'solid',
        l: 4,
        w: 3,
        h: 2,
        cubes: false,
        showDimensions: true,
        showVolume: true,
        unit: 'cm',
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Rumus dipakai pada balok berlabel ukuran, tanpa kubus untuk dihitung —
      // di sinilah anak harus benar-benar mengalikan.
      type: 'keypad',
      skill: 'volume-formula',
      params: { l: [2, 8], w: [2, 6], h: [2, 5] },
      answer: (p) => volumeOf(p.l as number, p.w as number, p.h as number),
      text: (p) => `${p.l} cm by ${p.w} cm by ${p.h} cm. Volume?`,
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
      // Ukurannya hanya tertulis, tanpa gambar sama sekali: rumus harus bertahan
      // tanpa benda di depannya, kalau tidak ia belum dikuasai.
      type: 'choose-number',
      skill: 'volume-formula',
      params: { l: [2, 9], w: [2, 9], h: [2, 9] },
      answer: (p) => volumeOf(p.l as number, p.w as number, p.h as number),
      text: (p) => `Volume of a ${p.l} × ${p.w} × ${p.h} box?`,
      distractors: 'near',
      // Miskonsepsi paling sering di volume: tingginya dilupakan, jadi yang
      // dijawab adalah LUAS ALAS. Itu kekeliruan yang harus terbaca sebagai
      // "belum memisahkan luas dari volume", bukan sebagai salah hitung.
      misconception: (p) => layerOf(p.l as number, p.w as number),
    },
    {
      // Arah terbalik: volumenya diketahui, satu rusuknya dicari. Ini yang
      // menyiapkan m3 (membandingkan) dan memaksa rumus dibaca dua arah.
      type: 'missing-number',
      skill: 'volume-missing-side',
      params: { l: [2, 8], w: [2, 6], h: [2, 6] },
      answer: (p) => p.h as number,
      text: (p) =>
        `${p.l} × ${p.w} × ? = ${volumeOf(p.l as number, p.w as number, p.h as number)}`,
    },
  ],
};
