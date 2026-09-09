import { angleKind } from '../../../components/manipulatives/Angle';
import type { ContentModule } from '../../types';

/**
 * Sudut contoh. Sengaja BERJARAK jauh dari 90° (tidak ada 85 atau 95): tanpa busur
 * derajat — yang baru datang di m3 — sudut 85° dan sudut siku tidak bisa dibedakan
 * mata, jadi menanyakannya di sini bukan menguji pengertian melainkan menebak.
 */
const DEGREES = [25, 45, 65, 90, 115, 135, 160];

/**
 * Seluruh gambar diputar. Anak yang hanya pernah melihat sudut siku dengan kaki
 * mendatar akan mengira sudut siku yang miring bukan sudut siku — memutar gambarnya
 * adalah cara termurah mencegah miskonsepsi itu terbentuk.
 */
const TURNS = [0, 30, 110, 215];

const degOf = (p: Record<string, number>) => DEGREES[p.i as number] as number;
const turnOf = (p: Record<string, number>) => TURNS[p.r as number] as number;

/**
 * Gerbang unit. Satu ide saja: sudut adalah BESAR BUKAAN antara dua sisi, bukan
 * panjang sisinya — dan sudut siku (90°) adalah tolok ukur yang dipakai untuk
 * menilai semua sudut lain.
 *
 * Nama "acute" dan "obtuse" belum dipakai di sini. Anak lebih dulu perlu satu
 * pembanding yang dia percaya; namanya menyusul di m2.
 */
export const meetAngles: ContentModule = {
  id: 'g4-u6-m1',
  unitId: 'g4-u6',
  grade: 4,
  title: 'Meet Angles',
  icon: '📐',
  prereq: ['g4-u5-m5'],
  skills: ['angle-basics'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'keypad'],
  visuals: ['angle-arc', 'counter-objects'],
  vocab: ['angle', 'angles', 'degree', 'degrees', 'square', 'opens', 'wide'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap the two sides.',
      visual: { kind: 'counter-objects', count: 2, icon: '📏' },
      action: 'tap-count',
      target: 2,
      hint: 'An angle has two sides.',
    },
    {
      stage: 'pictorial',
      prompt: 'An angle is a turn.',
      visual: { kind: 'angle', degrees: 45 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'A square corner is a right angle.',
      visual: { kind: 'angle', degrees: 90, showName: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A right angle is 90 degrees.',
      visual: { kind: 'angle', degrees: 90, rotate: 30, showValue: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Yang dilatih: memakai sudut siku sebagai pembanding, bukan menghafal angka.
      type: 'choose-text',
      skill: 'angle-basics',
      params: { i: [0, 6], r: [0, 3] },
      answer: (p) => {
        const kind = angleKind(degOf(p));
        return kind === 'right' ? 1 : kind === 'acute' ? 0 : 2;
      },
      // Teks tetap, tapi gambarnya berubah — kunci dedupe generator memuat gambar,
      // jadi 28 kombinasi ini tetap 28 soal berbeda.
      text: () => 'How big is this angle?',
      visual: (p) => ({ kind: 'angle', degrees: degOf(p), rotate: turnOf(p) }),
      options: () => [
        'smaller than a right angle',
        'a right angle',
        'bigger than a right angle',
      ],
    },
    {
      // Seperempat putaran, setengah, tiga perempat, penuh — patokan yang dipakai
      // sepanjang sisa unit (dan seluruh geometri sesudahnya).
      type: 'keypad',
      skill: 'angle-basics',
      params: { n: [1, 4] },
      answer: (p) => (p.n as number) * 90,
      text: (p) => `${p.n} right angle${(p.n as number) === 1 ? '' : 's'} = ? degrees`,
    },
  ],
};
