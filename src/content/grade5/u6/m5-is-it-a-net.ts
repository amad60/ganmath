import {
  NET_SOLIDS,
  SOLID_FACES,
  SOLID_NAMES,
  netEdges,
  netFaces,
  netLayoutCount,
  type SolidName,
} from '../../../components/manipulatives/solids';
import type { ContentModule } from '../../types';

const solidAt = (i: number): SolidName => NET_SOLIDS[i] as SolidName;

/**
 * Garis lipat sebuah jaring — dihitung dari gambarnya sendiri, bukan dari rumus
 * yang ditulis ulang di sini. `netEdges` menandai sebuah rusuk sebagai lipatan
 * kalau ia dipakai DUA sisi; sisanya garis potong. Jumlahnya selalu (sisi − 1),
 * dan itu dijaga test komponen, bukan oleh kepercayaan penulis konten.
 */
function foldLines(solid: SolidName, layout = 0): number {
  return netEdges(netFaces(solid, {}, layout)).filter((e) => e.fold).length;
}

/**
 * Tabung tidak ikut dalam soal garis lipat: alasnya lingkaran, dan lingkaran tidak
 * punya rusuk lurus untuk dilipat. `netEdges` mengembalikan 0 lipatan untuknya —
 * benar untuk gambarnya, tapi menyesatkan sebagai pelajaran.
 */
const FOLDABLE = NET_SOLIDS.filter((s) => s !== 'cylinder');
const foldableAt = (i: number): SolidName => FOLDABLE[i] as SolidName;

/**
 * Penutup unit: **tidak setiap kumpulan bangun datar adalah jaring.**
 *
 * Empat modul sebelumnya selalu menunjukkan jaring yang sah, jadi anak belum
 * pernah punya alasan untuk memeriksa apa pun — dia hanya menamai. Padahal
 * pertanyaan yang benar-benar dipakai di ulangan sekolah justru "mana yang BUKAN
 * jaring kubus", dan anak yang tidak pernah menolak satu gambar pun akan menjawab
 * dengan perasaan.
 *
 * Dua pemeriksaan yang bisa dilakukan anak sendiri, keduanya diambil dari
 * `solids.ts`:
 * 1. **Jumlah sisinya harus tepat.** Kurang → ada lubang; lebih → ada sisi dobel.
 * 2. **Garis lipatnya harus sisi dikurangi satu.** Lebih sedikit berarti lembarnya
 *    terputus jadi dua bagian; lebih banyak berarti ada sisi yang bertumpuk.
 *
 * Yang tidak diajarkan di sini: menolak susunan yang jumlah sisinya benar tapi
 * bentuknya tetap tidak bisa dilipat (mis. empat persegi berjajar lurus lalu dua
 * di ujung). Itu butuh menggambar jaring yang SALAH, dan `ShapeNet` — memang
 * sengaja — hanya bisa menggambar jaring yang sah. Batasnya dinyatakan terbuka di
 * sini supaya tidak ada yang mengira modul ini sudah menutup seluruh materinya.
 */
export const isItANet: ContentModule = {
  id: 'g5-u6-m5',
  unitId: 'g5-u6',
  grade: 5,
  title: 'Is It a Net?',
  icon: '✂️',
  prereq: ['g5-u6-m4'],
  skills: ['count-fold-lines', 'check-a-net'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'keypad', 'choose-text'],
  visuals: ['shape-net', 'counter-objects'],
  vocab: ['net', 'nets', 'fold', 'folds', 'cube', 'face', 'minus', 'need', 'needs', 'wrong'],

  learn: [
    {
      stage: 'concrete',
      prompt: `Tap the ${foldLines('cube')} fold lines of a cube.`,
      visual: { kind: 'counter-objects', count: foldLines('cube'), icon: '📏' },
      action: 'tap-count',
      target: foldLines('cube'),
      hint: 'Fold lines are faces minus one.',
    },
    {
      stage: 'pictorial',
      prompt: `${netFaces('cube').length} faces and ${foldLines('cube')} fold lines.`,
      visual: { kind: 'net', solid: 'cube', numberFaces: true },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: `${netFaces('triangular-prism').length} faces need ${foldLines('triangular-prism')} fold lines.`,
      visual: { kind: 'net', solid: 'triangular-prism', numberFaces: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Wrong number of faces? Not a net.',
      visual: { kind: 'net', solid: 'square-pyramid', showName: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Dihitung langsung dari gambar yang sedang tampil: garis putus-putusnya
      // memang sebanyak itu, jadi anak yang menghitungnya satu per satu benar.
      type: 'choose-number',
      skill: 'count-fold-lines',
      params: { s: [0, 3], y: [0, 2] },
      answer: (p) => foldLines(foldableAt(p.s as number), p.y as number),
      text: () => 'Count the fold lines in this net.',
      visual: (p) => ({ kind: 'net', solid: foldableAt(p.s as number), layout: p.y as number }),
      exclude: (p) => (p.y as number) >= netLayoutCount(foldableAt(p.s as number)),
      distractors: 'near',
    },
    {
      // Tanpa gambar: aturannya (sisi dikurangi satu) harus bisa dipakai sendiri.
      type: 'keypad',
      skill: 'count-fold-lines',
      params: { s: [0, 3] },
      answer: (p) => foldLines(foldableAt(p.s as number)),
      text: (p) => `A ${SOLID_NAMES[foldableAt(p.s as number)]} net has how many fold lines?`,
    },
    {
      // Inti modul: menolak. Jawaban "terlalu sedikit" dan "terlalu banyak" dipisah
      // supaya jawaban salah anak terbaca sebagai diagnosis — anak yang selalu
      // memilih "terlalu sedikit" sebenarnya sedang menebak, bukan membandingkan.
      type: 'choose-text',
      skill: 'check-a-net',
      params: { s: [0, 4], n: [2, 9] },
      answer: (p) => {
        const need = SOLID_FACES[solidAt(p.s as number)];
        if ((p.n as number) === need) return 0;
        return (p.n as number) < need ? 1 : 2;
      },
      text: (p) =>
        `A ${SOLID_NAMES[solidAt(p.s as number)]} net needs ` +
        `${SOLID_FACES[solidAt(p.s as number)]} faces. Is ${p.n} right?`,
      options: () => ['the right number of faces', 'too few faces', 'too many faces'],
    },
  ],
};
