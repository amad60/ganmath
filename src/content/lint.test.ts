import { describe, expect, it } from 'vitest';
import { lintContent } from './lint';
import { all, registry } from './index';
import { generateSet } from '../engine/generator';
import { mulberry32 } from '../engine/rng';
import { answerDigitCount } from '../engine/answer';
import type { ContentModule } from './types';
import { snapToStep, stepFor } from '../components/manipulatives/scale';

describe('linter konten', () => {
  it('seluruh konten yang terdaftar lolos semua aturan', () => {
    const problems = lintContent(all, registry);
    expect(problems).toEqual([]);
  });

  const broken = (patch: Partial<ContentModule>): ContentModule[] => {
    const base = all[0] as ContentModule;
    return [{ ...base, ...patch }];
  };
  const reg = (mods: ContentModule[]) => ({
    modules: Object.fromEntries(mods.map((m) => [m.id, m])),
    pathOrder: mods.map((m) => m.id),
  });

  it('menolak instruksi lebih dari 8 kata', () => {
    const mods = broken({
      learn: [
        {
          stage: 'concrete',
          prompt: 'Tap on each one of the apples to count them all now',
          visual: { kind: 'counter-objects', count: 3 },
          action: 'watch',
        },
      ],
    });
    const problems = lintContent(mods, reg(mods));
    expect(problems.some((p) => p.rule === 'prompt-length')).toBe(true);
  });

  it('menolak kata yang belum diperkenalkan', () => {
    const mods = broken({
      vocab: [],
      learn: [
        {
          stage: 'concrete',
          prompt: 'Estimate the quantity.',
          visual: { kind: 'counter-objects', count: 3 },
          action: 'watch',
        },
      ],
    });
    const problems = lintContent(mods, reg(mods));
    expect(problems.some((p) => p.rule === 'vocab' && p.detail.includes('estimate'))).toBe(true);
  });

  it('menolak modul yang melewatkan tahap CPA', () => {
    const mods = broken({
      learn: [
        {
          stage: 'abstract',
          prompt: 'We write it as 3.',
          visual: { kind: 'ten-frame', value: 3 },
          action: 'watch',
        },
      ],
    });
    const problems = lintContent(mods, reg(mods));
    expect(problems.filter((p) => p.rule === 'cpa').length).toBeGreaterThan(0);
  });

  it('menolak tipe soal yang belum bisa dirender layar soal', () => {
    const mods = broken({ questionTypes: ['choose-number', 'bar-model'] });
    const problems = lintContent(mods, reg(mods));
    expect(problems.some((p) => p.rule === 'renderable')).toBe(true);
  });

  it('menolak modul fakta tanpa pengecoh miskonsepsi', () => {
    const base = all[0] as ContentModule;
    const mods = broken({
      kind: 'fact',
      fluencyTracked: true,
      rules: base.rules.map((r) => {
        const { misconception, ...rest } = r;
        void misconception;
        return rest;
      }),
    });
    const problems = lintContent(mods, reg(mods));
    expect(problems.some((p) => p.rule === 'misconception')).toBe(true);
  });

  /**
   * Bug nyata: "Tap the three corners." digambar dengan visual shape2d yang waktu itu
   * cuma gambar mati. Nilai tap tidak pernah naik, tombol Next tidak pernah aktif,
   * dan anak terjebak di layar pertama Grade 1 unit 6.
   */
  it('menolak aksi di atas manipulatif yang tidak bisa menerimanya', () => {
    const mods = broken({
      learn: [
        {
          stage: 'concrete',
          prompt: 'Tap the three corners.',
          visual: { kind: 'shape2d', name: 'triangle', showCorners: true },
          action: 'tap-count',
          target: 3,
        },
      ],
    });
    const problems = lintContent(mods, reg(mods));
    expect(problems.some((p) => p.rule === 'learn-action')).toBe(true);
  });

  it('menolak target yang lebih banyak daripada yang digambar', () => {
    const tooMany = broken({
      learn: [
        {
          stage: 'concrete',
          prompt: 'Tap each one.',
          visual: { kind: 'counter-objects', count: 3 },
          action: 'tap-count',
          target: 5,
        },
      ],
    });
    expect(lintContent(tooMany, reg(tooMany)).some((p) => p.rule === 'learn-action')).toBe(true);

    const shape = broken({
      learn: [
        {
          stage: 'concrete',
          prompt: 'Tap the five corners.',
          visual: { kind: 'shape2d', name: 'triangle', showCorners: true, tap: 'corners' },
          action: 'tap-count',
          target: 5,
        },
      ],
    });
    expect(lintContent(shape, reg(shape)).some((p) => p.rule === 'learn-action')).toBe(true);
  });

  it('menolak pilihan kata yang tinggal dua setelah tulisan kembar dibuang', () => {
    const base = all[0] as ContentModule;
    const mods = broken({
      questionTypes: ['choose-text'],
      rules: [
        {
          type: 'choose-text',
          skill: base.rules[0]!.skill,
          params: { a: [1, 4] },
          answer: () => 0,
          text: (p) => `Which is ${p.a}?`,
          // Tiga dari empat pilihan bertulisan sama: yang tersisa cuma dua tombol.
          options: (p) => [`${p.a}`, `${p.a}`, `${p.a}`, 'none'],
        },
      ],
    });
    const problems = lintContent(mods, reg(mods));
    expect(problems.some((p) => p.rule === 'choices')).toBe(true);
  });

  it('menolak langkah interaktif yang lupa target', () => {
    const mods = broken({
      learn: [
        {
          stage: 'concrete',
          prompt: 'Tap each one.',
          visual: { kind: 'counter-objects', count: 3 },
          action: 'tap-count',
        },
      ],
    });
    const problems = lintContent(mods, reg(mods));
    expect(problems.some((p) => p.rule === 'learn-target')).toBe(true);
  });

  /**
   * Bug nyata: keypad terkunci 3 digit sementara g3-u1-m2 berjawaban sampai 9990,
   * jadi soalnya tidak bisa dijawab sama sekali. Linter tidak menangkapnya karena
   * tidak tahu batas UI — sekarang tahu.
   */
  it('setiap soal ketik muat di keypadnya sendiri, di seluruh konten', () => {
    for (const m of all) {
      const { questions } = generateSet(m, 12, mulberry32(9));
      for (const q of questions) {
        if (q.choices || q.type === 'number-line-drop') continue;
        // Yang dihitung digitnya saja: tanda minus dan titik punya tombol sendiri.
        expect(answerDigitCount(q.answer)).toBeLessThanOrEqual(q.maxDigits);
      }
    }
  });

  it('menolak rule ketik yang jawabannya lebih lebar dari keypad', () => {
    const mods = broken({
      questionTypes: ['keypad'],
      rules: [
        {
          type: 'keypad',
          skill: 'too-wide',
          params: { a: [1, 9] },
          answer: (p) => (p.a as number) * 1_000_000,
          text: (p) => `${p.a} millions = ?`,
        },
      ],
    });
    const problems = lintContent(mods, reg(mods));
    expect(problems.some((p) => p.rule === 'input-width')).toBe(true);
  });

  /**
   * `input-width` dulu menolak SEMUA jawaban desimal dan negatif, karena keypad
   * memang tidak punya tombolnya. Sekarang punya — dan tombolnya muncul per rule
   * (lihat `answerCaps`), jadi tiga unit yang inti materinya justru menuliskan
   * angka semacam itu (g5-u2 desimal, g5-u3 persen, g6-u1 bilangan bulat) tidak
   * lagi terpaksa dibangun sebagai soal pilihan.
   */
  it('menerima rule ketik yang jawabannya desimal — keypad punya titik', () => {
    const mods = broken({
      questionTypes: ['keypad'],
      rules: [
        {
          type: 'keypad',
          skill: 'half',
          params: { a: [1, 9] },
          answer: (p) => (p.a as number) / 2,
          text: (p) => `Half of ${p.a} = ?`,
        },
      ],
    });
    const problems = lintContent(mods, reg(mods));
    expect(problems.filter((p) => p.rule === 'input-width')).toEqual([]);
  });

  it('menerima rule ketik yang jawabannya negatif — keypad punya minus', () => {
    const mods = broken({
      questionTypes: ['keypad'],
      rules: [
        {
          type: 'keypad',
          skill: 'below-zero',
          params: { a: [1, 9] },
          answer: (p) => -(p.a as number),
          text: (p) => `0 − ${p.a} = ?`,
        },
      ],
    });
    const problems = lintContent(mods, reg(mods));
    expect(problems.filter((p) => p.rule === 'input-width')).toEqual([]);
    // Aturan lama "tidak boleh jawaban negatif" juga tidak boleh ikut menyala.
    expect(problems.filter((p) => p.rule === 'generator')).toEqual([]);
  });

  it('tetap menolak desimal yang tak berujung — 1/3 tidak bisa diketik anak', () => {
    const mods = broken({
      questionTypes: ['keypad'],
      rules: [
        {
          type: 'keypad',
          skill: 'third',
          params: { a: [1, 9] },
          answer: (p) => (p.a as number) / 3,
          text: (p) => `${p.a} ÷ 3 = ?`,
        },
      ],
    });
    const problems = lintContent(mods, reg(mods));
    expect(problems.some((p) => p.rule === 'input-width')).toBe(true);
  });

  it('jawaban pilihan ganda tetap tidak boleh negatif — pengecohnya jadi mustahil', () => {
    const mods = broken({
      questionTypes: ['choose-number'],
      rules: [
        {
          type: 'choose-number',
          skill: 'below-zero',
          params: { a: [1, 9] },
          answer: (p) => -(p.a as number),
          text: (p) => `0 − ${p.a} = ?`,
        },
      ],
    });
    const problems = lintContent(mods, reg(mods));
    expect(problems.some((p) => p.rule === 'generator' && /negatif/.test(p.detail))).toBe(true);
  });

  /**
   * Bug nyata: g3-u1-m5 memasang garis 0–10.000 berjawaban kelipatan 1000, tapi
   * penandanya melompat per satu satuan — jawabannya mustahil disentuh anak.
   * Sekarang langkahnya diturunkan dari rentang, dan linter memeriksa jawabannya
   * benar-benar mendarat di sana.
   */
  it('setiap jawaban number-line-drop bisa disentuh anak, di seluruh konten', () => {
    for (const m of all) {
      const { questions } = generateSet(m, 12, mulberry32(4));
      for (const q of questions) {
        if (q.type !== 'number-line-drop') continue;
        const [lo, hi] = q.range as [number, number];
        expect(snapToStep(q.answer, lo, q.step ?? stepFor(lo, hi))).toBe(q.answer);
      }
    }
  });

  it('menolak number-line-drop yang jawabannya bukan kelipatan langkah', () => {
    const mods = broken({
      questionTypes: ['number-line-drop'],
      rules: [
        {
          type: 'number-line-drop',
          skill: 'off-step',
          params: { n: [1, 20] },
          range: [0, 10000],
          // Langkah otomatis garis 0–10.000 adalah 1000: 1234 tidak akan pernah kena.
          answer: (p) => (p.n as number) * 1234,
          text: (p) => `Put ${(p.n as number) * 1234} on the line.`,
        },
      ],
    });
    const problems = lintContent(mods, reg(mods));
    expect(problems.some((p) => p.rule === 'number-line-step')).toBe(true);
  });

  it('menerima langkah bukan bilangan bulat kalau modulnya menuliskan step-nya', () => {
    const mods = broken({
      questionTypes: ['number-line-drop'],
      rules: [
        {
          type: 'number-line-drop',
          skill: 'tenths',
          params: { n: [1, 9] },
          range: [0, 1],
          step: 0.1,
          answer: (p) => (p.n as number) / 10,
          text: (p) => `Put 0.${p.n} on the line.`,
        },
      ],
    });
    const problems = lintContent(mods, reg(mods));
    expect(problems.some((p) => p.rule === 'number-line-step')).toBe(false);
  });

  it('menolak langkah Learn yang targetnya tidak bisa didaratkan', () => {
    const mods = broken({
      learn: [
        {
          stage: 'concrete',
          prompt: 'Put 105 on the line.',
          visual: { kind: 'number-line', min: 0, max: 10000, value: null },
          action: 'drop-on-line',
          target: 105,
        },
      ],
    });
    const problems = lintContent(mods, reg(mods));
    expect(problems.some((p) => p.rule === 'number-line-step')).toBe(true);
  });

  it('menolak modul yang aturan soalnya terlalu sempit untuk satu sesi', () => {
    const base = all[0] as ContentModule;
    const mods = broken({
      rules: [{ ...(base.rules[0] as ContentModule['rules'][number]), params: { n: [1, 2] } }],
      questionTypes: [(base.rules[0] as ContentModule['rules'][number]).type],
    });
    const problems = lintContent(mods, reg(mods));
    expect(problems.some((p) => p.rule === 'generator' || p.rule === 'question-types')).toBe(true);
  });
});
