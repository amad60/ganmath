import type { ContentModule } from '../../types';

/** Tanda minus yang DILIHAT anak: U+2212, sama dengan tombol `−` di keypad. */
const MINUS = '−';

/** Semua pilihan `choose-text` harus berbeda — dua tombol bertulisan sama = soal rusak. */
const allUnique = (o: string[]) => new Set(o).size === o.length;

/** Pilihan "n bertambah b", dibuat sekali supaya `options` dan `exclude` sepakat. */
const addOptions = (b: number) => [`n + ${b}`, `n ${MINUS} ${b}`, `${b} ${MINUS} n`, `n × ${b}`];

/** Pilihan "b kelompok berisi n". */
const timesOptions = (b: number) => [`${b} × n`, `n + ${b}`, `n ${MINUS} ${b}`, `n ÷ ${b}`];

/** Pilihan arah terbalik: dari bentuk aljabar kembali ke ceritanya. */
const storyOptions = (b: number) => [
  `take ${b} from n`,
  `add ${b} to n`,
  `take n from ${b}`,
  `times n by ${b}`,
];

/**
 * Langkah yang paling sering dilewati saat aljabar diajarkan terlalu cepat:
 * **menuliskan situasi sebagai bentuk aljabar, sebelum menghitung apa pun.**
 * Di sini tidak ada yang perlu dicari. Yang dilatih hanya menerjemahkan.
 *
 * Alasannya praktis. Anak yang langsung diajari menyelesaikan persamaan akan
 * pandai memindahkan angka, tapi berhenti total ketika soalnya berupa kalimat —
 * karena dia tidak pernah berlatih membuat kalimat matematikanya sendiri.
 * Modul ini memisahkan dua keterampilan itu supaya keduanya bisa gagal sendiri
 * dan terbaca sendiri di data salah anak.
 *
 * **Bentuk aljabar utuh (`n + 3`, `4 × n`) selalu lewat `choose-text`.** Keypad
 * hanya menerima satu bilangan, dan tidak ada tipe soal di app ini yang merender
 * simbol aljabar; jadi yang boleh diketik anak selalu SATU angka — angka yang
 * menempel pada hurufnya. Itu tetap latihan yang sah ("Bob has n + ?"): yang
 * diuji adalah struktur kalimatnya, bukan hitungannya.
 *
 * Aturan terakhir sengaja menyuruh anak MENGISI nilai n dan menghitung hasilnya.
 * Tanpa itu, tiga aturan sebelumnya semuanya berjawaban "angka yang terlihat di
 * soal", dan anak bisa lulus modul ini tanpa membaca kalimatnya sama sekali.
 */
export const writeWithALetter: ContentModule = {
  id: 'g6-u3-m2',
  unitId: 'g6-u3',
  grade: 6,
  title: 'Write With a Letter',
  icon: '✏️',
  prereq: ['g6-u3-m1'],
  skills: ['write-expression', 'read-expression'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'missing-number', 'choose-number'],
  visuals: ['counter-objects', 'bar-model', 'number-bond'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three more dots.',
      visual: { kind: 'counter-objects', count: 8, icon: '🟢' },
      action: 'tap-count',
      target: 3,
      hint: 'n dots and three more dots.',
    },
    {
      // Batang panjang tak berangka = "sebanyak yang belum kita tahu". `Bars`
      // tidak punya sumbu, jadi panjangnya memang TIDAK boleh dibaca sebagai
      // nilai — di sini itu justru pas: nilainya memang belum ada.
      stage: 'pictorial',
      prompt: 'The first bar is n.',
      visual: { kind: 'bars', lengths: [0.6, 0.2], labels: ['n', '3'] },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'n and 3 make the whole.',
      visual: { kind: 'number-bond', whole: null, parts: [null, 3], ask: 'whole' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'We write it as n + 3.',
      visual: { kind: 'bars', lengths: [0.6, 0.2], labels: ['n', '3'] },
      action: 'watch',
    },
    {
      // Perkalian sebagai kelompok yang sama besar — bentuk yang sama yang
      // dipakai lagi di m5 saat 4 × n harus dibalik jadi pembagian.
      stage: 'abstract',
      prompt: 'We write 3 times n as 3 × n.',
      visual: { kind: 'bars', lengths: [0.3, 0.3, 0.3], labels: ['n', 'n', 'n'] },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Bertambah. Pengecoh kedua dan ketiga adalah dua arah pengurangan —
      // anak yang menebak operasi dari kata "more" tanpa membaca arahnya.
      type: 'choose-text',
      skill: 'write-expression',
      params: { b: [2, 9] },
      answer: () => 0,
      text: (p) => `Ann has n pens. She gets ${p.b} more.`,
      options: (p) => addOptions(p.b as number),
      exclude: (p) => !allUnique(addOptions(p.b as number)),
    },
    {
      // Kelompok yang sama besar → perkalian. Pengecoh pertama menjumlahkan
      // banyaknya kelompok dengan isinya: kesalahan khas anak yang membaca
      // dua angka lalu memilih operasi yang paling mudah.
      type: 'choose-text',
      skill: 'write-expression',
      params: { b: [2, 9] },
      answer: () => 0,
      text: (p) => `${p.b} boxes. Each box holds n balls.`,
      options: (p) => timesOptions(p.b as number),
      exclude: (p) => !allUnique(timesOptions(p.b as number)),
    },
    {
      // Arah sebaliknya: membaca bentuk aljabar dan memilih ceritanya. Urutan
      // pengurangan diuji langsung di sini, karena `n − 3` dan `3 − n` adalah
      // dua hal berbeda yang terlihat sangat mirip.
      type: 'choose-text',
      skill: 'read-expression',
      params: { b: [2, 9] },
      answer: () => 0,
      text: (p) => `Which one means n ${MINUS} ${p.b}?`,
      options: (p) => storyOptions(p.b as number),
      exclude: (p) => !allUnique(storyOptions(p.b as number)),
    },
    {
      // Satu angka yang bisa diketik: angka yang menempel pada hurufnya.
      // Yang diuji strukturnya, bukan hitungannya.
      type: 'missing-number',
      skill: 'write-expression',
      params: { b: [2, 12] },
      answer: (p) => p.b as number,
      text: (p) => `Bob has ${p.b} more than n. Bob has n + ?`,
    },
    {
      // Menguji tulisannya dengan mengisi nilai n. Tanpa aturan ini seluruh
      // modul berjawaban "angka yang terlihat", dan anak bisa lulus tanpa
      // membaca kalimatnya. Pengecoh miskonsepsinya: mengalikan, bukan menambah.
      type: 'choose-number',
      skill: 'write-expression',
      params: { v: [2, 9], b: [2, 9] },
      answer: (p) => (p.v as number) + (p.b as number),
      text: (p) => `n is ${p.v}. Ann has n + ${p.b} pens. How many?`,
      distractors: 'near',
      misconception: (p) => (p.v as number) * (p.b as number),
    },
  ],
};
