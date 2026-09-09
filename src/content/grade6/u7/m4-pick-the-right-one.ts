import type { ContentModule } from '../../types';

/**
 * SATU susunan data yang ketiga ukurannya berbeda — itu seluruh isi modul ini.
 *
 * Terurut: [a, a, b, c, d]. Jadi modusnya `a` (satu-satunya yang berulang),
 * mediannya `b` (nilai ke-3 dari lima), dan rata-ratanya jumlah dibagi lima.
 * Rentang tiap huruf dipisah (a ≤ 6 < b ≤ 9 < c ≤ 12 < d) supaya urutannya tidak
 * pernah tertukar dan modusnya selalu tunggal.
 *
 * Yang dijaga `exclude` di aturan pertama: jumlahnya harus kelipatan lima (kalau
 * tidak, rata-ratanya pecahan) DAN rata-rata tidak boleh sama dengan mediannya.
 * Kalau keduanya kebetulan sama, soal "cari mediannya" dan "cari rata-ratanya"
 * berjawaban sama — dan anak yang salah pilih ukuran tetap dapat nilai benar.
 * Justru itu yang sedang diuji di sini, jadi kebetulan seperti itu tidak boleh ada.
 */
const sorted5 = (p: Record<string, number>) => {
  const a = p.a as number;
  return [a, a, p.b as number, p.c as number, p.d as number];
};

/** Urutan tampil. Dua kembarannya dipisah supaya modus tidak terlihat gratis. */
const SHOW: number[] = [3, 0, 4, 1, 2];

const shown = (p: Record<string, number>) => {
  const v = sorted5(p);
  return SHOW.map((i) => v[i] as number);
};

const sumOf = (p: Record<string, number>) => sorted5(p).reduce((s, x) => s + x, 0);
const meanOf = (p: Record<string, number>) => sumOf(p) / 5;
const medianOf = (p: Record<string, number>) => p.b as number;
const modeOf = (p: Record<string, number>) => p.a as number;

/** Jumlah bukan kelipatan lima = rata-rata pecahan. */
const notWhole = (p: Record<string, number>) => sumOf(p) % 5 !== 0;

const MEASURES = ['mean', 'median', 'mode'] as const;

/**
 * Modul yang membuat tiga modul sebelumnya berguna: sampai di sini anak sudah bisa
 * MENGHITUNG ketiganya, tapi belum pernah harus MEMILIH yang mana.
 *
 * Tiga aturan, tiga cara memaksa pilihan itu terjadi:
 *
 * 1. **Data yang sama, pertanyaan yang berganti.** Daftar lima angka yang sama bisa
 *    ditanya rata-ratanya, mediannya, atau modusnya — dan ketiganya berjawaban
 *    berbeda. Anak yang menghafal satu prosedur akan benar sepertiga waktu.
 * 2. **Situasi, bukan angka.** "Ukuran 34 paling banyak terjual" adalah modus;
 *    "separuh kelas di atas 34" adalah median. Yang diuji namanya, bukan hitungannya.
 * 3. **Membandingkan dua ukuran.** Rata-rata bisa lebih besar, lebih kecil, atau
 *    persis sama dengan median. Aturan `compare-symbol` sengaja TIDAK membuang
 *    kasus samanya — kalau dibuang, anak belajar bahwa tombol `=` tidak pernah
 *    dipakai, dan itu pelajaran yang salah tentang data.
 *
 * Tidak ada satu pun grafik di soal-soal ini: yang diuji adalah memilih ukuran,
 * dan datanya cukup lima angka di dalam teks. Keterbatasan `Bars` (tanpa sumbu
 * berangka) tidak menyentuh modul ini sama sekali.
 */
export const pickTheRightOne: ContentModule = {
  id: 'g6-u7-m4',
  unitId: 'g6-u7',
  grade: 6,
  title: 'Pick the Right One',
  icon: '🧠',
  prereq: ['g6-u7-m3'],
  skills: ['same-data-three-ways', 'name-the-measure', 'compare-measures'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-text', 'compare-symbol'],
  visuals: ['pictogram', 'bar-chart', 'counter-objects'],
  vocab: ['mean', 'median', 'mode', 'middle', 'value', 'data', 'list', 'answer', 'pick', 'fits', 'ways'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five red blocks.',
      visual: { kind: 'counter-objects', count: 9, icon: '🟥' },
      action: 'tap-count',
      target: 5,
      hint: 'One list, three ways to read.',
    },
    {
      stage: 'pictorial',
      prompt: 'Add all, then share equally: mean.',
      visual: { kind: 'bars', lengths: [0.6, 0.6, 0.6, 0.6, 0.6], labels: ['A', 'B', 'C', 'D', 'E'] },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Order them, take the middle: median.',
      visual: { kind: 'bars', lengths: [0.25, 0.45, 0.6, 0.8, 0.95], labels: ['A', 'B', 'C', 'D', 'E'] },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'The value that comes most: mode.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: '4', icon: '🔵', count: 3 },
          { label: '8', icon: '🔵', count: 1 },
          { label: '9', icon: '🔵', count: 1 },
        ],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'One list gives three answers.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: '4', icon: '🔵', count: 3 },
          { label: '8', icon: '🔵', count: 1 },
          { label: '9', icon: '🔵', count: 1 },
        ],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Pick the one that fits.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: '4', icon: '🔵', count: 3 },
          { label: '8', icon: '🔵', count: 1 },
          { label: '9', icon: '🔵', count: 1 },
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Satu daftar, tiga pertanyaan. `t` memilih ukuran yang diminta; teksnya
      // memuat daftarnya, jadi tiap kombinasi jadi soal yang berbeda.
      type: 'keypad',
      skill: 'same-data-three-ways',
      params: { a: [1, 6], b: [7, 9], c: [10, 12], d: [13, 20], t: [0, 2] },
      answer: (p) => {
        const t = p.t as number;
        return t === 0 ? meanOf(p) : t === 1 ? medianOf(p) : modeOf(p);
      },
      text: (p) => `Find the ${MEASURES[p.t as number]}: ${shown(p).join(', ')}.`,
      exclude: (p) => notWhole(p) || meanOf(p) === medianOf(p),
    },
    {
      // Tanpa satu pun hitungan: yang diuji adalah nama ukurannya. Angkanya ikut
      // di teks supaya tiap situasi jadi soal yang berbeda (generator men-dedupe
      // dengan kunci tipe + teks + gambar; teks tetap akan menyusut jadi satu).
      type: 'choose-text',
      skill: 'name-the-measure',
      params: { s: [20, 40], t: [0, 2] },
      answer: (p) => p.t as number,
      text: (p) => {
        const t = p.t as number;
        if (t === 0) return `They shared ${p.s} sweets equally. Which one is that?`;
        if (t === 1) return `Half the class scored above ${p.s}. Which one is that?`;
        return `Size ${p.s} was sold most often. Which one is that?`;
      },
      options: () => [...MEASURES],
    },
    {
      // Kasus rata-rata = median SENGAJA ikut, supaya `=` benar-benar pernah
      // menjadi jawaban. Hanya kelipatan lima yang lolos, supaya rata-ratanya bulat
      // dan yang dibandingkan dua bilangan bulat, bukan satu angka dan satu pecahan.
      type: 'compare-symbol',
      skill: 'compare-measures',
      params: { a: [1, 6], b: [7, 9], c: [10, 12], d: [13, 20] },
      answer: (p) => Math.sign(meanOf(p) - medianOf(p)),
      text: (p) => `Data: ${shown(p).join(', ')}. Mean ? median`,
      exclude: notWhole,
    },
  ],
};
