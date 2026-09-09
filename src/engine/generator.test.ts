import { describe, expect, it } from 'vitest';
import { answerCaps, generateSet } from './generator';
import { mulberry32 } from './rng';
import { addModule } from './fixtures';
import type { ModuleDef, QuestionRule } from './types';

describe('generator', () => {
  it('tidak pernah mengulang soal identik dalam satu sesi', () => {
    const set = generateSet(addModule(), 12, mulberry32(1));
    const keys = set.questions.map((q) => `${q.type}:${q.text}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('dua aturan boleh memakai parameter sama untuk soal yang berbeda', () => {
    const def = addModule();
    const withTwin = {
      ...def,
      rules: [
        def.rules[0]!,
        { ...def.rules[0]!, text: (p: Record<string, number>) => `${p.a} plus ${p.b} = ?` },
      ],
    };
    const set = generateSet(withTwin, 12, mulberry32(11));
    expect(set.questions.some((q) => q.text.includes('plus'))).toBe(true);
  });

  it('menghormati exclude (tidak ada penjumlahan melebihi 10)', () => {
    const set = generateSet(addModule(), 20, mulberry32(2));
    for (const q of set.questions) {
      if (q.type === 'choose-number') expect(q.answer).toBeLessThanOrEqual(10);
    }
  });

  it('requireCoverage memunculkan setiap questionType minimal sekali', () => {
    const def = addModule();
    const set = generateSet(def, 8, mulberry32(3), { requireCoverage: true });
    for (const t of def.questionTypes) {
      expect(set.questions.some((q) => q.type === t)).toBe(true);
    }
  });

  it('pilihan jawaban: 4 buah, unik, tidak negatif, memuat jawaban benar', () => {
    const set = generateSet(addModule(), 20, mulberry32(4));
    for (const q of set.questions.filter((x) => x.choices)) {
      const c = q.choices as number[];
      expect(c).toHaveLength(4);
      expect(new Set(c).size).toBe(4);
      expect(c).toContain(q.answer);
      expect(c.every((n) => n >= 0)).toBe(true);
    }
  });

  it('pengecoh masuk akal — tidak ada yang jauh di luar rentang jawaban', () => {
    const set = generateSet(addModule(), 30, mulberry32(5));
    for (const q of set.questions.filter((x) => x.choices)) {
      for (const c of q.choices as number[]) {
        expect(Math.abs(c - q.answer)).toBeLessThanOrEqual(10);
      }
    }
  });

  it('distribusi merata — tidak ada soal yang mendominasi (1000 sampel)', () => {
    const counts = new Map<string, number>();
    for (let seed = 0; seed < 100; seed++) {
      const set = generateSet(addModule(), 10, mulberry32(seed));
      for (const q of set.questions) {
        const k = `${q.type}:${JSON.stringify(q.params)}`;
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
    }
    const values = [...counts.values()];
    const total = values.reduce((a, b) => a + b, 0);
    const max = Math.max(...values);
    // tidak ada satu soal pun yang mengambil lebih dari 3% seluruh kemunculan
    expect(max / total).toBeLessThan(0.03);
    expect(counts.size).toBeGreaterThan(30);
  });

  it('modul tanpa aturan adalah kesalahan konten, bukan sesi kosong', () => {
    expect(() => generateSet(addModule({ rules: [] }), 5, mulberry32(1))).toThrow();
  });
});

describe('skala pengecoh', () => {
  // Regresi: "Round 270 to the nearest hundred" pernah menawarkan 298 dan 302.
  // Anak yang tahu artinya "pembulatan" bisa mencoret keduanya tanpa berhitung,
  // jadi soalnya menilai hal yang salah.
  it('distractorUnit membuat semua pilihan sekelipatan jawaban', () => {
    const def: ModuleDef = {
      ...addModule(),
      rules: [
        {
          type: 'choose-number',
          skill: 'round',
          params: { n: [11, 99] },
          answer: (p) => Math.round((p.n as number) / 10) * 100,
          text: (p) => `Round ${(p.n as number) * 10}.`,
          exclude: (p) => (p.n as number) % 10 === 0,
          distractors: 'near',
          distractorUnit: 100,
        },
      ],
    };

    const { questions } = generateSet(def, 10, mulberry32(7));
    expect(questions.length).toBeGreaterThan(0);
    for (const q of questions) {
      for (const c of q.choices ?? []) expect(c % 100).toBe(0);
    }
  });

  it('tanpa distractorUnit pengecoh tetap rapat di sekitar jawaban', () => {
    const def: ModuleDef = {
      ...addModule(),
      rules: [
        {
          type: 'choose-number',
          skill: 'add',
          params: { a: [1, 9], b: [1, 9] },
          answer: (p) => (p.a as number) + (p.b as number),
          text: (p) => `${p.a} + ${p.b} = ?`,
          distractors: 'near',
        },
      ],
    };

    const { questions } = generateSet(def, 10, mulberry32(7));
    for (const q of questions) {
      for (const c of q.choices ?? []) expect(Math.abs(c - q.answer)).toBeLessThanOrEqual(4);
    }
  });
});

describe('pilihan choose-text', () => {
  // Regresi: urutan tombol dulu persis seperti ditulis di konten, jadi aturan yang
  // jawabannya selalu indeks 0 menaruh jawaban benar di tombol yang sama terus.
  it('urutan tombolnya diacak, bukan urutan penulisan', () => {
    const def: ModuleDef = {
      ...addModule(),
      questionTypes: ['choose-text'],
      rules: [
        {
          type: 'choose-text',
          skill: 'name',
          params: { a: [1, 9], b: [1, 9] },
          answer: () => 0,
          text: (p) => `${p.a} and ${p.b}?`,
          options: (p) => [`${p.a}`, `${p.b}`, 'none', 'both'],
        },
      ],
    };

    const { questions } = generateSet(def, 12, mulberry32(3));
    const firsts = questions.map((q) => q.choices?.[0]);
    expect(new Set(firsts).size).toBeGreaterThan(1);
    for (const q of questions) {
      expect([...(q.choices ?? [])].sort()).toEqual([0, 1, 2, 3]);
    }
  });
});

/**
 * Kemampuan input keypad diturunkan per ATURAN, bukan per soal.
 *
 * Kalau per soal, munculnya tombol minus pada "3 − 8 = ?" sudah memberi tahu anak
 * bahwa jawabannya di bawah nol sebelum dia berhitung — tombolnya menjawab soalnya.
 * Karena itu `answerCaps` memindai seluruh ruang parameter aturan, persis seperti
 * `maxDigits` yang sudah lebih dulu memakai alasan yang sama.
 */
describe('kemampuan input diturunkan per rule', () => {
  const rule = (over: Partial<QuestionRule>): QuestionRule => ({
    type: 'keypad',
    skill: 'x',
    params: { a: [1, 9] },
    answer: (p) => p.a as number,
    text: (p) => `${p.a} = ?`,
    ...over,
  });

  it('bilangan bulat positif tidak memunculkan tombol apa pun', () => {
    const caps = answerCaps(rule({}));
    expect(caps).toMatchObject({ decimal: false, negative: false, digits: 1, untypable: null });
  });

  it('aturan berjawaban desimal minta titik; berjawaban negatif minta minus', () => {
    expect(answerCaps(rule({ answer: (p) => (p.a as number) / 2 }))).toMatchObject({
      decimal: true,
      negative: false,
    });
    expect(answerCaps(rule({ answer: (p) => -(p.a as number) }))).toMatchObject({
      decimal: false,
      negative: true,
    });
  });

  it('digit dihitung tanpa tanda dan titik: −7.25 adalah 3 digit', () => {
    const caps = answerCaps(rule({ params: { a: [1, 1] }, answer: () => -7.25 }));
    expect(caps.digits).toBe(3);
  });

  it('galat float tidak dibaca sebagai jawaban belasan digit', () => {
    // 0.1 + 0.2 = 0.30000000000000004. Tanpa normalisasi ini 17 digit dan
    // aturan yang sempurna wajar akan ditolak linter karena hal yang bukan isinya.
    const caps = answerCaps(rule({ params: { a: [1, 1] }, answer: () => 0.1 + 0.2 }));
    expect(caps.digits).toBe(2);
    expect(caps.decimal).toBe(true);
  });

  it('jawaban yang tak bisa dituliskan dilaporkan, bukan dibulatkan diam-diam', () => {
    const caps = answerCaps(rule({ params: { a: [1, 1] }, answer: () => 1 / 0 }));
    expect(caps.untypable).toBe(Infinity);
  });

  it('SEMUA soal dari satu aturan membawa kapabilitas yang sama, walau jawabannya tidak', () => {
    // Aturan campur: sebagian jawabannya negatif, sebagian tidak. Soal yang
    // jawabannya positif tetap harus menampilkan tombol minus — kalau tidak,
    // tidak adanya tombol itu sendiri sudah membocorkan tanda jawabannya.
    const def: ModuleDef = {
      ...addModule(),
      questionTypes: ['keypad'],
      rules: [
        {
          type: 'keypad',
          skill: 'integers',
          params: { a: [1, 9], b: [1, 9] },
          answer: (p) => (p.a as number) - (p.b as number),
          text: (p) => `${p.a} − ${p.b} = ?`,
        },
      ],
    };
    const { questions } = generateSet(def, 12, mulberry32(5));
    expect(questions.some((q) => q.answer < 0)).toBe(true);
    expect(questions.some((q) => q.answer > 0)).toBe(true);
    for (const q of questions) {
      expect(q.allowNegative).toBe(true);
      expect(q.allowDecimal).toBe(false);
    }
  });

  it('modul biasa tidak mendapat tombol tambahan sama sekali', () => {
    const { questions } = generateSet(addModule(), 12, mulberry32(2));
    for (const q of questions) {
      expect(q.allowNegative).toBe(false);
      expect(q.allowDecimal).toBe(false);
    }
  });
});
