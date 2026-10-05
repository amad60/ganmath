import { describe, expect, it } from 'vitest';
import { scaffoldForQuestion } from './scaffolding';
import type { Question } from './types';

function q(patch: Partial<Question> & Pick<Question, 'text' | 'answer' | 'params'>): Question {
  return {
    id: 'test-q',
    type: 'keypad',
    skill: 'test',
    maxDigits: 3,
    allowDecimal: false,
    allowNegative: false,
    ...patch,
  };
}

describe('scaffoldForQuestion — Fading support di sesi practice', () => {
  it('memberikan column-sum tanpa jawaban pada 3 soal pertama sesi practice', () => {
    const question = q({ text: '26 + 37 = ?', params: { a: 26, b: 37 }, answer: 63 });

    // Soal ke-0 (soal pertama): dapat scaffold tangga bantu
    const s0 = scaffoldForQuestion(question, 0, 'practice');
    expect(s0).toEqual({
      kind: 'column-sum',
      a: 26,
      b: 37,
      op: '+',
      showTotal: false,
    });

    // Soal ke-1 (soal kedua): masih dapat scaffold
    const s1 = scaffoldForQuestion(question, 1, 'practice');
    expect(s1).toEqual({
      kind: 'column-sum',
      a: 26,
      b: 37,
      op: '+',
      showTotal: false,
    });

    // Soal ke-2 (soal ketiga): masih dibimbing
    expect(scaffoldForQuestion(question, 2, 'practice')).toEqual(s1);

    // Soal ke-3 dan seterusnya: memudar (fading) -> null agar mandiri
    const s3 = scaffoldForQuestion(question, 3, 'practice');
    expect(s3).toBeNull();
  });

  it('tidak pernah memberikan scaffold pada sesi ujian (quiz, speed, master, review)', () => {
    const question = q({ text: '26 + 37 = ?', params: { a: 26, b: 37 }, answer: 63 });
    for (const kind of ['quiz', 'speed', 'master', 'review', 'testout']) {
      const s = scaffoldForQuestion(question, 0, kind);
      expect(s).toBeNull();
    }
  });

  it('tidak menimpa visual jika soal sudah memiliki visual bawaan sendiri', () => {
    const question = q({
      text: 'How many sides?',
      params: {},
      answer: 3,
      visual: { kind: 'shape2d', name: 'triangle' },
    });
    const s = scaffoldForQuestion(question, 0, 'practice');
    expect(s).toBeNull();
  });
});
