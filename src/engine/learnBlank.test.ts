import { describe, expect, it } from 'vitest';
import { learnBlank } from './learnBlank';
import { all } from '../content/index';
import { readModulesList } from '../content/readIndex';
import { scienceModulesList } from '../content/scienceIndex';
import type { LearnStep } from '../content/types';

const step = (prompt: string, over: Partial<LearnStep> = {}): LearnStep => ({
  stage: 'abstract',
  prompt,
  visual: { kind: 'array', rows: 2, cols: 4 },
  action: 'watch',
  ...over,
});

describe('learnBlank — tahap abstract meminta anak menulis lambangnya', () => {
  it('mengosongkan angka terakhir, bukan yang pertama', () => {
    const b = learnBlank(step('We write it as 2 × 4 = 8.'))!;
    expect(b.before).toBe('We write it as 2 × 4 = ');
    expect(b.answer).toBe('8');
    expect(b.after).toBe('.');
    expect(b.choices).toHaveLength(3);
    expect(b.choices).toContain('8');
  });

  it('pengecoh mencerminkan salah nyata', () => {
    expect(learnBlank(step('We write it as 47 + 38 = 85.'))!.choices).toEqual(expect.arrayContaining(['85', '75', '86']));
    expect(learnBlank(step('300 + 200 = 500.'))!.choices).toEqual(expect.arrayContaining(['400', '500', '600']));
    expect(learnBlank(step('Three fourths is 0.75.'))!.choices).toEqual(expect.arrayContaining(['0.65', '0.75', '0.85']));
    expect(learnBlank(step('So the answer is 0.'))!.choices).toEqual(expect.arrayContaining(['0', '1', '2']));
  });

  it('tidak memotong jam, pecahan, angka berpemisah, atau rupiah', () => {
    expect(learnBlank(step('Half past three is 3:30.'))).toBeNull();
    expect(learnBlank(step('Two of four parts is 2/4.'))).toBeNull();
    expect(learnBlank(step('That is 1,000.'))).toBeNull();
    expect(learnBlank(step('Together they make 100.000.'))).toBeNull();
  });

  it('melewati kalimat tanpa angka, kalimat tanya, dan tahap selain abstract', () => {
    expect(learnBlank(step('Numbers keep going past twenty.'))).toBeNull();
    expect(learnBlank(step('How many groups of 24 in 168?'))).toBeNull();
    expect(learnBlank(step('We write it as 5.', { stage: 'pictorial' }))).toBeNull();
    expect(learnBlank(step('Put 5 on the line.', { action: 'drop-on-line', target: 5 }))).toBeNull();
  });

  it('caption yang memuat jawabannya disembunyikan sampai terisi', () => {
    expect(learnBlank(step('We write it as 6 > 4.', { caption: '6 > 4' }))!.hideCaption).toBe(true);
    expect(learnBlank(step('Ones 9. Tens 50.', { caption: '9 + 50' }))!.hideCaption).toBe(true);
    expect(learnBlank(step('We write it as 43.', { caption: '4 tens' }))!.hideCaption).toBe(false);
  });

  it('seluruh Math: setiap isian punya 3 pilihan berbeda, jawabannya ada, dan kalimatnya utuh', () => {
    let count = 0;
    for (const m of all) {
      for (const s of m.learn) {
        const b = learnBlank(s);
        if (!b) continue;
        count++;
        expect(new Set(b.choices).size, `${m.id}: ${s.prompt}`).toBe(3);
        expect(b.choices, m.id).toContain(b.answer);
        expect(b.before + b.answer + b.after).toBe(s.prompt);
        for (const c of b.choices) expect(Number(c), `${m.id}: ${c}`).toBeGreaterThanOrEqual(0);
      }
    }
    // Dulu nol langkah abstract yang meminta apa pun.
    expect(count).toBeGreaterThan(130);
  });

  it('posisi jawaban tidak selalu sama (tidak bisa ditebak dari letaknya)', () => {
    const slots = new Set<number>();
    for (const m of all) for (const s of m.learn) {
      const b = learnBlank(s);
      if (b) slots.add(b.choices.indexOf(b.answer));
    }
    expect(slots).toEqual(new Set([0, 1, 2]));
  });

  it('Read dan Science tidak tersentuh — mereka punya interaksinya sendiri', () => {
    for (const m of [...readModulesList, ...scienceModulesList]) {
      for (const s of m.learn) expect(learnBlank(s), m.id).toBeNull();
    }
  });
});
