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
import { addTen } from './grade1/u4/m1-add-ten';
import { doubles } from './grade1/u4/m2-doubles';
import { nearDoubles } from './grade1/u4/m3-near-doubles';
import { makeTenToAdd } from './grade1/u4/m4-make-ten-to-add';
import { addWithin20 } from './grade1/u4/m5-add-within-20';
import { subtractWithin20 } from './grade1/u4/m6-subtract-within-20';
import { makeNewShapes } from './grade1/u6/m3-make-new-shapes';
import { halvesAndFourths } from './grade1/u6/m4-halves-and-fourths';
import { countTo50 } from './grade1/u5/m1-count-to-50';
import { countTo100 } from './grade1/u5/m2-count-to-100';
import { skipCount } from './grade1/u5/m3-skip-count';
import { tensAndOnesTo100 } from './grade1/u5/m4-tens-and-ones-to-100';
import { compareTwoDigit } from './grade1/u5/m5-compare-two-digit';
import { tenMoreTenLess } from './grade1/u5/m6-ten-more-ten-less';
import { whereIsIt } from './grade1/u6/m5-where-is-it';
import { heavyAndLight } from './grade1/u7/m3-heavy-and-light';
import { tellTheTime } from './grade1/u7/m4-tell-the-time';
import { money } from './grade1/u7/m5-money';
import { tallyMarks } from './grade1/u8/m2-tally-marks';
import { pictureGraph } from './grade1/u8/m3-picture-graph';

// ---- Grade 2
import { hundreds } from './grade2/u1/m1-hundreds';
import { countTo1000 } from './grade2/u1/m2-count-to-1000';
import { hundredsTensOnes } from './grade2/u1/m3-hundreds-tens-ones';
import { readAndWrite1000 } from './grade2/u1/m4-read-and-write-1000';
import { compareTo1000 } from './grade2/u1/m5-compare-to-1000';
import { nearestTen } from './grade2/u1/m6-nearest-ten';
import { addTens } from './grade2/u2/m1-add-tens';
import { addNoRegroup } from './grade2/u2/m2-add-no-regroup';
import { bridgeToTen } from './grade2/u2/m3-bridge-to-ten';
import { addWithRegrouping } from './grade2/u2/m4-add-with-regrouping';
import { subtractNoRegroup } from './grade2/u2/m5-subtract-no-regroup';
import { subtractWithRegrouping } from './grade2/u2/m6-subtract-with-regrouping';
import { checkYourAnswer } from './grade2/u2/m7-check-your-answer';
import { tenMoreLess100 } from './grade2/u3/m1-ten-more-ten-less';
import { hundredMoreLess } from './grade2/u3/m2-hundred-more-less';
import { nearTens } from './grade2/u3/m3-near-tens';
import { doublesTo100 } from './grade2/u3/m4-doubles-to-100';
import { countOnAndBack } from './grade2/u3/m5-count-on-and-back';
import { equalGroups } from './grade2/u4/m1-equal-groups';
import { arrays } from './grade2/u4/m2-arrays';
import { timesTwo } from './grade2/u4/m3-times-two';
import { timesFive } from './grade2/u4/m4-times-five';
import { timesTen } from './grade2/u4/m5-times-ten';
import { timesCheck } from './grade2/u4/m6-times-check';
import { evenAndOdd } from './grade2/u5/m1-even-and-odd';
import { skipCount100 } from './grade2/u5/m2-skip-count-100';
import { growingPatterns } from './grade2/u5/m3-growing-patterns';
import { numberPatterns } from './grade2/u5/m4-number-patterns';
import { centimetres } from './grade2/u6/m1-centimetres';
import { metres } from './grade2/u6/m2-metres';
import { gramsAndKilograms } from './grade2/u6/m3-grams-and-kilograms';
import { compareMeasures } from './grade2/u6/m4-compare-measures';
import { estimateLength } from './grade2/u6/m5-estimate-length';
import { timeToFive } from './grade2/u7/m1-time-to-five';
import { quarterPastAndTo } from './grade2/u7/m2-quarter-past-and-to';
import { moneyTo20000 } from './grade2/u7/m3-money-to-20000';
import { change } from './grade2/u7/m4-change';
import { barChart } from './grade2/u7/m5-bar-chart';

// ---- Grade 3
import { thousands } from './grade3/u1/m1-thousands';
import { numbersTo10000 } from './grade3/u1/m2-numbers-to-10000';
import { compareTo10000 } from './grade3/u1/m3-compare-to-10000';
import { nearestHundred } from './grade3/u1/m4-nearest-hundred';
import { numberLine10000 } from './grade3/u1/m5-number-line-10000';
import { timesThree } from './grade3/u2/m1-times-three';
import { timesFour } from './grade3/u2/m2-times-four';
import { turnAroundFacts } from './grade3/u2/m3-turn-around-facts';
import { timesSix } from './grade3/u2/m4-times-six';
import { timesSeven } from './grade3/u2/m5-times-seven';
import { timesEight } from './grade3/u2/m6-times-eight';
import { timesNine } from './grade3/u2/m7-times-nine';
import { timesTableCheck } from './grade3/u2/m8-times-table-check';
import { shareEqually } from './grade3/u3/m1-share-equally';
import { makeGroups } from './grade3/u3/m2-make-groups';
import { divideBy2510 } from './grade3/u3/m3-divide-by-2-5-10';
import { divideBy34 } from './grade3/u3/m4-divide-by-3-4';
import { timesAndDivide } from './grade3/u3/m5-times-and-divide';
import { leftOver } from './grade3/u3/m6-left-over';
import { addHundreds } from './grade3/u4/m1-add-hundreds';
import { add3Digit } from './grade3/u4/m2-add-3-digit';
import { addAndRegroup } from './grade3/u4/m3-add-and-regroup';
import { subtract3Digit } from './grade3/u4/m4-subtract-3-digit';
import { subtractAndRegroup } from './grade3/u4/m5-subtract-and-regroup';
import { equalParts } from './grade3/u5/m1-equal-parts';
import { nameTheFraction } from './grade3/u5/m2-name-the-fraction';
import { partsOnALine } from './grade3/u5/m3-parts-on-a-line';
import { compareFractions } from './grade3/u5/m4-compare-fractions';
import { equalFractions } from './grade3/u5/m5-equal-fractions';
import { fractionOfANumber } from './grade3/u5/m6-fraction-of-a-number';
import { sidesAndCorners } from './grade3/u6/m1-sides-and-corners';
import { squareCorners } from './grade3/u6/m2-square-corners';
import { perimeter } from './grade3/u6/m3-perimeter';
import { missingSide } from './grade3/u6/m4-missing-side';
import { samePerimeter } from './grade3/u6/m5-same-perimeter';
import { timeToTheMinute } from './grade3/u7/m1-time-to-the-minute';
import { howLong } from './grade3/u7/m2-how-long';
import { moneyTo100000 } from './grade3/u7/m3-money-to-100000';
import { shopping } from './grade3/u7/m4-shopping';
import { graphsThatCount } from './grade3/u7/m5-graphs-that-count';

// ---- Grade 4
import { tenThousands } from './grade4/u1/m1-ten-thousands';
import { numbersTo1000000 } from './grade4/u1/m2-numbers-to-1000000';
import { readBigNumbers } from './grade4/u1/m3-read-big-numbers';
import { compareBigNumbers } from './grade4/u1/m4-compare-big-numbers';
import { nearestThousand } from './grade4/u1/m5-nearest-thousand';
import { timesTenAndHundred } from './grade4/u2/m1-times-ten-and-hundred';
import { splitToMultiply } from './grade4/u2/m2-split-to-multiply';
import { twoDigitsTimesOne } from './grade4/u2/m3-two-digits-times-one';
import { threeDigitsTimesOne } from './grade4/u2/m4-three-digits-times-one';
import { divideTensFirst } from './grade4/u2/m5-divide-tens-first';
import { divideWithRemainder } from './grade4/u2/m6-divide-with-remainder';
import { longDivisionStart } from './grade4/u2/m7-long-division-start';
import { findTheFactors } from './grade4/u3/m1-find-the-factors';
import { countTheMultiples } from './grade4/u3/m2-count-the-multiples';
import { dividesExactly } from './grade4/u3/m3-divides-exactly';
import { primeOrNot } from './grade4/u3/m4-prime-or-not';
import { commonFactors } from './grade4/u3/m5-common-factors';
import { commonMultiples } from './grade4/u3/m6-common-multiples';
import { sameSizeFractions } from './grade4/u4/m1-same-size-fractions';
import { multiplyBothParts } from './grade4/u4/m2-multiply-both-parts';
import { divideBothParts } from './grade4/u4/m3-divide-both-parts';
import { simplestForm } from './grade4/u4/m4-simplest-form';
import { compareTwoFractions } from './grade4/u4/m5-compare-two-fractions';
import { addAndTakeAway } from './grade4/u4/m6-add-and-take-away';
import { mixedNumbers } from './grade4/u4/m7-mixed-numbers';
import { tenths } from './grade4/u5/m1-tenths';
import { writeADecimal } from './grade4/u5/m2-write-a-decimal';
import { hundredths } from './grade4/u5/m3-hundredths';
import { tenthsOnALine } from './grade4/u5/m4-tenths-on-a-line';
import { compareDecimals } from './grade4/u5/m5-compare-decimals';
import { meetAngles } from './grade4/u6/m1-meet-angles';
import { acuteAndObtuse } from './grade4/u6/m2-acute-and-obtuse';
import { measureAngles } from './grade4/u6/m3-measure-angles';
import { coverAndCount } from './grade4/u6/m4-cover-and-count';
import { areaOfARectangle } from './grade4/u6/m5-area-of-a-rectangle';
import { areaOrPerimeter } from './grade4/u6/m6-area-or-perimeter';
import { readABarChart } from './grade4/u7/m1-read-a-bar-chart';
import { frequencyTable } from './grade4/u7/m2-frequency-table';
import { compareTheData } from './grade4/u7/m3-compare-the-data';
import { findTheMean } from './grade4/u7/m4-find-the-mean';

// ---- Grade 5
import { makeBottomsMatch } from './grade5/u1/m1-make-bottoms-match';
import { addUnlikeBottoms } from './grade5/u1/m2-add-unlike-bottoms';
import { findACommonBottom } from './grade5/u1/m3-find-a-common-bottom';
import { mixedNumberSums } from './grade5/u1/m4-mixed-number-sums';
import { fractionTimesWhole } from './grade5/u1/m5-fraction-times-whole';
import { fractionTimesFraction } from './grade5/u1/m6-fraction-times-fraction';
import { divideByAFraction } from './grade5/u1/m7-divide-by-a-fraction';
import { tidyUpTheAnswer } from './grade5/u1/m8-tidy-up-the-answer';
import { lineUpThePoints } from './grade5/u2/m1-line-up-the-points';
import { timesAWholeNumber } from './grade5/u2/m2-times-a-whole-number';
import { decimalTimesDecimal } from './grade5/u2/m3-decimal-times-decimal';
import { divideDecimals } from './grade5/u2/m4-divide-decimals';
import { fractionsAndDecimals } from './grade5/u2/m5-fractions-and-decimals';
import { roundDecimals } from './grade5/u2/m6-round-decimals';
import { outOfOneHundred } from './grade5/u3/m1-out-of-one-hundred';
import { threeWaysToWrite } from './grade5/u3/m2-three-ways-to-write';
import { percentOfANumber } from './grade5/u3/m3-percent-of-a-number';
import { discountAndPrice } from './grade5/u3/m4-discount-and-price';
import { compareWithPercent } from './grade5/u3/m5-compare-with-percent';
import { twoDigitsTimesTwo } from './grade5/u4/m1-two-digits-times-two';
import { divideByTwoDigits } from './grade5/u4/m2-divide-by-two-digits';
import { whatIsLeftOver } from './grade5/u4/m3-what-is-left-over';
import { squareNumbers } from './grade5/u4/m4-square-numbers';
import { squareRoots } from './grade5/u4/m5-square-roots';
import { whichStepFirst } from './grade5/u4/m6-which-step-first';
import { countTheCubes } from './grade5/u5/m1-count-the-cubes';
import { lengthTimesWidth } from './grade5/u5/m2-length-times-width';
import { whichBoxHoldsMore } from './grade5/u5/m3-which-box-holds-more';
import { changeTheLengthUnit } from './grade5/u5/m4-change-the-length-unit';
import { gramsAndMillilitres } from './grade5/u5/m5-grams-and-millilitres';
import { pickTheRightUnit } from './grade5/u5/m6-pick-the-right-unit';
import { openItFlat } from './grade5/u6/m1-open-it-flat';
import { foldItUp } from './grade5/u6/m2-fold-it-up';
import { manyNetsOneSolid } from './grade5/u6/m3-many-nets-one-solid';
import { facesEdgesCorners } from './grade5/u6/m4-faces-edges-corners';
import { isItANet } from './grade5/u6/m5-is-it-a-net';
import { howFastIsIt } from './grade5/u7/m1-how-fast-is-it';
import { howFarDidItGo } from './grade5/u7/m2-how-far-did-it-go';
import { howLongDidItTake } from './grade5/u7/m3-how-long-did-it-take';
import { readTheData } from './grade5/u7/m4-read-the-data';

// ---- Grade 6
import { belowZero } from './grade6/u1/m1-below-zero';
import { leftOfZero } from './grade6/u1/m2-left-of-zero';
import { colderOrWarmer } from './grade6/u1/m3-colder-or-warmer';
import { addAcrossZero } from './grade6/u1/m4-add-across-zero';
import { takeAwayAcrossZero } from './grade6/u1/m5-take-away-across-zero';
import { howFarFromZero } from './grade6/u1/m6-how-far-from-zero';
import { whatIsARatio } from './grade6/u2/m1-what-is-a-ratio';
import { simplestRatio } from './grade6/u2/m2-simplest-ratio';
import { equalRatios } from './grade6/u2/m3-equal-ratios';
import { shareByRatio } from './grade6/u2/m4-share-by-ratio';
import { mapScale } from './grade6/u2/m5-map-scale';
import { moreMeansMore } from './grade6/u2/m6-more-means-more';
import { moreMeansLess } from './grade6/u2/m7-more-means-less';
import { letterForANumber } from './grade6/u3/m1-letter-for-a-number';
import { writeWithALetter } from './grade6/u3/m2-write-with-a-letter';
import { findTheValue } from './grade6/u3/m3-find-the-value';
import { undoPlusAndMinus } from './grade6/u3/m4-undo-plus-and-minus';
import { undoTimesAndDivide } from './grade6/u3/m5-undo-times-and-divide';
import { followTheRule } from './grade6/u3/m6-follow-the-rule';
import { radiusAndDiameter } from './grade6/u4/m1-radius-and-diameter';
import { meetPi } from './grade6/u4/m2-meet-pi';
import { aroundACircle } from './grade6/u4/m3-around-a-circle';
import { insideACircle } from './grade6/u4/m4-inside-a-circle';
import { aroundOrInside } from './grade6/u4/m5-around-or-inside';
import { boxesAndCubes } from './grade6/u5/m1-boxes-and-cubes';
import { addEveryFace } from './grade6/u5/m2-add-every-face';
import { sixEqualFaces } from './grade6/u5/m3-six-equal-faces';
import { volumeOrSurface } from './grade6/u5/m4-volume-or-surface';
import { fillOrCover } from './grade6/u5/m5-fill-or-cover';
import { rightThenUp } from './grade6/u6/m1-right-then-up';
import { sayThePair } from './grade6/u6/m2-say-the-pair';
import { allFourQuadrants } from './grade6/u6/m3-all-four-quadrants';
import { shapesOnTheGrid } from './grade6/u6/m4-shapes-on-the-grid';
import { meanAgain } from './grade6/u7/m1-mean-again';
import { theMiddleValue } from './grade6/u7/m2-the-middle-value';
import { mostOften } from './grade6/u7/m3-most-often';
import { pickTheRightOne } from './grade6/u7/m4-pick-the-right-one';
import { chanceAsANumber } from './grade6/u7/m5-chance-as-a-number';
import { tryItManyTimes } from './grade6/u7/m6-try-it-many-times';

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
  // Unit 4 — Add & Subtract within 20 (#24–29)
  addTen,
  doubles,
  nearDoubles,
  makeTenToAdd,
  addWithin20,
  subtractWithin20,
  // jeda bentuk & pecahan (#30–31)
  makeNewShapes,
  halvesAndFourths,
  // Unit 5 — Numbers to 100 (#32–37)
  countTo50,
  countTo100,
  skipCount,
  tensAndOnesTo100,
  compareTwoDigit,
  tenMoreTenLess,
  // posisi & berat (#38–39)
  whereIsIt,
  heavyAndLight,
  // waktu & uang (#40–41)
  tellTheTime,
  money,
  // data (#42–43) — Grade 1 selesai
  tallyMarks,
  pictureGraph,

  // ===== Grade 2 =====
  // Unit 1 — Numbers to 1000
  hundreds,
  countTo1000,
  hundredsTensOnes,
  readAndWrite1000,
  compareTo1000,
  nearestTen,
  // Unit 2 — Add & Subtract 2-Digit
  addTens,
  addNoRegroup,
  bridgeToTen,
  addWithRegrouping,
  subtractNoRegroup,
  subtractWithRegrouping,
  checkYourAnswer,
  // Unit 3 — Mental Math
  tenMoreLess100,
  hundredMoreLess,
  nearTens,
  doublesTo100,
  countOnAndBack,
  // Unit 4 — Meet Multiplication
  equalGroups,
  arrays,
  timesTwo,
  timesFive,
  timesTen,
  timesCheck,
  // Unit 5 — Even, Odd and Patterns
  evenAndOdd,
  skipCount100,
  growingPatterns,
  numberPatterns,
  // Unit 6 — Measure with Real Units
  centimetres,
  metres,
  gramsAndKilograms,
  compareMeasures,
  estimateLength,
  // Unit 7 — Time, Money and Data
  timeToFive,
  quarterPastAndTo,
  moneyTo20000,
  change,
  barChart,

  // ===== Grade 3 =====
  // Unit 1 — Numbers to 10.000
  thousands,
  numbersTo10000,
  compareTo10000,
  nearestHundred,
  numberLine10000,
  // Unit 2 — Times Tables
  timesThree,
  timesFour,
  turnAroundFacts,
  timesSix,
  timesSeven,
  timesEight,
  timesNine,
  timesTableCheck,
  // Unit 3 — Division
  shareEqually,
  makeGroups,
  divideBy2510,
  divideBy34,
  timesAndDivide,
  leftOver,
  // Unit 4 — Add & Subtract to 1000
  addHundreds,
  add3Digit,
  addAndRegroup,
  subtract3Digit,
  subtractAndRegroup,
  // Unit 5 — Fractions
  equalParts,
  nameTheFraction,
  partsOnALine,
  compareFractions,
  equalFractions,
  fractionOfANumber,
  // Unit 6 — Shapes & Perimeter
  sidesAndCorners,
  squareCorners,
  perimeter,
  missingSide,
  samePerimeter,
  // Unit 7 — Time, Data & Money
  timeToTheMinute,
  howLong,
  moneyTo100000,
  shopping,
  graphsThatCount,

  // ===== Grade 4 =====
  // Unit 1 — Big Numbers
  tenThousands,
  numbersTo1000000,
  readBigNumbers,
  compareBigNumbers,
  nearestThousand,
  // Unit 2 — Multiply & Divide Bigger
  timesTenAndHundred,
  splitToMultiply,
  twoDigitsTimesOne,
  threeDigitsTimesOne,
  divideTensFirst,
  divideWithRemainder,
  longDivisionStart,
  // Unit 3 — Factors & Multiples
  findTheFactors,
  countTheMultiples,
  dividesExactly,
  primeOrNot,
  commonFactors,
  commonMultiples,
  // Unit 4 — Equivalent Fractions
  sameSizeFractions,
  multiplyBothParts,
  divideBothParts,
  simplestForm,
  compareTwoFractions,
  addAndTakeAway,
  mixedNumbers,
  // Unit 5 — Decimals Begin
  tenths,
  writeADecimal,
  hundredths,
  tenthsOnALine,
  compareDecimals,
  // Unit 6 — Angles & Area
  meetAngles,
  acuteAndObtuse,
  measureAngles,
  coverAndCount,
  areaOfARectangle,
  areaOrPerimeter,
  // Unit 7 — Data
  readABarChart,
  frequencyTable,
  compareTheData,
  findTheMean,

  // ===== Grade 5 =====
  // Unit 1 — Fraction Operations
  makeBottomsMatch,
  addUnlikeBottoms,
  findACommonBottom,
  mixedNumberSums,
  fractionTimesWhole,
  fractionTimesFraction,
  divideByAFraction,
  tidyUpTheAnswer,
  // Unit 2 — Decimals
  lineUpThePoints,
  timesAWholeNumber,
  decimalTimesDecimal,
  divideDecimals,
  fractionsAndDecimals,
  roundDecimals,
  // Unit 3 — Percent
  outOfOneHundred,
  threeWaysToWrite,
  percentOfANumber,
  discountAndPrice,
  compareWithPercent,
  // Unit 4 — Multiply & Divide Fluently
  twoDigitsTimesTwo,
  divideByTwoDigits,
  whatIsLeftOver,
  squareNumbers,
  squareRoots,
  whichStepFirst,
  // Unit 5 — Volume & Measurement
  countTheCubes,
  lengthTimesWidth,
  whichBoxHoldsMore,
  changeTheLengthUnit,
  gramsAndMillilitres,
  pickTheRightUnit,
  // Unit 6 — Shapes in Space
  openItFlat,
  foldItUp,
  manyNetsOneSolid,
  facesEdgesCorners,
  isItANet,
  // Unit 7 — Data & Speed
  howFastIsIt,
  howFarDidItGo,
  howLongDidItTake,
  readTheData,

  // ================= Grade 6 =================
  // Unit 1 — Integers
  belowZero,
  leftOfZero,
  colderOrWarmer,
  addAcrossZero,
  takeAwayAcrossZero,
  howFarFromZero,
  // Unit 2 — Ratio & Proportion
  whatIsARatio,
  simplestRatio,
  equalRatios,
  shareByRatio,
  mapScale,
  moreMeansMore,
  moreMeansLess,
  // Unit 3 — Algebra Begins
  letterForANumber,
  writeWithALetter,
  findTheValue,
  undoPlusAndMinus,
  undoTimesAndDivide,
  followTheRule,
  // Unit 4 — Circles
  radiusAndDiameter,
  meetPi,
  aroundACircle,
  insideACircle,
  aroundOrInside,
  // Unit 5 — Solids
  boxesAndCubes,
  addEveryFace,
  sixEqualFaces,
  volumeOrSurface,
  fillOrCover,
  // Unit 6 — Coordinates
  rightThenUp,
  sayThePair,
  allFourQuadrants,
  shapesOnTheGrid,
  // Unit 7 — Statistics & Chance
  meanAgain,
  theMiddleValue,
  mostOften,
  pickTheRightOne,
  chanceAsANumber,
  tryItManyTimes,
];

export const modules: Record<string, ContentModule> = Object.fromEntries(
  all.map((m) => [m.id, m]),
);

export const pathOrder: string[] = all.map((m) => m.id);

export const registry: Registry = { modules, pathOrder };

/** Kelas yang benar-benar punya konten. Jangan pernah menawarkan kelas kosong. */
export const availableGrades: number[] = [...new Set(all.map((m) => m.grade))].sort();

export function pathOrderFor(grade: number): string[] {
  return all.filter((m) => m.grade === grade).map((m) => m.id);
}

/**
 * Registry yang hanya memuat satu kelas. Gating dihitung di dalam kelas itu saja,
 * sehingga anak kelas 2 tidak perlu menempuh seluruh Grade 1 lebih dulu.
 */
export function registryFor(grade: number): Registry {
  const ids = pathOrderFor(grade);
  return {
    modules: Object.fromEntries(ids.map((id) => [id, modules[id] as ContentModule])),
    pathOrder: ids,
  };
}

export function unitModules(unitId: string): ContentModule[] {
  return all.filter((m) => m.unitId === unitId);
}

/**
 * Modul semu yang menggabungkan seluruh aturan soal satu unit, dipakai untuk
 * "lompati satu unit". Dibuat sebagai ModuleDef biasa supaya seluruh mesin yang
 * sudah ada — generator, sesi, evaluator — bisa dipakai apa adanya.
 *
 * Kecepatan sengaja tidak dinilai: yang diuji adalah apakah anak menguasai isi
 * unitnya, bukan seberapa cepat dia.
 */
export function unitTestDef(unitId: string): ContentModule {
  const mods = unitModules(unitId);
  const first = mods[0];
  if (!first) throw new Error(`Unit tidak ada: ${unitId}`);
  const rules = mods.flatMap((m) => m.rules.slice(0, 1));
  return {
    ...first,
    id: `unit:${unitId}`,
    title: unitTitles[unitId]?.title.split('·')[1]?.trim() ?? unitId,
    prereq: [],
    kind: 'application',
    fluencyTracked: false,
    masteryOverride: undefined,
    skills: [...new Set(mods.flatMap((m) => m.skills))],
    visuals: [...new Set(mods.flatMap((m) => m.visuals))],
    vocab: [],
    learn: [],
    // Satu aturan pertama dari tiap modul: cakupannya merata ke seluruh unit,
    // bukan menumpuk di modul yang aturannya paling banyak.
    rules,
    /**
     * Diturunkan dari `rules` DI ATAS, bukan dari gabungan questionTypes seluruh
     * modul. Versi pertama memakai gabungan itu, sehingga tes unit menuntut cakupan
     * atas tipe soal yang tidak punya satu pun aturan untuk memunculkannya — syarat
     * yang mustahil dipenuhi. Akibatnya 41 dari 43 tes unit TIDAK PERNAH bisa lulus
     * meski anak menjawab 100% benar. Lolos dari test karena `flow.test.ts` hanya
     * menguji `g1-u1`, satu dari dua unit yang kebetulan tidak kena.
     */
    questionTypes: [...new Set(rules.map((r) => r.type))],
  };
}

export function moduleById(id: string): ContentModule {
  const m = modules[id];
  if (!m) throw new Error(`Modul tidak terdaftar: ${id}`);
  return m;
}

export const unitTitles: Record<string, { title: string; color: string }> = {
  'g1-u1': { title: 'Unit 1 · Numbers to 10', color: 'var(--c-unit-1)' },
  'g1-u2': { title: 'Unit 2 · Add and Subtract', color: 'var(--c-unit-2)' },
  'g1-u3': { title: 'Unit 3 · Numbers to 20', color: 'var(--c-unit-3)' },
  'g1-u4': { title: 'Unit 4 · Add & Subtract to 20', color: 'var(--c-unit-4)' },
  'g1-u5': { title: 'Unit 5 · Numbers to 100', color: 'var(--c-unit-5)' },
  'g1-u6': { title: 'Unit 6 · Shapes', color: 'var(--c-unit-6)' },
  'g1-u7': { title: 'Unit 7 · Measure & Time', color: 'var(--c-unit-7)' },
  'g1-u8': { title: 'Unit 8 · Patterns & Data', color: 'var(--c-unit-8)' },
  'g2-u1': { title: 'Unit 1 · Numbers to 1000', color: 'var(--c-unit-1)' },
  'g2-u2': { title: 'Unit 2 · Add & Subtract', color: 'var(--c-unit-2)' },
  'g2-u3': { title: 'Unit 3 · Mental Math', color: 'var(--c-unit-3)' },
  'g2-u4': { title: 'Unit 4 · Meet Multiplication', color: 'var(--c-unit-4)' },
  'g2-u5': { title: 'Unit 5 · Even, Odd & Patterns', color: 'var(--c-unit-5)' },
  'g2-u6': { title: 'Unit 6 · Measure', color: 'var(--c-unit-6)' },
  'g2-u7': { title: 'Unit 7 · Time, Money & Data', color: 'var(--c-unit-7)' },
  'g3-u1': { title: 'Unit 1 · Numbers to 10.000', color: 'var(--c-unit-1)' },
  'g3-u2': { title: 'Unit 2 · Times Tables', color: 'var(--c-unit-2)' },
  'g3-u3': { title: 'Unit 3 · Division', color: 'var(--c-unit-3)' },
  'g3-u4': { title: 'Unit 4 · Add & Subtract to 1000', color: 'var(--c-unit-4)' },
  'g3-u5': { title: 'Unit 5 · Fractions', color: 'var(--c-unit-5)' },
  'g3-u6': { title: 'Unit 6 · Shapes & Perimeter', color: 'var(--c-unit-6)' },
  'g3-u7': { title: 'Unit 7 · Time, Money & Data', color: 'var(--c-unit-7)' },
  'g4-u1': { title: 'Unit 1 · Big Numbers', color: 'var(--c-unit-1)' },
  'g4-u2': { title: 'Unit 2 · Multiply & Divide Bigger', color: 'var(--c-unit-2)' },
  'g4-u3': { title: 'Unit 3 · Factors & Multiples', color: 'var(--c-unit-3)' },
  'g4-u4': { title: 'Unit 4 · Equivalent Fractions', color: 'var(--c-unit-4)' },
  'g4-u5': { title: 'Unit 5 · Decimals Begin', color: 'var(--c-unit-5)' },
  'g4-u6': { title: 'Unit 6 · Angles & Area', color: 'var(--c-unit-6)' },
  'g4-u7': { title: 'Unit 7 · Data', color: 'var(--c-unit-7)' },
  'g5-u1': { title: 'Unit 1 · Fraction Operations', color: 'var(--c-unit-1)' },
  'g5-u2': { title: 'Unit 2 · Decimals', color: 'var(--c-unit-2)' },
  'g5-u3': { title: 'Unit 3 · Percent', color: 'var(--c-unit-3)' },
  'g5-u4': { title: 'Unit 4 · Multiply & Divide Fluently', color: 'var(--c-unit-4)' },
  'g5-u5': { title: 'Unit 5 · Volume & Measurement', color: 'var(--c-unit-5)' },
  'g5-u6': { title: 'Unit 6 · Shapes in Space', color: 'var(--c-unit-6)' },
  'g5-u7': { title: 'Unit 7 · Data & Speed', color: 'var(--c-unit-7)' },
  'g6-u1': { title: 'Unit 1 · Integers', color: 'var(--c-unit-1)' },
  'g6-u2': { title: 'Unit 2 · Ratio & Proportion', color: 'var(--c-unit-2)' },
  'g6-u3': { title: 'Unit 3 · Algebra Begins', color: 'var(--c-unit-3)' },
  'g6-u4': { title: 'Unit 4 · Circles', color: 'var(--c-unit-4)' },
  'g6-u5': { title: 'Unit 5 · Solids', color: 'var(--c-unit-5)' },
  'g6-u6': { title: 'Unit 6 · Coordinates', color: 'var(--c-unit-6)' },
  'g6-u7': { title: 'Unit 7 · Statistics & Chance', color: 'var(--c-unit-7)' },
};
