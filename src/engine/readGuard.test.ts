import { describe, expect, it } from 'vitest';
import { generateSet } from './generator';
import { mulberry32 } from './rng';
import { createSession, currentQuestion, submitAnswer } from './session';
import { mysteryClues } from '../content/readGrade1/r1-u4-m1';
import { readModulesList } from '../content/readIndex';

describe('Read tidak bisa diluluskan dengan mengetuk posisi', () => {
  it('mengacak urutan kalimat dan tetap menunjuk kalimat petunjuk yang sama', () => {
    const indexes = new Set<number>();
    for (let seed = 1; seed <= 40; seed++) {
      const { questions } = generateSet(mysteryClues, 12, mulberry32(seed));
      for (const q of questions) {
        if (q.type !== 'clue-tap' || q.visual?.kind !== 'evidence-text') continue;
        indexes.add(q.answer);
        if (q.visual.title === 'Cold Weather') {
          expect(q.visual.sentences[q.answer]).toBe('Snow covered the ground in white ice.');
        }
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.visual.sentences.length);
      }
    }
    expect(indexes.size).toBeGreaterThan(1);
  });

  it('soal baca yang salah tidak kembali di sesi yang sama', () => {
    const session = createSession(mysteryClues, 'practice', 7, 1_000);
    const q = currentQuestion(session);
    expect(q).toBeTruthy();
    const next = submitAnswer(session, {
      correct: false,
      thinkMs: 400,
      totalMs: 800,
      hintUsed: false,
      nowMs: 2_000,
    });
    expect(next.requeue).toEqual([]);
    expect(next.pending.some((item) => item.question.id === q?.id)).toBe(false);
    expect(next.results[0]?.correct).toBe(false);
  });

  it('setiap modul Read baru bisa menghasilkan sesi latihan', () => {
    for (const mod of readModulesList.filter((m) => m.grade >= 2)) {
      const session = createSession(mod, 'practice', 42, 1_000);
      expect(session.pending.length).toBeGreaterThanOrEqual(6);
      const types = new Set(session.pending.map((item) => item.question.type));
      expect(types.has('clue-tap') || types.has('choose-text')).toBe(true);
      for (const item of session.pending) {
        const q = item.question;
        if (q.type === 'clue-tap' && q.visual?.kind === 'evidence-text') {
          expect(q.visual.sentences[q.answer]?.length).toBeGreaterThan(0);
        }
        if (q.type === 'choose-text') {
          expect(q.options?.[q.answer]).toBeTruthy();
          expect(q.choices).toContain(q.answer);
        }
      }
    }
  });
});
