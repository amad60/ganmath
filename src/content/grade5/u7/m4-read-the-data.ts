import type { ContentModule } from '../../types';

const ROWS = [
  { label: 'red', icon: '🟥' },
  { label: 'blue', icon: '🟦' },
  { label: 'green', icon: '🟩' },
] as const;

const NAMES = ROWS.map((r) => r.label);

const threeRows = (p: Record<string, number>) => [p.a as number, p.b as number, p.c as number];

/** Nilai kembar membuat "yang terbanyak" punya dua jawaban benar. */
const hasTie = (p: Record<string, number>) => new Set(threeRows(p)).size < 3;

/**
 * Penutup Grade 5. Grafiknya dibaca, lalu hasil bacaannya DIPAKAI — termasuk untuk
 * menghitung kecepatan, sehingga tiga modul sebelumnya bertemu dengan unit data
 * Grade 4 di satu layar.
 *
 * **Setiap soal bernilai tepat digambar sebagai baris blok (`pictogram`), bukan
 * batang mulus.** `Bars` tidak punya sumbu berangka, jadi tinggi batang hanya bisa
 * dibandingkan, tidak bisa dibaca — anak yang diminta menyebut nilainya hanya akan
 * menebak. Siasat ini diwarisi dari `g4-u7`, dan batasnya masih sama: batang mulus
 * cuma muncul di layar Learn, sebagai gambar tentang "lebih tinggi berarti lebih
 * banyak", tidak pernah sebagai soal berjawaban angka.
 *
 * Kunci ("satu blok = 6 km") berganti tiap soal. Itu yang menutup satu-satunya
 * pintasan yang tersedia di grafik berskala: menghitung blok lalu menjawab jumlah
 * bloknya. Selisih blok tidak pernah sama dengan selisih nilainya, dan totalnya
 * tidak pernah sama dengan cacah bloknya.
 *
 * Yang sengaja TIDAK diambil di sini: median, modus, dan peluang. Ketiganya materi
 * Grade 6 (`g6-u7`), dan rata-rata sederhana sudah punya modulnya sendiri di
 * `g4-u7-m4` — mengulangnya di sini hanya akan menunda materi yang benar-benar baru.
 */
export const readTheData: ContentModule = {
  id: 'g5-u7-m4',
  unitId: 'g5-u7',
  grade: 5,
  title: 'Read the Data',
  icon: '📊',
  prereq: ['g5-u7-m3'],
  skills: ['read-data', 'compare-data', 'find-speed'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-text'],
  visuals: ['pictogram', 'bar-chart', 'counter-objects'],
  vocab: ['data', 'chart', 'speed', 'km', 'hour', 'stands', 'longer', 'bar', 'total', 'mean'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five blocks.',
      visual: { kind: 'counter-objects', count: 8, icon: '🟦' },
      action: 'tap-count',
      target: 5,
      hint: 'One block stands for 10 km.',
    },
    {
      stage: 'pictorial',
      prompt: 'Each block stands for 10 km.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'red', icon: '🟥', count: 4 },
          { label: 'blue', icon: '🟦', count: 6 },
        ],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'A longer bar means more.',
      visual: { kind: 'bars', lengths: [0.8, 0.35, 0.6], labels: ['A', 'B', 'C'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Add the rows to find the total.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'red', icon: '🟥', count: 4 },
          { label: 'blue', icon: '🟦', count: 6 },
          { label: 'green', icon: '🟩', count: 3 },
        ],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Read the chart, then find the speed.',
      visual: {
        kind: 'pictogram',
        rows: [{ label: 'red', icon: '🟥', count: 4 }],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Tiga langkah: hitung blok tiap baris, jumlahkan, lalu kalikan kuncinya.
      // Baris terakhir adalah tempat anak paling sering berhenti — di sini
      // kelalaian itu tidak bisa disembunyikan, karena kuncinya melipatgandakannya.
      type: 'keypad',
      skill: 'read-data',
      params: { k: [2, 9], a: [2, 8], b: [1, 8], c: [1, 8] },
      answer: (p) => ((p.a as number) + (p.b as number) + (p.c as number)) * (p.k as number),
      text: (p) => `Each block is ${p.k} km. How far in all?`,
      visual: (p) => ({
        kind: 'pictogram',
        rows: ROWS.map((r, i) => ({ ...r, count: threeRows(p)[i] as number })),
      }),
    },
    {
      // Selisih DULU, baru dikalikan kunci. Mengalikan tiap baris lebih dahulu juga
      // benar dan hasilnya sama — yang salah hanya berhenti di selisih bloknya.
      type: 'keypad',
      skill: 'compare-data',
      params: { k: [2, 9], a: [3, 8], b: [1, 7] },
      answer: (p) => ((p.a as number) - (p.b as number)) * (p.k as number),
      text: (p) => `Each block is ${p.k} km. How much more is red?`,
      visual: (p) => ({
        kind: 'pictogram',
        rows: [
          { label: 'red', icon: '🟥', count: p.a as number },
          { label: 'blue', icon: '🟦', count: p.b as number },
        ],
      }),
      exclude: (p) => (p.b as number) >= (p.a as number),
    },
    {
      // Di sinilah unit ini menutup dirinya: grafik dibaca dulu (blok × kunci),
      // hasilnya baru dipakai sebagai jarak untuk mencari kecepatan. Satu baris
      // saja supaya "how fast" tidak bisa salah alamat.
      //
      // Hasil kali blok × kunci dijaga genap: waktunya 2 jam, dan kecepatan yang
      // berjawaban setengah km hanya akan menguji desimal, bukan kecepatan.
      type: 'keypad',
      skill: 'find-speed',
      params: { k: [2, 8], a: [2, 8] },
      answer: (p) => ((p.a as number) * (p.k as number)) / 2,
      text: (p) => `Each block is ${p.k} km. How fast in 2 hours?`,
      visual: (p) => ({
        kind: 'pictogram',
        rows: [{ label: 'red', icon: '🟥', count: p.a as number }],
      }),
      exclude: (p) => ((p.a as number) * (p.k as number)) % 2 !== 0,
    },
    {
      // Membandingkan tanpa menghitung: kuncinya sama untuk semua baris, jadi baris
      // terpanjang selalu yang terbanyak. Teksnya berganti antara "most" dan "least"
      // supaya anak tidak bisa lulus dengan selalu menekan baris terpanjang.
      type: 'choose-text',
      skill: 'compare-data',
      params: { a: [1, 9], b: [1, 9], c: [1, 9], q: [0, 1] },
      answer: (p) => {
        const v = threeRows(p);
        return v.indexOf((p.q as number) === 0 ? Math.max(...v) : Math.min(...v));
      },
      text: (p) => `Which row has the ${(p.q as number) === 0 ? 'most' : 'least'}?`,
      visual: (p) => ({
        kind: 'pictogram',
        rows: ROWS.map((r, i) => ({ ...r, count: threeRows(p)[i] as number })),
      }),
      exclude: hasTie,
      options: () => [...NAMES],
    },
  ],
};
