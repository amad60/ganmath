import type { ContentModule } from './types';
import type { Registry } from '../engine/unlock';
import { whatLivingThingsNeed } from './scienceGrade1/s1-u1-m1';
import { bodyAndSenses } from './scienceGrade1/s1-u2-m1';
import { materialsChange } from './scienceGrade1/s1-u3-m1';
import { sunRainWind } from './scienceGrade1/s1-u4-m1';
import { plantParts } from './scienceGrade1/s1-u5-m1';
import { howAnimalsMove } from './scienceGrade1/s1-u6-m1';
import { dayAndNight } from './scienceGrade1/s1-u7-m1';
import { pushAndPull } from './scienceGrade1/s1-u8-m1';
import { loudAndQuiet } from './scienceGrade1/s1-u9-m1';
import { lookAfterThem } from './scienceGrade1/s1-u10-m1';

export const scienceModulesList: ContentModule[] = [
  whatLivingThingsNeed,
  bodyAndSenses,
  materialsChange,
  sunRainWind,
  plantParts,
  howAnimalsMove,
  dayAndNight,
  pushAndPull,
  loudAndQuiet,
  lookAfterThem,
];

/** Level science yang sudah punya jalur. */
export const SCIENCE_LEVELS = [1] as const;

export const scienceModules: Record<string, ContentModule> = Object.fromEntries(
  scienceModulesList.map((m) => [m.id, m]),
);

export const sciencePathOrder: string[] = scienceModulesList.map((m) => m.id);

export function sciencePathOrderFor(grade: number): string[] {
  return scienceModulesList.filter((m) => m.grade === grade).map((m) => m.id);
}

export function scienceRegistryFor(grade = 1): Registry {
  const ids = sciencePathOrderFor(grade);
  return {
    modules: Object.fromEntries(ids.map((id) => [id, scienceModules[id] as ContentModule])),
    pathOrder: ids,
  };
}

export const scienceUnitTitles: Record<string, { title: string; color: string }> = {
  's1-u1': { title: 'Unit 1 · Living Things', color: '#0284c7' },
  's1-u2': { title: 'Unit 2 · Body and Senses', color: '#0369a1' },
  's1-u3': { title: 'Unit 3 · Materials', color: '#0ea5e9' },
  's1-u4': { title: 'Unit 4 · Weather', color: '#38bdf8' },
  's1-u5': { title: 'Unit 5 · Plant Parts', color: '#075985' },
  's1-u6': { title: 'Unit 6 · How Animals Move', color: '#0c4a6e' },
  's1-u7': { title: 'Unit 7 · Day and Night', color: '#0e7490' },
  's1-u8': { title: 'Unit 8 · Push and Pull', color: '#0891b2' },
  's1-u9': { title: 'Unit 9 · Loud and Quiet', color: '#155e75' },
  's1-u10': { title: 'Unit 10 · Look After Them', color: '#1e3a8a' },
};
