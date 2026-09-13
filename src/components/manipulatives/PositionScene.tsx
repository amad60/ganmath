import type { Place, PositionVisual } from '../../engine/types';

/** Urutan baku kata letak — dipakai sebagai indeks jawaban oleh modul dan lint. */
export const PLACES: Place[] = ['above', 'below', 'left', 'right'];

/** Sel grid 3×3 tiap letak; acuan selalu di tengah. */
const CELL: Record<Place, { row: number; col: number }> = {
  above: { row: 1, col: 2 },
  below: { row: 3, col: 2 },
  left: { row: 2, col: 1 },
  right: { row: 2, col: 3 },
};

/**
 * Benda di atas / bawah / kiri / kanan sebuah benda acuan.
 *
 * Digambar dalam grid 3×3 yang TETAP, bukan dengan posisi bebas: "di atas" harus
 * lurus di atas acuan, tidak serong. Benda yang sedikit menyamping membuat anak
 * yang benar ("above") bisa merasa jawabannya "left" juga — dan soal posisi yang
 * bisa dibaca dua arah tidak mengukur apa pun.
 */
export function PositionScene({ anchor, items }: PositionVisual) {
  const describe = items.map((it) => (it.name ? `${it.name} ${it.at}` : it.at)).join(', ');
  return (
    <div
      className="grid justify-center"
      style={{ gridTemplateColumns: 'repeat(3, 72px)', gridTemplateRows: 'repeat(3, 72px)' }}
      // Pembaca layar tidak diberi kata letaknya kalau gambarnya sendiri tidak menulisnya:
      // itulah jawaban soalnya.
      aria-label={
        items.every((it) => it.label)
          ? `${anchor.name}: ${describe}`
          : `${anchor.name} and ${items.length} more`
      }
      role="img"
    >
      <span
        className="flex items-center justify-center leading-none"
        style={{ gridRow: 2, gridColumn: 2, fontSize: 48 }}
        data-place="anchor"
      >
        {anchor.icon}
      </span>
      {items.map((it) => (
        <span
          key={it.at}
          // Kata letak digantung di bawah ikon (absolute), bukan ikut antrean flex:
          // kalau ikut, ikon kiri/kanan terdorong naik dan tidak lagi sejajar acuannya.
          className="relative flex items-center justify-center"
          style={{ gridRow: CELL[it.at].row, gridColumn: CELL[it.at].col }}
          data-place={it.at}
        >
          {it.icon ? <span style={{ fontSize: 40, lineHeight: 1 }}>{it.icon}</span> : null}
          {it.label ? (
            <span
              className={it.icon ? 'absolute bottom-0 font-black' : 'font-black'}
              style={{
                fontSize: it.icon ? 15 : 22,
                color: 'var(--c-primary)',
                lineHeight: 1,
              }}
            >
              {it.at}
            </span>
          ) : null}
        </span>
      ))}
    </div>
  );
}
