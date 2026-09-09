import {
  PI,
  circumferenceFromDiameter,
  radiusFromDiameter,
} from '../../../components/manipulatives/circles';
import type { ContentModule } from '../../types';

/** Simbol yang DILIHAT anak. Nilainya tidak pernah ditulis lepas — lihat `PI`. */
const PI_SIGN = 'π';

/**
 * π, dan sengaja BUKAN sebagai angka yang jatuh dari langit.
 *
 * Urutannya dibalik dari cara buku biasa menyajikannya. Buku menulis "π = 3,14"
 * lebih dulu lalu memakainya; di sini anak melihat pasangan keliling–diameter
 * berkali-kali, membaginya, dan **selalu mendapat 3.14**. Barulah hasil itu
 * diberi nama. Itulah kenapa aturan pertama modul ini jawabannya selalu sama:
 * jawabannya memang harus selalu sama — kalau tidak, π bukan π.
 *
 * `Circle` bisa menuliskan keliling dan diameter dalam satu gambar, jadi
 * pembagian itu sesuatu yang anak periksa sendiri di layar, bukan yang dia
 * percayai karena disuruh.
 *
 * Semua angka datang dari `circles.ts`: `PI` (satu konstanta untuk seluruh app)
 * dan `circumferenceFromDiameter`. Tidak ada 3.14 yang ditulis lepas di file ini
 * dan tidak ada keliling yang dihitung sendiri — kalau ada, cepat atau lambat
 * soal akan menyebut angka yang berbeda dari gambarnya.
 */
export const meetPi: ContentModule = {
  id: 'g6-u4-m2',
  unitId: 'g6-u4',
  grade: 6,
  title: 'Meet Pi',
  icon: '🥧',
  prereq: ['g6-u4-m1'],
  skills: ['pi-meaning', 'circumference-from-diameter'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number'],
  visuals: ['circle', 'counter-objects'],
  vocab: ['pi', 'circumference', 'string'],

  learn: [
    {
      // Tiga tali sepanjang diameter, dipasang mengelilingi lingkaran, hampir
      // menutupnya — itu π sebelum ada angkanya sama sekali.
      stage: 'concrete',
      prompt: 'Tap three pieces of string.',
      visual: { kind: 'counter-objects', count: 3, icon: '🧵' },
      action: 'tap-count',
      target: 3,
      hint: 'Each string is one diameter long.',
    },
    {
      stage: 'pictorial',
      prompt: 'This diameter is 10 cm long.',
      visual: { kind: 'circle', d: 10 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: `The circumference is ${circumferenceFromDiameter(10)} cm.`,
      visual: { kind: 'circle', d: 10, showCircumference: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: `Circumference ÷ diameter is always ${PI}.`,
      visual: { kind: 'circle', d: 10, showCircumference: true },
      action: 'watch',
    },
    {
      // Lingkaran yang BERBEDA, hasil bagi yang sama. Satu contoh tidak pernah
      // cukup untuk sebuah kata "selalu".
      stage: 'abstract',
      prompt: 'That answer is always pi.',
      visual: { kind: 'circle', d: 20, showCircumference: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Jawabannya SELALU 3.14, dan itu memang isi modulnya. Diameter berganti
      // tiap soal, kelilingnya ikut berganti, hasil baginya tidak — anak yang
      // benar-benar membagi akan melihat sendiri kenapa angka ini punya nama.
      type: 'keypad',
      skill: 'pi-meaning',
      params: { d: [2, 20] },
      answer: () => PI,
      text: (p) =>
        `C is ${circumferenceFromDiameter(p.d as number)} cm. d is ${p.d} cm. C ÷ d = ?`,
    },
    {
      // Arti π dibalik jadi alat: kalau C ÷ d selalu π, maka C = π × d.
      type: 'keypad',
      skill: 'circumference-from-diameter',
      params: { d: [2, 20] },
      answer: (p) => circumferenceFromDiameter(p.d as number),
      text: (p) => `Diameter ${p.d} cm. C = ${PI_SIGN} × d. Find C.`,
      visual: (p) => ({ kind: 'circle', d: p.d as number }),
    },
    {
      // Diameternya hanya ada di gambar. Pengecoh miskonsepsinya adalah
      // memasukkan JARI-JARI ke rumus yang minta diameter — kesalahan yang akan
      // dibawa anak sampai ke soal luas kalau tidak terlihat sekarang.
      type: 'choose-number',
      skill: 'circumference-from-diameter',
      params: { d: [2, 20] },
      answer: (p) => circumferenceFromDiameter(p.d as number),
      text: () => 'What is the circumference?',
      visual: (p) => ({ kind: 'circle', d: p.d as number }),
      distractors: 'near',
      misconception: (p) => circumferenceFromDiameter(radiusFromDiameter(p.d as number)),
    },
  ],
};
