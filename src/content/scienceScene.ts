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

/** Satu kartu di soal `pick-picture`. Ikon DAN label-nya sama-sama terlihat. */
export type PictureCard = { icon: string; label: string };

/**
 * Satu soal bukti: gambar menunjukkan HASIL atau keadaannya, pertanyaan
 * menanyakan sebab, kebutuhan, atau bagian yang bekerja. Kartu PERTAMA selalu
 * yang benar — generator mengacak urutannya (lihat `generateSet`), jadi penulis
 * tidak boleh mengacak sendiri.
 *
 * Bukan "apa yang terjadi selanjutnya" kalau akibatnya sudah tergambar.
 * Sekolah menilai anak yang bisa menjelaskan bukti pada benda baru, bukan
 * anak yang mencocokkan emoji.
 */
export type NextScenario = {
  base: SceneItem[];
  bg?: SceneBg;
  /**
   * Pertanyaan soal ini. Harus menyebut keadaan yang diubah ("The front muscle
   * pulls the arm."), bukan "What happens next?" — gambar emoji tidak membawa
   * sebab itu sendiri.
   */
  ask?: string;
  cards: [PictureCard, PictureCard, PictureCard];
};

/**
 * Aturan `pick-picture` dari daftar skenario. `ask` tiap skenario menang atas
 * pertanyaan bersama: delapan gambar sering delapan keadaan yang berbeda.
 */
export function whatHappensNext(
  skill: string,
  scenarios: NextScenario[],
  /** Cadangan kalau skenario tidak punya `ask`. Jangan memakai kalimat kosong. */
  question = 'What happens next?',
): QuestionRule {
  return {
    type: 'pick-picture',
    skill,
    params: { p: [0, scenarios.length - 1] },
    answer: () => 0,
    text: (p) => scenarios[p.p as number]?.ask ?? question,
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
