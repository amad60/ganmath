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
});
