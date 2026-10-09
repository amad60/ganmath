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
import { onlyOneChange } from './scienceGrade5/s5-u1-m1';
import { itComesBack } from './scienceGrade5/s5-u2-m1';
import { leftBehind } from './scienceGrade5/s5-u3-m1';
import { heatMoves } from './scienceGrade5/s5-u4-m1';
import { caughtOrThrough } from './scienceGrade5/s5-u5-m1';
import { shadowGrowsShort } from './scienceGrade5/s5-u6-m1';
import { evenPush } from './scienceGrade5/s5-u7-m1';
import { highOrLow } from './scienceGrade5/s5-u8-m1';
import { bornThatWay } from './scienceGrade5/s5-u9-m1';
import { manyDrips } from './scienceGrade5/s5-u10-m1';
import { foodIsFuel } from './scienceGrade6/s6-u1-m1';
import { springBack } from './scienceGrade6/s6-u2-m1';
import { earthTurns } from './scienceGrade6/s6-u3-m1';
import { beakFitsFood } from './scienceGrade6/s6-u4-m1';
import { tooManyEaters } from './scienceGrade6/s6-u5-m1';
import { wrapKeepsWarm } from './scienceGrade6/s6-u6-m1';
import { downToTheGround } from './scienceGrade6/s6-u7-m1';
import { warmAndWetRots } from './scienceGrade6/s6-u8-m1';
import { pickTheIronOut } from './scienceGrade6/s6-u9-m1';
import { afterYouRun } from './scienceGrade6/s6-u10-m1';

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
  onlyOneChange,
  itComesBack,
  leftBehind,
  heatMoves,
  caughtOrThrough,
  shadowGrowsShort,
  evenPush,
  highOrLow,
  bornThatWay,
  manyDrips,
  foodIsFuel,
  springBack,
  earthTurns,
  beakFitsFood,
  tooManyEaters,
  wrapKeepsWarm,
  downToTheGround,
  warmAndWetRots,
  pickTheIronOut,
  afterYouRun,
];

/** Level science yang sudah punya jalur. */
export const SCIENCE_LEVELS = [1, 2, 3, 4, 5, 6] as const;

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
  's5-u1': { title: 'Unit 1 · Only One Change', color: '#0c4a6e' },
  's5-u2': { title: 'Unit 2 · It Comes Back', color: '#7f1d1d' },
  's5-u3': { title: 'Unit 3 · Left Behind', color: '#1e3a8a' },
  's5-u4': { title: 'Unit 4 · Heat Moves', color: '#3f6212' },
  's5-u5': { title: 'Unit 5 · Caught or Through', color: '#4c1d95' },
  's5-u6': { title: 'Unit 6 · Shadow Grows Short', color: '#134e4a' },
  's5-u7': { title: 'Unit 7 · Even Push', color: '#9a3412' },
  's5-u8': { title: 'Unit 8 · High or Low', color: '#1e1b4b' },
  's5-u9': { title: 'Unit 9 · Born That Way', color: '#365314' },
  's5-u10': { title: 'Unit 10 · Many Drips', color: '#292524' },
  's6-u1': { title: 'Unit 1 · Food Is Fuel', color: '#4a044e' },
  's6-u2': { title: 'Unit 2 · Spring Back', color: '#155e75' },
  's6-u3': { title: 'Unit 3 · Earth Turns', color: '#1c1917' },
  's6-u4': { title: 'Unit 4 · Beak Fits Food', color: '#701a75' },
  's6-u5': { title: 'Unit 5 · Too Many Eaters', color: '#14532d' },
  's6-u6': { title: 'Unit 6 · Wrap Keeps Warm', color: '#7c2d12' },
  's6-u7': { title: 'Unit 7 · Down to the Ground', color: '#0f172a' },
  's6-u8': { title: 'Unit 8 · Warm and Wet Rots', color: '#581c87' },
  's6-u9': { title: 'Unit 9 · Pick the Iron Out', color: '#1e293b' },
  's6-u10': { title: 'Unit 10 · After You Run', color: '#3b0764' },
};
