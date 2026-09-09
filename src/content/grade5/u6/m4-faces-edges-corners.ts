import {
  NET_SOLIDS,
  SOLID_EDGES,
  SOLID_FACES,
  SOLID_NAMES,
  SOLID_VERTICES,
  netLayoutCount,
  type SolidName,
} from '../../../components/manipulatives/solids';
import type { ContentModule } from '../../types';

const solidAt = (i: number): SolidName => NET_SOLIDS[i] as SolidName;

const tooManyLayouts = (p: Record<string, number>): boolean =>
  (p.y as number) >= netLayoutCount(solidAt(p.s as number));

/**
 * Kubus dan balok punya jumlah sisi, rusuk, dan titik sudut yang sama persis
 * (6 / 12 / 8), jadi soal "bangun mana yang punya 6 sisi dan 12 rusuk?" punya DUA
 * jawaban benar. Aturan yang menanyakannya memakai daftar tanpa kubus — bukan
 * karena kubus tidak penting, tapi karena soal bercabang dua adalah soal rusak.
 */
const NO_CUBE: SolidName[] = NET_SOLIDS.filter((s) => s !== 'cube');
const noCubeAt = (i: number): SolidName => NO_CUBE[i] as SolidName;

/**
 * Kosakata bangun ruang yang akan dipakai terus sampai Grade 6: **sisi, rusuk,
 * titik sudut.**
 *
 * Tiga modul sebelumnya hanya menghitung sisi, karena itulah yang benar-benar
 * terlihat di sebuah jaring. Rusuk dan titik sudut tidak bisa dihitung dari
 * bentangan — di jaring, satu rusuk bangun tampak sebagai DUA garis potong yang
 * nanti bertemu, dan itu justru sumber kekeliruan yang paling sering: anak
 * menghitung garis di kertas, bukan rusuk di bangunnya. Karena itu di sini
 * jaringnya dipakai untuk MENGENALI bangunnya, lalu angkanya diingat.
 *
 * Tabung sengaja ikut meski jumlahnya ganjil menurut kebiasaan sekolah dasar
 * (3 sisi, 2 rusuk, 0 titik sudut). Bangun tanpa titik sudut adalah satu-satunya
 * cara membuktikan bahwa "titik sudut" itu benda yang dihitung, bukan hiasan yang
 * selalu ada.
 *
 * Seluruh angka diambil dari `SOLID_FACES`, `SOLID_EDGES`, dan `SOLID_VERTICES`
 * di `solids.ts` — tabel yang sama yang dipakai gambar untuk menamai bangunnya.
 */
export const facesEdgesCorners: ContentModule = {
  id: 'g5-u6-m4',
  unitId: 'g5-u6',
  grade: 5,
  title: 'Faces, Edges, Corners',
  icon: '🧱',
  prereq: ['g5-u6-m3'],
  skills: ['count-edges', 'count-corners', 'name-from-counts', 'compare-corners'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad', 'choose-text', 'compare-symbol'],
  visuals: ['shape-net', 'shape-3d', 'counter-objects'],
  vocab: ['edge', 'edges', 'corner', 'corners', 'net', 'fold', 'cube', 'cylinder', 'solid'],

  learn: [
    {
      stage: 'concrete',
      prompt: `Tap the ${SOLID_EDGES.cube} edges of a cube.`,
      visual: { kind: 'counter-objects', count: SOLID_EDGES.cube, icon: '📏' },
      action: 'tap-count',
      target: SOLID_EDGES.cube,
      hint: 'Edges are the lines you fold.',
    },
    {
      stage: 'pictorial',
      prompt: `A cube net shows all ${SOLID_FACES.cube} faces.`,
      visual: { kind: 'net', solid: 'cube', numberFaces: true },
      action: 'watch',
    },
    {
      // Balok bersisi sama panjang: `Solid3D` menamainya lewat `solidFromDims`,
      // jadi label gambarnya dan kata "cube" di prompt tidak bisa berselisih.
      stage: 'pictorial',
      prompt: `A cube has ${SOLID_EDGES.cube} edges.`,
      visual: { kind: 'solid', l: 3, w: 3, h: 3, cubes: false, showDimensions: true, showName: true },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: `A ${SOLID_NAMES.cylinder} has ${SOLID_VERTICES.cylinder} corners.`,
      visual: { kind: 'net', solid: 'cylinder', showName: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: `Cube: ${SOLID_FACES.cube} faces, ${SOLID_EDGES.cube} edges, ${SOLID_VERTICES.cube} corners.`,
      visual: { kind: 'net', solid: 'cube', showName: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Jaringnya untuk mengenali bangunnya; rusuknya harus diingat. Kalau anak
      // mencoba menghitung garis di gambar dia akan salah — dan itu memang
      // kekeliruan yang ingin terlihat di sini.
      type: 'choose-number',
      skill: 'count-edges',
      params: { s: [0, 4], y: [0, 2] },
      answer: (p) => SOLID_EDGES[solidAt(p.s as number)],
      text: () => 'This net folds up. How many edges?',
      visual: (p) => ({ kind: 'net', solid: solidAt(p.s as number), layout: p.y as number }),
      exclude: tooManyLayouts,
      distractors: 'near',
    },
    {
      type: 'keypad',
      skill: 'count-corners',
      params: { s: [0, 4] },
      answer: (p) => SOLID_VERTICES[solidAt(p.s as number)],
      text: (p) => `A ${SOLID_NAMES[solidAt(p.s as number)]} has how many corners?`,
    },
    {
      // Arah terbalik: angkanya diberikan, bangunnya dicari.
      type: 'choose-text',
      skill: 'name-from-counts',
      params: { s: [0, 3] },
      answer: () => 0,
      text: (p) =>
        `Which solid has ${SOLID_FACES[noCubeAt(p.s as number)]} faces and ` +
        `${SOLID_EDGES[noCubeAt(p.s as number)]} edges?`,
      options: (p) => {
        const correct = noCubeAt(p.s as number);
        return [
          SOLID_NAMES[correct],
          ...NO_CUBE.filter((s) => s !== correct).map((s) => SOLID_NAMES[s]),
        ];
      },
    },
    {
      // Limas dan prisma segitiga sama-sama bersisi lima tapi titik sudutnya
      // berbeda (5 lawan 6). Membandingkan memaksa ketiga angka dipisahkan.
      type: 'compare-symbol',
      skill: 'compare-corners',
      params: { a: [0, 4], b: [0, 4] },
      answer: (p) =>
        Math.sign(SOLID_VERTICES[solidAt(p.a as number)] - SOLID_VERTICES[solidAt(p.b as number)]),
      text: (p) =>
        `${SOLID_NAMES[solidAt(p.a as number)]} corners ? ` +
        `${SOLID_NAMES[solidAt(p.b as number)]} corners`,
      exclude: (p) => (p.a as number) === (p.b as number),
    },
  ],
};
