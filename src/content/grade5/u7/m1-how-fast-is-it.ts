import type { ContentModule } from '../../types';

/**
 * Kecepatan selalu dibangun DARI hasil kalinya, bukan sebaliknya.
 *
 * Kalau jarak dan waktu diacak lepas, hampir semua soal berjawaban desimal panjang
 * (47 km dalam 3 jam = 15,666…). Keypad memang sudah punya titik desimal sejak
 * `fix-keypad-input`, tapi angka seperti itu tidak mengajarkan apa pun tentang
 * kecepatan — anak sibuk membagi bersusun. Jadi kecepatannya yang dipilih dulu
 * (kelipatan 5, 10–90 km/jam), lalu jaraknya dihitung: kecepatan × waktu.
 *
 * Kelipatan 5 dan bukan kelipatan 10 supaya jawabannya tidak selalu berakhiran nol —
 * kalau selalu, anak bisa menebak digit terakhirnya tanpa membagi apa pun.
 */
const speedOf = (p: Record<string, number>) => (p.u as number) * 5;
const distanceOf = (p: Record<string, number>) => speedOf(p) * (p.t as number);

/**
 * Gerbang unit terakhir Grade 5. Satu gagasan saja: **kecepatan adalah jarak
 * untuk SATU satuan waktu.**
 *
 * Anak sudah bisa membagi (g5-u4) dan sudah tahu satuan panjang mana yang dipakai
 * untuk apa (g5-u5). Yang baru di sini hanya bahwa hasil baginya punya nama dan
 * dua satuan sekaligus: km per jam. Karena itu setiap soal memakai SATU satuan
 * waktu saja dari awal sampai akhir — km/jam tidak pernah dicampur dengan menit
 * dalam soal yang sama. Konversi menit↔jam adalah materi tersendiri yang tidak
 * ada di unit ini, dan mencampurnya berarti menguji dua hal sambil mengajarkan satu.
 *
 * Aturan ketiga (`compare-symbol`) yang membawa inti materinya: jarak yang lebih
 * besar TIDAK berarti lebih cepat. "120 km dalam 2 jam" mengalahkan "150 km dalam
 * 3 jam" walaupun angka pertamanya lebih kecil — dan anak yang hanya melihat jarak
 * akan salah di situ. Soal berjawaban "=" sengaja ikut dimunculkan: dua perjalanan
 * yang angkanya sama sekali berbeda bisa punya kecepatan yang sama persis, dan itu
 * satu-satunya bukti bahwa yang dibandingkan memang lajunya, bukan angkanya.
 */
export const howFastIsIt: ContentModule = {
  id: 'g5-u7-m1',
  unitId: 'g5-u7',
  grade: 5,
  title: 'How Fast Is It?',
  icon: '🚗',
  prereq: ['g5-u6-m5'],
  skills: ['find-speed', 'compare-speed'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-number', 'compare-symbol'],
  visuals: ['counter-objects', 'number-line'],
  vocab: ['speed', 'distance', 'car', 'hour', 'km', 'time', 'share', 'shared'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap two cars.',
      visual: { kind: 'counter-objects', count: 5, icon: '🚗' },
      action: 'tap-count',
      target: 2,
      hint: 'Speed tells us how fast it goes.',
    },
    {
      stage: 'pictorial',
      prompt: 'In 1 hour the car goes 40 km.',
      visual: { kind: 'number-line', min: 0, max: 200, value: 40 },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'In 2 hours it goes 80 km.',
      visual: { kind: 'number-line', min: 0, max: 200, value: 80 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: '80 km in 2 hours is 40 each hour.',
      visual: { kind: 'number-line', min: 0, max: 200, value: 80 },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Speed is distance shared by the time.',
      visual: { kind: 'number-line', min: 0, max: 200, value: 80 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Jaraknya besar (sampai 720 km) tapi jawabannya dua digit: yang dilatih
      // adalah membagi jarak menjadi jam, bukan mengetik angka panjang.
      type: 'keypad',
      skill: 'find-speed',
      params: { u: [2, 18], t: [2, 6] },
      answer: (p) => speedOf(p),
      text: (p) => `${distanceOf(p)} km in ${p.t} hours. How far in 1 hour?`,
    },
    {
      // Meter per detik, bukan km per jam: satuan boleh berganti antar soal, yang
      // tidak boleh adalah berganti DI DALAM satu soal.
      //
      // Pengecoh miskonsepsinya adalah waktunya sendiri. Anak yang belum memisahkan
      // "berapa lama" dari "seberapa cepat" akan menyebut angka detiknya — dan itu
      // kekeliruan yang terbaca sebagai diagnosis, bukan sekadar salah hitung.
      type: 'choose-number',
      skill: 'find-speed',
      params: { s: [2, 6], t: [2, 5] },
      answer: (p) => p.s as number,
      text: (p) => `${(p.s as number) * (p.t as number)} m in ${p.t} seconds. How far in 1 second?`,
      exclude: (p) => (p.s as number) * (p.t as number) > 24,
      distractors: 'near',
      misconception: (p) => p.t as number,
    },
    {
      // Inti modul. Jarak yang lebih besar bukan berarti lebih cepat, dan angka yang
      // berbeda bisa berarti kecepatan yang sama.
      type: 'compare-symbol',
      skill: 'compare-speed',
      params: { a: [1, 9], b: [1, 9], t1: [2, 4], t2: [2, 4] },
      answer: (p) => Math.sign((p.a as number) - (p.b as number)),
      text: (p) =>
        `${(p.a as number) * 10 * (p.t1 as number)} km in ${p.t1} h ? ` +
        `${(p.b as number) * 10 * (p.t2 as number)} km in ${p.t2} h`,
      // Dua sisi yang identik tidak menguji apa pun — jawabannya terbaca dari
      // bentuknya, bukan dari kecepatannya.
      exclude: (p) => (p.a as number) === (p.b as number) && (p.t1 as number) === (p.t2 as number),
    },
    {
      type: 'keypad',
      skill: 'find-speed',
      story: true,
      params: { u: [2, 18], t: [2, 6] },
      answer: (p) => speedOf(p),
      text: (p) => `A car goes ${distanceOf(p)} km in ${p.t} hours. How many km each hour?`,
    },
    {
      type: 'keypad',
      skill: 'find-speed',
      story: true,
      params: { u: [2, 18], t: [2, 6] },
      answer: (p) => speedOf(p),
      text: (p) => `Ana walks ${distanceOf(p)} km in ${p.t} hours. How many km each hour?`,
    },
  ],
};
