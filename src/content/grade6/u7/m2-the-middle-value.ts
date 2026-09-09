import type { ContentModule } from '../../types';

/**
 * Data SELALU berjumlah ganjil di modul ini, dan itu keputusan, bukan kelalaian.
 *
 * Median dari data genap adalah rata-rata dua nilai tengah — yang untuk 8 dan 11
 * bernilai 9,5. Keypad memang punya titik desimal sekarang, tapi soalnya jadi
 * menguji dua hal sekaligus (memilih dua tengah DAN merata-ratakannya) pada modul
 * yang gagasan barunya cuma satu. Data genap ditunda; yang diajarkan di sini
 * adalah "urutkan dulu, lalu ambil yang persis di tengah".
 *
 * Susunan nilai dibangun DARI mediannya: dua di bawah, dua di atas, jaraknya
 * berbeda-beda supaya median tidak bisa ditebak sebagai rata-rata atau sebagai
 * nilai yang paling sering (ketiga nilai lainnya selalu berbeda — tidak ada modus).
 */
const sorted5 = (p: Record<string, number>) => {
  const m = p.m as number;
  return [m - (p.a as number) - (p.b as number), m - (p.a as number), m, m + (p.c as number), m + (p.c as number) + (p.d as number)];
};

/**
 * Urutan TAMPIL, bukan urutan terurut. Tiap permutasi dipilih supaya nilai yang
 * kebetulan berada di tengah DAFTAR bukan mediannya — itulah kekeliruan yang
 * ingin ditangkap modul ini, dan kalau kadang-kadang benar, kekeliruan itu
 * kadang-kadang berbuah nilai bagus.
 */
const PERMS5: number[][] = [
  [3, 0, 4, 2, 1],
  [1, 4, 0, 2, 3],
  [4, 2, 1, 3, 0],
];

const shown5 = (p: Record<string, number>) => {
  const v = sorted5(p);
  const perm = PERMS5[p.ord as number] as number[];
  return perm.map((i) => v[i] as number);
};

const sorted3 = (p: Record<string, number>) => {
  const m = p.m as number;
  return [m - (p.a as number), m, m + (p.c as number)];
};

/** Sama alasannya dengan `PERMS5`: median tidak pernah jatuh di tengah daftar. */
const PERMS3: number[][] = [
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
];

const shown3 = (p: Record<string, number>) => {
  const v = sorted3(p);
  const perm = PERMS3[p.ord as number] as number[];
  return perm.map((i) => v[i] as number);
};

/**
 * Ukuran pemusatan yang kedua. Yang benar-benar baru bukan "ambil yang tengah",
 * melainkan **mengurutkan lebih dulu** — dan itu justru langkah yang paling sering
 * dilewatkan, karena daftar angka sudah terlihat seperti daftar yang rapi.
 *
 * Seluruh aturan soal di sini menampilkan datanya dalam urutan acak yang dipilih
 * supaya nilai di tengah DAFTAR tidak pernah sama dengan mediannya. Anak yang
 * melewatkan pengurutan akan selalu salah; anak yang mengurutkan akan selalu benar.
 * Aturan `choose-number` menjadikan kekeliruan itu pengecoh resminya, sehingga
 * jawaban salah bisa dibaca sebagai diagnosis.
 *
 * Datanya ditulis di teks soal, bukan digambar. `Bars` tidak punya sumbu berangka,
 * dan median menuntut nilai yang tepat — jadi grafik batang mulus sama sekali tidak
 * dipakai di sini. Gambar hanya muncul di layar Learn: batang terurut sebagai
 * gagasan "yang tengah", dan piktogram blok terhitung untuk contoh bernilai tepat.
 */
export const theMiddleValue: ContentModule = {
  id: 'g6-u7-m2',
  unitId: 'g6-u7',
  grade: 6,
  title: 'The Middle Value',
  icon: '🎯',
  prereq: ['g6-u7-m1'],
  skills: ['order-first', 'find-median', 'median-of-three'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number'],
  visuals: ['bar-chart', 'pictogram', 'counter-objects'],
  vocab: ['median', 'middle', 'data', 'value'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five red blocks.',
      visual: { kind: 'counter-objects', count: 9, icon: '🟥' },
      action: 'tap-count',
      target: 5,
      hint: 'Put them in order first.',
    },
    {
      stage: 'pictorial',
      prompt: 'These are not in order.',
      visual: { kind: 'bars', lengths: [0.6, 0.25, 0.95, 0.45, 0.8], labels: ['A', 'B', 'C', 'D', 'E'] },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Order them from small to big.',
      visual: { kind: 'bars', lengths: [0.25, 0.45, 0.6, 0.8, 0.95], labels: ['B', 'D', 'A', 'E', 'C'] },
      action: 'watch',
    },
    {
      // Piktogram, bukan batang: di sini nilainya harus benar-benar terbaca, dan
      // blok bisa dihitung satu-satu. Batang mulus tidak punya sumbu berangka.
      stage: 'abstract',
      prompt: 'Now the middle one is the median.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'A', icon: '🟦', count: 3 },
          { label: 'B', icon: '🟦', count: 5 },
          { label: 'C', icon: '🟦', count: 9 },
        ],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'The median of 3, 5, 9 is 5.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'A', icon: '🟦', count: 3 },
          { label: 'B', icon: '🟦', count: 5 },
          { label: 'C', icon: '🟦', count: 9 },
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Lima nilai, ganjil, semuanya berbeda. Median selalu `m`, tapi `m` tidak
      // pernah muncul di tengah daftar — lihat `PERMS5`.
      type: 'keypad',
      skill: 'find-median',
      params: { m: [8, 16], a: [1, 3], b: [1, 3], c: [1, 3], d: [1, 3], ord: [0, 2] },
      answer: (p) => p.m as number,
      text: (p) => `Find the median: ${shown5(p).join(', ')}.`,
    },
    {
      // Kekeliruan resmi modul ini: mengambil angka yang kebetulan tertulis di
      // tengah tanpa mengurutkan lebih dulu. Dijadikan pengecoh supaya terbaca.
      type: 'choose-number',
      skill: 'order-first',
      params: { m: [6, 14], a: [1, 3], b: [1, 3], c: [1, 3], d: [1, 3], ord: [0, 2] },
      answer: (p) => p.m as number,
      text: (p) => `Which number is the median: ${shown5(p).join(', ')}?`,
      distractors: 'near',
      misconception: (p) => shown5(p)[2] as number,
    },
    {
      // Tiga nilai. Daftarnya lebih pendek, jadi godaan melewatkan pengurutan
      // lebih besar — dan permutasinya tetap menjamin yang di tengah bukan median.
      type: 'keypad',
      skill: 'median-of-three',
      params: { m: [6, 18], a: [1, 5], c: [1, 5], ord: [0, 2] },
      answer: (p) => p.m as number,
      text: (p) => `Put in order. What is the median: ${shown3(p).join(', ')}?`,
    },
  ],
};
