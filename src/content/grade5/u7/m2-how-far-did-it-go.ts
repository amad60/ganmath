import type { ContentModule } from '../../types';

/** Kecepatan kelipatan 5 (10–90), sama seperti m1 — jaraknya yang jadi jawaban. */
const speedOf = (p: Record<string, number>) => (p.u as number) * 5;

/**
 * Arah kedua dari hubungan yang sama: kecepatan dan waktu diketahui, **jaraknya**
 * yang dicari.
 *
 * Kenapa ini modul tersendiri dan bukan latihan tambahan di m1: anak yang hanya
 * pernah membagi akan membagi lagi di sini. Hubungan jarak–kecepatan–waktu bukan
 * satu rumus melainkan tiga soal yang berbeda, dan yang menentukan bukan angkanya
 * melainkan angka mana yang HILANG. Karena itu m2 dan m3 sengaja dipisah: masing-masing
 * memberi anak satu bentuk yang harus dia kenali sendiri.
 *
 * `number-line-drop` dipakai di aturan ketiga karena di sinilah gambar benar-benar
 * berarti sesuatu: jarak adalah panjang, dan "3 jam × 20 km" adalah tiga lompatan
 * yang bisa dilihat sekaligus. Langkahnya ditulis eksplisit (`step: 10`) supaya
 * penanda bisa mendarat tepat di setiap jawaban yang mungkin — tanpa itu garis
 * 0–200 melompat 20 dan jawaban seperti 30 km mustahil disentuh.
 */
export const howFarDidItGo: ContentModule = {
  id: 'g5-u7-m2',
  unitId: 'g5-u7',
  grade: 5,
  title: 'How Far Did It Go?',
  icon: '🛣️',
  prereq: ['g5-u7-m1'],
  skills: ['find-distance'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'number-line-drop'],
  visuals: ['counter-objects', 'number-line'],
  vocab: ['speed', 'distance', 'car', 'hour', 'km', 'time', 'go'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap three cars.',
      visual: { kind: 'counter-objects', count: 6, icon: '🚗' },
      action: 'tap-count',
      target: 3,
      hint: 'One car for each hour we go.',
    },
    {
      stage: 'pictorial',
      prompt: 'Each hour the car goes 50 km.',
      visual: { kind: 'number-line', min: 0, max: 200, value: 50, step: 50 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'After 3 hours it is at 150 km.',
      visual: { kind: 'number-line', min: 0, max: 200, value: 150, step: 50 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '50 km each hour for 3 hours is 150 km.',
      visual: { kind: 'number-line', min: 0, max: 200, value: 150, step: 50 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Distance is speed times the time.',
      visual: { kind: 'number-line', min: 0, max: 200, value: 150, step: 50 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'keypad',
      skill: 'find-distance',
      params: { u: [2, 18], t: [2, 6] },
      answer: (p) => speedOf(p) * (p.t as number),
      text: (p) => `${speedOf(p)} km each hour. How far in ${p.t} hours?`,
    },
    {
      // Dijumlahkan, bukan dikalikan — kekeliruan operasi yang paling sering muncul
      // begitu soal berhenti menyebut kata "times". Hasil kalinya sengaja dibatasi
      // 24 supaya pengecoh itu tetap masuk akal dan tidak bisa dicoret sekilas.
      type: 'choose-number',
      skill: 'find-distance',
      params: { s: [2, 6], t: [2, 6] },
      answer: (p) => (p.s as number) * (p.t as number),
      text: (p) => `${p.s} m each second. How far in ${p.t} seconds?`,
      exclude: (p) => (p.s as number) * (p.t as number) > 24,
      distractors: 'near',
      misconception: (p) => (p.s as number) + (p.t as number),
    },
    {
      type: 'number-line-drop',
      skill: 'find-distance',
      params: { u: [1, 4], t: [2, 5] },
      answer: (p) => (p.u as number) * 10 * (p.t as number),
      text: (p) => `${(p.u as number) * 10} km each hour. Where after ${p.t} h?`,
      range: [0, 200],
      step: 10,
    },
  ],
};
