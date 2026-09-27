import { describe, expect, it } from 'vitest';
import { xpForSession } from './gamification';
import type { SessionResult } from './types';

describe('Gamification — perolehan XP modul Read', () => {
  it('memberi XP normal untuk sesi Read yang berhasil dikerjakan', () => {
    const sessionRes: SessionResult = {
      sessionId: 'sess-xp',
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

    const xp = xpForSession(sessionRes, { passed: true, mastered: false, thirdStar: false });
    // 8 benar × 5 XP = 40 XP + 20 XP pass = 60 XP
    expect(xp).toBe(60);
  });

  it('memberikan badge membaca saat modul read dikuasai', async () => {
    const { newBadges } = await import('./gamification');
    const { emptyModuleState } = await import('./types');

    const before = emptyModuleState();
    const after = {
      ...before,
      status: 'mastered' as const,
      stars: 2 as const,
      totals: { sessions: 1, questions: 10, correct: 10 },
    };

    const sessionRes: SessionResult = {
      sessionId: 'sess-badge-read',
      moduleId: 'r1-u1-m1',
      kind: 'quiz',
      date: '2026-09-27',
      questions: Array.from({ length: 10 }, (_, i) => ({
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

    const earned = newBadges({
      owned: [],
      result: sessionRes,
      before,
      after,
      accuracy: 1,
      medianThinkMs: 2500,
      streakCurrent: 1,
      unitComplete: false,
      depth: {
        modulesCleared: 1,
        unitsCleared: 0,
        gradesCleared: [],
        thirdStars: 0,
        retained: 0,
      },
    });

    expect(earned).toContain('bookworm-1');
    expect(earned).toContain('story-detective');
  });

  it('memberikan badge kelulusan level membaca (read-graduate-1, 2, 3)', async () => {
    const { depthBadges } = await import('./gamification');

    const earned = depthBadges([], {
      modulesCleared: 10,
      unitsCleared: 4,
      gradesCleared: [101, 102],
      thirdStars: 0,
      retained: 0,
    });

    expect(earned).toContain('read-graduate-1');
    expect(earned).toContain('read-graduate-2');
    expect(earned).not.toContain('read-graduate-3');
  });
});
