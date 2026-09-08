import { describe, expect, it } from 'vitest';
import { isUnlocked, nextModule, validateRegistry, type Registry } from './unlock';
import { addModule, state } from './fixtures';
import type { ModuleState } from './types';

function registry(): Registry {
  const m1 = addModule({ id: 'm1', prereq: [] });
  const m2 = addModule({ id: 'm2', prereq: ['m1'] });
  const m3 = addModule({ id: 'm3', prereq: ['m2'] });
  return { modules: { m1, m2, m3 }, pathOrder: ['m1', 'm2', 'm3'] };
}

const cleared = (): ModuleState => state({ status: 'mastered' });

describe('gating', () => {
  it('modul pertama terbuka sejak awal', () => {
    expect(isUnlocked('m1', {}, registry())).toBe(true);
  });

  it('modul berikutnya terkunci sampai sebelumnya lewat', () => {
    expect(isUnlocked('m2', {}, registry())).toBe(false);
    expect(isUnlocked('m2', { m1: cleared() }, registry())).toBe(true);
  });

  it('status practiced (paham tapi lambat) tetap membuka modul berikutnya', () => {
    expect(isUnlocked('m2', { m1: state({ status: 'practiced' }) }, registry())).toBe(true);
  });

  it('needs_review tidak mengunci ulang modul berikutnya', () => {
    const states = { m1: state({ status: 'needs_review' }), m2: cleared() };
    expect(isUnlocked('m3', states, registry())).toBe(true);
  });

  it('gating ketat: tidak bisa melompat meski prereq langsung terpenuhi', () => {
    const r: Registry = {
      modules: { m1: addModule({ id: 'm1', prereq: [] }), m3: addModule({ id: 'm3', prereq: [] }) },
      pathOrder: ['m1', 'm3'],
    };
    expect(isUnlocked('m3', {}, r)).toBe(false);
  });

  it('nextModule menunjuk modul yang harus dikerjakan sekarang', () => {
    expect(nextModule({ m1: cleared() }, registry())).toBe('m2');
    expect(nextModule({ m1: cleared(), m2: cleared(), m3: cleared() }, registry())).toBeNull();
  });

  it('menambah modul baru tidak mengunci progress lama', () => {
    const r = registry();
    r.modules.m4 = addModule({ id: 'm4', prereq: ['m3'] });
    r.pathOrder.push('m4');
    const states = { m1: cleared(), m2: cleared(), m3: cleared() };
    expect(isUnlocked('m4', states, r)).toBe(true);
  });
});

describe('validasi registry (dipakai linter konten)', () => {
  it('registry sehat tidak menghasilkan masalah', () => {
    expect(validateRegistry(registry())).toEqual([]);
  });

  it('mendeteksi prasyarat melingkar', () => {
    const r = registry();
    r.modules.m1 = addModule({ id: 'm1', prereq: ['m3'] });
    const problems = validateRegistry(r);
    expect(problems.some((p) => p.problem.includes('melingkar'))).toBe(true);
  });

  it('mendeteksi prereq yang tidak ada', () => {
    const r = registry();
    r.modules.m2 = addModule({ id: 'm2', prereq: ['hantu'] });
    expect(validateRegistry(r).some((p) => p.problem.includes('tidak ada'))).toBe(true);
  });

  it('mendeteksi modul yang lupa dimasukkan ke pathOrder', () => {
    const r = registry();
    r.modules.m9 = addModule({ id: 'm9', prereq: [] });
    expect(validateRegistry(r).some((p) => p.problem.includes('pathOrder'))).toBe(true);
  });

  it('mendeteksi fluencyTracked pada modul non-fact', () => {
    const r = registry();
    r.modules.m2 = addModule({ id: 'm2', prereq: ['m1'], kind: 'concept', fluencyTracked: true });
    expect(validateRegistry(r).some((p) => p.problem.includes('fluencyTracked'))).toBe(true);
  });

  it('mendeteksi modul dengan kurang dari 2 questionTypes', () => {
    const r = registry();
    r.modules.m2 = addModule({ id: 'm2', prereq: ['m1'], questionTypes: ['keypad'] });
    expect(validateRegistry(r).some((p) => p.problem.includes('2 questionTypes'))).toBe(true);
  });
});
