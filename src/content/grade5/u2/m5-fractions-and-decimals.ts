import type { ContentModule } from '../../types';

/**
 * Penyebut yang menghasilkan desimal berhenti dan pendek. Semuanya membagi 1000,
 * jadi tidak ada jawaban berulang yang tak bisa diketik anak (lihat `input-width`).
 */
const DENOMS = [2, 4, 5, 8, 10, 20, 25];

/**
 * Jembatan antara dua cara menulis angka yang sama, dan satu-satunya modul unit ini
 * yang benar-benar berisi HAFALAN: 1/2 = 0.5, 1/4 = 0.25, 3/4 = 0.75, 1/5 = 0.2.
 * Karena itu ia `fact` dan memakai ambang kecepatan Grade 5 apa adanya (5 detik) —
 * tidak ada override di sini, sebab tidak ada langkah kedua yang harus dikerjakan.
 * Yang diukur adalah `thinkMs` (sampai tombol pertama disentuh), jadi panjangnya
 * "0.75" untuk diketik tidak ikut terhitung.
 *
 * Arah kerjanya tidak simetris, dan itu keputusan sadar:
 *  - pecahan → desimal DIKETIK anak, karena hasilnya sebuah desimal dan keypad
 *    sekarang punya titiknya;
 *  - desimal → pecahan lewat `choose-text`, karena "3/4" tidak bisa diketik sama
 *    sekali (keypad tidak punya garis pecahan, dan itu di luar lingkup `dae385c`).
 *
 * `compare-symbol` menutup keduanya: membandingkan 3/5 dengan 0.7 memaksa anak
 * mengubah salah satunya lebih dulu — tidak ada jalan pintas visual.
 */
export const fractionsAndDecimals: ContentModule = {
  id: 'g5-u2-m5',
  unitId: 'g5-u2',
  grade: 5,
  title: 'Fractions and Decimals',
  icon: '🔁',
  prereq: ['g5-u2-m4'],
  skills: ['fraction-to-decimal', 'decimal-to-fraction'],
  kind: 'fact',
  fluencyTracked: true,
  questionTypes: ['keypad', 'choose-text', 'choose-number', 'compare-symbol'],
  visuals: ['counter-objects', 'fraction-shape', 'number-line'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five of ten parts.',
      visual: { kind: 'counter-objects', count: 10, icon: '🟡' },
      action: 'tap-count',
      target: 5,
      hint: 'Half of ten parts.',
    },
    {
      stage: 'pictorial',
      prompt: 'Half is five tenths: 0.5.',
      visual: { kind: 'fraction', parts: 2, shaded: 1, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'One fourth is 0.25.',
      visual: { kind: 'fraction', parts: 4, shaded: 1, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Divide the top by the bottom.',
      visual: { kind: 'fraction', parts: 4, shaded: 3, shape: 'square' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Three fourths is 0.75.',
      visual: {
        kind: 'number-line',
        min: 0,
        max: 1,
        value: 0.75,
        marks: [0.25, 0.5, 0.75],
        step: 0.25,
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Pecahan → desimal, DIKETIK. Inilah bukti bahwa keypad baru dipakai untuk
      // hal yang memang membutuhkannya: 0.125 tidak bisa dijawab dengan cara lain.
      type: 'keypad',
      skill: 'fraction-to-decimal',
      params: { i: [0, 6], n: [1, 24] },
      answer: (p) => (p.n as number) / (DENOMS[p.i as number] as number),
      text: (p) => `${p.n}/${DENOMS[p.i as number]} = ?`,
      exclude: (p) => (p.n as number) >= (DENOMS[p.i as number] as number),
    },
    {
      // Arah sebaliknya. Pecahan tidak bisa diketik, jadi ini soal pilihan —
      // bukan kemunduran, tapi batas keypad yang memang belum dilewati.
      type: 'choose-text',
      skill: 'decimal-to-fraction',
      params: { i: [0, 6], n: [1, 24] },
      answer: () => 0,
      text: (p) =>
        `Which fraction is the same as ${(p.n as number) / (DENOMS[p.i as number] as number)}?`,
      exclude: (p) => (p.n as number) >= (DENOMS[p.i as number] as number),
      options: (p) => {
        const n = p.n as number;
        const d = DENOMS[p.i as number] as number;
        return [`${n}/${d}`, `${d}/${n}`, `${n}/${d * 10}`, `${n + 1}/${d}`];
      },
    },
    {
      // Desimal satu tempat dibaca sebagai perseratusan. Miskonsepsi khas: 0.4
      // ditulis 4/100 karena penyebutnya seratus, angkanya disalin apa adanya.
      type: 'choose-number',
      skill: 'decimal-to-fraction',
      params: { a: [1, 9] },
      answer: (p) => (p.a as number) * 10,
      text: (p) => `0.${p.a} = ?/100`,
      distractors: 'near',
      // Jawabannya selalu kelipatan sepuluh; pengecoh berjarak 1 bisa dicoret
      // tanpa berpikir (aturan lint `distractor-scale`).
      distractorUnit: 10,
      misconception: (p) => p.a as number,
    },
    {
      // Satu bentuk harus diubah dulu sebelum bisa dibandingkan. Kasus sama besar
      // (1/2 dengan 0.5) sengaja DIBIARKAN muncul: itu jawaban `=`, dan tanpa
      // pernah melihatnya anak belajar bahwa dua bentuk tidak pernah setara.
      type: 'compare-symbol',
      skill: 'fraction-to-decimal',
      params: { i: [0, 6], n: [1, 24], k: [1, 9] },
      // Dibandingkan sebagai bilangan bulat (n × 10 lawan k × d) supaya tidak ada
      // galat float yang menentukan benar-salah.
      answer: (p) =>
        Math.sign(
          (p.n as number) * 10 - (p.k as number) * (DENOMS[p.i as number] as number),
        ),
      text: (p) => `${p.n}/${DENOMS[p.i as number]} ? 0.${p.k}`,
      exclude: (p) => (p.n as number) >= (DENOMS[p.i as number] as number),
    },
  ],
};
