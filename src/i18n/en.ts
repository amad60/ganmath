/**
 * SELURUH teks yang dilihat anak ada di sini. Menambah Bahasa Indonesia nanti =
 * menambah satu file, bukan menyisir komponen (docs/tech/implementation-plan.md, risiko bahasa).
 * Aturan: kalimat pendek, 3–8 kata, kosakata dasar.
 */
export const en = {
  appName: 'GanMath',

  map: {
    startNext: 'Start',
    locked: 'Locked',
    review: 'Review',
    allDone: 'All done for now!',
    gradeProgress: (done: number, total: number) => `${done}/${total}`,
  },

  learn: {
    next: 'Next',
    start: 'Start practice',
    stepOf: (i: number, n: number) => `Step ${i} of ${n}`,
    tapToContinue: 'Do it to continue.',
  },

  question: {
    hint: 'Hint',
    check: 'Check',
    correct: 'Yes!',
    retry: 'Try again',
    masteryCheck: 'Mastery Check',
    practice: 'Practice',
    review: 'Quick Review',
    speed: 'Speed Round',
    master: 'Master Round',
    showMe: 'Look at the picture.',
  },

  result: {
    niceWork: 'Nice work!',
    keepGoing: 'Keep going!',
    correct: 'Correct',
    speed: 'Speed',
    xp: 'XP',
    continue: 'Continue',
    tryAgain: 'Try again',
    mastered: 'Module mastered!',
    almost: 'Almost! One more good round.',
    speedRound: 'Try a Speed Round',
    moduleProgress: 'Module',
  },

  common: {
    close: 'Close',
    back: 'Back',
    seconds: (s: number) => `${s.toFixed(1)}s`,
  },
} as const;
