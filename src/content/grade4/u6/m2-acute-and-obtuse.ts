import { ANGLE_NAMES, angleKind } from '../../../components/manipulatives/Angle';
import type { ContentModule } from '../../types';

/**
 * Nama jenis sudut diambil dari komponen gambarnya, bukan ditulis ulang di sini.
 * Kalau keduanya ditulis terpisah, gambar bisa menulis "obtuse angle" sementara
 * jawaban benar di data berbunyi lain — dan tidak ada yang menyadarinya.
 */
const NAMES = [
  ANGLE_NAMES.acute,
  ANGLE_NAMES.right,
  ANGLE_NAMES.obtuse,
  ANGLE_NAMES.straight,
];

/** 8 sudut: tiga lancip, satu siku, tiga tumpul, satu lurus — porsinya seimbang. */
const DEGREES = [25, 45, 70, 90, 115, 140, 165, 180];
const TURNS = [0, 30, 110, 215];

const degOf = (p: Record<string, number>) => DEGREES[p.i as number] as number;
const turnOf = (p: Record<string, number>) => TURNS[p.r as number] as number;

/**
 * Nama jenis sudut. Sudut refleks sengaja TIDAK diajarkan: komponen bisa
 * menggambarnya, tapi anak Grade 4 belum punya alasan memakainya, dan setiap nama
 * tambahan menambah beban hafalan tanpa menambah kemampuan.
 */
export const acuteAndObtuse: ContentModule = {
  id: 'g4-u6-m2',
  unitId: 'g4-u6',
  grade: 4,
  title: 'Acute and Obtuse',
  icon: '🔺',
  prereq: ['g4-u6-m1'],
  skills: ['angle-kinds'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'compare-symbol'],
  visuals: ['angle-arc', 'counter-objects'],
  vocab: ['acute', 'obtuse', 'straight', 'flat'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three angles.',
      visual: { kind: 'counter-objects', count: 3, icon: '📐' },
      action: 'tap-count',
      target: 3,
      hint: 'Each corner has one angle.',
    },
    {
      stage: 'pictorial',
      prompt: 'An acute angle is less than 90.',
      visual: { kind: 'angle', degrees: 40, showName: true },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'An obtuse angle is more than 90.',
      visual: { kind: 'angle', degrees: 130, rotate: 25, showName: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'A straight angle is 180 degrees.',
      visual: { kind: 'angle', degrees: 180, showValue: true, showName: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'choose-text',
      skill: 'angle-kinds',
      params: { i: [0, 7], r: [0, 3] },
      answer: (p) => NAMES.indexOf(ANGLE_NAMES[angleKind(degOf(p))]),
      text: () => 'What kind of angle is this?',
      // showName mati: nama sudut justru yang ditanyakan.
      visual: (p) => ({ kind: 'angle', degrees: degOf(p), rotate: turnOf(p) }),
      options: () => NAMES,
    },
    {
      // Nama jenis sudut hanyalah nama untuk perbandingan ini. Menuliskannya sebagai
      // < = > memaksa anak memeriksa ulang bukaannya, bukan mengingat kata.
      type: 'compare-symbol',
      skill: 'angle-kinds',
      params: { i: [0, 7], r: [0, 3] },
      answer: (p) => Math.sign(degOf(p) - 90),
      text: () => 'This angle ? a right angle',
      visual: (p) => ({ kind: 'angle', degrees: degOf(p), rotate: turnOf(p) }),
    },
  ],
};
