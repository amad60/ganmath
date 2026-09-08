import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Penjaga aturan arsitektur (docs/tech/architecture.md §2).
 * Aturan penguasaan terlalu mudah salah diam-diam untuk disembunyikan di dalam komponen —
 * karena itu engine harus bisa diuji tanpa DOM sama sekali.
 */
function filesIn(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? filesIn(join(dir, e.name)) : [join(dir, e.name)],
  );
}

describe('aturan arsitektur', () => {
  it('src/engine tidak mengimpor React, komponen, atau store', () => {
    const offenders: string[] = [];
    for (const f of filesIn('src/engine').filter((f) => f.endsWith('.ts'))) {
      const src = readFileSync(f, 'utf8');
      if (/from\s+['"](react|react-dom|motion|zustand)/.test(src)) offenders.push(f);
      if (/from\s+['"].*\/(components|store|app)\//.test(src)) offenders.push(f);
    }
    expect(offenders).toEqual([]);
  });
});
