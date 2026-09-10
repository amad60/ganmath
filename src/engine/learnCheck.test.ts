import { describe, expect, it } from 'vitest';
import { learnCheck } from './learnCheck';
import { all, moduleById } from '../content';
import { addModule } from './fixtures';

/**
 * Pengecekan pemahaman menutup lubang yang terukur di konten: dari 252 langkah Learn
 * yang menuntut aksi, 240 ada di tahap `concrete`, dan NOL dari 314 langkah `abstract`
 * meminta apa pun. Karena untuk langkah `watch` tombol Next aktif seketika, anak bisa
 * sampai di ujung materi tanpa pernah menyentuh idenya.
 */
describe('pengecekan pemahaman akhir materi', () => {
  it('SETIAP modul punya pengecekan — kalau tidak, ada modul yang tetap bisa dilewati pasif', () => {
    const tanpa = all.filter((m) => learnCheck(m, 7) == null);
    expect(tanpa.map((m) => m.id)).toEqual([]);
  });

  it('jawaban benar SELALU ada di antara pilihan', () => {
    const salah: string[] = [];
    for (const m of all) {
      for (const seed of [1, 99, 12345]) {
        const c = learnCheck(m, seed);
        if (!c) continue;
        if (!c.choices.includes(c.question.answer)) salah.push(`${m.id}@${seed}`);
        if (c.choices.length < 2) salah.push(`${m.id}@${seed} (pilihan < 2)`);
      }
    }
    expect(salah).toEqual([]);
  });

  it('pilihan tidak pernah kembar — dua tombol bertulisan sama menghukum anak yang benar', () => {
    const kembar: string[] = [];
    for (const m of all) {
      const c = learnCheck(m, 5);
      if (!c) continue;
      const label: string[] = c.choices.map((i) => String(c.options ? c.options[i] : i));
      if (new Set(label).size !== label.length) kembar.push(m.id);
    }
    expect(kembar).toEqual([]);
  });

  it('seed yang sama memberi soal yang sama — ia tidak boleh berganti saat anak berpikir', () => {
    const a = learnCheck(moduleById('g1-u2-m5'), 42);
    const b = learnCheck(moduleById('g1-u2-m5'), 42);
    expect(a?.question.text).toBe(b?.question.text);
    expect(a?.choices).toEqual(b?.choices);
  });

  it('soalnya dibuat dari aturan modul itu sendiri, jadi tidak bisa melenceng dari materinya', () => {
    const def = moduleById('g1-u2-m5');
    const c = learnCheck(def, 3);
    expect(def.questionTypes).toContain(c?.question.type);
    expect(def.skills).toContain(c?.question.skill);
  });

  it('modul yang aturannya rusak tidak menjatuhkan layar materi', () => {
    const rusak = addModule({ rules: [] });
    expect(() => learnCheck(rusak, 1)).not.toThrow();
    expect(learnCheck(rusak, 1)).toBeNull();
  });
});
