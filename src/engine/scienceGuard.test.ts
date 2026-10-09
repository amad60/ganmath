import { describe, expect, it } from 'vitest';
import { generateSet } from './generator';
import { mulberry32 } from './rng';
import { createSession, currentQuestion, submitAnswer } from './session';
import { coverageOf } from './mastery';
import { scienceModulesList } from '../content/scienceIndex';
import type { Question } from './types';

/**
 * Science Level 1 punya soal `pick-picture`: tiga kartu GAMBAR, satu akibat yang
 * benar. Penjaga ini mencerminkan readGuard: soal pilihan yang bisa diluluskan
 * dengan mengetuk POSISI (selalu kartu kiri) tidak mengukur sains sama sekali.
 */
/** Level yang sudah memakai adegan + `pick-picture`. Tambahkan level di sini saat dikonversi. */
const SCENE_LEVELS: number[] = [1, 2, 3, 4];
const level1 = scienceModulesList.filter((m) => SCENE_LEVELS.includes(m.grade));

function pictureQuestions(seeds: number): Question[] {
  const out: Question[] = [];
  for (const mod of level1) {
    for (let seed = 1; seed <= seeds; seed++) {
      const { questions } = generateSet(mod, 15, mulberry32(seed));
      out.push(...questions.filter((q) => q.type === 'pick-picture'));
    }
  }
  return out;
}

describe('Science Level 1 — soal gambar tidak bisa diluluskan dengan menebak posisi', () => {
  it('setiap modul Science hanya soal gambar, minimal 8 skenario', () => {
    expect(level1).toHaveLength(10 * SCENE_LEVELS.length);
    for (const mod of level1) {
      expect(mod.questionTypes, mod.id).toEqual(['pick-picture']);
      expect(mod.rules.every((r) => r.type === 'pick-picture'), mod.id).toBe(true);
      const rule = mod.rules[0];
      expect(rule, mod.id).toBeTruthy();
      const [lo, hi] = rule!.params.p!;
      expect(hi - lo + 1, mod.id).toBeGreaterThanOrEqual(8);
    }
  });

  it('indeks jawaban tetap menunjuk kartu yang sah setelah diacak', () => {
    const qs = pictureQuestions(10);
    expect(qs.length).toBeGreaterThan(0);
    for (const q of qs) {
      expect(q.visual?.kind).toBe('science-scene');
      if (q.visual?.kind !== 'science-scene') continue;
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.visual.options.length);
      expect(q.choices).toEqual(q.visual.options.map((_, i) => i));
      // Data gambar soal tidak membawa kunci jawaban ke layar.
      expect(q.visual.correct).toBeUndefined();
      // `options` adalah emoji kartunya, urut sama dengan gambarnya.
      expect(q.options).toEqual(q.visual.options.map((o) => o.icon));
    }
  });

  it('kartu yang benar tetap kartu yang sama setelah diacak', () => {
    // Skenario pertama s1-u1: tanaman tanpa air → layu. Di mana pun kartunya jatuh,
    // indeks jawabannya harus ikut menunjuk 🥀.
    const mod = level1.find((m) => m.id === 's1-u1-m1')!;
    for (let seed = 1; seed <= 30; seed++) {
      const { questions } = generateSet(mod, 15, mulberry32(seed));
      for (const q of questions) {
        if (q.type !== 'pick-picture' || q.visual?.kind !== 'science-scene') continue;
        if (!q.visual.options.some((o) => o.icon === '🌳')) continue;
        expect(q.visual.options[q.answer]?.icon).toBe('🥀');
      }
    }
  });

  it('pengacakan memindahkan jawaban ke lebih dari satu posisi', () => {
    const positions = new Set(pictureQuestions(20).map((q) => q.answer));
    expect(positions.size).toBe(3);
  });

  it('tidak ada dua kartu bergambar sama dalam satu soal', () => {
    for (const q of pictureQuestions(10)) {
      if (q.visual?.kind !== 'science-scene') continue;
      const icons = q.visual.options.map((o) => o.icon);
      expect(new Set(icons).size, q.text).toBe(icons.length);
    }
  });

  it('soal gambar yang salah tidak kembali verbatim di sesi yang sama', () => {
    const mod = level1[0]!;
    let session = createSession(mod, 'practice', 3, 1_000);
    // Majukan sampai soal gambar pertama.
    let guard = 0;
    while (currentQuestion(session)?.type !== 'pick-picture' && guard++ < 20) {
      session = submitAnswer(session, { correct: true, thinkMs: 1, totalMs: 1, hintUsed: false, nowMs: 2_000 });
    }
    const q = currentQuestion(session);
    if (!q) return; // sesi latihan ini kebetulan tanpa soal gambar
    const next = submitAnswer(session, { correct: false, thinkMs: 1, totalMs: 1, hintUsed: false, nowMs: 3_000 });
    expect(next.requeue.some((r) => r.question.id === q.id)).toBe(false);
    expect(next.pending.some((item) => item.question.id === q.id)).toBe(false);
  });

  it('setiap modul Level 1 menghasilkan sesi latihan dan kuis yang mencakup semua tipe', () => {
    for (const mod of level1) {
      const practice = createSession(mod, 'practice', 42, 1_000);
      expect(practice.pending.length, mod.id).toBeGreaterThanOrEqual(8);

      const quiz = createSession(mod, 'quiz', 42, 1_000);
      const types = new Set(quiz.pending.map((p) => p.question.type));
      for (const t of mod.questionTypes) expect(types.has(t), `${mod.id} ${t}`).toBe(true);

      // Kuis yang dijawab benar semua memenuhi syarat cakupan penguasaan.
      const covered = coverageOf(mod, {
        sessionId: quiz.sessionId,
        moduleId: mod.id,
        kind: 'quiz',
        date: '2026-10-05',
        questions: quiz.pending.map((p) => ({
          questionId: p.question.id,
          type: p.question.type,
          skill: p.question.skill,
          correct: true,
          thinkMs: 1000,
          totalMs: 1000,
          retried: false,
          hintUsed: false,
          story: false,
        })),
      });
      expect(covered, mod.id).toBe(true);
    }
  });

  it('Learn Level 1: tahap concrete dan pictorial adalah adegan yang dikerjakan', () => {
    for (const mod of level1) {
      const [concrete, pictorial, abstract] = mod.learn;
      expect(concrete?.action, mod.id).toBe('explore');
      expect(concrete?.visual.kind).toBe('science-scene');
      expect(pictorial?.action, mod.id).toBe('explore');
      expect(pictorial?.visual.kind === 'science-scene' && pictorial.visual.mode).toBe('predict');
      expect(abstract?.stage).toBe('abstract');
    }
  });
});
