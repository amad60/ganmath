import { describe, expect, it } from 'vitest';
import { lintContent } from './lint';
import { all, registry } from './index';
import type { ContentModule } from './types';

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
