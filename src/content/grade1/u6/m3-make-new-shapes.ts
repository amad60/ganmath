import { COMPOSED, COMPOSED_NAMES, piecesOf } from '../../../components/manipulatives/composed';
import type { ShapeName } from '../../../engine/types';
import { ALSO_TRUE, fourOf } from '../../options';
import type { ContentModule } from '../../types';

/**
 * Fase A Kurikulum Merdeka: menyusun bangun datar dari bangun datar lain.
 *
 * Versi pertama berkata "Two triangles join into a square." di atas SATU segitiga,
 * menguji "What shape is this?" (materi g1-u6-m1, bukan menyusun), dan menanyakan
 * "4 shapes joined twice. How many?" — kalimat tanpa arti dengan jawaban 8. Sekarang
 * setiap soal menunjuk bangun tersusun yang digambar: nama bangun besar dan jumlah
 * potongannya dibaca dari data yang sama dengan gambarnya (`composed.ts`).
 */

/** Bangun besar yang bisa lahir dari potongan di `COMPOSED`. */
const WHOLES: ShapeName[] = ['triangle', 'square', 'rectangle', 'hexagon', 'circle'];

const name = (i: number) => COMPOSED_NAMES[i]!;
const wholeOf = (i: number) => WHOLES.indexOf(COMPOSED[name(i)].whole);
const wholeOptions = (c: number, drop: number) =>
  fourOf(WHOLES, wholeOf(c), drop, (ALSO_TRUE[COMPOSED[name(c)].whole] ?? []) as ShapeName[]);

export const makeNewShapes: ContentModule = {
  id: 'g1-u6-m3',
  unitId: 'g1-u6',
  grade: 1,
  title: 'Make New Shapes',
  icon: '🧩',
  prereq: ['g1-u6-m2'],
  skills: ['compose-shapes'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['composed-shape'],
  vocab: ['join', 'joined', 'half', 'halves', 'part', 'piece', 'pieces', 'hexagon', 'name'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Two triangles join. Tap each one.',
      visual: { kind: 'composed-shape', name: 'square-2-triangles', tap: true },
      action: 'tap-count',
      target: 2,
      hint: 'Together they make a square.',
    },
    {
      stage: 'pictorial',
      prompt: 'Two squares make a rectangle.',
      visual: { kind: 'composed-shape', name: 'rectangle-2-squares', note: '2 squares make 1 rectangle' },
      action: 'watch',
    },
    {
      // Langkah pictorial TERAKHIR = isi tombol Hint: potongan yang banyak, jadi
      // anak bisa berlatih menghitung potongan DAN menamai bangun besarnya.
      stage: 'pictorial',
      prompt: 'Six triangles make a hexagon.',
      visual: { kind: 'composed-shape', name: 'hexagon-6-triangles', note: '6 triangles make 1 hexagon' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Count the pieces. Name the big shape.',
      visual: { kind: 'composed-shape', name: 'circle-2-halves', note: '2 halves make 1 circle' },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Pengecoh yang paling berharga ikut dengan sendirinya: nama POTONGANNYA
      // ("triangle" untuk persegi dari segitiga) — anak yang menamai potongan,
      // bukan bangun besarnya.
      type: 'choose-text',
      skill: 'compose-shapes',
      params: { c: [0, COMPOSED_NAMES.length - 1], drop: [0, 3] },
      answer: (p) => wholeOptions(p.c as number, p.drop as number).indexOf(COMPOSED[name(p.c as number)].whole),
      text: () => 'What big shape do they make?',
      visual: (p) => ({ kind: 'composed-shape', name: name(p.c as number) }),
      options: (p) => wholeOptions(p.c as number, p.drop as number),
    },
    {
      type: 'choose-number',
      skill: 'compose-shapes',
      params: { c: [0, COMPOSED_NAMES.length - 1] },
      answer: (p) => piecesOf(name(p.c as number)),
      text: () => 'How many pieces make this shape?',
      visual: (p) => ({ kind: 'composed-shape', name: name(p.c as number) }),
      distractors: 'near',
      choiceRange: [1, 9],
    },
  ],
};
