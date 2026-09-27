import { useEffect, useState } from 'react';
import { teachingDuration, useReducedMotion } from './useReducedMotion';

export type ArrayGridProps = {
  rows: number;
  cols: number;
  /** Tandai satu baris untuk menunjukkan "satu kelompok". */
  highlightRow?: number;
  /**
   * Gambar petak persegi yang berdempetan, bukan penanda bulat berjarak.
   *
   * Harus dinyalakan sendiri: penanda bulat masih benar untuk perkalian dan
   * perseratusan — di sana yang dihitung BENDA, dan bentuknya tidak berarti apa-apa.
   * Luas berbeda: gagasannya justru MENUTUP bidang dengan persegi, dan titik bulat
   * meninggalkan celah, jadi bidangnya tidak pernah tampak tertutup.
   */
  square?: boolean;
  size?: number;
  /** Berapa baris yang sudah dibuka. Kosong = semua, kecuali `play` mengatur sendiri. */
  visibleRows?: number;
  /** Munculkan baris satu per satu. Baris terakhir tetap tersembunyi kalau `omitLast`. */
  play?: boolean;
  omitLast?: boolean;
};

/**
 * Array baris × kolom — cara perkalian pertama kali masuk akal.
 *
 * Anak bisa MELIHAT bahwa 3 baris berisi 4 sama dengan 4 kolom berisi 3, jadi
 * sifat komutatif tidak perlu dihafal. Dipakai dari Grade 2 (pengenalan perkalian)
 * sampai Grade 5 (luas).
 */
const ROW_MS = 420;

export function ArrayGrid({
  rows,
  cols,
  highlightRow,
  square,
  size = 22,
  visibleRows,
  play = false,
  omitLast = false,
}: ArrayGridProps) {
  const reduced = useReducedMotion();
  const dot = Math.max(10, Math.min(size, 200 / Math.max(rows, cols)));
  const cap = omitLast ? Math.max(1, rows - 1) : rows;
  const [played, setPlayed] = useState(play ? 1 : rows);

  useEffect(() => {
    if (visibleRows != null) return;
    if (!play) {
      setPlayed(rows);
      return;
    }
    setPlayed(1);
    if (cap <= 1) return;
    let n = 1;
    const id = window.setInterval(() => {
      n += 1;
      setPlayed(Math.min(n, cap));
      if (n >= cap) window.clearInterval(id);
    }, teachingDuration(ROW_MS, reduced));
    return () => window.clearInterval(id);
  }, [play, rows, cap, reduced, visibleRows]);

  const shown = Math.max(1, Math.min(visibleRows ?? (play ? played : rows), rows));
  const label =
    shown < rows
      ? `${shown} of ${rows} rows, ${cols} in each`
      : square
        ? `${rows} rows of ${cols} squares`
        : `${rows} rows of ${cols}`;

  return (
    <div
      className={square ? 'flex flex-col' : 'flex flex-col gap-1.5'}
      aria-label={label}
      style={{ alignItems: 'center' }}
    >
      {Array.from({ length: shown }, (_, r) => (
        <div key={r} className={square ? 'flex' : 'flex gap-1.5'}>
          {Array.from({ length: cols }, (_, c) => (
            <span
              key={c}
              style={{
                width: dot,
                height: dot,
                borderRadius: square ? 3 : 999,
                background:
                  highlightRow === r ? 'var(--c-unit-3)' : 'var(--c-primary)',
                // Petak yang berdempetan butuh garis pemisah, kalau tidak seluruh
                // bidang jadi satu blok pekat dan tidak ada lagi yang bisa dihitung.
                boxShadow: square ? 'inset 0 0 0 1.5px var(--c-surface)' : undefined,
                display: 'block',
                animation: `fade-rise ${teachingDuration(220, reduced)}ms ${(r * cols + c) * 18}ms both`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
