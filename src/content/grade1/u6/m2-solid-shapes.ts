import { FLAT_FACES, MOVES, SOLID_KINDS } from '../../../components/manipulatives/solidKinds';
import type { SolidKind } from '../../../engine/types';
import { ALSO_TRUE, fourOf } from '../../options';
import { pl } from '../../plural';
import type { ContentModule } from '../../types';

/**
 * Fase A Kurikulum Merdeka: mengenal bangun ruang — bola, kubus, balok, tabung,
 * kerucut — lewat bentuknya dan sifatnya (menggelinding / bisa ditumpuk).
 *
 * Versi pertama menggambar "A ball rolls. A box stacks." di atas TEN-FRAME, menjawab
 * "Which one is a ball?" dengan 🔴 (lingkaran datar, untuk mengajarkan bahwa bangun
 * ruang tidak datar), dan soal keduanya hanya menghitung kotak 📦. Sekarang setiap
 * soal menunjuk bangun yang digambar, dan jawabannya dibaca dari tabel yang sama
 * dengan yang dipakai materinya (`solidKinds.ts`).
 */

/** Yang ditanya "roll atau stack" — kerucut tidak (lihat `MOVES`). */
const MOVERS = SOLID_KINDS.filter((k) => MOVES[k] != null);
const MOVE_WORDS = ['rolls', 'stacks', 'both'] as const;

const kind = (i: number) => SOLID_KINDS[i] as SolidKind;
const nameOptions = (s: number, drop: number) =>
  fourOf(SOLID_KINDS, s, drop, (ALSO_TRUE[kind(s)] ?? []) as SolidKind[]);

export const solidShapes: ContentModule = {
  id: 'g1-u6-m2',
  unitId: 'g1-u6',
  grade: 1,
  title: 'Solid Shapes',
  icon: '📦',
  prereq: ['g1-u6-m1'],
  skills: ['shape-3d'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['solid-shapes', 'shape-net', 'counter-objects'],
  vocab: [
    'solid',
    'ball',
    'cube',
    'cylinder',
    'cone',
    'can',
    'roll',
    'rolls',
    'stack',
    'stacks',
    'face',
    'faces',
    'some',
    'both',
    'real',
  ],

  learn: [
    {
      // Concrete = benda sungguhan. Emoji boleh di SINI karena yang ditunjukkan adalah
      // benda sehari-harinya, bukan bentuk geometrinya.
      stage: 'concrete',
      prompt: 'These real things are cylinders. Tap each one.',
      visual: { kind: 'counter-objects', count: 4, icons: ['🥫', '🔋', '🧻', '🕯️'] },
      action: 'tap-count',
      target: 4,
      hint: 'A can is a cylinder.',
    },
    {
      stage: 'pictorial',
      prompt: 'Some roll. Some stack. Some do both.',
      visual: {
        kind: 'solid-shapes',
        shapes: MOVERS.map((name) => ({ name, label: true, note: MOVES[name]! })),
      },
      action: 'watch',
    },
    {
      // Langkah pictorial TERAKHIR = isi tombol Hint, jadi kelima bangun, namanya,
      // dan jumlah sisi datarnya ada di sini.
      stage: 'pictorial',
      prompt: 'Count the flat faces on each shape.',
      visual: {
        kind: 'solid-shapes',
        shapes: SOLID_KINDS.map((name) => ({
          name,
          label: true,
          note: pl(FLAT_FACES[name], 'flat face'),
        })),
      },
      action: 'watch',
    },
    {
      // Tiga sisi kubus tersembunyi di gambar mana pun; jaring-jaringnya menunjukkan
      // keenamnya sekaligus, bernomor.
      stage: 'abstract',
      prompt: 'A cube has 6 flat faces.',
      visual: { kind: 'net', solid: 'cube', numberFaces: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Gambar yang ditampilkan, NAMA yang dipilih (sama seperti g1-u6-m1).
      type: 'choose-text',
      skill: 'shape-3d',
      params: { s: [0, 4], drop: [0, 3] },
      answer: (p) => nameOptions(p.s as number, p.drop as number).indexOf(kind(p.s as number)),
      text: () => 'What shape is this?',
      visual: (p) => ({ kind: 'solid-shapes', shapes: [{ name: kind(p.s as number) }] }),
      options: (p) => nameOptions(p.s as number, p.drop as number),
    },
    {
      type: 'choose-number',
      skill: 'shape-3d',
      params: { s: [0, 4] },
      answer: (p) => FLAT_FACES[kind(p.s as number)],
      text: () => 'How many flat faces?',
      visual: (p) => ({ kind: 'solid-shapes', shapes: [{ name: kind(p.s as number) }] }),
      distractors: 'near',
      // Miskonsepsi khas: hanya menghitung sisi yang TERLIHAT di gambar (3 untuk kubus).
      misconception: (p) => (FLAT_FACES[kind(p.s as number)] === 6 ? 3 : null),
      choiceRange: [0, 9],
    },
    {
      type: 'choose-text',
      skill: 'shape-3d',
      params: { m: [0, MOVERS.length - 1] },
      answer: (p) => MOVE_WORDS.indexOf(MOVES[MOVERS[p.m as number]!]!),
      text: () => 'Does it roll, stack, or both?',
      visual: (p) => ({ kind: 'solid-shapes', shapes: [{ name: MOVERS[p.m as number]! }] }),
      options: () => [...MOVE_WORDS],
    },
  ],
};
