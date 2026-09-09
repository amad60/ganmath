import { volumeOf } from '../../../components/manipulatives/solids';
import type { ContentModule } from '../../types';

/** Satuan panjang, dari yang terkecil. Urutannya dipakai sebagai jawaban. */
const LENGTH_UNITS = ['mm', 'cm', 'm', 'km'];
/** Massa dan zat cair dijadikan satu daftar pilihan — di situlah kekeliruannya. */
const AMOUNT_UNITS = ['g', 'kg', 'ml', 'L'];

/**
 * Benda nyata dan satuan yang masuk akal untuk mengukurnya.
 *
 * Pilihan massa dan zat cair sengaja dicampur dalam SATU daftar tombol: anak yang
 * hanya hafal "kg untuk berat, L untuk cairan" tetap harus memutuskan mana yang
 * berlaku untuk benda ini. Kalau daftarnya dipisah, separuh soalnya sudah terjawab
 * oleh bentuk tombolnya sendiri.
 */
const ITEMS: { name: string; units: string[]; right: number }[] = [
  { name: 'a pencil', units: LENGTH_UNITS, right: 1 },
  { name: 'a door', units: LENGTH_UNITS, right: 2 },
  { name: 'an ant', units: LENGTH_UNITS, right: 0 },
  { name: 'a long road', units: LENGTH_UNITS, right: 3 },
  { name: 'a book', units: LENGTH_UNITS, right: 1 },
  { name: 'a tall tree', units: LENGTH_UNITS, right: 2 },
  { name: 'the walk to school', units: LENGTH_UNITS, right: 3 },
  { name: 'an apple', units: AMOUNT_UNITS, right: 0 },
  { name: 'a big dog', units: AMOUNT_UNITS, right: 1 },
  { name: 'a bag of rice', units: AMOUNT_UNITS, right: 1 },
  { name: 'a spoon of oil', units: AMOUNT_UNITS, right: 2 },
  { name: 'a glass of milk', units: AMOUNT_UNITS, right: 2 },
  { name: 'a bucket of water', units: AMOUNT_UNITS, right: 3 },
];

/** Tangga metrik yang harus keluar tanpa berpikir di akhir unit. */
const FACTS: { text: string; answer: number }[] = [
  { text: 'How many mm are in 1 cm?', answer: 10 },
  { text: 'How many cm are in 1 m?', answer: 100 },
  { text: 'How many m are in 1 km?', answer: 1000 },
  { text: 'How many g are in 1 kg?', answer: 1000 },
  { text: 'How many ml are in 1 L?', answer: 1000 },
  { text: 'How many mm are in 1 m?', answer: 1000 },
];

/**
 * Penutup unit: satuannya DIPILIH, bukan diberikan.
 *
 * Sepanjang m4 dan m5 satuannya selalu sudah tertulis di soal, jadi yang dilatih
 * hanya tangganya. Di luar app tidak ada yang menuliskannya — anak sendiri yang
 * harus memutuskan bahwa semut diukur dalam milimeter dan jalan raya dalam
 * kilometer. Itu keterampilan yang berbeda, dan tanpa modul ini seluruh unit
 * berhenti sebagai latihan mengalikan seribu.
 *
 * Karena itu `kind: 'application'`: tidak ada konsep baru di sini, yang ada adalah
 * memakai empat modul sebelumnya di situasi nyata. Kecepatan tidak dinilai
 * (CLAUDE.md §6 — hanya modul `fact` yang dinilai kecepatannya).
 *
 * Aturan terakhir sengaja kembali ke volume, memakai `volumeOf` dari `solids.ts`:
 * unit ini dibuka dengan kubus satuan dan ditutup dengan satuan kubik, dan di
 * antara keduanya harus terlihat sebagai satu benang, bukan dua topik yang
 * kebetulan setetangga.
 */
export const pickTheRightUnit: ContentModule = {
  id: 'g5-u5-m6',
  unitId: 'g5-u5',
  grade: 5,
  title: 'Pick the Right Unit',
  icon: '🧭',
  prereq: ['g5-u5-m5'],
  skills: ['choose-unit', 'metric-facts', 'volume-in-units'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'keypad', 'choose-number'],
  visuals: ['counter-objects', 'bar-model', 'shape-3d'],
  vocab: ['pencil', 'road'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap two bottles.',
      visual: { kind: 'counter-objects', count: 5, icon: '🍶' },
      action: 'tap-count',
      target: 2,
      hint: 'Each bottle holds one litre.',
    },
    {
      stage: 'pictorial',
      prompt: 'Small things use small units.',
      visual: { kind: 'bars', lengths: [0.2, 1], labels: ['cm', 'km'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A long road uses km.',
      visual: { kind: 'bars', lengths: [1, 0.1], labels: ['km', 'm'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: `Volume uses cubic units: ${volumeOf(4, 3, 2)}.`,
      visual: {
        kind: 'solid',
        l: 4,
        w: 3,
        h: 2,
        cubes: false,
        showDimensions: true,
        showVolume: true,
        unit: 'cm',
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Nama bendanya masuk ke teks soal, bukan hanya ke pilihannya: kunci dedupe
      // generator memakai teks, jadi 13 benda ini benar-benar jadi 13 soal.
      type: 'choose-text',
      skill: 'choose-unit',
      params: { i: [0, ITEMS.length - 1] },
      answer: (p) => (ITEMS[p.i as number] as { right: number }).right,
      text: (p) => `Which unit fits ${(ITEMS[p.i as number] as { name: string }).name}?`,
      options: (p) => (ITEMS[p.i as number] as { units: string[] }).units,
    },
    {
      // Tangganya sendiri, diketik. Sengaja bukan `choose-number`: pilihan di
      // sekitar 1000 (990, 1010) tidak mencerminkan kekeliruan siapa pun — yang
      // salah menjawab 100, dan itu jarak yang tidak bisa dibuat pengecoh `near`.
      type: 'keypad',
      skill: 'metric-facts',
      params: { i: [0, FACTS.length - 1] },
      answer: (p) => (FACTS[p.i as number] as { answer: number }).answer,
      text: (p) => (FACTS[p.i as number] as { text: string }).text,
    },
    {
      // Volume dengan satuan sungguhan. Angkanya datang dari `volumeOf`, sama
      // seperti label yang tertulis di gambarnya.
      type: 'keypad',
      skill: 'volume-in-units',
      params: { l: [2, 8], w: [2, 6], h: [2, 5] },
      answer: (p) => volumeOf(p.l as number, p.w as number, p.h as number),
      text: (p) => `A box is ${p.l} cm by ${p.w} cm by ${p.h} cm. Volume in cubic cm?`,
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
      // Soal cerita satu langkah: satuannya harus diubah sebelum dijawab.
      type: 'choose-number',
      skill: 'metric-facts',
      params: { n: [2, 9] },
      answer: (p) => (p.n as number) * 1000,
      text: (p) => `A jug holds ${p.n} L. How many ml is that?`,
      distractorUnit: 1000,
      distractors: 'near',
      misconception: (p) => (p.n as number) * 100,
    },
  ],
};
