import { describe, expect, it } from 'vitest';
import { learnCheck } from './learnCheck';
import { whoIsInTheStory } from '../content/readGrade1/r1-u1-m1';

describe('LearnCheck — pengecekan pemahaman modul Read', () => {
  it('menghasilkan learn check yang valid untuk modul r1-u1-m1', () => {
    const check = learnCheck(whoIsInTheStory, 9999);
    expect(check).toBeTruthy();
    expect(check?.choices.length).toBeGreaterThanOrEqual(2);
    expect(check?.options?.length).toBeGreaterThanOrEqual(2);
    expect(check?.choices).toContain(check?.question.answer);
  });
});
