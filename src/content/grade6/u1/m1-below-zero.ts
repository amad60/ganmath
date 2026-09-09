import type { ContentModule } from '../../types';

/**
 * Tanda minus yang DILIHAT anak: U+2212, sama persis dengan tombol `−` di keypad
 * (`MINUS` di `src/engine/answer.ts`). Hyphen keyboard tidak pernah dipakai di
 * teks soal — kalau berbeda, anak melihat satu tanda di soal dan tanda lain di
 * tombol yang harus dia tekan.
 */
const MINUS = '−';

/** −5 ditulis "−5"; 5 tetap "5". */
const sgn = (n: number) => (n < 0 ? MINUS + String(-n) : String(n));

/** "1 degree", "7 degrees" — satuan ikut angkanya, supaya bacaannya tetap wajar. */
const deg = (n: number) => `${n} degree${Math.abs(n) === 1 ? '' : 's'}`;

/**
 * Gerbang Grade 6. `prereq: []` — tiap kelas harus bisa dimasuki langsung, tanpa
 * menempuh kelas sebelumnya (CLAUDE.md §5).
 *
 * Sampai modul ini, seluruh app hanya pernah menyebut bilangan yang bisa dihitung
 * dengan jari: nol adalah lantai, dan tidak ada apa-apa di bawahnya. Grade 6
 * membuka lantai itu. Yang baru bukan cara berhitungnya — 6 tetap 6 — melainkan
 * bahwa sebuah angka sekarang membawa ARAH, dan arah itu ditulis dengan satu
 * tanda di depannya.
 *
 * Konteksnya suhu, dan itu pilihan sadar: suhu adalah satu-satunya tempat anak
 * Indonesia berumur 12 tahun benar-benar pernah melihat bilangan negatif tertulis
 * (freezer, ramalan cuaca kota dingin). Ketinggian di bawah laut dan lantai
 * basement dipakai sebagai variasi, bukan sebagai pengantar.
 *
 * **Anak mengetik sendiri jawaban negatifnya.** Sejak `dae385c` keypad punya
 * tombol `−`, dan kemunculannya diturunkan per aturan (`answerCaps`) — bukan per
 * soal. Karena itu aturan `keypad` di sini sengaja dibuat MELINTASI nol (ada soal
 * "above" dan ada soal "below" dalam satu aturan yang sama): tombol minusnya
 * selalu ada, jadi keberadaannya tidak membocorkan tanda jawaban soal yang sedang
 * tampil. Anak yang menekannya adalah anak yang memutuskannya sendiri.
 *
 * Batas grade: menjumlah dan mengurangi bilangan bulat adalah `m4`/`m5`; di sini
 * angka hanya DIBACA dan DITULIS.
 */
export const belowZero: ContentModule = {
  id: 'g6-u1-m1',
  unitId: 'g6-u1',
  grade: 6,
  title: 'Below Zero',
  icon: '🌡️',
  // Kelas 6 harus bisa dimasuki langsung, tanpa menempuh kelas sebelumnya.
  prereq: [],
  skills: ['read-integer', 'write-integer'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'compare-symbol'],
  visuals: ['counter-objects', 'number-line'],
  vocab: ['ice', 'colder', 'warmer', 'sign', 'negative', 'temperature'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three ice blocks.',
      visual: { kind: 'counter-objects', count: 6, icon: '🧊' },
      action: 'tap-count',
      target: 3,
      hint: 'Each block makes it one colder.',
    },
    {
      // Benang `number-line` Grade 6 = NEGATIF (grades-2-6.md). Garisnya dipasang
      // dengan `min` negatif sejak layar pertama supaya nol berdiri di tengah,
      // bukan di ujung kiri seperti lima kelas sebelumnya.
      //
      // `step: 1` ditulis eksplisit: langkah otomatis untuk rentang selebar 20
      // adalah 2 (lihat `stepFor`), dan garis yang melompat dua satuan tidak bisa
      // menunjukkan −7. Semua garis di unit ini karena itu memakai step 1.
      stage: 'pictorial',
      prompt: 'Six degrees above zero is 6.',
      visual: { kind: 'number-line', min: -10, max: 10, value: 6, step: 1 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Show six degrees below zero.',
      visual: { kind: 'number-line', min: -10, max: 10, value: null, step: 1 },
      action: 'drop-on-line',
      target: -6,
      hint: 'Count six jumps left from zero.',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as −6.',
      visual: { kind: 'number-line', min: -10, max: 10, value: -6, marks: [6], step: 1 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'The minus sign means below zero.',
      visual: { kind: 'number-line', min: -10, max: 10, value: -6, step: 1 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Inti modul, dan alasan tombol `−` dibuat: anak MENULISKAN sendiri
      // bilangan negatifnya. Satu aturan memuat dua arah sekaligus, jadi
      // `answerCaps` melihat jawaban −9 sampai 9 — tombol minusnya selalu
      // muncul dan karena itu tidak pernah menjawab soalnya.
      type: 'keypad',
      skill: 'write-integer',
      params: { n: [1, 9], d: [0, 1] },
      answer: (p) => ((p.d as number) === 1 ? -(p.n as number) : (p.n as number)),
      text: (p) =>
        `${deg(p.n as number)} ${(p.d as number) === 1 ? 'below' : 'above'} zero. Write it.`,
    },
    {
      // Arah sebaliknya: dari angka bertanda kembali ke maknanya. Jawabannya
      // adalah JARAKNYA, jadi selalu positif — dan memang harus begitu, karena
      // pengecoh soal pilihan dibangun di sekitar jawaban dan dipagari ≥0.
      type: 'choose-number',
      skill: 'read-integer',
      params: { n: [1, 9] },
      answer: (p) => p.n as number,
      text: (p) => `It is ${MINUS}${deg(p.n as number)}. How many degrees below zero?`,
      distractors: 'near',
    },
    {
      // Satu gagasan yang harus terpasang sebelum apa pun yang lain: setiap
      // bilangan negatif lebih kecil daripada nol, seberapa pun besar angkanya.
      // `v = 0` sengaja ikut, supaya `=` benar-benar pernah jadi jawaban dan
      // anak tidak belajar bahwa tombol tengah tidak pernah dipakai.
      type: 'compare-symbol',
      skill: 'read-integer',
      params: { v: [-9, 9] },
      answer: (p) => Math.sign(p.v as number),
      text: (p) => `${sgn(p.v as number)} ? 0`,
    },
  ],
};
