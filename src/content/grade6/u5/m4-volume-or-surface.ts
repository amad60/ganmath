import { layerOf, surfaceAreaOf, volumeOf } from '../../../components/manipulatives/solids';
import type { ContentModule } from '../../types';

/**
 * Empat pilihan yang SAMA untuk kedua pertanyaan — hanya kuncinya yang berpindah.
 * Anak tidak bisa lulus dengan mengenali "yang paling besar"; dia harus membaca
 * apa yang ditanyakan.
 *
 * Dua pilihan terakhir bukan angka asal. `layerOf` adalah luas satu muka saja —
 * jawaban anak yang berhenti di langkah pertama m2. Setengah luas permukaan
 * adalah jawaban anak yang menjumlahkan tiap muka SEKALI, lupa bahwa sisinya
 * berpasangan. Dua-duanya kekeliruan nyata yang sudah dipagari m2.
 */
const OPTIONS = (p: Record<string, number>) => {
  const l = p.l as number;
  const w = p.w as number;
  const h = p.h as number;
  return [
    `${volumeOf(l, w, h)}`,
    `${surfaceAreaOf(l, w, h)}`,
    `${layerOf(l, w)}`,
    `${surfaceAreaOf(l, w, h) / 2}`,
  ];
};

/**
 * Modul yang memisahkan dua bilangan yang selama ini datang dari kotak yang sama.
 *
 * Pada tahap ini yang keliru hampir tidak pernah hitungannya — anak sudah bisa
 * mengerjakan keduanya sejak m1 dan m2. Yang keliru adalah **memilih**: melihat
 * tiga angka pada sebuah balok lalu memakai rumus yang paling terakhir dilatih,
 * apa pun yang ditanya. Karena itu setiap aturan di sini menanyakan volume dan
 * luas permukaan SECARA BERGANTIAN pada gambar yang bentuknya sama persis. Pola
 * dan alasannya identik dengan `g4-u6-m6` (luas atau keliling) dan `g6-u4-m5`
 * (keliling atau luas lingkaran).
 *
 * **Jebakan yang harus disebut:** untuk sebagian balok kedua bilangan itu KEBETULAN
 * sama — kubus rusuk 6 punya volume 216 dan luas permukaan 216, begitu juga balok
 * 4 × 8 × 8. Itu bukan cacat, itu fakta; jadi ia diajarkan terang-terangan di
 * langkah Learn terakhir, dan dipagari di tempat yang memang tidak boleh bercabang:
 *
 * - Aturan `compare-symbol` MEMBIARKANNYA. Tanda `=` adalah salah satu dari tiga
 *   tombol yang tersedia, jadi kasus itu punya jawaban yang benar dan justru
 *   menjadi soal paling berharga di modul ini.
 * - Aturan `choose-text` MEMBUANGNYA lewat `exclude`, bersama semua kombinasi lain
 *   yang membuat dua pilihannya kembar. Soal pilihan dengan dua tombol yang sama
 *   nilainya adalah soal rusak, apa pun yang ditanyakan.
 *
 * Semua angka datang dari `volumeOf`, `surfaceAreaOf`, dan `layerOf` di `solids.ts`.
 */
export const volumeOrSurface: ContentModule = {
  id: 'g6-u5-m4',
  unitId: 'g6-u5',
  grade: 6,
  title: 'Volume or Surface',
  icon: '⚖️',
  prereq: ['g6-u5-m3'],
  skills: ['pick-the-number', 'compare-volume-surface'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-text', 'compare-symbol'],
  visuals: ['shape-3d', 'counter-objects'],
  vocab: ['outside'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap eight cubes.',
      visual: { kind: 'counter-objects', count: 8, icon: '🧊' },
      action: 'tap-count',
      target: 8,
      hint: 'Cubes fill it. Faces cover it.',
    },
    {
      // Balok yang sama dipakai tiga langkah berturut-turut. Yang berubah hanya
      // angka yang ditulis di atasnya — itulah seluruh isi modul ini.
      stage: 'pictorial',
      prompt: `Volume counts cubes inside: ${volumeOf(2, 3, 4)}.`,
      visual: { kind: 'solid', l: 2, w: 3, h: 4 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: `Surface area covers outside: ${surfaceAreaOf(2, 3, 4)}.`,
      visual: { kind: 'solid', l: 2, w: 3, h: 4, cubes: false, showDimensions: true, unit: 'cm' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: `Volume ${volumeOf(2, 3, 4)}, surface area ${surfaceAreaOf(2, 3, 4)}.`,
      visual: {
        kind: 'solid',
        l: 2,
        w: 3,
        h: 4,
        cubes: false,
        showDimensions: true,
        showVolume: true,
        unit: 'cm',
      },
      action: 'watch',
    },
    {
      // Jebakannya diajarkan, bukan disembunyikan. Kubus rusuk 6 adalah satu-satunya
      // kubus yang volumenya sama dengan luas permukaannya, dan anak yang pernah
      // melihatnya tidak akan menyangka soalnya rusak saat ia muncul di kuis.
      stage: 'abstract',
      prompt: `Edge 6: both are ${volumeOf(6, 6, 6)}.`,
      visual: {
        kind: 'solid',
        l: 6,
        w: 6,
        h: 6,
        cubes: false,
        showDimensions: true,
        showName: true,
        unit: 'cm',
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Inti modul: gambar yang sama, pertanyaan yang berganti. `q` bukan bernama
      // `n` dengan sengaja — nama itu memicu ten-frame bantuan di layar soal.
      type: 'keypad',
      skill: 'pick-the-number',
      params: { l: [2, 8], w: [2, 7], h: [2, 6], q: [0, 1] },
      answer: (p) =>
        (p.q as number) === 1
          ? surfaceAreaOf(p.l as number, p.w as number, p.h as number)
          : volumeOf(p.l as number, p.w as number, p.h as number),
      text: (p) =>
        `Box ${p.l} by ${p.w} by ${p.h} cm. Find the ${
          (p.q as number) === 1 ? 'surface area' : 'volume'
        }.`,
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
      // Pilihannya sama untuk kedua pertanyaan; yang berpindah cuma kuncinya.
      type: 'choose-text',
      skill: 'pick-the-number',
      params: { l: [2, 7], w: [2, 7], h: [2, 7], q: [0, 1] },
      answer: (p) => ((p.q as number) === 1 ? 1 : 0),
      text: (p) =>
        `A ${p.l} × ${p.w} × ${p.h} cm box. Which is the ${
          (p.q as number) === 1 ? 'surface area' : 'volume'
        }?`,
      visual: (p) => ({
        kind: 'solid',
        l: p.l as number,
        w: p.w as number,
        h: p.h as number,
        cubes: false,
        showDimensions: true,
        unit: 'cm',
      }),
      options: OPTIONS,
      // Dua tombol bernilai sama = soal bercabang. Ini yang membuang kubus rusuk 6
      // dan balok 4 × 8 × 8 (volume = luas permukaan), juga 3 × 3 × 3 dan 2 × 4 × 4
      // (volume = setengah luas permukaan) — dicek dari angkanya sendiri, bukan
      // dari daftar ukuran yang harus diingat penulis konten.
      exclude: (p) => new Set(OPTIONS(p)).size !== 4,
    },
    {
      // Dua bilangan dari kotak yang SAMA, diadu langsung. `=` memang salah satu
      // jawabannya, dan justru soal itu yang paling banyak mengajarkan.
      type: 'compare-symbol',
      skill: 'compare-volume-surface',
      params: { l: [2, 8], w: [2, 8], h: [2, 8] },
      answer: (p) =>
        Math.sign(
          volumeOf(p.l as number, p.w as number, p.h as number) -
            surfaceAreaOf(p.l as number, p.w as number, p.h as number),
        ),
      text: (p) => `Box ${p.l} × ${p.w} × ${p.h} cm. Volume ? surface area`,
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
  ],
};
