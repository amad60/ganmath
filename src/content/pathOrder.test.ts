import { describe, expect, it } from 'vitest';
import { pathOrder } from './index';
import mirror from './pathOrder.json';

describe('pathOrder.json', () => {
  // Cermin statis untuk skrip screenshot. Kalau ia melenceng, `npm run shots --from=`
  // akan menyeed modul yang salah dan hasil pemeriksaan visual jadi menyesatkan.
  it('sama persis dengan registry', () => {
    expect(mirror.pathOrder).toEqual(pathOrder);
  });
});
