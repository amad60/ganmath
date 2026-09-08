import type { Registry } from '../engine/unlock';
import type { ContentModule } from './types';
import { countTo5 } from './grade1/u1/m1-count-to-5';
import { countTo10 } from './grade1/u1/m2-count-to-10';
import { readAndWrite } from './grade1/u1/m3-read-and-write';
import { quickLook } from './grade1/u1/m4-quick-look';
import { moreOrLess } from './grade1/u1/m5-more-or-less';
import { putInOrder } from './grade1/u1/m6-put-in-order';

/**
 * Registry konten. Modul baru cukup ditambahkan ke `all` dan ke `pathOrder` —
 * tidak ada migrasi data yang diperlukan, karena status `locked` tidak pernah disimpan.
 *
 * Urutan mengikuti "path order" di docs/curriculum/grade-1.md (menyelang-nyeling unit).
 * U1 (#1–6) lengkap di S7; S8 menambah #7–16.
 */
export const all: ContentModule[] = [
  countTo5,
  countTo10,
  readAndWrite,
  quickLook,
  moreOrLess,
  putInOrder,
];

export const modules: Record<string, ContentModule> = Object.fromEntries(
  all.map((m) => [m.id, m]),
);

export const pathOrder: string[] = all.map((m) => m.id);

export const registry: Registry = { modules, pathOrder };

export function moduleById(id: string): ContentModule {
  const m = modules[id];
  if (!m) throw new Error(`Modul tidak terdaftar: ${id}`);
  return m;
}

export const unitTitles: Record<string, { title: string; color: string }> = {
  'g1-u1': { title: 'Unit 1 · Numbers to 10', color: 'var(--c-unit-1)' },
  'g1-u2': { title: 'Unit 2 · Add and Subtract', color: 'var(--c-unit-2)' },
  'g1-u6': { title: 'Unit 6 · Shapes', color: 'var(--c-unit-6)' },
};
