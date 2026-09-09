import {
  PI,
  areaOf,
  circumferenceOf,
  diameterFromRadius,
  radiusFromDiameter,
} from '../../../components/manipulatives/circles';
import type { ContentModule } from '../../types';

/** Simbol yang DILIHAT anak. Nilainya diambil dari `PI`, tidak pernah ditulis lepas. */
const PI_SIGN = 'π';

/**
 * Luas lingkaran: A = π × r × r.
 *
 * Rumusnya sengaja ditulis **π × r × r**, bukan π r², di sepanjang modul ini.
 * Bukan karena pangkat dua belum dikenal — `g5-u4` sudah mengajarkannya — tapi
 * karena bentuk berpangkat itu justru yang membuat anak mengalikan jari-jari
 * dengan 2. Ditulis panjang, urutan kerjanya terbaca apa adanya: kalikan
 * jari-jari dengan dirinya sendiri, baru kalikan π.
 *
 * Miskonsepsi besar unit ini bukan salah hitung, melainkan **salah rumus**:
 * menjawab keliling saat yang diminta luas. Karena itu pengecoh di sini adalah
 * `circumferenceOf(r)` — persis pola yang dipakai `g4-u6-m5` (keliling persegi
 * panjang sebagai pengecoh luasnya). Modul penutup unit (`m5`) melanjutkannya
 * jadi pilihan rumus yang eksplisit.
 *
 * Jari-jari dibatasi 1–10 supaya luas terbesarnya 314 — tiga digit, masih wajar
 * diketik anak, dan jauh di bawah pagar enam digit keypad.
 *
 * Semua angka datang dari `circles.ts`: `areaOf`, `circumferenceOf`,
 * `radiusFromDiameter`, `diameterFromRadius`. Gambar dan soal memakai fungsi yang
 * sama, jadi label "A = 78.5 cm²" tidak mungkin berbeda dari kunci jawabannya.
 */
export const insideACircle: ContentModule = {
  id: 'g6-u4-m4',
  unitId: 'g6-u4',
  grade: 6,
  title: 'Inside a Circle',
  icon: '🟠',
  prereq: ['g6-u4-m3'],
  skills: ['area-of-circle', 'area-from-diameter'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'compare-symbol'],
  visuals: ['circle', 'counter-objects'],
  vocab: [],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap twelve small squares.',
      visual: { kind: 'counter-objects', count: 12, icon: '🟦' },
      action: 'tap-count',
      target: 12,
      hint: 'They cover the circle inside.',
    },
    {
      stage: 'pictorial',
      prompt: 'This radius is 5 cm.',
      visual: { kind: 'circle', r: 5 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: `The area is ${areaOf(5)} square cm.`,
      visual: { kind: 'circle', r: 5, showArea: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Area is pi times r times r.',
      visual: { kind: 'circle', r: 5, showArea: true },
      action: 'watch',
    },
    {
      // Jari-jari dua kali lipat, luasnya EMPAT kali — sesuatu yang hanya
      // terlihat kalau dua contohnya berdampingan. Keliling tidak begitu, dan
      // di situlah kedua rumus mulai terasa berbeda, bukan sekadar terlihat beda.
      stage: 'abstract',
      prompt: `${PI} times 10 times 10 is ${areaOf(10)}.`,
      visual: { kind: 'circle', r: 10, showArea: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Bentuk pokok. Luasnya tidak ditulis di gambar — itu jawabannya.
      type: 'keypad',
      skill: 'area-of-circle',
      params: { r: [1, 10] },
      answer: (p) => areaOf(p.r as number),
      text: (p) => `Radius ${p.r} cm. A = ${PI_SIGN} r r. Find the area.`,
      visual: (p) => ({ kind: 'circle', r: p.r as number }),
    },
    {
      // Diameter dulu, jari-jari belakangan. Satu langkah tambahan yang menjadi
      // sumber hampir semua jawaban salah di soal luas: memasukkan diameter ke
      // tempat jari-jari dan mendapat luas empat kali lipat.
      type: 'keypad',
      skill: 'area-from-diameter',
      params: { d: [2, 20] },
      answer: (p) => areaOf(radiusFromDiameter(p.d as number)),
      text: (p) => `Diameter ${p.d} cm. Find the area.`,
      visual: (p) => ({ kind: 'circle', d: p.d as number }),
      exclude: (p) => (p.d as number) % 2 !== 0,
    },
    {
      // Angka hanya di gambar. Pengecohnya keliling lingkaran yang sama —
      // jawaban salah di sini terbaca sebagai diagnosis "salah rumus",
      // bukan "salah hitung".
      type: 'choose-number',
      skill: 'area-of-circle',
      params: { r: [1, 10] },
      answer: (p) => areaOf(p.r as number),
      text: () => 'What is the area?',
      visual: (p) => ({ kind: 'circle', r: p.r as number }),
      distractors: 'near',
      misconception: (p) => circumferenceOf(p.r as number),
    },
    {
      // Menaksir luas. Rentangnya dipilih supaya SETIAP jari-jari di sini punya
      // pembanding yang lebih kecil maupun lebih besar — kalau tidak, r terbesar
      // selalu berjawaban ">" dan tandanya bisa dipilih dari besar jari-jarinya
      // saja, tanpa pernah menghitung luas. Luas r = 10 tepat 314, jadi tanda "="
      // pun benar-benar bisa jadi jawaban yang benar.
      type: 'compare-symbol',
      skill: 'area-of-circle',
      params: { r: [4, 10], x: [40, 330] },
      answer: (p) => Math.sign(areaOf(p.r as number) - (p.x as number)),
      text: (p) =>
        `Radius ${p.r} cm, diameter ${diameterFromRadius(p.r as number)} cm. Area ? ${p.x} square cm`,
      visual: (p) => ({ kind: 'circle', r: p.r as number }),
    },
  ],
};
