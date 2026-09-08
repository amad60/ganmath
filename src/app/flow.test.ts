import { describe, expect, it } from 'vitest';
import { createProgressStore, memoryStorage } from '../store/progress';
import { createSession, currentQuestion, isFinished, submitAnswer, toSessionResult } from '../engine/session';
import { isUnlocked, nextModule } from '../engine/unlock';
import { nextStepFor } from '../engine/steps';
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

  /**
   * Regresi untuk bug terburuk yang pernah lolos: anak terjebak berlatih selamanya
   * karena layar peta menebak langkahnya sendiri dan sesi latihan tidak pernah
   * menaikkan status. Test ini meniru persis apa yang dilakukan tombol utama app.
   */
  it('mengikuti tombol utama app berkali-kali BENAR-BENAR menuntaskan modul', () => {
    const store = createProgressStore(memoryStorage());
    const first = pathOrder[0] as string;
    const def = moduleById(first);
    const trail: string[] = [];

    for (let i = 0; i < 12; i++) {
      const step = nextStepFor(def, store.getState().moduleState(first), '2026-09-08');
      trail.push(step);
      if (step === 'done') break;
      if (step === 'learn') {
        store.getState().markLearnComplete(first, '2026-09-08');
        continue;
      }
      playSession(store, first, step, { date: '2026-09-08' });
    }

    expect(store.getState().moduleState(first).status).toBe('mastered');
    expect(trail).toContain('practice');
    expect(trail).toContain('quiz');
    expect(trail.at(-1)).toBe('done');
    // Modul berikutnya terbuka, jadi tombol utama pindah ke modul lain.
    expect(nextModule(store.getState().data.modules, registry)).toBe(pathOrder[1]);
  });

  it('anak yang gagal terus tidak diulang-ulang di langkah yang sama', () => {
    const store = createProgressStore(memoryStorage());
    const first = pathOrder[0] as string;
    const def = moduleById(first);
    const trail: string[] = [];

    for (let i = 0; i < 8; i++) {
      const step = nextStepFor(def, store.getState().moduleState(first), '2026-09-08');
      trail.push(step);
      if (step === 'done') break;
      if (step === 'learn') {
        store.getState().markLearnComplete(first, '2026-09-08');
        continue;
      }
      playSession(store, first, step, { correct: false, date: '2026-09-08' });
    }

    // Dia dikembalikan ke materi, bukan disuruh mengulang kuis yang sama terus.
    expect(trail).toContain('learn');
    expect(new Set(trail).size).toBeGreaterThan(2);
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
    expect(store.getState().moduleState(first).status).toBe('mastered');
    void c;
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

  it('ulangan berjarak benar-benar muncul setelah jatuh tempo', async () => {
    const { dueReviews } = await import('../engine/review');
    const store = createProgressStore(memoryStorage());
    const first = pathOrder[0] as string;

    store.getState().markLearnComplete(first, '2026-09-01');
    playSession(store, first, 'practice', { date: '2026-09-01' });
    playSession(store, first, 'quiz', { date: '2026-09-01' });
    playSession(store, first, 'quiz', { date: '2026-09-01' });
    expect(store.getState().moduleState(first).status).toBe('mastered');

    // Belum jatuh tempo
    expect(dueReviews(store.getState().data.modules, '2026-09-02')).toHaveLength(0);
    // R1 jatuh tempo 3 hari kemudian
    expect(dueReviews(store.getState().data.modules, '2026-09-05')[0]?.moduleId).toBe(first);
  });

  it('Master Round bisa memberi bintang ketiga', () => {
    const store = createProgressStore(memoryStorage());
    const first = pathOrder[0] as string;
    store.getState().markLearnComplete(first, '2026-09-01');
    playSession(store, first, 'practice', { date: '2026-09-01' });
    playSession(store, first, 'quiz', { date: '2026-09-01' });
    playSession(store, first, 'quiz', { date: '2026-09-01' });
    expect(store.getState().moduleState(first).stars).toBeLessThan(3);

    playSession(store, first, 'master', { date: '2026-09-02', thinkMs: 1500 });
    expect(store.getState().moduleState(first).stars).toBe(3);
  });

  /**
   * Penjaga untuk KELAS bug yang berulang di proyek ini: kemampuan yang ada di
   * engine tapi tidak punya jalan dari app. Ulangan berjarak, Master Round, dan
   * pemulihan data yang terhapus semuanya pernah selesai di engine dan lengkap
   * dengan testnya, tapi tidak pernah bisa dijangkau anak.
   */
  it('setiap kemampuan engine punya jalan dari app', async () => {
    const { readFileSync, readdirSync } = await import('node:fs');
    const { join } = await import('node:path');
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
      );
    const src = walk('src/app')
      .concat(walk('src/store'))
      .filter((f) => /\.tsx?$/.test(f) && !f.includes('.test.'))
      .map((f) => readFileSync(f, 'utf8'))
      .join('\n');

    // Sesi yang dijangkau lewat step machine dibuktikan oleh nextStepFor;
    // sisanya harus dipanggil eksplisit dari suatu tempat di app.
    const { nextStepFor } = await import('../engine/steps');
    const { addModule, state } = await import('../engine/fixtures');
    const def = addModule();
    const viaSteps = new Set([
      nextStepFor(def, state({ learnCompletedAt: '2026-09-08' })),
      nextStepFor(def, state({ status: 'practiced' })),
      nextStepFor(def, state({ status: 'needs_review' })),
      nextStepFor(
        def,
        state({ status: 'mastered', masteredAt: '2026-09-01', reviewStage: 1 }),
        '2026-09-20',
      ),
    ]);
    expect(viaSteps).toContain('practice');
    expect(viaSteps).toContain('speed');
    expect(viaSteps).toContain('review');

    for (const kind of ['quiz', 'master', 'testout']) {
      expect(src, `sesi "${kind}" tidak pernah dimulai app`).toContain(`'${kind}'`);
    }

    // Fungsi engine yang menjadi fitur bagi anak, bukan sekadar helper internal.
    for (const fn of ['dueReviews', 'nextStepFor', 'looksWiped', 'evaluate', 'newBadges']) {
      expect(src, `${fn}() tidak pernah dipanggil app`).toContain(fn);
    }
  });

  it('lolos tes satu unit menandai SELURUH modul unit itu dikuasai', async () => {
    const { unitModules, unitTestDef } = await import('../content');
    const { createSession, currentQuestion, isFinished, submitAnswer, toSessionResult } =
      await import('../engine/session');
    const { evaluate } = await import('../engine/mastery');
    const { emptyModuleState } = await import('../engine/types');

    const store = createProgressStore(memoryStorage());
    const def = unitTestDef('g1-u1');
    let s = createSession(def, 'testout', 5, 0);
    let i = 0;
    while (currentQuestion(s) && !isFinished(s, 0)) {
      s = submitAnswer(s, {
        correct: true,
        thinkMs: 1500,
        totalMs: 2000,
        hintUsed: false,
        nowMs: i * 1000,
      });
      if (++i > 30) break;
    }
    const evaluation = evaluate(def, emptyModuleState(), toSessionResult(s, '2026-09-08'));
    expect(evaluation.next.status).toBe('mastered');

    const ids = unitModules('g1-u1').map((m) => m.id);
    store.getState().masterModules(ids, '2026-09-08');
    for (const id of ids) expect(store.getState().moduleState(id).status).toBe('mastered');

    // Modul berikutnya kini di luar unit itu.
    const after = nextModule(store.getState().data.modules, registry);
    expect(ids).not.toContain(after);
  });

  it('registry konten tidak punya masalah struktural', async () => {
    const { validateRegistry } = await import('../engine/unlock');
    expect(validateRegistry(registry)).toEqual([]);
  });
});
