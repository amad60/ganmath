import { layerOf, volumeOf } from '../../../components/manipulatives/solids';
import type { ContentModule } from '../../types';

/**
 * Gerbang unit bangun ruang Grade 6, dan sengaja **tidak** mengajarkan apa pun yang
 * baru. Volume balok dan kubus sudah dikuasai di `g5-u5`; yang dibutuhkan di sini
 * hanya membangunkannya kembali — karena seluruh unit ini bersandar padanya, dan
 * karena luas permukaan (m2) hanya bisa dipisahkan dari volume kalau volumenya
 * sendiri masih kokoh.
 *
 * Maka modulnya sengaja pendek: satu putaran CPA yang cepat (hitung kubus → satu
 * lapis ditumpuk → p × l × t), lalu langsung ke soal. Anak yang memang sudah bisa
 * akan menyelesaikannya dalam satu sesi sempurna dan lewat (CLAUDE.md §6); anak
 * yang lupa mendapat jalan pulangnya sebelum materi baru menimpanya.
 *
 * Kubus diberi aturan soalnya sendiri, bukan dititipkan sebagai kasus khusus balok.
 * Itu yang menyiapkan m3: rusuk yang sama di ketiga arah adalah satu-satunya alasan
 * luas permukaan kubus bisa ditulis sebagai enam kali satu sisi.
 *
 * **Semua angka datang dari `solids.ts`** (`volumeOf`, `layerOf`) — fungsi yang sama
 * yang dipakai `Solid3D` menuliskan label volumenya. Tidak ada perkalian yang
 * dihitung sendiri di file ini.
 */
export const boxesAndCubes: ContentModule = {
  id: 'g6-u5-m1',
  unitId: 'g6-u5',
  grade: 6,
  title: 'Boxes and Cubes',
  icon: '📦',
  prereq: ['g6-u4-m5'],
  skills: ['volume-recall', 'cube-volume', 'volume-edge-back'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'missing-number'],
  visuals: ['shape-3d', 'counter-objects'],
  vocab: [],

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
      stage: 'pictorial',
      prompt: `One layer holds ${layerOf(3, 2)} cubes.`,
      visual: { kind: 'solid', l: 3, w: 2, h: 1 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: `Two layers make ${volumeOf(3, 2, 2)} cubes.`,
      visual: { kind: 'solid', l: 3, w: 2, h: 2, highlightLayer: 0 },
      action: 'watch',
    },
    {
      // Kubus satuan hilang di sini, persis seperti di `g5-u5-m2`: begitu rumus
      // dipakai, balok digambar sebagai kotak berlabel ukuran — sama seperti di
      // buku dan sama seperti soal yang akan dia temui.
      stage: 'abstract',
      prompt: 'Length times width times height.',
      visual: { kind: 'solid', l: 4, w: 3, h: 2, cubes: false, showDimensions: true, unit: 'cm' },
      action: 'watch',
    },
    {
      // Kubus diperkenalkan ulang sebagai bangun bernama, bukan sebagai balok yang
      // kebetulan sama sisi. m3 akan bersandar tepat pada sifat itu.
      stage: 'abstract',
      prompt: `Cube edge 4: volume is ${volumeOf(4, 4, 4)}.`,
      visual: {
        kind: 'solid',
        l: 4,
        w: 4,
        h: 4,
        cubes: false,
        showDimensions: true,
        showVolume: true,
        showName: true,
        unit: 'cm',
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Ukuran ada di gambar DAN di teks. Ini pemanasan: yang diuji rumusnya,
      // bukan kemampuan membaca rusuk pada gambar isometrik.
      type: 'keypad',
      skill: 'volume-recall',
      params: { l: [2, 8], w: [2, 6], h: [2, 5] },
      answer: (p) => volumeOf(p.l as number, p.w as number, p.h as number),
      text: (p) => `Box ${p.l} by ${p.w} by ${p.h} cm. Find the volume.`,
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
      // Kubus: satu angka saja yang diberikan, tiga kali dipakai.
      type: 'choose-number',
      skill: 'cube-volume',
      params: { s: [2, 8] },
      answer: (p) => volumeOf(p.s as number, p.s as number, p.s as number),
      text: (p) => `A cube has edge ${p.s} cm. Find the volume.`,
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
      distractors: 'near',
      // Miskonsepsi khas kubus: berhenti di satu sisi, jadi yang dijawab luas satu
      // muka (s × s) dan bukan volumenya. Kekeliruan yang sama akan muncul lagi di
      // m3 dari arah sebaliknya, jadi ia sengaja sudah terekam sejak sekarang.
      misconception: (p) => layerOf(p.s as number, p.s as number),
    },
    {
      // Arah balik, tanpa gambar sama sekali. Rusuk yang dicari ada di TENGAH,
      // bukan di ujung: anak yang menghafal "bagi dua angka terakhir" akan salah.
      type: 'missing-number',
      skill: 'volume-edge-back',
      params: { l: [2, 8], w: [2, 6], h: [2, 6] },
      answer: (p) => p.w as number,
      text: (p) =>
        `${p.l} × ? × ${p.h} = ${volumeOf(p.l as number, p.w as number, p.h as number)}`,
    },
  ],
};
