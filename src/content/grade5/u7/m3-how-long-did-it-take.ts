import type { ContentModule } from '../../types';

const speedOf = (p: Record<string, number>) => (p.u as number) * 5;
const distanceOf = (p: Record<string, number>) => speedOf(p) * (p.t as number);

/**
 * Arah ketiga: jarak dan kecepatan diketahui, **waktunya** yang dicari.
 *
 * Ini bentuk yang paling sering salah, dan alasannya bukan pembagiannya. Di m1
 * yang dibagi adalah jarak dengan WAKTU; di sini jarak dibagi dengan KECEPATAN.
 * Kedua soal terlihat sama persis — dua angka dan sebuah pembagian — sehingga anak
 * yang menghafal "bagi saja" akan membagi dengan angka yang salah dan tetap
 * mendapat bilangan bulat yang kelihatan wajar. Karena itu satuannya selalu
 * ditulis di kedua angka soal (`160 km at 20 km each hour`): satuanlah satu-satunya
 * petunjuk yang membedakan keduanya, dan membacanya adalah keterampilan yang
 * dilatih di sini.
 *
 * Aturan ketiga menuliskan hal yang sama sebagai perkalian yang bolong
 * (`20 × ? = 160`). Bukan variasi tampilan: itu yang menunjukkan bahwa mencari
 * waktu adalah kebalikan m2, bukan aturan keempat yang harus dihafal terpisah.
 */
export const howLongDidItTake: ContentModule = {
  id: 'g5-u7-m3',
  unitId: 'g5-u7',
  grade: 5,
  title: 'How Long Did It Take?',
  icon: '⏱️',
  prereq: ['g5-u7-m2'],
  skills: ['find-time'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'missing-number'],
  visuals: ['counter-objects', 'number-line'],
  vocab: ['speed', 'distance', 'car', 'hour', 'km', 'time', 'went', 'trip'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap four blocks.',
      visual: { kind: 'counter-objects', count: 7, icon: '🟦' },
      action: 'tap-count',
      target: 4,
      hint: 'One block for each hour of the trip.',
    },
    {
      stage: 'pictorial',
      prompt: 'The car went 150 km in all.',
      visual: { kind: 'number-line', min: 0, max: 200, value: 150, step: 50 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'Each hour it goes 50 km.',
      visual: { kind: 'number-line', min: 0, max: 200, value: 50, step: 50 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '150 km shared by 50 km is 3 hours.',
      visual: { kind: 'number-line', min: 0, max: 200, value: 150, step: 50 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Time is distance shared by the speed.',
      visual: { kind: 'number-line', min: 0, max: 200, value: 150, step: 50 },
      action: 'watch',
    },
  ],

  rules: [
    {
      type: 'keypad',
      skill: 'find-time',
      params: { u: [2, 18], t: [2, 8] },
      answer: (p) => p.t as number,
      text: (p) => `${distanceOf(p)} km at ${speedOf(p)} km each hour. Hours?`,
    },
    {
      // Pengecohnya adalah kecepatannya sendiri. Anak yang membaca soal ini sebagai
      // "ambil angka yang kecil" akan menyebutnya, dan pilihan itu selalu masuk akal
      // besarnya — tidak bisa dicoret tanpa benar-benar membagi.
      type: 'choose-number',
      skill: 'find-time',
      params: { s: [2, 9], t: [2, 9] },
      answer: (p) => p.t as number,
      text: (p) => `${(p.s as number) * (p.t as number)} m at ${p.s} m each second. Seconds?`,
      exclude: (p) => (p.s as number) * (p.t as number) > 36,
      distractors: 'near',
      misconception: (p) => p.s as number,
    },
    {
      // Bentuk perkalian yang bolong: mencari waktu = membalik m2, bukan aturan baru.
      type: 'missing-number',
      skill: 'find-time',
      params: { u: [2, 12], t: [2, 8] },
      answer: (p) => p.t as number,
      text: (p) => `${speedOf(p)} km each hour × ? = ${distanceOf(p)} km`,
    },
    {
      type: 'keypad',
      skill: 'find-time',
      story: true,
      params: { u: [2, 18], t: [2, 8] },
      answer: (p) => p.t as number,
      text: (p) => `A car goes ${speedOf(p)} km each hour. How many hours for ${distanceOf(p)} km?`,
    },
    {
      type: 'keypad',
      skill: 'find-time',
      story: true,
      params: { u: [2, 18], t: [2, 8] },
      answer: (p) => p.t as number,
      text: (p) => `Ana walks ${speedOf(p)} km each hour. How many hours for ${distanceOf(p)} km?`,
    },
  ],
};
