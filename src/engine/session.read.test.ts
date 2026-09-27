import { describe, expect, it } from 'vitest';
import { createSession, currentQuestion, submitAnswer } from './session';
import { whoIsInTheStory } from '../content/readGrade1/r1-u1-m1';
import { mainIdeaSummary } from '../content/readGrade2/r2-u1-m1';
import { howToFollowSteps } from '../content/readGrade3/r3-u1-m1';

describe('Read Sessions — sesi modul literasi pemahaman teks', () => {
  it('dapat membuat sesi practice untuk modul Read Grade 1', () => {
    const s = createSession(whoIsInTheStory, 'practice', 12345, 1_000_000);
    expect(s.pending.length).toBeGreaterThanOrEqual(8);
    const firstQ = currentQuestion(s);
    expect(firstQ).toBeTruthy();
    expect(['clue-tap', 'choose-text']).toContain(firstQ?.type);
  });

  it('dapat membuat sesi practice untuk modul Read Grade 2 dan 3', () => {
    const s2 = createSession(mainIdeaSummary, 'practice', 54321, 1_000_000);
    expect(s2.pending.length).toBeGreaterThanOrEqual(8);

    const s3 = createSession(howToFollowSteps, 'practice', 67890, 1_000_000);
    expect(s3.pending.length).toBeGreaterThanOrEqual(8);
  });

  it('dapat menjawab soal clue-tap di sesi Read', () => {
    let s = createSession(whoIsInTheStory, 'practice', 12345, 1_000_000);
    const q = currentQuestion(s);
    expect(q).toBeTruthy();

    s = submitAnswer(s, {
      correct: true,
      thinkMs: 2500,
      totalMs: 3500,
      hintUsed: false,
      nowMs: 1_003_500,
    });

    expect(s.results.length).toBe(1);
    expect(s.results[0]?.correct).toBe(true);
  });
});
