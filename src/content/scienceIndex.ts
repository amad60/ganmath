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
import { seedsGrow } from './scienceGrade2/s2-u1-m1';
import { animalHomes } from './scienceGrade2/s2-u2-m1';
import { lifeCycles } from './scienceGrade2/s2-u3-m1';
import { solidAndLiquid } from './scienceGrade2/s2-u4-m1';
import { heatAndCold } from './scienceGrade2/s2-u5-m1';
import { magnetsPull } from './scienceGrade2/s2-u6-m1';
import { lightAndShadow } from './scienceGrade2/s2-u7-m1';
import { whoEatsWhat } from './scienceGrade2/s2-u8-m1';
import { soilAndRain } from './scienceGrade2/s2-u9-m1';
import { careForEarth } from './scienceGrade2/s2-u10-m1';
import { leavesMakeFood } from './scienceGrade3/s3-u1-m1';
import { bodyCoverings } from './scienceGrade3/s3-u2-m1';
import { homeChanges } from './scienceGrade3/s3-u3-m1';
import { airTakesSpace } from './scienceGrade3/s3-u4-m1';
import { fallAndSlow } from './scienceGrade3/s3-u5-m1';
import { rampsAndLevers } from './scienceGrade3/s3-u6-m1';
import { soundTravels } from './scienceGrade3/s3-u7-m1';
import { closedPath } from './scienceGrade3/s3-u8-m1';
import { waterGoesAround } from './scienceGrade3/s3-u9-m1';
import { rotFeedsSoil } from './scienceGrade3/s3-u10-m1';
import { rootsDrink } from './scienceGrade4/s4-u1-m1';
import { bonesAndMuscles } from './scienceGrade4/s4-u2-m1';
import { sugarDissolves } from './scienceGrade4/s4-u3-m1';
import { lightBounces } from './scienceGrade4/s4-u4-m1';
import { polesPushAndPull } from './scienceGrade4/s4-u5-m1';
import { wheelsHelp } from './scienceGrade4/s4-u6-m1';
import { floatOrSink } from './scienceGrade4/s4-u7-m1';
import { coldMakesDrops } from './scienceGrade4/s4-u8-m1';
import { longerDays } from './scienceGrade4/s4-u9-m1';
import { oneLinkBreaks } from './scienceGrade4/s4-u10-m1';

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
  seedsGrow,
  animalHomes,
  lifeCycles,
  solidAndLiquid,
  heatAndCold,
  magnetsPull,
  lightAndShadow,
  whoEatsWhat,
  soilAndRain,
  careForEarth,
  leavesMakeFood,
  bodyCoverings,
  homeChanges,
  airTakesSpace,
  fallAndSlow,
  rampsAndLevers,
  soundTravels,
  closedPath,
  waterGoesAround,
  rotFeedsSoil,
  rootsDrink,
  bonesAndMuscles,
  sugarDissolves,
  lightBounces,
  polesPushAndPull,
  wheelsHelp,
  floatOrSink,
  coldMakesDrops,
  longerDays,
  oneLinkBreaks,
];

/** Level science yang sudah punya jalur. */
export const SCIENCE_LEVELS = [1, 2, 3, 4] as const;

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
  's2-u1': { title: 'Unit 1 · Seeds Grow', color: '#0f766e' },
  's2-u2': { title: 'Unit 2 · Animal Homes', color: '#115e59' },
  's2-u3': { title: 'Unit 3 · Life Cycles', color: '#047857' },
  's2-u4': { title: 'Unit 4 · Solid and Liquid', color: '#065f46' },
  's2-u5': { title: 'Unit 5 · Heat and Cold', color: '#134e4a' },
  's2-u6': { title: 'Unit 6 · Magnets', color: '#166534' },
  's2-u7': { title: 'Unit 7 · Light and Shadow', color: '#14532d' },
  's2-u8': { title: 'Unit 8 · Who Eats What', color: '#1e40af' },
  's2-u9': { title: 'Unit 9 · Soil and Rain', color: '#1e3a8a' },
  's2-u10': { title: 'Unit 10 · Care for Earth', color: '#3730a3' },
  's3-u1': { title: 'Unit 1 · Leaves Make Food', color: '#7c2d12' },
  's3-u2': { title: 'Unit 2 · Body Coverings', color: '#9a3412' },
  's3-u3': { title: 'Unit 3 · When a Home Changes', color: '#9f1239' },
  's3-u4': { title: 'Unit 4 · Air Takes Space', color: '#831843' },
  's3-u5': { title: 'Unit 5 · Falling and Slowing', color: '#6b21a8' },
  's3-u6': { title: 'Unit 6 · Ramps and Levers', color: '#581c87' },
  's3-u7': { title: 'Unit 7 · Sound Travels', color: '#5b21b6' },
  's3-u8': { title: 'Unit 8 · A Closed Path', color: '#4c1d95' },
  's3-u9': { title: 'Unit 9 · Water Goes Around', color: '#312e81' },
  's3-u10': { title: 'Unit 10 · Rot Feeds the Soil', color: '#3b0764' },
  's4-u1': { title: 'Unit 1 · Roots Drink', color: '#0f172a' },
  's4-u2': { title: 'Unit 2 · Bones and Muscles', color: '#7f1d1d' },
  's4-u3': { title: 'Unit 3 · Sugar Dissolves', color: '#365314' },
  's4-u4': { title: 'Unit 4 · Light Bounces', color: '#155e75' },
  's4-u5': { title: 'Unit 5 · Poles Push and Pull', color: '#701a75' },
  's4-u6': { title: 'Unit 6 · Wheels Help', color: '#44403c' },
  's4-u7': { title: 'Unit 7 · Float or Sink', color: '#1e3a8a' },
  's4-u8': { title: 'Unit 8 · Cold Makes Drops', color: '#1e1b4b' },
  's4-u9': { title: 'Unit 9 · Longer Days', color: '#3f6212' },
  's4-u10': { title: 'Unit 10 · One Link Breaks', color: '#4a044e' },
};
