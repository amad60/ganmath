import {
  NET_SOLIDS,
  SOLID_FACES,
  SOLID_NAMES,
  netFaces,
  netLayoutCount,
  type SolidName,
} from '../../../components/manipulatives/solids';
import type { ContentModule } from '../../types';

/** Bangun yang punya bentangan. Dipakai sebagai indeks parameter soal. */
const solidAt = (i: number): SolidName => NET_SOLIDS[i] as SolidName;

/**
 * Susunan jaring yang tidak ada tidak boleh jadi soal: `netFaces` membungkus nomor
 * di luar rentang, jadi tanpa pagar ini kubus layout 3 sama dengan layout 0 dan dua
 * gambar yang identik lolos sebagai dua soal berbeda.
 */
const tooManyLayouts = (p: Record<string, number>): boolean =>
  (p.y as number) >= netLayoutCount(solidAt(p.s as number));

/**
 * Gerbang unit jaring-jaring. Satu ide saja: **sebuah bangun ruang bisa dibuka
 * sampai datar, dan yang keluar adalah sisi-sisinya — tidak berkurang, tidak
 * bertambah.**
 *
 * Nama bangunnya sengaja belum ditanyakan di sini (itu m2). Yang dibangun lebih
 * dulu adalah kepercayaan bahwa jaring itu SATU lembar, bukan tumpukan kotak yang
 * kebetulan berdempetan — karena itu garis lipat (putus-putus) dan garis potong
 * (tebal) diberi soal sendiri. Anak yang tidak bisa membedakan keduanya akan
 * membaca setiap jaring sebagai gambar acak, dan seluruh unit ini berubah jadi
 * tebak-tebakan.
 *
 * **Semua angka datang dari `solids.ts`** — `netFaces(...).length` untuk soal yang
 * ADA gambarnya (jadi jawabannya benar-benar jumlah sisi yang tergambar) dan
 * `SOLID_FACES` untuk soal yang hanya menyebut namanya. Test komponen menjamin
 * keduanya selalu sama; data modul tidak pernah menghitungnya sendiri.
 */
export const openItFlat: ContentModule = {
  id: 'g5-u6-m1',
  unitId: 'g5-u6',
  grade: 5,
  title: 'Open It Flat',
  icon: '📐',
  prereq: ['g5-u5-m6'],
  skills: ['read-a-net', 'count-net-faces', 'fold-lines'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-number', 'choose-text', 'keypad'],
  visuals: ['shape-net', 'counter-objects'],
  vocab: ['net', 'nets', 'fold', 'folds', 'flat', 'face', 'open', 'cut', 'dashed', 'thick', 'cube'],

  learn: [
    {
      stage: 'concrete',
      prompt: `Tap the ${SOLID_FACES.cube} faces of a cube.`,
      visual: { kind: 'counter-objects', count: SOLID_FACES.cube, icon: '⬜' },
      action: 'tap-count',
      target: SOLID_FACES.cube,
      hint: 'A cube has six flat faces.',
    },
    {
      // Sisi diberi nomor HANYA di sini. Begitu jadi soal, nomornya dimatikan —
      // kalau tidak, gambarnya menjawab pertanyaannya sendiri.
      stage: 'pictorial',
      prompt: `Open the cube flat. ${netFaces('cube').length} faces.`,
      visual: { kind: 'net', solid: 'cube', numberFaces: true },
      action: 'watch',
    },
    {
      // Beda garis lipat dan garis potong adalah satu-satunya hal yang membuat
      // gambar ini terbaca sebagai SATU lembar yang bisa dilipat.
      stage: 'pictorial',
      prompt: 'Dashed lines fold. Thick lines are cut.',
      visual: { kind: 'net', solid: 'square-pyramid' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: `A ${SOLID_NAMES.cube} net has ${SOLID_FACES.cube} faces.`,
      visual: { kind: 'net', solid: 'cube', showName: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Teks tetap, gambar berubah — kunci dedupe generator memuat gambarnya,
      // jadi sepuluh jaring ini tetap sepuluh soal berbeda.
      type: 'choose-number',
      skill: 'count-net-faces',
      params: { s: [0, 4], y: [0, 2] },
      answer: (p) => netFaces(solidAt(p.s as number), {}, p.y as number).length,
      text: () => 'How many faces does this net have?',
      visual: (p) => ({ kind: 'net', solid: solidAt(p.s as number), layout: p.y as number }),
      exclude: tooManyLayouts,
      distractors: 'near',
    },
    {
      // Tabung sengaja tidak ikut: selimutnya digambar sebagai satu persegi panjang
      // dan alasnya lingkaran, jadi jaring tabung tidak punya garis lipat sama
      // sekali. Menanyakannya di sini hanya akan mengajarkan hal yang salah.
      type: 'choose-text',
      skill: 'fold-lines',
      params: { s: [0, 3], y: [0, 2] },
      answer: () => 0,
      text: () => 'Which lines do you fold?',
      visual: (p) => ({ kind: 'net', solid: solidAt(p.s as number), layout: p.y as number }),
      exclude: tooManyLayouts,
      options: () => ['the dashed lines', 'the thick lines', 'all the lines', 'no lines at all'],
    },
    {
      // Tanpa gambar: jumlah sisi harus bertahan sebagai pengetahuan, bukan sebagai
      // hasil menghitung kotak yang kebetulan ada di depan mata.
      type: 'keypad',
      skill: 'read-a-net',
      params: { s: [0, 4] },
      answer: (p) => SOLID_FACES[solidAt(p.s as number)],
      text: (p) => `A ${SOLID_NAMES[solidAt(p.s as number)]} has how many faces?`,
    },
  ],
};
