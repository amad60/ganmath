/**
 * SELURUH teks yang dilihat anak ada di sini. Menambah Bahasa Indonesia nanti =
 * menambah satu file, bukan menyisir komponen (docs/tech/implementation-plan.md, risiko bahasa).
 * Aturan: kalimat pendek, 3–8 kata, kosakata dasar.
 */
export const en = {
  appName: 'GanMath',

  step: {
    learn: 'Learn',
    practice: 'Practice',
    quiz: 'Mastery Check',
    speed: 'Speed Round',
    review: 'Quick Review',
    done: 'Done',
  },

  map: {
    startNext: 'Start',
    skipAhead: 'I already know this',
    nextUp: 'Next up',
    lockedHint: 'Finish the one before to open this',
    installYes: 'Add to home screen',
    later: 'Later',
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
    testout: 'Skip Check',
    speed: 'Speed Round',
    master: 'Master Round',
    showMe: 'Look at the picture.',
    pickOnLine: 'Tap the line first',
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
    almost: 'Almost! Just be a bit quicker.',
    oneMore: 'One more good round to master this.',
    keepPractising: 'Practise this one more time.',
    newBadge: 'New badge!',
    speedRound: 'Try a Speed Round',
    nextIs: (label: string, title: string) => `${label}: ${title}`,
    nextModule: (title: string) => `Next: ${title}`,
    backToMap: 'Back to the map',
    allDone: 'Grade finished!',
    reteach: 'Let us look at it again.',
    testedOut: 'Skipped — you already knew it!',
    testoutFailed: 'Let us learn this one properly.',
    moduleProgress: 'Module',
  },

  common: {
    close: 'Close',
    back: 'Back',
    seconds: (s: number) => `${s.toFixed(1)}s`,
  },
} as const;
