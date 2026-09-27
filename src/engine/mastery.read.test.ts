import { describe, expect, it } from 'vitest';
import { evaluate } from './mastery';
import { whoIsInTheStory } from '../content/readGrade1/r1-u1-m1';
import { emptyModuleState, type SessionResult } from './types';

describe('Mastery Engine — evaluasi sesi Read', () => {
  it('latihan read yang dijawab benar menaikkan status menjadi learning tanpa crash', () => {
    const sessionRes: SessionResult = {
      sessionId: 'sess-read-1',
      moduleId: 'r1-u1-m1',
      kind: 'practice',
      date: '2026-09-27',
      questions: Array.from({ length: 8 }, (_, i) => ({
        questionId: `q-${i}`,
        type: 'clue-tap',
        skill: 'read-who',
        story: false,
        correct: true,
        thinkMs: 2500,
        totalMs: 3500,
        retried: false,
        hintUsed: false,
      })),
    };

    const outcome = evaluate(whoIsInTheStory, emptyModuleState(), sessionRes);
    expect(outcome.next.status).toBe('learning');
  });

  it('mastery check kuis sempurna dengan kedua tipe soal meluluskan modul Read menjadi mastered dengan 2 bintang', () => {
    const sessionRes: SessionResult = {
      sessionId: 'sess-read-quiz',
      moduleId: 'r1-u1-m1',
      kind: 'quiz',
      date: '2026-09-27',
      questions: [
        ...Array.from({ length: 5 }, (_, i) => ({
          questionId: `q-clue-${i}`,
          type: 'clue-tap' as const,
          skill: 'read-who',
          story: false,
          correct: true,
          thinkMs: 3000,
          totalMs: 4000,
          retried: false,
          hintUsed: false,
        })),
        ...Array.from({ length: 5 }, (_, i) => ({
          questionId: `q-choice-${i}`,
          type: 'choose-text' as const,
          skill: 'read-who',
          story: false,
          correct: true,
          thinkMs: 2800,
          totalMs: 3800,
          retried: false,
          hintUsed: false,
        })),
      ],
    };

    const outcome = evaluate(whoIsInTheStory, emptyModuleState(), sessionRes);
    expect(outcome.next.status).toBe('mastered');
    expect(outcome.next.stars).toBe(2);
  });
});
