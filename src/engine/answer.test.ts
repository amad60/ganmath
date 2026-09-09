import { describe, expect, it } from 'vitest';
import {
  MINUS,
  answerDigitCount,
  answerText,
  formatAnswer,
  isCompleteInput,
  normalizeAnswer,
  parseTypedAnswer,
  sameAnswer,
} from './answer';

describe('nilai desimal', () => {
  /**
   * Inti masalahnya: 0.1 + 0.2 tidak sama dengan 0.3 dalam biner. Modul desimal
   * (g5-u2) menghitung jawabannya persis seperti itu, jadi tanpa normalisasi anak
   * yang mengetik 0.3 akan dinilai SALAH oleh soal yang jawabannya memang 0.3.
   */
  it('0.1 + 0.2 dianggap sama dengan 0.3', () => {
    expect(0.1 + 0.2).not.toBe(0.3); // penyebabnya, supaya test ini tidak bohong
    expect(sameAnswer(0.1 + 0.2, 0.3)).toBe(true);
    expect(normalizeAnswer(0.1 + 0.2)).toBe(0.3);
  });

  it('dibandingkan sebagai nilai, bukan string: 0.5 = 0.50 = .5', () => {
    for (const typed of ['0.5', '0.50', '.5']) {
      expect(sameAnswer(parseTypedAnswer(typed) ?? NaN, 0.5)).toBe(true);
    }
  });

  it('angka yang memang berbeda tetap berbeda', () => {
    expect(sameAnswer(0.5, 0.51)).toBe(false);
    expect(sameAnswer(-3, 3)).toBe(false);
    expect(sameAnswer(0.05, 0.5)).toBe(false);
  });

  it('galat float pada jawaban besar tidak membuat dua angka lebur jadi satu', () => {
    expect(sameAnswer(100000, 100001)).toBe(false);
    expect(sameAnswer(1.1 * 3, 3.3)).toBe(true);
  });

  it('nol negatif adalah nol', () => {
    expect(normalizeAnswer(-0)).toBe(0);
    expect(sameAnswer(-0, 0)).toBe(true);
  });
});

describe('bentuk tertulis jawaban', () => {
  it('memakai tanda minus, bukan hyphen keyboard', () => {
    expect(formatAnswer(-7)).toBe(`${MINUS}7`);
    expect(formatAnswer(-0.25)).toBe(`${MINUS}0.25`);
  });

  it('galat float tidak pernah sampai ke mata anak', () => {
    expect(formatAnswer(0.1 + 0.2)).toBe('0.3');
  });

  it('digit dihitung tanpa tanda dan titik', () => {
    expect(answerDigitCount(0.5)).toBe(2);
    expect(answerDigitCount(-7.25)).toBe(3);
    expect(answerDigitCount(0)).toBe(1);
    expect(answerDigitCount(9990)).toBe(4);
  });

  it('angka yang tak bisa dituliskan dikenali, bukan diam-diam dibulatkan', () => {
    expect(answerText(Infinity)).toBeNull();
    expect(answerText(NaN)).toBeNull();
    expect(answerText(1e21)).toBeNull();
    expect(answerDigitCount(Infinity)).toBeNull();
  });
});

describe('masukan yang belum sah tidak boleh dikirim', () => {
  it('menolak "5.", "−" sendirian, dan kosong', () => {
    for (const bad of ['', '.', '5.', MINUS, `${MINUS}.`, `${MINUS}5.`]) {
      expect(isCompleteInput(bad)).toBe(false);
      expect(parseTypedAnswer(bad)).toBeNull();
    }
  });

  it('menerima bilangan bulat, desimal, dan negatif', () => {
    expect(parseTypedAnswer('12')).toBe(12);
    expect(parseTypedAnswer('0.75')).toBe(0.75);
    expect(parseTypedAnswer(`${MINUS}8`)).toBe(-8);
    expect(parseTypedAnswer(`${MINUS}0.5`)).toBe(-0.5);
  });
});
