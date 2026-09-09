import type { ContentModule } from '../../types';

/**
 * Nilai dibangun DARI rata-ratanya — pola yang sama persis dengan `g4-u7-m4`,
 * dan diulang di sini dengan sengaja.
 *
 * Kalau angkanya diacak lalu dibagi, hasilnya hampir selalu pecahan. Jadi rata-rata
 * `m` dipilih dulu, lalu nilainya disebar simetris: (m−d), (m+e), (m+d), (m−e).
 * Jumlahnya pasti 4m, jadi rata-ratanya pasti bilangan bulat.
 *
 * `d ≠ e` dijaga karena dua alasan, dan di Grade 6 alasan keduanya jadi jauh lebih
 * penting daripada di Grade 4: supaya nilainya tidak kembar (kalau kembar, MODUS-nya
 * ada — dan modus baru diajarkan di `m3`), dan supaya TIDAK ADA nilai yang kebetulan
 * sama dengan rata-ratanya. Kalau ada, anak bisa lulus modul ini dengan menunjuk
 * angka tengah — itu median, materi `m2`, dan di unit ini ketiganya hidup
 * berdampingan. Kebiasaan salah alamat di sini akan langsung terbawa dua modul lagi.
 */
const fourValues = (p: Record<string, number>) => {
  const m = p.m as number;
  const d = p.d as number;
  const e = p.e as number;
  return [m - d, m + e, m + d, m - e];
};

/**
 * Pembuka unit penutup. Rata-rata sudah dikenal sejak `g4-u7-m4`, jadi modul ini
 * bukan pengulangan: ia memasang kembali gagasannya, lalu MEMBALIK arahnya.
 *
 * Tiga arah rata-rata, dan yang ketiga adalah yang benar-benar baru:
 * 1. nilai → rata-rata (dijumlahkan, lalu dibagi) — yang sudah dikuasai;
 * 2. rata-rata → total (dikalikan banyaknya) — pembalikan sederhana;
 * 3. rata-rata + sebagian nilai → nilai yang hilang — di sinilah anak harus benar
 *    benar memahami bahwa rata-rata MENYIMPAN totalnya, bukan sekadar hasil bagi.
 *
 * Arah ketiga itu juga yang membuat unit ini bisa dibuka tanpa grafik sama sekali:
 * datanya ada di teks soal, jadi keterbatasan `Bars` (tanpa sumbu berangka) tidak
 * menyentuhnya. Batang mulus muncul hanya sebagai gambar tentang "meratakan" —
 * tidak pernah sebagai sumber angka yang harus dibaca tepat.
 */
export const meanAgain: ContentModule = {
  id: 'g6-u7-m1',
  unitId: 'g6-u7',
  grade: 6,
  title: 'Mean Again',
  icon: '⚖️',
  prereq: ['g6-u6-m4'],
  skills: ['find-mean', 'mean-to-total', 'missing-value'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number'],
  visuals: ['bar-chart', 'counter-objects'],
  vocab: ['mean', 'data', 'move', 'stacks', 'total', 'value'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap six blue blocks.',
      visual: { kind: 'counter-objects', count: 9, icon: '🟦' },
      action: 'tap-count',
      target: 6,
      hint: 'Share them into three equal stacks.',
    },
    {
      stage: 'pictorial',
      prompt: 'These stacks are not equal.',
      visual: { kind: 'bars', lengths: [0.9, 0.35, 0.6], labels: ['A', 'B', 'C'] },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Move blocks to make them equal.',
      visual: { kind: 'bars', lengths: [0.62, 0.62, 0.62], labels: ['A', 'B', 'C'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Add them all, then share equally.',
      visual: { kind: 'bars', lengths: [0.62, 0.62, 0.62], labels: ['A', 'B', 'C'] },
      action: 'watch',
    },
    {
      // Pembalikannya, dan ini yang baru: rata-rata tidak membuang totalnya,
      // ia menyimpannya. Kalimatnya sengaja dibuat cermin dari langkah di atas.
      stage: 'abstract',
      prompt: 'Mean times how many gives the total.',
      visual: { kind: 'bars', lengths: [0.62, 0.62, 0.62], labels: ['A', 'B', 'C'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Batangnya di sini GAMBAR, bukan sumber angka: nilainya ada di teks soal.
      // `Bars` tidak punya sumbu berangka, jadi tinggi batang hanya bisa
      // dibandingkan — anak yang diminta membaca nilainya dari sana hanya menebak.
      type: 'keypad',
      skill: 'find-mean',
      params: { m: [12, 25], d: [1, 6], e: [1, 7] },
      answer: (p) => p.m as number,
      text: (p) => `Find the mean: ${fourValues(p).join(', ')}.`,
      visual: (p) => {
        const v = fourValues(p);
        const top = Math.max(...v);
        return {
          kind: 'bars',
          lengths: v.map((x) => (x / top) * 0.95),
          labels: ['A', 'B', 'C', 'D'],
        };
      },
      exclude: (p) => (p.d as number) === (p.e as number),
    },
    {
      // Arah balik: rata-rata sudah diketahui, totalnya yang dicari. Tanpa gambar —
      // tidak ada data untuk digambar, dan gambar kosong hanya jadi hiasan.
      type: 'keypad',
      skill: 'mean-to-total',
      params: { c: [3, 8], m: [4, 15] },
      answer: (p) => (p.c as number) * (p.m as number),
      text: (p) => `The mean of ${p.c} numbers is ${p.m}. What is the total?`,
    },
    {
      // Nilai yang hilang. Pengecoh miskonsepsinya adalah rata-rata itu sendiri:
      // anak yang mengira "nilai yang hilang pasti rata-ratanya" akan menekannya,
      // dan itu terbaca sebagai diagnosis, bukan sekadar angka salah. Karena itu
      // kombinasi yang jawabannya KEBETULAN sama dengan rata-rata dibuang — kalau
      // tidak, pengecohnya menjadi jawaban benar.
      type: 'choose-number',
      skill: 'missing-value',
      params: { m: [6, 14], a: [2, 9], b: [2, 9] },
      answer: (p) => 3 * (p.m as number) - (p.a as number) - (p.b as number),
      text: (p) =>
        `Three numbers have mean ${p.m}. Two of them are ${p.a} and ${p.b}. Find the third.`,
      exclude: (p) => {
        const third = 3 * (p.m as number) - (p.a as number) - (p.b as number);
        return third < 1 || third === (p.m as number);
      },
      distractors: 'near',
      misconception: (p) => p.m as number,
    },
  ],
};
