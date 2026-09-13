import type { SolidKind } from '../../engine/types';

export type { SolidKind };

/**
 * Aturan bangun ruang Grade 1 — fungsi murni, dipakai bersama data modul dan gambar.
 *
 * Grade 1 memakai nama benda sehari-hari (ball, box, can-shaped cylinder), bukan
 * `solids.ts` Grade 4+ yang digambar dari kubus satuan.
 */
export const SOLID_KINDS: SolidKind[] = ['ball', 'cube', 'box', 'cylinder', 'cone'];

/**
 * Banyak sisi DATAR. Sengaja bukan `SOLID_FACES` dari `solids.ts`: di sana tabung
 * dihitung 3 (dua alas + selimut lengkung) seperti buku kelas atas. Anak kelas 1
 * ditanya "flat faces" — yang bisa diletakkan rata di meja — dan tabung punya 2.
 */
export const FLAT_FACES: Record<SolidKind, number> = {
  ball: 0,
  cube: 6,
  box: 6,
  cylinder: 2,
  cone: 1,
};

/**
 * Bisa menggelinding, bisa ditumpuk, atau keduanya.
 *
 * Kerucut sengaja `null`: ia menggelinding memutar dan hanya bisa ditumpuk di atas
 * alasnya — jawabannya bisa diperdebatkan orang dewasa, jadi tidak ditanyakan ke
 * anak 6 tahun.
 */
export const MOVES: Record<SolidKind, 'rolls' | 'stacks' | 'both' | null> = {
  ball: 'rolls',
  cube: 'stacks',
  box: 'stacks',
  cylinder: 'both',
  cone: null,
};
