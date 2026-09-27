import { describe, expect, it } from 'vitest';
import { hintFor, operandsOf } from './hint';
import { moduleById } from '../content';
import type { Question } from './types';

function q(patch: Partial<Question> & Pick<Question, 'text' | 'answer' | 'params'>): Question {
  return {
    id: 't',
    type: 'keypad',
    skill: 'x',
    maxDigits: 3,
    allowDecimal: false,
    allowNegative: false,
    ...patch,
  };
}

describe('hintFor — bantuan harus tentang soal INI', () => {
  it('26 + 37 disusun: 13 satuan, 50 puluhan, 63', () => {
    const question = q({ text: '26 + 37 = ?', params: { a: 26, b: 37 }, answer: 63 });
    const h = hintFor(moduleById('g2-u2-m4').learn, question);
    expect(h?.prompt).toBe('Ones first. 6 + 7.');
    expect(h?.visual).toEqual({ kind: 'column-sum', a: 26, b: 37, op: '+', showTotal: false });
  });

  it('soal cerita 26 dan 37 juga memakai kedua angka itu', () => {
    const question = q({
      text: 'Ana picks 26 flowers. Budi picks 37. How many altogether?',
      params: { a: 26, b: 37 },
      answer: 63,
      story: true,
    });
    expect(operandsOf(question)).toEqual({ left: 26, right: 37, op: '+' });
    const h = hintFor(moduleById('g2-u2-m4').learn, question);
    expect(h?.visual).toEqual({ kind: 'column-sum', a: 26, b: 37, op: '+', showTotal: false });
  });

  it('6 + 7 (near doubles, param n=6) adalah 13 titik, bukan ten-frame 6', () => {
    const question = q({ text: '6 + 7 = ?', params: { n: 6 }, answer: 13 });
    const h = hintFor(moduleById('g1-u4-m3').learn, question);
    expect(h?.visual).toEqual({
      kind: 'number-bond',
      whole: null,
      parts: [6, 7],
      ask: 'whole',
    });
  });

  it('2 + 3 di Add to 5 memakai 2 dan 3, bukan selalu contoh 2+3=5 dari Learn', () => {
    const question = q({ text: '1 + 4 = ?', params: { a: 1, b: 4 }, answer: 5 });
    const h = hintFor(moduleById('g1-u2-m2').learn, question);
    expect(h?.visual).toEqual({
      kind: 'number-bond',
      whole: null,
      parts: [1, 4],
      ask: 'whole',
    });
    expect(h?.prompt).toBe('1 and 4.');
  });

  it('20 + 30 memakai puluhan, bukan 2 kubus', () => {
    const question = q({ text: '20 + 30 = ?', params: { a: 2, b: 3 }, answer: 50 });
    const h = hintFor(moduleById('g2-u2-m1').learn, question);
    expect(h?.visual).toEqual({
      kind: 'column-sum',
      a: 20,
      b: 30,
      op: '+',
      showTotal: false,
    });
  });

  it('52 − 27 membuka satu puluhan dari 52, bukan gambar 25', () => {
    const question = q({ text: '52 - 27 = ?', params: { a: 52, b: 27 }, answer: 25 });
    const h = hintFor(moduleById('g2-u2-m6').learn, question);
    expect(h?.prompt).toBe('Open one ten. Then take 27.');
    expect(h?.visual).toEqual({ kind: 'column-sum', a: 52, b: 27, op: '−', showTotal: false });
  });

  it('modul bergagasan banyak tetap memakai langkah Learn yang dipilih aturan', () => {
    const question = q({
      type: 'choose-text',
      text: 'Does it roll or stack?',
      params: {},
      answer: 0,
      hint: 1,
    });
    const h = hintFor(moduleById('g1-u6-m2').learn, question);
    expect(h?.prompt).toBe('Some roll. Some stack. Some do both.');
  });

  it('menghitung n tanpa operasi: ten-frame dari n', () => {
    const question = q({ text: 'How many dots?', params: { n: 4 }, answer: 4 });
    const h = hintFor(moduleById('g1-u1-m1').learn, question);
    expect(h?.prompt).toBe('Count one by one.');
    expect(h?.visual).toEqual({ kind: 'ten-frame', value: 4, capacity: 10 });
  });

  it('1/4 + 5/8 bukan ten-frame 4+5', () => {
    const question = q({ text: '1/4 + 5/8 = ?/8', params: { a: 1, b: 4, c: 5, d: 8 }, answer: 7 });
    expect(operandsOf(question)).toBeNull();
    const h = hintFor(moduleById('g5-u1-m2').learn, question);
    expect(h?.visual.kind).toBe('fraction');
  });

  it('6 + 6 = 10 + ? bukan ten-frame 12', () => {
    const question = q({ text: '6 + 6 = 10 + ?', params: { a: 6, b: 6 }, answer: 2 });
    expect(operandsOf(question)).toBeNull();
    const h = hintFor(moduleById('g1-u4-m4').learn, question);
    expect(h?.visual).not.toEqual({
      kind: 'ten-frame',
      value: 12,
      capacity: 20,
      split: 6,
    });
  });

  it('8 ? 10 memakai 8 dan 10, bukan contoh 6 > 4', () => {
    const question = q({ text: '8 ? 10', params: { a: 8, b: 10 }, answer: -1, type: 'compare-symbol' });
    const h = hintFor(moduleById('g1-u1-m5').learn, question);
    expect(h?.prompt).toBe('Look at both.');
    expect(h?.visual).toEqual({ kind: 'ten-frame', value: 10, capacity: 10, split: 8 });
  });

  it('Round 47 ke puluhan terdekat, bukan garis 40–50 yang dihafal', () => {
    const question = q({ text: 'Round 47 to the nearest ten.', params: { n: 47 }, answer: 50 });
    const h = hintFor(moduleById('g2-u1-m6').learn, question);
    expect(h?.prompt).toBe('Halfway is 45.');
    expect(h?.visual).toMatchObject({ kind: 'number-line', min: 40, max: 50, value: 47 });
  });

  it('8 thousands = 8000, bukan gambar 400', () => {
    const question = q({ text: '8 thousands = ?', params: { t: 8 }, answer: 8000 });
    const h = hintFor(moduleById('g3-u1-m1').learn, question);
    expect(h?.prompt).toBe('8 groups of 1000.');
    expect(h?.visual).toMatchObject({ kind: 'number-line', value: null });
  });

  it('? tens = 400 adalah 40 tens', () => {
    const question = q({ text: '? tens = 400', params: { h: 4 }, answer: 40 });
    const h = hintFor(moduleById('g2-u1-m1').learn, question);
    expect(h?.prompt).toBe('How many tens in 400?');
    expect(h?.visual).toEqual({ kind: 'base10', hundreds: 4, tens: 0, ones: 0 });
  });

  it('2/5 = ?/10 mengalikan atas dan bawah dengan 2', () => {
    const question = q({ text: '2/5 = ?/10', params: { a: 2, b: 5, k: 2 }, answer: 4 });
    const h = hintFor(moduleById('g5-u1-m1').learn, question);
    expect(h?.prompt).toBe('Multiply top and bottom by 2.');
    expect(h?.visual).toEqual({ kind: 'fraction', parts: 5, shaded: 2, shape: 'square' });
  });

  it('−6 + 9 memakai garis dari −6 ke 3, bukan 6+9', () => {
    const question = q({ text: 'What is −6 + 9?', params: { a: -6, b: 9 }, answer: 3 });
    expect(operandsOf(question)).toEqual({ left: -6, right: 9, op: '+' });
    const h = hintFor(moduleById('g6-u1-m4').learn, question);
    expect(h?.prompt).toBe('Start at −6. Jump 9.');
    expect(h?.visual).toMatchObject({ kind: 'number-line', value: -6 });
  });

  it('modul Read r1-u1-m1 mengambil langkah pictorial sebagai hint', () => {
    const question = q({ text: 'Which sentence tells WHO is in the story?', params: {}, answer: 0, type: 'clue-tap' });
    const h = hintFor(moduleById('r1-u1-m1').learn, question);
    expect(h?.visual.kind).toBe('evidence-text');

    const q2 = q({ text: 'Which sentence states the MAIN IDEA of the story?', params: {}, answer: 0, type: 'clue-tap' });
    const h2 = hintFor(moduleById('r2-u1-m1').learn, q2);
    expect(h2?.visual.kind).toBe('evidence-text');
  });
});
