import type { ContentModule } from '../../types';

/** Persen bulat yang membagi 100 dengan rapi — dipakai untuk dua sisi perbandingan. */
const PARTS = [10, 20, 25, 50];

/** Pecahan berpenyebut pembagi 100, jadi nilainya bisa dibandingkan tanpa float. */
const FRACTIONS: [number, number][] = [
  [1, 2],
  [1, 4],
  [3, 4],
  [1, 5],
  [3, 5],
  [1, 10],
  [7, 10],
  [1, 20],
  [3, 25],
  [9, 20],
];

/**
 * Penutup unit, dan alasan persen ada sama sekali: **persen membuat dua hal yang
 * tidak sebanding jadi bisa dibandingkan.** 30 dari 50 dan 40 dari 80 tidak bisa
 * diadu langsung; 60% dan 50% bisa.
 *
 * Empat aturannya menaiki satu tangga:
 *  1. dua persen dari dua bilangan yang berbeda (`compare-symbol`) — anak harus
 *     menghitung dua-duanya lebih dulu, tidak ada jalan pintas dengan melihat
 *     angka persennya saja: 10% dari 600 mengalahkan 50% dari 100;
 *  2. persen lawan pecahan — satu bentuk wajib diubah;
 *  3. tiga bentuk sekaligus (persen, desimal, pecahan) dalam satu soal, yang
 *     menutup `m2` dan memaksa semuanya dibawa ke satu satuan;
 *  4. arah terbalik: sebuah bagian DINYATAKAN sebagai persen (`? %`).
 *
 * Aturan 1 dan 3 sengaja TIDAK bergambar. Menggambar dua batang berdampingan
 * langsung memberi jawabannya — batangnya menjadi soalnya sekaligus kuncinya.
 * Batang tetap dipakai di materi, di mana angkanya memang sudah diberitahukan.
 *
 * Batas grade dijaga: aturan 4 menanyakan "berapa persen dari", bukan "berapa
 * perbandingannya". Rasio, skala, dan proporsi adalah `g6-u2` dan tidak diambil
 * di sini — tidak ada notasi a : b dan tidak ada persamaan senilai.
 *
 * Perbandingan dihitung sebagai bilangan bulat di mana-mana (p × den lawan
 * num × 100, bukan p/100 lawan num/den) supaya galat float tidak pernah ikut
 * menentukan benar-salah.
 */
export const compareWithPercent: ContentModule = {
  id: 'g5-u3-m5',
  unitId: 'g5-u3',
  grade: 5,
  title: 'Compare with Percent',
  icon: '⚖️',
  prereq: ['g5-u3-m4'],
  skills: ['percent-compare'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['compare-symbol', 'choose-text', 'missing-number'],
  visuals: ['counter-objects', 'bar-model'],
  vocab: ['percent', 'half', 'both', 'compare'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap six of ten parts.',
      visual: { kind: 'counter-objects', count: 10, icon: '🟪' },
      action: 'tap-count',
      target: 6,
      hint: 'Six of ten is 60 percent.',
    },
    {
      // Dua batang berdampingan: di materi ini sah, karena angkanya sudah
      // dituliskan. Di soal tidak — lihat catatan di atas.
      stage: 'pictorial',
      prompt: '60 percent is more than half.',
      visual: { kind: 'bars', lengths: [0.6, 0.5], labels: ['a', 'b'] },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: '25 percent of 80 is 20.',
      visual: { kind: 'bars', lengths: [1, 0.25], labels: ['1', '?'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Change both to percent, then compare.',
      visual: { kind: 'bars', lengths: [0.75, 0.8], labels: ['a', 'b'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '50 percent of 40 beats 20 percent of 80.',
      visual: { kind: 'bars', lengths: [0.5, 0.4], labels: ['a', 'b'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Persen besar tidak selalu menang. 10% dari 600 = 60 mengalahkan 50% dari
      // 100 = 50, dan kombinasi seperti itu memang ada di ruang parameter ini —
      // itulah yang menghukum anak yang hanya membandingkan angka persennya.
      type: 'compare-symbol',
      skill: 'percent-compare',
      params: { i: [0, 3], j: [0, 3], k: [1, 6], l: [1, 6] },
      answer: (p) =>
        Math.sign(
          (PARTS[p.i as number] as number) * (p.k as number) -
            (PARTS[p.j as number] as number) * (p.l as number),
        ),
      text: (p) =>
        `${PARTS[p.i as number]}% of ${(p.k as number) * 100} ? ${PARTS[p.j as number]}% of ${(p.l as number) * 100}`,
      // Kedua sisi persis sama = soal tanpa isi.
      exclude: (p) => p.i === p.j && p.k === p.l,
    },
    {
      // Persen lawan pecahan. Kasus setara (25% dengan 1/4) dibiarkan muncul:
      // itu jawaban `=`, dan anak harus tahu bahwa dua bentuk bisa sama besar.
      type: 'compare-symbol',
      skill: 'percent-compare',
      params: { i: [0, 9], p: [1, 99] },
      answer: (p) => {
        const [num, den] = FRACTIONS[p.i as number] as [number, number];
        return Math.sign((p.p as number) * den - num * 100);
      },
      text: (p) => {
        const [num, den] = FRACTIONS[p.i as number] as [number, number];
        return `${p.p}% ? ${num}/${den}`;
      },
    },
    {
      // Tiga bentuk sekaligus — penutup yang menagih kembali seluruh m2.
      // Nilai yang seri dibuang supaya "yang terbesar" selalu tunggal.
      type: 'choose-text',
      skill: 'percent-compare',
      params: { p: [1, 99], d: [1, 9], i: [0, 5] },
      answer: (p) => {
        const [num, den] = FRACTIONS[p.i as number] as [number, number];
        const v = [(p.p as number), (p.d as number) * 10, (num * 100) / den];
        return v.indexOf(Math.max(...v));
      },
      text: (p) => {
        const [num, den] = FRACTIONS[p.i as number] as [number, number];
        return `Largest: ${p.p}%, ${(p.d as number) / 10}, or ${num}/${den}?`;
      },
      exclude: (p) => {
        const [num, den] = FRACTIONS[p.i as number] as [number, number];
        const v = [(p.p as number), (p.d as number) * 10, (num * 100) / den];
        return v[0] === v[1] || v[0] === v[2] || v[1] === v[2];
      },
      options: () => ['the percent', 'the decimal', 'the fraction'],
    },
    {
      // Arah terbalik: bagiannya diketahui, persennya yang dicari. Inilah bentuk
      // yang dipakai anak untuk membandingkan dua hasil ulangan yang jumlah
      // soalnya berbeda — dan alasan sebenarnya persen dipakai orang.
      type: 'missing-number',
      skill: 'percent-compare',
      params: { k: [1, 9], j: [1, 99] },
      answer: (p) => p.j as number,
      text: (p) => `${(p.j as number) * (p.k as number)} out of ${(p.k as number) * 100} = ?%`,
    },
  ],
};
