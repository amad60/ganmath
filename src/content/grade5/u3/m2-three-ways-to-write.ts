import type { ContentModule } from '../../types';

/** Persen "bulat" yang pecahan sederhananya pendek dan benar-benar dipakai orang. */
const NICE = [10, 20, 25, 40, 50, 60, 75, 80];
/** Pecahan paling sederhana dari `NICE`, index demi index. */
const NICE_FRACTION = ['1/10', '1/5', '1/4', '2/5', '1/2', '3/5', '3/4', '4/5'];

/**
 * Satu nilai, tiga cara menulisnya. Modul ini adalah `g5-u2-m5` (pecahan ↔ desimal)
 * dengan satu sudut ketiga ditambahkan, dan arah kerjanya sengaja tidak simetris —
 * alasannya sama persis seperti di sana:
 *  - persen → desimal DIKETIK anak, karena hasilnya sebuah desimal dan keypad
 *    punya titiknya sejak `dae385c`;
 *  - desimal → persen juga diketik, karena hasilnya bilangan bulat;
 *  - persen → pecahan lewat `choose-text`, karena "3/4" masih tidak bisa diketik
 *    sama sekali (keypad tidak punya garis pecahan).
 *
 * Miskonsepsi utama yang dibidik: **menggeser titik satu tempat, bukan dua**.
 * 0.7 dijawab 7% (bukan 70%) dan 7% dijawab 0.7 (bukan 0.07). Karena itu aturan
 * desimal → persen sengaja memakai desimal SATU tempat maupun DUA tempat dari
 * ruang parameter yang sama (`0.${d/100}`), jadi 0.7 dan 0.07 sama-sama muncul dan
 * anak tidak bisa lulus dengan satu kebiasaan geser saja.
 *
 * Batas sadar: modul ini tidak pernah menguji nol di belakang. Jawaban dibandingkan
 * sebagai NILAI (`sameAnswer`), jadi "0.5" = "0.50" — itu notasi, bukan persen.
 */
export const threeWaysToWrite: ContentModule = {
  id: 'g5-u3-m2',
  unitId: 'g5-u3',
  grade: 5,
  title: 'Three Ways to Write',
  icon: '🔀',
  prereq: ['g5-u3-m1'],
  skills: ['percent-to-decimal', 'percent-to-fraction'],
  kind: 'concept',
  fluencyTracked: false,
  questionTypes: ['keypad', 'choose-text', 'compare-symbol'],
  visuals: ['counter-objects', 'fraction-shape', 'number-line', 'bar-model'],
  vocab: ['percent', 'half', 'decimal', 'divide', 'times'],

  learn: [
    {
      stage: 'concrete',
      prompt: 'Tap five of ten parts.',
      visual: { kind: 'counter-objects', count: 10, icon: '🟨' },
      action: 'tap-count',
      target: 5,
      hint: 'Half of ten parts.',
    },
    {
      stage: 'pictorial',
      prompt: 'Half is 50 percent.',
      visual: { kind: 'fraction', parts: 2, shaded: 1, shape: 'square' },
      action: 'watch',
    },
    {
      // Garis bilangan 0–1 dengan langkah 0.1: penanda anak benar-benar mendarat
      // di 0.5 (dijaga lint `number-line-step`).
      stage: 'pictorial',
      prompt: 'Show 50 percent on the line.',
      visual: { kind: 'number-line', min: 0, max: 1, value: null, step: 0.1 },
      action: 'drop-on-line',
      target: 0.5,
      hint: 'Five jumps from zero.',
    },
    {
      stage: 'abstract',
      prompt: 'Percent to decimal: divide by 100.',
      visual: { kind: 'bars', lengths: [1, 0.35], labels: ['1', '%'] },
      action: 'watch',
    },
    {
      stage: 'abstract',
      prompt: 'Decimal to percent: times 100.',
      visual: { kind: 'number-line', min: 0, max: 1, value: 0.35, marks: [0.35], step: 0.1 },
      action: 'watch',
    },
  ],

  rules: [
    {
      // Persen → desimal, diketik. Titik desimal muncul di keypad karena
      // `answerCaps` melihat SELURUH aturan ini berjawaban pecahan desimal.
      type: 'keypad',
      skill: 'percent-to-decimal',
      params: { p: [1, 99] },
      answer: (p) => (p.p as number) / 100,
      text: (p) => `Write ${p.p}% as a decimal.`,
    },
    {
      // Arah sebaliknya, dan di sinilah 0.7 lawan 0.07 diadu: keduanya lahir dari
      // ruang parameter yang sama, jadi anak tidak bisa menebak panjang desimalnya.
      type: 'keypad',
      skill: 'percent-to-decimal',
      params: { d: [1, 99] },
      answer: (p) => p.d as number,
      text: (p) => `Write ${(p.d as number) / 100} as a percent.`,
    },
    {
      // Persen → pecahan paling sederhana. Pilihan kedua memakai penyebut 10,
      // ketiga penyebut 1000 (titik digeser terlalu jauh), keempat sisanya —
      // jawaban anak yang membaca "75%" sebagai "yang tersisa".
      type: 'choose-text',
      skill: 'percent-to-fraction',
      params: { i: [0, 7] },
      answer: () => 0,
      text: (p) => `Which fraction is the same as ${NICE[p.i as number]}%?`,
      options: (p) => {
        const v = NICE[p.i as number] as number;
        return [
          NICE_FRACTION[p.i as number] as string,
          `${v}/10`,
          `${v}/1000`,
          `${100 - v}/100`,
        ];
      },
    },
    {
      // Satu bentuk harus diubah dulu sebelum bisa dibandingkan. Kasus setara
      // (50% dengan 0.5) sengaja dibiarkan muncul: itu jawaban `=`, dan tanpa
      // pernah melihatnya anak belajar bahwa dua bentuk tidak pernah sama besar.
      type: 'compare-symbol',
      skill: 'percent-to-decimal',
      params: { p: [1, 99], d: [1, 9] },
      answer: (p) => Math.sign((p.p as number) - (p.d as number) * 10),
      text: (p) => `${p.p}% ? ${(p.d as number) / 10}`,
    },
  ],
};
