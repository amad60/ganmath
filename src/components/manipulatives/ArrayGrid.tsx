import { teachingDuration, useReducedMotion } from './useReducedMotion';

export type ArrayGridProps = {
  rows: number;
  cols: number;
  /** Tandai satu baris untuk menunjukkan "satu kelompok". */
  highlightRow?: number;
  size?: number;
};

/**
 * Array baris × kolom — cara perkalian pertama kali masuk akal.
 *
 * Anak bisa MELIHAT bahwa 3 baris berisi 4 sama dengan 4 kolom berisi 3, jadi
 * sifat komutatif tidak perlu dihafal. Dipakai dari Grade 2 (pengenalan perkalian)
 * sampai Grade 5 (luas).
 */
export function ArrayGrid({ rows, cols, highlightRow, size = 22 }: ArrayGridProps) {
  const reduced = useReducedMotion();
  const dot = Math.max(10, Math.min(size, 200 / Math.max(rows, cols)));

  return (
    <div
      className="flex flex-col gap-1.5"
      aria-label={`${rows} rows of ${cols}`}
      style={{ alignItems: 'center' }}
    >
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex gap-1.5">
          {Array.from({ length: cols }, (_, c) => (
            <span
              key={c}
              style={{
                width: dot,
                height: dot,
                borderRadius: 999,
                background:
                  highlightRow === r ? 'var(--c-unit-3)' : 'var(--c-primary)',
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
