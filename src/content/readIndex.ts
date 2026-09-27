import type { ContentModule } from './types';
import type { Registry } from '../engine/unlock';

import { whoIsInTheStory } from './readGrade1/r1-u1-m1';
import { whereDoesItHappen } from './readGrade1/r1-u1-m2';
import { orderOfEvents } from './readGrade1/r1-u2-m1';
import { whyDidItHappen } from './readGrade1/r1-u3-m1';
import { mysteryClues } from './readGrade1/r1-u4-m1';

// Read Grade 2
import { mainIdeaSummary } from './readGrade2/r2-u1-m1';
import { factVsOpinion } from './readGrade2/r2-u2-m1';
import { characterFeelings } from './readGrade2/r2-u3-m1';

// Read Grade 3
import { howToFollowSteps } from './readGrade3/r3-u1-m1';
import { scienceAnimalClues } from './readGrade3/r3-u2-m1';

export const readModulesList: ContentModule[] = [
  whoIsInTheStory,
  whereDoesItHappen,
  orderOfEvents,
  whyDidItHappen,
  mysteryClues,
  mainIdeaSummary,
  factVsOpinion,
  characterFeelings,
  howToFollowSteps,
  scienceAnimalClues,
];

export const readModules: Record<string, ContentModule> = Object.fromEntries(
  readModulesList.map((m) => [m.id, m]),
);

export const readPathOrder: string[] = readModulesList.map((m) => m.id);

export function readPathOrderFor(grade: number): string[] {
  return readModulesList.filter((m) => m.grade === grade).map((m) => m.id);
}

export const readRegistry: Registry = {
  modules: readModules,
  pathOrder: readPathOrder,
};

export const readUnitTitles: Record<string, { title: string; color: string }> = {
  // Read Grade 1
  'r1-u1': { title: 'Unit 1 · Who, Where & What', color: '#10b981' },
  'r1-u2': { title: 'Unit 2 · Beginning, Middle & End', color: '#059669' },
  'r1-u3': { title: 'Unit 3 · Why Did It Happen?', color: '#0d9488' },
  'r1-u4': { title: 'Unit 4 · Mystery Clues', color: '#0284c7' },
  // Read Grade 2
  'r2-u1': { title: 'Unit 1 · The Big Idea', color: '#10b981' },
  'r2-u2': { title: 'Unit 2 · Fact or Feeling?', color: '#059669' },
  'r2-u3': { title: 'Unit 3 · Character Feelings', color: '#0d9488' },
  // Read Grade 3
  'r3-u1': { title: 'Unit 1 · Follow the Steps', color: '#10b981' },
  'r3-u2': { title: 'Unit 2 · Animal Adaptations', color: '#0284c7' },
};

export function readRegistryFor(grade = 1): Registry {
  const ids = readPathOrderFor(grade);
  return {
    modules: Object.fromEntries(ids.map((id) => [id, readModules[id] as ContentModule])),
    pathOrder: ids,
  };
}
