import type { ContentModule } from './types';
import type { Registry } from '../engine/unlock';

import { whoIsInTheStory } from './readGrade1/r1-u1-m1';
import { whereDoesItHappen } from './readGrade1/r1-u1-m2';
import { orderOfEvents } from './readGrade1/r1-u2-m1';
import { whyDidItHappen } from './readGrade1/r1-u3-m1';
import { mysteryClues } from './readGrade1/r1-u4-m1';

export const readModulesList: ContentModule[] = [
  whoIsInTheStory,
  whereDoesItHappen,
  orderOfEvents,
  whyDidItHappen,
  mysteryClues,
];

export const readModules: Record<string, ContentModule> = Object.fromEntries(
  readModulesList.map((m) => [m.id, m]),
);

export const readPathOrder: string[] = readModulesList.map((m) => m.id);

export const readRegistry: Registry = {
  modules: readModules,
  pathOrder: readPathOrder,
};

export const readUnitTitles: Record<string, { title: string; color: string }> = {
  'r1-u1': { title: 'Unit 1 · Who, Where & What', color: '#10b981' },
  'r1-u2': { title: 'Unit 2 · Beginning, Middle & End', color: '#059669' },
  'r1-u3': { title: 'Unit 3 · Why Did It Happen?', color: '#0d9488' },
  'r1-u4': { title: 'Unit 4 · Mystery Clues', color: '#0284c7' },
};

export function readRegistryFor(_grade = 1): Registry {
  return readRegistry;
}
