import type { ModuleDef, ModuleState, QuestionResult, SessionKind, SessionResult } from './types';
import { emptyModuleState } from './types';

/** Modul contoh untuk test: penjumlahan dalam 10, bertipe fact. */
export function addModule(over: Partial<ModuleDef> = {}): ModuleDef {
  return {
    id: 'g1-u2-m5',
    unitId: 'g1-u2',
    grade: 1,
    title: 'Add to 10',
    icon: '➕',
    prereq: ['g1-u2-m4'],
    skills: ['add-within-10'],
    kind: 'fact',
    fluencyTracked: true,
    questionTypes: ['choose-number', 'keypad'],
    visuals: ['ten-frame'],
    vocab: [],
    rules: [
      {
        type: 'choose-number',
        skill: 'add-within-10',
        params: { a: [1, 9], b: [1, 9] },
        answer: (p) => (p.a as number) + (p.b as number),
        text: (p) => `${p.a} + ${p.b} = ?`,
        exclude: (p) => (p.a as number) + (p.b as number) > 10,
        distractors: 'near',
        // miskonsepsi khas: anak mengurangi, bukan menjumlahkan
        misconception: (p) => Math.abs((p.a as number) - (p.b as number)),
      },
      {
        type: 'keypad',
        skill: 'add-within-10',
        params: { a: [1, 5], b: [1, 5] },
        answer: (p) => (p.a as number) + (p.b as number),
        text: (p) => `${p.a} + ${p.b} = ?`,
      },
    ],
    ...over,
  };
}

export function state(over: Partial<ModuleState> = {}): ModuleState {
  return { ...emptyModuleState(), ...over };
}

export function session(
  opts: {
    kind?: SessionKind;
    date?: string;
    n?: number;
    correct?: number;
    thinkMs?: number;
    totalMs?: number;
    types?: QuestionResult['type'][];
    hintUsed?: boolean;
    moduleId?: string;
  } = {},
): SessionResult {
  const {
    kind = 'quiz',
    date = '2026-09-08',
    n = 10,
    correct = 10,
    thinkMs = 2000,
    totalMs = 3000,
    types = ['choose-number', 'keypad'],
    hintUsed = false,
    moduleId = 'g1-u2-m5',
  } = opts;

  const questions: QuestionResult[] = Array.from({ length: n }, (_, i) => ({
    questionId: `q${i}`,
    type: types[i % types.length] as QuestionResult['type'],
    skill: 'add-within-10',
    correct: i < correct,
    thinkMs,
    totalMs,
    retried: false,
    hintUsed,
  }));

  return { sessionId: `s-${date}-${kind}`, moduleId, kind, date, questions };
}
