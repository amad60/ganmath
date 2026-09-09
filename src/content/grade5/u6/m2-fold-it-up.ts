import {
  NET_SOLIDS,
  SOLID_FACES,
  SOLID_NAMES,
  solidFromDims,
  type SolidName,
} from '../../../components/manipulatives/solids';
import type { ContentModule } from '../../types';

const solidAt = (i: number): SolidName => NET_SOLIDS[i] as SolidName;

/**
 * Empat nama: yang benar lebih dulu, tiga lain diputar supaya pengecohnya tidak
 * selalu tetangga yang sama. Urutan tombolnya sendiri diacak generator.
 */
function nameChoices(correct: SolidName, offset: number): string[] {
  const others = NET_SOLIDS.filter((s) => s !== correct);
  const picked: string[] = [];
  for (let k = 0; k < 3; k++) {
    picked.push(SOLID_NAMES[others[(offset + k) % others.length] as SolidName]);
  }
  return [SOLID_NAMES[correct], ...picked];
}

/**
 * Ukuran balok yang jaringnya benar-benar terlihat berbeda satu sama lain.
 *
 * Satu di antaranya bersisi sama — dan itulah soalnya: jaring dari `2 × 2 × 2`
 * melipat jadi KUBUS, bukan balok. Namanya diambil `solidFromDims`, bukan ditebak
 * penulis konten, karena kekeliruan itu (menyebut apa pun yang berbentuk kotak
 * sebagai "kubus") persis yang harus diperbaiki modul ini.
 */
const BOXES: [number, number, number][] = [
  [2, 2, 2],
  [3, 2, 1],
  [1, 2, 3],
  [3, 3, 1],
  [1, 3, 2],
];

/**
 * Arah utama unit ini: **jaring di depanmu melipat jadi bangun yang mana?**
 *
 * m1 sudah memastikan anak bisa membaca satu jaring sebagai satu lembar. Di sini
 * lembar itu dilipat kembali di kepala — dan itu keterampilan yang berbeda:
 * menghitung enam kotak tidak sama dengan melihat bahwa keenamnya akan bertemu
 * jadi kubus.
 *
 * Dua jebakan yang sengaja dipasang:
 * 1. **Kubus lawan balok.** Keduanya berjaring enam persegi panjang; yang
 *    membedakan hanya apakah ketiga rusuknya sama. `solidFromDims` yang memutuskan.
 * 2. **Jumlah sisi bukan nama.** Limas dan prisma segitiga sama-sama bersisi lima,
 *    jadi menghafal "lima sisi = limas" akan gagal separuh waktu. Aturan
 *    `compare-symbol` memakai itu: dua bangun berbeda bisa berujung sama besar.
 */
export const foldItUp: ContentModule = {
  id: 'g5-u6-m2',
  unitId: 'g5-u6',
  grade: 5,
  title: 'Fold It Up',
  icon: '🎁',
  prereq: ['g5-u6-m1'],
  skills: ['net-to-solid', 'cube-or-box', 'compare-faces'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['choose-text', 'compare-symbol'],
  visuals: ['shape-net', 'counter-objects'],
  vocab: ['net', 'nets', 'fold', 'folds', 'pyramid', 'prism', 'triangular', 'cylinder', 'solid', 'name'],

  learn: [
    {
      stage: 'concrete',
      prompt: `Tap the ${SOLID_FACES['square-pyramid']} faces of a pyramid.`,
      visual: { kind: 'counter-objects', count: SOLID_FACES['square-pyramid'], icon: '🔺' },
      action: 'tap-count',
      target: SOLID_FACES['square-pyramid'],
      hint: 'A pyramid net has five faces.',
    },
    {
      stage: 'pictorial',
      prompt: `This net folds into a ${SOLID_NAMES['triangular-prism']}.`,
      visual: { kind: 'net', solid: 'triangular-prism', showName: true },
      action: 'watch',
    },
    {
      // Tabung dimasukkan lebih awal justru karena jaringnya paling tidak terduga:
      // selimutnya persegi panjang selebar keliling alas, bukan lengkung.
      stage: 'pictorial',
      prompt: `A ${SOLID_NAMES.cylinder} net has ${SOLID_FACES.cylinder} faces.`,
      visual: { kind: 'net', solid: 'cylinder', showName: true },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Count the faces. Then name the solid.',
      visual: { kind: 'net', solid: 'square-pyramid', showName: true },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Susunan dasar tiap bangun. Bentangan yang lain sengaja disimpan untuk m3,
      // supaya "jaring yang sama boleh terlihat lain" jadi pelajaran tersendiri.
      type: 'choose-text',
      skill: 'net-to-solid',
      params: { s: [0, 4] },
      answer: () => 0,
      text: () => 'Which solid does this net make?',
      visual: (p) => ({ kind: 'net', solid: solidAt(p.s as number) }),
      options: (p) => nameChoices(solidAt(p.s as number), p.s as number),
    },
    {
      // Kubus atau balok — dua bangun yang jaringnya paling mudah tertukar.
      type: 'choose-text',
      skill: 'cube-or-box',
      params: { b: [0, 4] },
      answer: () => 0,
      text: () => 'Look at the sides. Which solid is it?',
      visual: (p) => {
        const [l, w, h] = BOXES[p.b as number] as [number, number, number];
        return { kind: 'net', solid: 'rectangular-prism', l, w, h };
      },
      options: (p) => {
        const [l, w, h] = BOXES[p.b as number] as [number, number, number];
        return nameChoices(solidFromDims(l, w, h), p.b as number);
      },
    },
    {
      // Lima sisi bisa berarti limas ATAU prisma segitiga; enam sisi bisa berarti
      // kubus ATAU balok. Membandingkan dua bangun memaksa itu terlihat.
      type: 'compare-symbol',
      skill: 'compare-faces',
      params: { a: [0, 4], b: [0, 4] },
      answer: (p) =>
        Math.sign(SOLID_FACES[solidAt(p.a as number)] - SOLID_FACES[solidAt(p.b as number)]),
      text: (p) =>
        `${SOLID_NAMES[solidAt(p.a as number)]} faces ? ${SOLID_NAMES[solidAt(p.b as number)]} faces`,
      exclude: (p) => (p.a as number) === (p.b as number),
    },
  ],
};
