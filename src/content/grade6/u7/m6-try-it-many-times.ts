import type { ContentModule } from '../../types';

/** Banyak putaran = banyak bagian × pengali, jadi hasil harapannya selalu bulat. */
const spinsOf = (p: Record<string, number>) => (p.parts as number) * (p.mult as number);

/** 20 atau 50 percobaan — dua-duanya membuat peluang hasilnya berujung dua desimal. */
const triesOf = (p: Record<string, number>) => ((p.tt as number) === 0 ? 20 : 50);

const BAGS = ['Bag A', 'Bag B', 'Same chance'] as const;

/**
 * Modul penutup unit, penutup Grade 6, dan penutup seluruh kurikulum.
 *
 * Peluang di `m5` masih berupa angka yang dihitung dari isi kantong. Di sini angka
 * itu bertemu kenyataan: apa yang sebenarnya terjadi kalau percobaannya dilakukan
 * berkali-kali. Tiga arah, dan ketiganya arah yang berbeda:
 *
 * 1. **Peluang → berapa kali.** Peluang 1 dari 4 pada 20 putaran berarti sekitar 5
 *    merah. Kata "about" ada di teks soalnya dengan sengaja: hasil sebenarnya boleh
 *    meleset, dan yang diminta adalah perkiraan, bukan ramalan.
 * 2. **Berapa kali → peluang.** Arah baliknya, dan inilah peluang EMPIRIS: 7 merah
 *    dari 20 putaran adalah 0,35. Percobaannya dipatok 20 atau 50 supaya desimalnya
 *    selalu berujung dan bisa benar-benar diketik anak.
 * 3. **Membandingkan dua peluang.** 4 dari 10 lawan 9 dari 20 tidak bisa dibandingkan
 *    dengan melihat pembilangnya saja — dan pilihan "Same chance" ikut disediakan
 *    supaya 5 dari 10 dan 10 dari 20 punya tempat untuk dijawab benar.
 *
 * `kind: 'application'`: seluruh gagasannya sudah dipasang di `m5`, yang dilatih di
 * sini adalah memakainya. Datanya tetap berupa angka di dalam teks dan blok
 * piktogram yang bisa dihitung — tidak ada satu pun nilai yang harus dibaca dari
 * tinggi batang, karena `Bars` tidak punya sumbu berangka untuk membacanya.
 */
export const tryItManyTimes: ContentModule = {
  id: 'g6-u7-m6',
  unitId: 'g6-u7',
  grade: 6,
  title: 'Try It Many Times',
  icon: '🎡',
  prereq: ['g6-u7-m5'],
  skills: ['expected-count', 'experiment-chance', 'which-is-likely'],
  kind: 'application',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-text'],
  visuals: ['pictogram', 'counter-objects'],
  vocab: ['chance', 'spin', 'spins', 'try', 'tries', 'closer', 'red', 'likely', 'bag'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five red blocks.',
      visual: { kind: 'counter-objects', count: 9, icon: '🔴' },
      action: 'tap-count',
      target: 5,
      hint: 'Try it many times.',
    },
    {
      stage: 'pictorial',
      prompt: 'Ten spins, five reds.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'red', icon: '🔴', count: 5 },
          { label: 'blue', icon: '🔵', count: 5 },
        ],
      },
      action: 'watch',
    },
    {
      stage: 'pictorial',
      prompt: 'More tries, closer to the chance.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'red', icon: '🔴', count: 9 },
          { label: 'blue', icon: '🔵', count: 11 },
        ],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Chance 0.25 of 20 spins is 5.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'red', icon: '🔴', count: 5 },
          { label: 'blue', icon: '🔵', count: 15 },
        ],
      },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Five reds of 20 is 0.25.',
      visual: {
        kind: 'pictogram',
        rows: [
          { label: 'red', icon: '🔴', count: 5 },
          { label: 'blue', icon: '🔵', count: 15 },
        ],
      },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Peluang → berapa kali. Putarannya kelipatan banyak bagian, jadi jawabannya
      // tidak pernah pecahan dan "sekitar" tidak berubah jadi "0,8 kali merah".
      type: 'keypad',
      skill: 'expected-count',
      params: { parts: [2, 5], fav: [1, 4], mult: [3, 9] },
      answer: (p) => (p.fav as number) * (p.mult as number),
      text: (p) =>
        `A spinner has ${p.parts} equal parts. ${p.fav} are red. ` +
        `Spin ${spinsOf(p)} times. About how many reds?`,
      exclude: (p) => (p.fav as number) >= (p.parts as number),
    },
    {
      // Arah baliknya: hasil percobaan → peluang. 20 atau 50 percobaan, jadi tiap
      // jawaban jatuh di kelipatan 0,05 atau 0,02 — dua desimal, selalu berujung.
      type: 'keypad',
      skill: 'experiment-chance',
      params: { tt: [0, 1], k: [1, 19] },
      answer: (p) => (p.k as number) / triesOf(p),
      text: (p) => `Out of ${triesOf(p)} spins, ${p.k} were red. Chance of red as a decimal?`,
    },
    {
      // Pembilang saja tidak cukup: 9 dari 20 kalah oleh 5 dari 10. Kasus seri
      // ikut, dan itulah gunanya pilihan ketiga.
      type: 'choose-text',
      skill: 'which-is-likely',
      params: { a: [1, 9], b: [1, 19] },
      answer: (p) => {
        const left = 2 * (p.a as number);
        const right = p.b as number;
        return left > right ? 0 : left < right ? 1 : 2;
      },
      text: (p) => `Bag A: ${p.a} red of 10. Bag B: ${p.b} red of 20. Which is more likely?`,
      options: () => [...BAGS],
    },
  ],
};
