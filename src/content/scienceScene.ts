import type { QuestionRule, SceneBg, SceneColor, SceneItem } from '../engine/types';

/**
 * Penulis adegan sains. Data adegan ditulis sebagai daftar benda berposisi persen;
 * tanpa pembantu kecil ini satu modul jadi ratusan baris `{ icon, x, y, size }`
 * dan salah ketik koordinat tidak terlihat di antara kurung kurawalnya.
 */

/** Satu emoji di (x, y) persen, tinggi `size` persen lebar adegan. */
export function at(icon: string, x: number, y: number, size = 16, more: Partial<SceneItem> = {}): SceneItem {
  return { icon, x, y, size, ...more };
}

/** Bentuk polos tanpa emoji: tanah, batang, akar, air, tali. */
export function bar(
  x: number,
  y: number,
  w: number,
  h: number,
  color: SceneColor,
  more: Partial<SceneItem> = {},
): SceneItem {
  return { icon: '', x, y, bar: { w, h, color }, ...more };
}

/** Tanah selebar adegan di bagian bawah. */
export const ground = (color: SceneColor = 'green'): SceneItem => bar(50, 94, 100, 14, color);

/** Satu kartu di soal `pick-picture`. Namanya hanya untuk pembaca layar. */
export type PictureCard = { icon: string; label: string };

/**
 * Satu soal "What happens next?": gambar keadaannya, lalu tiga kartu akibat.
 * Kartu PERTAMA selalu yang benar — generator mengacak urutannya (lihat
 * `generateSet`), jadi penulis tidak perlu dan tidak boleh mengacak sendiri.
 */
export type NextScenario = {
  base: SceneItem[];
  bg?: SceneBg;
  cards: [PictureCard, PictureCard, PictureCard];
};

/**
 * Aturan `pick-picture` dari daftar skenario. Soalnya tidak pernah butuh
 * membaca lebih dari "What happens next?" — gambar keadaannya yang ditanyakan,
 * gambar akibatnya yang dijawab.
 */
export function whatHappensNext(
  skill: string,
  scenarios: NextScenario[],
  /** Kalimat soal. Indra memakai "Which part knows?" — akibatnya ada di bagian tubuh. */
  question = 'What happens next?',
): QuestionRule {
  return {
    type: 'pick-picture',
    skill,
    params: { p: [0, scenarios.length - 1] },
    answer: () => 0,
    text: () => question,
    visual: (p) => {
      const s = scenarios[p.p as number] ?? scenarios[0]!;
      return {
        kind: 'science-scene',
        mode: 'predict',
        base: s.base,
        ...(s.bg ? { bg: s.bg } : {}),
        options: s.cards.map((c) => ({ icon: c.icon, label: c.label, caption: c.label })),
      };
    },
  };
}
