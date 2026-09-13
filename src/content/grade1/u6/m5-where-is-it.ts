import { PLACES } from '../../../components/manipulatives/PositionScene';
import type { Place, PositionVisual } from '../../../engine/types';
import type { ContentModule } from '../../types';

/**
 * Fase A Kurikulum Merdeka: menyebut posisi benda — atas, bawah, kiri, kanan — dan
 * urutan benda dalam satu deret.
 *
 * Versi pertama modul ini tidak punya satu pun soal yang bisa dijawab: "Which word
 * means the same?" di atas satu batang berlabel huruf, dengan jawaban yang ditentukan
 * parameter yang tidak terlihat di layar; materinya berkata "This shape is above that
 * one." di atas SATU segitiga. Karena itu semua soal di sini dibaca dari gambarnya:
 * letak di gambar dan jawaban dirakit dari data yang sama, dan lint `position-answer`
 * membaca ulang gambarnya untuk memeriksa keduanya masih setuju.
 */

const BOX = { icon: '📦', name: 'box' };

/** Benda di sekeliling kotak. Satu benda hanya punya satu nama dan satu ikon. */
const THINGS = [
  { icon: '🐱', name: 'cat' },
  { icon: '🐶', name: 'dog' },
  { icon: '🐤', name: 'bird' },
  { icon: '⚽', name: 'ball' },
];

/** Hewan di deret. Semuanya beda, jadi yang ditanyakan hanya ada satu di deretnya. */
const ROW = [
  { icon: '🐱', name: 'cat' },
  { icon: '🐶', name: 'dog' },
  { icon: '🐤', name: 'bird' },
  { icon: '🐟', name: 'fish' },
  { icon: '🐸', name: 'frog' },
];

/** Ke-24 susunan empat benda di empat letak. `PERMS[k][i]` = benda di `PLACES[i]`. */
const PERMS: number[][] = (function permute(rest: number[]): number[][] {
  if (rest.length <= 1) return [rest];
  return rest.flatMap((x) => permute(rest.filter((y) => y !== x)).map((p) => [x, ...p]));
})([0, 1, 2, 3]);

/** Deret dengan hewan `who` di urutan `at` (0 = paling kiri); sisanya urut tetap. */
function rowOf(who: number, at: number): typeof ROW {
  const others = ROW.filter((_, i) => i !== who);
  return [...others.slice(0, at), ROW[who]!, ...others.slice(at)];
}

function around(perm: number[], label = false): PositionVisual {
  return {
    anchor: BOX,
    items: PLACES.map((at, i) => ({ at, ...THINGS[perm[i]!]!, ...(label ? { label } : {}) })),
  };
}

const one = (at: Place, thing: number): PositionVisual => ({
  anchor: BOX,
  items: [{ at, ...THINGS[thing]! }],
});

export const whereIsIt: ContentModule = {
  id: 'g1-u6-m5',
  unitId: 'g1-u6',
  grade: 1,
  title: 'Where Is It?',
  icon: '🧭',
  prereq: ['g1-u6-m1'],
  skills: ['position', 'order'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'choose-number'],
  visuals: ['position', 'counter-objects'],
  vocab: ['left', 'above', 'below', 'beside', 'position', 'order', 'cat', 'dog', 'bird', 'ball'],

  learn: [
    {
      // Menyentuh dari kiri memberi nomor 1, 2, 3 di atas tiap hewan — anak melihat
      // sendiri bahwa kucingnya nomor 3 kalau dihitung dari kiri.
      stage: 'concrete',
      prompt: 'Count from the left to the cat.',
      visual: { kind: 'counter-objects', count: 5, icons: rowOf(0, 2).map((r) => r.icon) },
      action: 'tap-count',
      target: 3,
      hint: 'Start at the left. Tap each one.',
    },
    {
      stage: 'pictorial',
      prompt: 'The bird is above. The ball is below.',
      visual: {
        kind: 'position',
        anchor: BOX,
        items: [
          { at: 'above', icon: '🐤', name: 'bird', label: true },
          { at: 'below', icon: '⚽', name: 'ball', label: true },
        ],
      },
      action: 'watch',
    },
    {
      // Langkah pictorial TERAKHIR = isi tombol Hint di latihan, jadi keempat letak
      // digambar dan ditulis di sini, bukan hanya kiri dan kanan.
      stage: 'pictorial',
      prompt: 'Cat on the left. Dog on the right.',
      visual: { kind: 'position', ...around([2, 3, 0, 1], true) },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Above, below, left, right tell where.',
      visual: {
        kind: 'position',
        anchor: BOX,
        items: PLACES.map((at) => ({ at, label: true })),
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Satu benda saja di sekitar kotak, jadi hanya satu kata yang benar.
      type: 'choose-text',
      skill: 'position',
      params: { place: [0, 3], thing: [0, 3] },
      answer: (p) => p.place as number,
      text: (p) => `Where is the ${THINGS[p.thing as number]!.name}?`,
      visual: (p) => ({ kind: 'position', ...one(PLACES[p.place as number]!, p.thing as number) }),
      options: () => PLACES,
    },
    {
      // Kebalikannya: letaknya disebut, bendanya yang dicari. Keempat benda tampil
      // sekaligus dan susunannya berganti, jadi jawabannya tidak bisa dihafal.
      type: 'choose-text',
      skill: 'position',
      params: { place: [0, 3], perm: [0, 23] },
      answer: (p) => PERMS[p.perm as number]![p.place as number]!,
      text: (p) => {
        const at = PLACES[p.place as number]!;
        return at === 'above' || at === 'below'
          ? `What is ${at} the box?`
          : `What is ${at} of the box?`;
      },
      visual: (p) => ({ kind: 'position', ...around(PERMS[p.perm as number]!) }),
      options: () => THINGS.map((t) => t.name),
    },
    {
      type: 'choose-number',
      skill: 'order',
      params: { who: [0, 4], at: [0, 4] },
      answer: (p) => (p.at as number) + 1,
      text: (p) => `Count from the left. Which number is the ${ROW[p.who as number]!.name}?`,
      visual: (p) => ({
        kind: 'counter-objects',
        count: ROW.length,
        icons: rowOf(p.who as number, p.at as number).map((r) => r.icon),
      }),
      distractors: 'near',
      // Miskonsepsi paling khas: menghitung dari KANAN.
      misconception: (p) => ROW.length - (p.at as number),
      choiceRange: [1, ROW.length],
      // Hint bawaan menggambar atas/bawah/kiri/kanan — tidak menolong soal URUTAN.
      // Langkah pertama tampil dalam keadaan sudah dikerjakan: hewan bernomor 1, 2, 3.
      hint: () => 0,
    },
  ],
};
