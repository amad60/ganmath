import { scienceModulesList } from '../content/scienceIndex';
import { describe, expect, it } from 'vitest';
import { hintFor, operandsOf } from './hint';
import { all, moduleById } from '../content';
import { enumerate } from './generator';
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
    expect(h?.visual).toMatchObject({ kind: 'number-line', value: -6, hopTo: 3 });
  });

  it('soal science tidak jadi ten-frame meski params.n ada', () => {
    const question = q({
      text: 'A plant in a dry pot looks sad. What does it need?',
      params: { n: 4 },
      answer: 0,
      type: 'choose-text',
      skill: 'sci-needs',
    });
    const h = hintFor(moduleById('s1-u1-m1').learn, question);
    // Science Level 1: Hint memutar adegan "ubah satu hal", bukan kartu kalimat.
    expect(h?.visual.kind).toBe('science-scene');
  });

  it('Hint Science tidak pernah memakai adegan tebak — hasilnya bisa jadi kunci jawaban', () => {
    for (const mod of scienceModulesList.filter((m) => m.grade === 1)) {
      const question = q({ text: 'What happens next?', params: {}, answer: 0, type: 'pick-picture', skill: mod.skills[0]! });
      const h = hintFor(mod.learn, question);
      expect(h?.visual.kind, mod.id).toBe('science-scene');
      if (h?.visual.kind === 'science-scene') expect(h.visual.mode, mod.id).not.toBe('predict');
    }
  });

  it('modul Read r1-u1-m1 mengambil langkah pictorial sebagai hint', () => {
    const question = q({ text: 'Which sentence tells WHO is in the story?', params: {}, answer: 0, type: 'clue-tap' });
    const h = hintFor(moduleById('r1-u1-m1').learn, question);
    expect(h?.visual.kind).toBe('evidence-text');

    const q2 = q({ text: 'Which sentence states the MAIN IDEA of the story?', params: {}, answer: 0, type: 'clue-tap' });
    const h2 = hintFor(moduleById('r2-u1-m1').learn, q2);
    expect(h2?.visual.kind).toBe('evidence-text');
  });

  it('3 × 6 adalah tiga baris berisi enam, utuh', () => {
    const h = hintFor(moduleById('g3-u2-m1').learn, q({ text: '3 × 6 = ?', params: { n: 6 }, answer: 18 }));
    expect(h?.prompt).toBe('3 rows of 6.');
    expect(h?.visual).toEqual({ kind: 'array', rows: 3, cols: 6 });
  });

  it('7 × 8 tetap array, bukan ikatan bilangan 7 dan 8', () => {
    const h = hintFor(moduleById('g3-u2-m6').learn, q({ text: '7 × 8 = ?', params: { n: 7 }, answer: 56 }));
    expect(h?.visual).toEqual({ kind: 'array', rows: 7, cols: 8 });
  });

  it('12 ÷ 3 dibagi ke 3 baris, bukan "Take 3" atau ten-frame', () => {
    const h = hintFor(moduleById('g3-u3-m4').learn, q({ text: '12 ÷ 3 = ?', params: { n: 4 }, answer: 4 }));
    expect(h?.visual).toEqual({ kind: 'array', rows: 3, cols: 4 });
  });

  it('20 ? 20 adalah perbandingan, bukan 20 − 20', () => {
    const h = hintFor(moduleById('g1-u5-m5').learn, q({ text: '20 ? 20', params: { a: 20, b: 20 }, answer: 0 }));
    expect(h?.prompt).toBe('Look at both.');
  });

  it('soal bersisa menggambar SEMUA bendanya, sisanya di baris terakhir', () => {
    const h = hintFor(
      moduleById('g3-u3-m6').learn,
      q({ text: 'Share 13 between 4. How many left over?', params: { n: 13, d: 4 }, answer: 1 }),
    );
    expect(h?.visual).toEqual({ kind: 'counter-objects', count: 13, columns: 4 });
  });

  it('angka kebetulan di soal cerita tidak jadi operasi', () => {
    const question = q({
      text: '2 cakes cost 4 coins. What do 3 cakes cost?',
      params: { a: 2, b: 4, c: 3 },
      answer: 6,
      story: true,
    });
    expect(operandsOf(question)).toBeNull();
  });

  it('setiap hint yang dibangun dari angka soal cocok dengan jawabannya, di semua modul', () => {
    const bad: string[] = [];
    for (const m of all) {
      for (const rule of m.rules) {
        const combos = enumerate(rule);
        const step = Math.max(1, Math.floor(combos.length / 12));
        for (let i = 0; i < combos.length; i += step) {
          const params = combos[i]!;
          const visual = rule.visual?.(params);
          const question = q({
            type: rule.type,
            skill: rule.skill,
            text: rule.text(params),
            answer: rule.answer(params) as number,
            params,
            ...(visual ? { visual } : {}),
            ...(rule.story ? { story: true as const } : {}),
            ...(rule.range ? { range: rule.range } : {}),
            ...(rule.hint ? { hint: rule.hint(params) } : {}),
          });
          const h = hintFor(m.learn, question);
          if (!h || m.learn.some((l) => l.visual === h.visual)) continue;
          const v = h.visual;
          const ans = question.answer;
          const where = `${m.id} "${question.text}" → ${h.prompt}`;
          if (v.kind === 'number-bond' && v.ask === 'whole' && v.parts[0] != null && v.parts[1] != null) {
            if (v.parts[0] + v.parts[1] !== ans) bad.push(where);
          }
          if (v.kind === 'ten-frame' && h.prompt === 'Count one by one.' && v.value !== ans) bad.push(where);
          const take = h.prompt.match(/^Start with (\d+)\. Take (\d+)\.$/);
          if (take && Number(take[1]) - Number(take[2]) !== ans) bad.push(where);
          if (v.kind === 'column-sum' && (v.op === '−' ? v.a - v.b : v.a + v.b) !== ans) bad.push(where);
          if (v.kind === 'array' && !v.square) {
            const rows = h.prompt.match(/(\d+) rows? of (\d+)/);
            if (rows && (Number(rows[1]) !== v.rows || Number(rows[2]) !== v.cols)) bad.push(where);
            const took = h.prompt.match(/Take (\d+) rows?/);
            const ok = took
              ? Number(took[1]) * v.cols === ans
              : [v.rows * v.cols, v.rows, v.cols].includes(ans) ||
                /Then times/.test(h.prompt);
            if (!ok) bad.push(where);
          }
        }
      }
    }
    expect(bad).toEqual([]);
  });
});
