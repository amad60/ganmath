import { describe, expect, it } from 'vitest';
import { createProgressStore, memoryStorage } from '../store/progress';
import { createSession, currentQuestion, isFinished, submitAnswer, toSessionResult } from '../engine/session';
import { isUnlocked, nextModule } from '../engine/unlock';
import { moduleById, pathOrder, registry } from '../content';
import type { SessionKind } from '../engine/types';

/**
 * Integrasi ujung-ke-ujung tanpa DOM: peta → learn → practice → quiz → mastered →
 * modul berikutnya terbuka. Ini yang membuktikan konten, engine, dan store benar-benar
 * tersambung — bukan sekadar masing-masing lulus test sendiri.
 */
function playSession(
  store: ReturnType<typeof createProgressStore>,
  moduleId: string,
  kind: SessionKind,
  opts: { correct?: boolean; thinkMs?: number; date?: string } = {},
) {
  const def = moduleById(moduleId);
  let s = createSession(def, kind, 42, 0);
  let i = 0;
  while (currentQuestion(s) && !isFinished(s, i * 1000)) {
    s = submitAnswer(s, {
      correct: opts.correct ?? true,
      thinkMs: opts.thinkMs ?? 1500,
      totalMs: (opts.thinkMs ?? 1500) + 500,
      hintUsed: false,
      nowMs: i * 1000,
    });
    if (++i > 40) break;
  }
  return store.getState().recordSession(def, toSessionResult(s, opts.date ?? '2026-09-08'));
}

describe('alur satu modul, ujung ke ujung', () => {
  it('anak menempuh modul pertama sampai dikuasai, lalu modul kedua terbuka', () => {
    const store = createProgressStore(memoryStorage());
    const first = pathOrder[0] as string;
    const second = pathOrder[1] as string;

    expect(nextModule(store.getState().data.modules, registry)).toBe(first);
    expect(isUnlocked(second, store.getState().data.modules, registry)).toBe(false);

    store.getState().markLearnComplete(first, '2026-09-08');
    expect(store.getState().moduleState(first).status).toBe('learning');

    playSession(store, first, 'practice');
    playSession(store, first, 'quiz');
    const final = playSession(store, first, 'quiz');

    expect(final.next.status).toBe('mastered');
    expect(store.getState().moduleState(first).status).toBe('mastered');
    expect(isUnlocked(second, store.getState().data.modules, registry)).toBe(true);
    expect(nextModule(store.getState().data.modules, registry)).toBe(second);
  });

  it('anak yang banyak salah tetap tertahan di modul yang sama (gating ketat)', () => {
    const store = createProgressStore(memoryStorage());
    const first = pathOrder[0] as string;
    const second = pathOrder[1] as string;

    for (let i = 0; i < 3; i++) playSession(store, first, 'quiz', { correct: false });

    expect(store.getState().moduleState(first).status).toBe('learning');
    expect(store.getState().moduleState(first).consecutiveFails).toBe(3);
    expect(isUnlocked(second, store.getState().data.modules, registry)).toBe(false);
  });

  it('setiap modul terdaftar punya materi CPA lengkap dan aturan soal', () => {
    for (const id of pathOrder) {
      const m = moduleById(id);
      expect(m.rules.length).toBeGreaterThan(0);
      expect(m.questionTypes.length).toBeGreaterThanOrEqual(2);
      if (m.kind !== 'application') {
        const stages = new Set(m.learn.map((l) => l.stage));
        expect([...stages].sort()).toEqual(['abstract', 'concrete', 'pictorial']);
      }
    }
  });

  it('gamifikasi tersambung: XP bertambah, streak jalan, badge diberikan', () => {
    const store = createProgressStore(memoryStorage());
    const first = pathOrder[0] as string;

    const a = playSession(store, first, 'practice', { date: '2026-09-08' });
    expect(a.xpGained).toBeGreaterThan(0);
    expect(a.earnedBadges).toContain('first-step');
    expect(store.getState().data.streak.current).toBe(1);

    // main lagi di hari yang sama tidak menambah streak
    playSession(store, first, 'quiz', { date: '2026-09-08' });
    expect(store.getState().data.streak.current).toBe(1);

    // hari berikutnya menambah streak, dan modul dikuasai memberi badge
    const c = playSession(store, first, 'quiz', { date: '2026-09-09' });
    expect(store.getState().data.streak.current).toBe(2);
    expect(c.earnedBadges).toContain('module-master');
    expect(store.getState().data.xp).toBeGreaterThan(a.xpGained);
    expect(store.getState().data.level).toBeGreaterThanOrEqual(1);
  });

  it('badge tidak pernah diberikan dua kali', () => {
    const store = createProgressStore(memoryStorage());
    const first = pathOrder[0] as string;
    playSession(store, first, 'practice');
    const second = playSession(store, first, 'practice');
    expect(second.earnedBadges).not.toContain('first-step');
    const ids = store.getState().data.badges;
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('registry konten tidak punya masalah struktural', async () => {
    const { validateRegistry } = await import('../engine/unlock');
    expect(validateRegistry(registry)).toEqual([]);
  });
});
