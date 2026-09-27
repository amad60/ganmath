import type { MascotMood } from '../mascot/Mascot';

export type UnitIntroDef = {
  unitId: string;
  grade: number;
  title: string;
  subtitle: string;
  concept: string;
  mascotMood: MascotMood;
  accentColor: string;
};

export const GRADE_1_INTROS: Record<string, UnitIntroDef> = {
  'g1-u1': {
    unitId: 'g1-u1',
    grade: 1,
    title: 'Unit 1 · Numbers to 10',
    subtitle: 'Counting & Subitizing',
    concept: 'Tap and count things one by one up to ten!',
    mascotMood: 'happy',
    accentColor: 'var(--c-unit-1)',
  },
  'g1-u2': {
    unitId: 'g1-u2',
    grade: 1,
    title: 'Unit 2 · Add & Subtract',
    subtitle: 'Putting Together & Taking Away',
    concept: 'Join two groups together to make more, or take some away!',
    mascotMood: 'celebrate',
    accentColor: 'var(--c-unit-2)',
  },
  'g1-u3': {
    unitId: 'g1-u3',
    grade: 1,
    title: 'Unit 3 · Numbers to 20',
    subtitle: 'Teen Numbers',
    concept: 'One full ten plus extra ones make teen numbers!',
    mascotMood: 'thinking',
    accentColor: 'var(--c-unit-3)',
  },
  'g1-u4': {
    unitId: 'g1-u4',
    grade: 1,
    title: 'Unit 4 · Add & Subtract to 20',
    subtitle: 'Bridging Through 10',
    concept: 'Make a ten first, then jump the rest of the way!',
    mascotMood: 'encourage',
    accentColor: 'var(--c-unit-4)',
  },
  'g1-u5': {
    unitId: 'g1-u5',
    grade: 1,
    title: 'Unit 5 · Numbers to 100',
    subtitle: 'Tens & Big Numbers',
    concept: 'Group tens together to count all the way to one hundred!',
    mascotMood: 'happy',
    accentColor: 'var(--c-unit-5)',
  },
  'g1-u6': {
    unitId: 'g1-u6',
    grade: 1,
    title: 'Unit 6 · Shapes',
    subtitle: 'Flat & Solid Shapes',
    concept: 'Look at sides and corners to spot triangles, squares, and circles!',
    mascotMood: 'thinking',
    accentColor: 'var(--c-unit-6)',
  },
  'g1-u7': {
    unitId: 'g1-u7',
    grade: 1,
    title: 'Unit 7 · Measure & Time',
    subtitle: 'Clocks, Length & Money',
    concept: 'Tick-tock on the clock, compare lengths, and count coins!',
    mascotMood: 'celebrate',
    accentColor: 'var(--c-unit-7)',
  },
  'g1-u8': {
    unitId: 'g1-u8',
    grade: 1,
    title: 'Unit 8 · Patterns & Data',
    subtitle: 'Repeating Patterns & Charts',
    concept: 'Spot what repeats next and count tally marks in graphs!',
    mascotMood: 'encourage',
    accentColor: 'var(--c-unit-8)',
  },
};

export const GRADE_2_INTROS: Record<string, UnitIntroDef> = {
  'g2-u1': {
    unitId: 'g2-u1',
    grade: 2,
    title: 'Unit 1 · Numbers to 1000',
    subtitle: 'Hundreds, Tens & Ones',
    concept: 'Ten hundreds make a thousand! Read and round 3-digit numbers.',
    mascotMood: 'happy',
    accentColor: 'var(--c-unit-1)',
  },
  'g2-u2': {
    unitId: 'g2-u2',
    grade: 2,
    title: 'Unit 2 · Add & Subtract',
    subtitle: 'Written Column Methods & Regrouping',
    concept: 'Add ones first, then add tens! Open a ten when you need more ones.',
    mascotMood: 'celebrate',
    accentColor: 'var(--c-unit-2)',
  },
  'g2-u3': {
    unitId: 'g2-u3',
    grade: 2,
    title: 'Unit 3 · Mental Math',
    subtitle: 'Quick Tricks & Near Tens',
    concept: 'Jump 10 or 100 fast in your head, and double numbers in a flash!',
    mascotMood: 'thinking',
    accentColor: 'var(--c-unit-3)',
  },
  'g2-u4': {
    unitId: 'g2-u4',
    grade: 2,
    title: 'Unit 4 · Meet Multiplication',
    subtitle: 'Equal Groups & Times Tables',
    concept: 'Rows and groups of the same size! Master ×2, ×5, and ×10.',
    mascotMood: 'celebrate',
    accentColor: 'var(--c-unit-4)',
  },
  'g2-u5': {
    unitId: 'g2-u5',
    grade: 2,
    title: 'Unit 5 · Even, Odd & Patterns',
    subtitle: 'Pairs & Growing Patterns',
    concept: 'Fair pairs are even! Spot growing steps on the hundreds chart.',
    mascotMood: 'encourage',
    accentColor: 'var(--c-unit-5)',
  },
  'g2-u6': {
    unitId: 'g2-u6',
    grade: 2,
    title: 'Unit 6 · Measure',
    subtitle: 'Centimetres, Metres, Grams & Kilos',
    concept: 'Line up from zero with your ruler, and weigh items in grams and kg!',
    mascotMood: 'thinking',
    accentColor: 'var(--c-unit-6)',
  },
  'g2-u7': {
    unitId: 'g2-u7',
    grade: 2,
    title: 'Unit 7 · Time, Money & Data',
    subtitle: 'Quarter Hours, Rupiah & Bar Charts',
    concept: 'Read quarter past and quarter to, give change, and read bar graphs!',
    mascotMood: 'celebrate',
    accentColor: 'var(--c-unit-7)',
  },
};

export const GRADE_3_INTROS: Record<string, UnitIntroDef> = {
  'g3-u1': {
    unitId: 'g3-u1',
    grade: 3,
    title: 'Unit 1 · Numbers to 10.000',
    subtitle: 'Thousands & Rounding',
    concept: 'Ten thousands line up on the big number line! Round to nearest hundred.',
    mascotMood: 'happy',
    accentColor: 'var(--c-unit-1)',
  },
  'g3-u2': {
    unitId: 'g3-u2',
    grade: 3,
    title: 'Unit 2 · Times Tables',
    subtitle: '×3, ×4, ×6, ×7, ×8, ×9',
    concept: 'Turn-around facts make multiplication twice as easy! 6 × 7 = 7 × 6.',
    mascotMood: 'celebrate',
    accentColor: 'var(--c-unit-2)',
  },
  'g3-u3': {
    unitId: 'g3-u3',
    grade: 3,
    title: 'Unit 3 · Division',
    subtitle: 'Sharing & Equal Groups',
    concept: 'Share equally into piles or count how many fit! Spot the leftovers.',
    mascotMood: 'thinking',
    accentColor: 'var(--c-unit-3)',
  },
  'g3-u4': {
    unitId: 'g3-u4',
    grade: 3,
    title: 'Unit 4 · Add & Subtract to 1000',
    subtitle: '3-Digit Regrouping',
    concept: 'Three columns! Add ones, tens, then hundreds with carrying.',
    mascotMood: 'encourage',
    accentColor: 'var(--c-unit-4)',
  },
  'g3-u5': {
    unitId: 'g3-u5',
    grade: 3,
    title: 'Unit 5 · Fractions',
    subtitle: 'Halves, Thirds, Fourths & Beyond',
    concept: 'Equal slices of the whole! Find fractions on the number line.',
    mascotMood: 'happy',
    accentColor: 'var(--c-unit-5)',
  },
  'g3-u6': {
    unitId: 'g3-u6',
    grade: 3,
    title: 'Unit 6 · Shapes & Perimeter',
    subtitle: 'Square Corners & Walking Around',
    concept: 'Measure all sides and add them up to find the perimeter around the fence!',
    mascotMood: 'thinking',
    accentColor: 'var(--c-unit-6)',
  },
  'g3-u7': {
    unitId: 'g3-u7',
    grade: 3,
    title: 'Unit 7 · Time, Money & Data',
    subtitle: 'To the Minute, Shopping & Bar Graphs',
    concept: 'Tell time to the exact minute and count money up to Rp 100.000!',
    mascotMood: 'celebrate',
    accentColor: 'var(--c-unit-7)',
  },
};

export const ALL_UNIT_INTROS: Record<string, UnitIntroDef> = {
  ...GRADE_1_INTROS,
  ...GRADE_2_INTROS,
  ...GRADE_3_INTROS,
};

export function getUnitIntro(unitId: string): UnitIntroDef | null {
  return ALL_UNIT_INTROS[unitId] ?? null;
}
