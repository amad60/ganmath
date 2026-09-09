import {
  NET_SOLIDS,
  SOLID_FACES,
  SOLID_NAMES,
  netFaces,
  netLayoutCount,
  type SolidName,
} from '../../../components/manipulatives/solids';
import type { ContentModule } from '../../types';

const solidAt = (i: number): SolidName => NET_SOLIDS[i] as SolidName;

const tooManyLayouts = (p: Record<string, number>): boolean =>
  (p.y as number) >= netLayoutCount(solidAt(p.s as number));

function nameChoices(correct: SolidName, offset: number): string[] {
  const others = NET_SOLIDS.filter((s) => s !== correct);
  const picked: string[] = [];
  for (let k = 0; k < 3; k++) {
    picked.push(SOLID_NAMES[others[(offset + k) % others.length] as SolidName]);
  }
  return [SOLID_NAMES[correct], ...picked];
}

/**
 * Bahaya terbesar dari dua modul sebelumnya: anak menghafal GAMBARNYA.
 *
 * Jaring kubus yang dia lihat berkali-kali berbentuk salib, jadi "salib = kubus"
 * jadi aturan yang bekerja sempurna sampai suatu hari jaringnya disusun lain.
 * Itu bukan pemahaman ruang, itu pengenalan pola — dan pengenalan pola tidak bisa
 * dipakai untuk apa pun sesudahnya.
 *
 * Modul ini membongkarnya dengan barang yang sudah disediakan komponen:
 * `netLayoutCount` memberi tahu berapa bentangan sah yang bisa digambar sebuah
 * bangun (kubus dan balok 3, prisma segitiga 2), dan seluruh soal di sini memakai
 * bentangan **selain** yang dipakai m2. Jawabannya tidak berubah — dan justru itu
 * yang harus anak alami sendiri.
 *
 * Catatan jujur: kubus punya sebelas jaring yang sah di matematika; app ini
 * menggambar tiga. Karena itu tidak ada satu pun soal yang menanyakan "ada berapa
 * jaring kubus" — angka itu milik komponennya, bukan milik matematikanya.
 */
export const manyNetsOneSolid: ContentModule = {
  id: 'g5-u6-m3',
  unitId: 'g5-u6',
  grade: 5,
  title: 'Many Nets, One Solid',
  icon: '🔀',
  prereq: ['g5-u6-m2'],
  skills: ['net-layouts', 'net-to-solid', 'count-net-faces'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number', 'missing-number'],
  visuals: ['shape-net', 'counter-objects'],
  vocab: ['net', 'nets', 'fold', 'folds', 'cube', 'different', 'still', 'way', 'ways', 'open'],

  learn: [
    {
      stage: 'concrete',
      prompt: `Tap the ${SOLID_FACES.cube} faces again.`,
      visual: { kind: 'counter-objects', count: SOLID_FACES.cube, icon: '⬜' },
      action: 'tap-count',
      target: SOLID_FACES.cube,
      hint: 'One cube can open many ways.',
    },
    {
      stage: 'pictorial',
      prompt: 'This is one cube net.',
      visual: { kind: 'net', solid: 'cube', layout: 0, showName: true },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'A different net. Still the same cube.',
      visual: { kind: 'net', solid: 'cube', layout: 1, showName: true },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: `One more cube net. Same ${SOLID_FACES.cube} faces.`,
      visual: { kind: 'net', solid: 'cube', layout: 2, showName: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: `Every cube net has ${netFaces('cube', {}, 2).length} faces.`,
      visual: { kind: 'net', solid: 'cube', layout: 2, numberFaces: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Hanya bentangan yang BELUM pernah dipakai m2 (layout 1 ke atas). Bangun
      // yang cuma punya satu bentangan otomatis tersaring keluar oleh `exclude`.
      type: 'choose-text',
      skill: 'net-layouts',
      params: { s: [0, 4], y: [1, 2] },
      answer: () => 0,
      text: () => 'A different net. Which solid is it?',
      visual: (p) => ({ kind: 'net', solid: solidAt(p.s as number), layout: p.y as number }),
      exclude: tooManyLayouts,
      options: (p) => nameChoices(solidAt(p.s as number), (p.s as number) + (p.y as number)),
    },
    {
      // Susunannya berubah, jumlah sisinya tidak. Jawabannya diambil dari gambar
      // yang benar-benar tergambar (`netFaces(...).length`), bukan dari tabel.
      type: 'choose-number',
      skill: 'count-net-faces',
      params: { s: [0, 4], y: [0, 2] },
      answer: (p) => netFaces(solidAt(p.s as number), {}, p.y as number).length,
      text: () => 'Count the faces on this net.',
      visual: (p) => ({ kind: 'net', solid: solidAt(p.s as number), layout: p.y as number }),
      exclude: tooManyLayouts,
      distractors: 'near',
    },
    {
      // Tanpa gambar sama sekali: kalau anak masih perlu melihat salibnya, dia
      // belum memahami bahwa jumlah sisi milik BANGUNNYA, bukan milik gambarnya.
      type: 'missing-number',
      skill: 'net-layouts',
      params: { s: [0, 4] },
      answer: (p) => SOLID_FACES[solidAt(p.s as number)],
      text: (p) => `Every ${SOLID_NAMES[solidAt(p.s as number)]} net has ? faces.`,
    },
  ],
};
