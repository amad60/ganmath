import { quadrantOf, type Coord } from '../../../components/manipulatives/coordinates';
import type { ContentModule } from '../../types';

/** Pilihan pada aturan `where-is-the-point`. Indeksnya = jawaban benar. */
const ON_X = 0;
const ON_Y = 1;
const AT_ORIGIN = 2;
const OFF_AXIS = 3;

/**
 * Titik yang dipasang aturan `where-is-the-point`, dibangun dari `side` supaya
 * keempat jawabannya muncul sama sering. Kalau titiknya diacak bebas dari dua
 * rentang, 63 dari 64 kombinasi jatuh di luar sumbu dan jebakan sumbunya —
 * justru yang ingin diajarkan — nyaris tidak pernah keluar.
 */
function sitePoint(p: Record<string, number>): Coord {
  const a = p.a as number;
  const b = p.b as number;
  switch (p.side as number) {
    case ON_X:
      return { x: a, y: 0 };
    case ON_Y:
      return { x: 0, y: b };
    case AT_ORIGIN:
      return { x: 0, y: 0 };
    default:
      return { x: a, y: b };
  }
}

/**
 * Gerbang unit koordinat. Yang dipasang di sini hanya BIDANGNYA, belum cara
 * menuliskan titiknya: dua sumbu, titik asal tempat keduanya bertemu, dan gerakan
 * membaca sebuah titik — berapa langkah ke kanan, lalu berapa langkah ke atas.
 *
 * Pasangan koordinat `(x, y)` sengaja belum muncul sama sekali di modul ini, baik
 * di layar Learn maupun di teks soal. Anak yang diberi notasinya di layar yang sama
 * dengan gridnya akan menghafal bentuk tulisannya dan berhenti melihat gambarnya;
 * m2 baru memperkenalkan notasi itu, setelah gerakannya sendiri sudah terpasang.
 * Karena itu semua gambar di sini memakai `showCoords: false` dan `guides: true` —
 * garis bantu putus-putus itulah yang menjawab soalnya, bukan label.
 *
 * Hanya kuadran I yang ditampilkan (`quadrants: 1`). Bilangan negatif sudah
 * dikuasai di `g6-u1`, tapi memasukkannya sekarang berarti mengajarkan dua hal
 * sekaligus; kuadran II–IV dibuka di m3.
 *
 * **Batas yang disadari:** `CoordinatePlane` read-only, jadi anak tidak pernah
 * menekan grid untuk menaruh titiknya sendiri. Yang bisa ditanyakan adalah nilai
 * satu sumbu (diketik) dan letak titik terhadap sumbu (pilihan).
 */
export const rightThenUp: ContentModule = {
  id: 'g6-u6-m1',
  unitId: 'g6-u6',
  grade: 6,
  title: 'Right Then Up',
  icon: '📐',
  prereq: ['g6-u5-m5'],
  skills: ['steps-right', 'steps-up', 'where-is-the-point'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-text'],
  visuals: ['coordinate-grid', 'counter-objects'],
  vocab: ['grid', 'axis', 'axes', 'origin', 'far', 'x', 'y'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four red dots.',
      visual: { kind: 'counter-objects', count: 9, icon: '🔴' },
      action: 'tap-count',
      target: 4,
      hint: 'Four steps to the right.',
    },
    {
      stage: 'pictorial',
      prompt: 'Two axes start at the origin.',
      visual: { kind: 'coordinate-grid', quadrants: 1, range: 6, showOrigin: true },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Go right, then go up.',
      visual: {
        kind: 'coordinate-grid',
        quadrants: 1,
        range: 6,
        points: [{ x: 4, y: 3, label: 'A' }],
        guides: true,
      },
      action: 'watch',
      hint: 'Count right first on the grid.',
    },
    {
      stage: 'abstract',
      prompt: 'x tells how far right.',
      visual: {
        kind: 'coordinate-grid',
        quadrants: 1,
        range: 6,
        points: [{ x: 4, y: 3, label: 'A' }],
        guides: true,
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'y tells how far up.',
      visual: {
        kind: 'coordinate-grid',
        quadrants: 1,
        range: 6,
        points: [{ x: 2, y: 5, label: 'A' }],
        guides: true,
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Teksnya tetap; yang berbeda GAMBARNYA. Itu sah karena kunci dedupe
      // generator memuat visual — dan memang di sinilah soalnya berada: satu-satunya
      // sumber jawabannya adalah titik di grid, bukan angka di kalimat.
      type: 'keypad',
      skill: 'steps-right',
      params: { px: [1, 8], py: [1, 8] },
      answer: (p) => p.px as number,
      text: () => 'How many steps right is point A?',
      visual: (p) => ({
        kind: 'coordinate-grid',
        quadrants: 1,
        range: 8,
        points: [{ x: p.px as number, y: p.py as number, label: 'A' }],
        guides: true,
      }),
    },
    {
      type: 'keypad',
      skill: 'steps-up',
      params: { px: [1, 8], py: [1, 8] },
      answer: (p) => p.py as number,
      text: () => 'How many steps up is point A?',
      visual: (p) => ({
        kind: 'coordinate-grid',
        quadrants: 1,
        range: 8,
        points: [{ x: p.px as number, y: p.py as number, label: 'A' }],
        guides: true,
      }),
    },
    {
      // Titik DI sumbu adalah jebakan yang harus diajarkan, bukan kasus tepi yang
      // dihindari: `quadrantOf` sengaja mengembalikan 0 untuknya (lihat
      // coordinates.ts). Di sini aturan yang sama dipakai untuk memilih jawabannya,
      // jadi soal dan gambar tidak bisa berbeda pendapat soal titik (0, 0).
      type: 'choose-text',
      skill: 'where-is-the-point',
      params: { a: [1, 8], b: [1, 8], side: [0, 3] },
      exclude: (p) => (p.side as number) === AT_ORIGIN && (p.a !== 1 || p.b !== 1),
      answer: (p) => {
        const { x, y } = sitePoint(p);
        if (quadrantOf(x, y) !== 0) return OFF_AXIS;
        if (x === 0 && y === 0) return AT_ORIGIN;
        return y === 0 ? ON_X : ON_Y;
      },
      text: () => 'Where is point A?',
      visual: (p) => {
        const { x, y } = sitePoint(p);
        return { kind: 'coordinate-grid', quadrants: 1, range: 8, points: [{ x, y, label: 'A' }] };
      },
      options: () => ['on the x-axis', 'on the y-axis', 'at the origin', 'not on an axis'],
    },
  ],
};
