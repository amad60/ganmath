import type { Registry } from '../engine/unlock';
import type { ContentModule } from './types';
import { countTo5 } from './grade1/u1/m1-count-to-5';
import { countTo10 } from './grade1/u1/m2-count-to-10';
import { readAndWrite } from './grade1/u1/m3-read-and-write';
import { quickLook } from './grade1/u1/m4-quick-look';
import { moreOrLess } from './grade1/u1/m5-more-or-less';
import { putInOrder } from './grade1/u1/m6-put-in-order';
import { flatShapes } from './grade1/u6/m1-flat-shapes';
import { solidShapes } from './grade1/u6/m2-solid-shapes';
import { partAndWhole } from './grade1/u2/m1-part-and-whole';
import { addTo5 } from './grade1/u2/m2-add-to-5';
import { takeAwayFrom5 } from './grade1/u2/m3-take-away-from-5';
import { bondsOf10 } from './grade1/u2/m4-bonds-of-10';
import { addTo10 } from './grade1/u2/m5-add-to-10';
import { takeAwayFrom10 } from './grade1/u2/m6-take-away-from-10';
import { factFamily } from './grade1/u2/m7-fact-family';
import { missingNumber } from './grade1/u2/m8-missing-number';
import { whatComesNext } from './grade1/u8/m1-what-comes-next';
import { teenNumbers } from './grade1/u3/m1-teen-numbers';
import { tensAndOnes } from './grade1/u3/m2-tens-and-ones';
import { compareTo20 } from './grade1/u3/m3-compare-to-20';
import { orderTo20 } from './grade1/u3/m4-order-to-20';
import { longerOrShorter } from './grade1/u7/m1-longer-or-shorter';
import { measureWithUnits } from './grade1/u7/m2-measure-with-units';

/**
 * Registry konten. Modul baru cukup ditambahkan ke `all` dan ke `pathOrder` —
 * tidak ada migrasi data yang diperlukan, karena status `locked` tidak pernah disimpan.
 *
 * Urutan mengikuti "path order" di docs/curriculum/grade-1.md (menyelang-nyeling unit).
 * U1 (#1–6) lengkap di S7; S8 menambah #7–16.
 */
/**
 * Urutan = path order dari docs/curriculum/grade-1.md: unit sengaja diselang-seling
 * supaya anak tidak mengerjakan 14 modul aritmetika berturut-turut.
 * Vertical slice 5a = 16 modul pertama.
 */
export const all: ContentModule[] = [
  // Unit 1 — Numbers to 10 (#1–6)
  countTo5,
  countTo10,
  readAndWrite,
  quickLook,
  moreOrLess,
  putInOrder,
  // jeda bentuk (#7–8)
  flatShapes,
  solidShapes,
  // Unit 2 — Add and Subtract within 10 (#9–16)
  partAndWhole,
  addTo5,
  takeAwayFrom5,
  bondsOf10,
  addTo10,
  takeAwayFrom10,
  factFamily,
  missingNumber,
  // jeda pola (#17)
  whatComesNext,
  // Unit 3 — Numbers to 20 (#18–21)
  teenNumbers,
  tensAndOnes,
  compareTo20,
  orderTo20,
  // jeda ukur (#22–23)
  longerOrShorter,
  measureWithUnits,
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
  'g1-u3': { title: 'Unit 3 · Numbers to 20', color: 'var(--c-unit-3)' },
  'g1-u6': { title: 'Unit 6 · Shapes', color: 'var(--c-unit-6)' },
  'g1-u7': { title: 'Unit 7 · Measure & Time', color: 'var(--c-unit-7)' },
  'g1-u8': { title: 'Unit 8 · Patterns & Data', color: 'var(--c-unit-8)' },
};
