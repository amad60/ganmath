import {
  diameterFromRadius,
  radiusFromDiameter,
} from '../../../components/manipulatives/circles';
import type { ContentModule } from '../../types';

/**
 * Gerbang unit lingkaran, dan sengaja belum menyentuh π sama sekali.
 *
 * Yang diajarkan cuma satu: **lingkaran punya satu panjang, dan panjang itu bisa
 * disebut dengan dua nama.** Jari-jari dari pusat ke tepi, diameter menembus pusat
 * dari tepi ke tepi, dan diameter selalu dua kali jari-jari. Anak yang tidak
 * memegang hubungan itu akan tersandung di tiap modul berikutnya — bukan karena
 * rumusnya sulit, tapi karena dia memasukkan diameter ke tempat jari-jari. Itu
 * kesalahan nomor satu di seluruh materi lingkaran, dan modul inilah pagarnya.
 *
 * Gambarnya **dinormalisasi**: lingkaran r=1 dan r=12 tampil sama besar, yang
 * berubah hanya angka di labelnya. Itu bukan kekurangan — kalau besar gambar ikut
 * berubah, anak bisa menjawab "yang mana lebih panjang" dengan mata dan tidak
 * pernah membaca angkanya. Di sini ukuran gambar memang tidak membawa informasi.
 *
 * Semua angka datang dari `circles.ts` (`radiusFromDiameter` / `diameterFromRadius`),
 * fungsi yang sama yang dipakai `Circle` menuliskan labelnya. Soal dan gambar
 * mustahil berbeda.
 *
 * Diameter di sini selalu genap, jadi jari-jarinya bilangan bulat. Setengah dari
 * bilangan ganjil (4.5) memang sah dan bisa diketik, tapi itu materi pecahan yang
 * menumpang di modul yang sedang mengajarkan hal lain.
 */
export const radiusAndDiameter: ContentModule = {
  id: 'g6-u4-m1',
  unitId: 'g6-u4',
  grade: 6,
  title: 'Radius and Diameter',
  icon: '⭕',
  prereq: ['g6-u3-m6'],
  skills: ['radius-diameter'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'missing-number', 'choose-number', 'compare-symbol'],
  visuals: ['circle', 'counter-objects'],
  vocab: ['circle', 'centre', 'radius', 'diameter'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five circles.',
      visual: { kind: 'counter-objects', count: 8, icon: '⭕' },
      action: 'tap-count',
      target: 5,
      hint: 'Each circle has a centre.',
    },
    {
      // Ruas jari-jari MENYAPU satu putaran penuh sebelum berhenti. Gerakan itu
      // sendiri yang mengajarkan definisinya: setiap titik di tepi berjarak sama.
      stage: 'pictorial',
      prompt: 'The radius goes centre to edge.',
      visual: { kind: 'circle', r: 5, mark: 'radius' },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'The diameter goes all the way across.',
      visual: { kind: 'circle', d: 10 },
      action: 'watch',
    },
    {
      // Dua ruas dalam SATU gambar. Perbandingan r : d = 1 : 2 adalah satu-satunya
      // perbandingan yang harus jujur di gambar lingkaran, dan di sini ia jujur:
      // keduanya digambar dari jari-jari layar yang sama.
      stage: 'abstract',
      prompt: 'Diameter is twice the radius.',
      visual: { kind: 'circle', r: 5, mark: 'both' },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: `Half of 10 cm is ${radiusFromDiameter(10)} cm.`,
      visual: { kind: 'circle', d: 10, mark: 'both' },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Arah maju: jari-jari diketahui, diameter dicari.
      type: 'keypad',
      skill: 'radius-diameter',
      params: { r: [1, 12] },
      answer: (p) => diameterFromRadius(p.r as number),
      text: (p) => `The radius is ${p.r} cm. Find the diameter.`,
      visual: (p) => ({ kind: 'circle', r: p.r as number, mark: 'radius' }),
    },
    {
      // Arah balik. Anak yang menghafal "kali dua" tanpa memahami arahnya akan
      // menjawab 2d di sini, dan itu memang yang ingin terlihat.
      type: 'missing-number',
      skill: 'radius-diameter',
      params: { d: [2, 24] },
      answer: (p) => radiusFromDiameter(p.d as number),
      text: (p) => `The diameter is ${p.d} cm. Find the radius.`,
      visual: (p) => ({ kind: 'circle', d: p.d as number }),
      exclude: (p) => (p.d as number) % 2 !== 0,
      distractors: 'near',
    },
    {
      // Angkanya HANYA ada di gambar — tidak diulang di teks soal. Ini satu-satunya
      // aturan yang menguji apakah anak bisa membaca ruas bertanda pada lingkaran,
      // bukan sekadar mengolah dua angka di dalam kalimat.
      type: 'choose-number',
      skill: 'radius-diameter',
      params: { d: [4, 24] },
      answer: (p) => radiusFromDiameter(p.d as number),
      text: () => 'What is the radius?',
      visual: (p) => ({ kind: 'circle', d: p.d as number }),
      exclude: (p) => (p.d as number) % 2 !== 0,
      distractors: 'near',
      // Miskonsepsi khas: membaca seluruh ruas yang tergambar sebagai jari-jari.
      misconception: (p) => p.d as number,
    },
    {
      // Diameter diperlakukan sebagai BILANGAN yang bisa dibandingkan, bukan
      // sebagai nama sebuah garis. Tidak ada jalan pintas: nilainya harus dicari
      // dulu sebelum tandanya bisa dipilih.
      type: 'compare-symbol',
      skill: 'radius-diameter',
      params: { r: [1, 12], x: [1, 24] },
      answer: (p) => Math.sign(diameterFromRadius(p.r as number) - (p.x as number)),
      text: (p) => `Radius ${p.r} cm. The diameter ? ${p.x} cm`,
      visual: (p) => ({ kind: 'circle', r: p.r as number, mark: 'radius' }),
    },
  ],
};
