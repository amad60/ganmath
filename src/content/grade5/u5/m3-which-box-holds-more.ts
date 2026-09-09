import { volumeOf } from '../../../components/manipulatives/solids';
import type { ContentModule } from '../../types';

/**
 * Membandingkan volume — dan lewat itu, membongkar miskonsepsi yang paling keras
 * kepala di seluruh topik ini: **bangun yang terlihat lebih tinggi dikira lebih
 * besar.** Balok 2 × 2 × 8 tampak jauh lebih menonjol daripada 4 × 4 × 2, padahal
 * keduanya berisi 32 kubus yang sama banyak.
 *
 * Karena itu aturan pembanding di sini sengaja dibuat BERDEKATAN (selisih paling
 * jauh dua kubus). Membandingkan 8 dengan 60 tidak menguji apa pun: mata sudah
 * menjawabnya sebelum anak mengalikan apa pun. Yang menguji adalah pasangan yang
 * hanya bisa dipisahkan dengan benar-benar menghitung.
 *
 * Aturan terakhir menutup gagasannya dari sisi lain: dua balok BERBEDA BENTUK
 * dengan volume yang SAMA. Rusuk yang hilang dicari anak, dan satu-satunya jalan
 * menemukannya adalah menerima bahwa volume tidak bergantung pada bentuknya.
 *
 * Seluruh angka volume — termasuk yang tertulis di label gambar — datang dari
 * `volumeOf` di `solids.ts`.
 */
export const whichBoxHoldsMore: ContentModule = {
  id: 'g5-u5-m3',
  unitId: 'g5-u5',
  grade: 5,
  title: 'Which Box Holds More',
  icon: '⚖️',
  prereq: ['g5-u5-m2'],
  skills: ['compare-volume', 'volume-difference', 'same-volume'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['compare-symbol', 'keypad', 'missing-number'],
  visuals: ['shape-3d', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap sixteen cubes.',
      visual: { kind: 'counter-objects', count: 16, icon: '🧊' },
      action: 'tap-count',
      target: 16,
      hint: 'Sixteen cubes fill two boxes.',
    },
    {
      stage: 'pictorial',
      prompt: `A tall solid holds ${volumeOf(2, 2, 6)} cubes.`,
      visual: { kind: 'solid', l: 2, w: 2, h: 6, showVolume: true },
      action: 'watch',
    },
    {
      // Pasangan yang membongkar miskonsepsinya: lebih pendek, tapi lebih banyak.
      stage: 'pictorial',
      prompt: `A wide solid holds ${volumeOf(4, 4, 2)} cubes.`,
      visual: { kind: 'solid', l: 4, w: 4, h: 2, showVolume: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Tall is not always more.',
      visual: { kind: 'solid', l: 4, w: 4, h: 2, cubes: false, showDimensions: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: `Same volume, different solid: ${volumeOf(8, 2, 2)} cubes.`,
      visual: {
        kind: 'solid',
        l: 8,
        w: 2,
        h: 2,
        cubes: false,
        showDimensions: true,
        showVolume: true,
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Gambar lawan angka. `d` menggeser pembandingnya −2 … +2 dari volume yang
      // sebenarnya, jadi tidak pernah ada soal yang bisa dijawab dengan melirik.
      type: 'compare-symbol',
      skill: 'compare-volume',
      params: { l: [2, 4], w: [2, 4], h: [2, 4], d: [0, 4] },
      answer: (p) => Math.sign(2 - (p.d as number)),
      text: (p) =>
        `This solid ? ${volumeOf(p.l as number, p.w as number, p.h as number) + (p.d as number) - 2} cubes`,
      visual: (p) => ({
        kind: 'solid',
        l: p.l as number,
        w: p.w as number,
        h: p.h as number,
      }),
    },
    {
      // Dua balok, hanya sebagai ukuran. Di sinilah 2 × 2 × 8 bertemu 4 × 4 × 2.
      //
      // `exclude` menjaga dua hal sekaligus: volumenya harus BERDEKATAN (selisih
      // paling jauh sepuluh kubus), dan ukurannya tidak boleh sama persis. Tanpa
      // syarat pertama, separuh soalnya terjawab dengan melirik angka terbesar;
      // tanpa syarat kedua, muncul "4 × 3 × 2 ? 4 × 3 × 2" yang tidak menanyakan
      // apa pun. Kasus setara tetap dibiarkan lewat — justru itu intinya.
      type: 'compare-symbol',
      skill: 'compare-volume',
      params: { a: [2, 6], b: [2, 5], c: [2, 5], d: [2, 6], e: [2, 5], f: [2, 5] },
      answer: (p) =>
        Math.sign(
          volumeOf(p.a as number, p.b as number, p.c as number) -
            volumeOf(p.d as number, p.e as number, p.f as number),
        ),
      text: (p) => `${p.a} × ${p.b} × ${p.c} ? ${p.d} × ${p.e} × ${p.f}`,
      exclude: (p) => {
        const left = volumeOf(p.a as number, p.b as number, p.c as number);
        const right = volumeOf(p.d as number, p.e as number, p.f as number);
        const identical = p.a === p.d && p.b === p.e && p.c === p.f;
        return identical || Math.abs(left - right) > 10;
      },
    },
    {
      // Selisihnya, bukan hanya arahnya. Yang lebih besar selalu ditulis lebih
      // dulu supaya jawabannya positif — keypad punya minus, tapi selisih negatif
      // di sini akan menguji tanda, bukan volume.
      type: 'keypad',
      skill: 'volume-difference',
      params: { a: [2, 5], b: [2, 4], c: [2, 4], d: [2, 5], e: [2, 4], f: [2, 4] },
      answer: (p) =>
        volumeOf(p.a as number, p.b as number, p.c as number) -
        volumeOf(p.d as number, p.e as number, p.f as number),
      text: (p) =>
        `A is ${p.a} × ${p.b} × ${p.c}. B is ${p.d} × ${p.e} × ${p.f}. ` +
        `How many more cubes fit in A?`,
      exclude: (p) =>
        volumeOf(p.a as number, p.b as number, p.c as number) <=
        volumeOf(p.d as number, p.e as number, p.f as number),
    },
    {
      // Volume sama, bentuk berbeda. Rusuk yang hilang selalu bilangan bulat:
      // kombinasi yang tidak habis dibagi dibuang, bukan dibulatkan.
      type: 'missing-number',
      skill: 'same-volume',
      params: { a: [2, 6], b: [2, 6], c: [2, 5], d: [2, 6] },
      answer: (p) => ((p.a as number) * (p.b as number)) / (p.d as number),
      text: (p) => `${p.a} × ${p.b} × ${p.c} = ${p.d} × ? × ${p.c}`,
      // Tidak habis dibagi, atau soalnya sepele karena kedua sisi sudah kembar.
      exclude: (p) =>
        ((p.a as number) * (p.b as number)) % (p.d as number) !== 0 ||
        (p.d as number) === (p.a as number) ||
        (p.d as number) === (p.b as number),
    },
  ],
};
