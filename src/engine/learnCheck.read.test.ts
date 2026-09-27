import { describe, expect, it } from 'vitest';
import { learnCheck } from './learnCheck';
import { whoIsInTheStory } from '../content/readGrade1/r1-u1-m1';
import { mainIdeaSummary } from '../content/readGrade2/r2-u1-m1';
import { howToFollowSteps } from '../content/readGrade3/r3-u1-m1';

describe('LearnCheck — pengecekan pemahaman modul Read', () => {
  it('menghasilkan learn check yang valid untuk modul r1-u1-m1, r2-u1-m1, r3-u1-m1', () => {
    for (const m of [whoIsInTheStory, mainIdeaSummary, howToFollowSteps]) {
      const check = learnCheck(m, 9999);
      expect(check).toBeTruthy();
      expect(check?.choices.length).toBeGreaterThanOrEqual(2);
      expect(check?.options?.length).toBeGreaterThanOrEqual(2);
      expect(check?.choices).toContain(check?.question.answer);
    }
  });
});
