export type RectShapeProps = {
  /** Panjang sisi mendatar, dalam satuan (bukan piksel). */
  w: number;
  /** Panjang sisi tegak, dalam satuan. */
  h: number;
  /** Satuan yang ditulis di label. */
  unit?: string;
  /** Tandai keempat sudut siku — dipakai saat mengajarkan "square corner". */
  showCorners?: boolean;
  size?: number;
};

/**
 * Persegi panjang dengan panjang sisi tertulis — bentuk yang dibutuhkan keliling.
 *
 * Sisinya digambar SEBANDING (persegi panjang 6x2 benar-benar terlihat tiga kali
 * lebih panjang daripada tingginya), karena anak yang belum lancar berhitung
 * memeriksa jawabannya dengan mata lebih dulu. Tapi ada batas: rasio dijepit
 * supaya sisi terpendek tidak menyusut jadi garis yang tak terbaca.
 */
export function RectShape({ w, h, unit = 'cm', showCorners, size = 150 }: RectShapeProps) {
  const ratio = Math.min(3.5, Math.max(1 / 3.5, w / h));
  const long = size;
  const short = Math.max(38, ratio >= 1 ? long / ratio : long * ratio);
  const bw = ratio >= 1 ? long : short;
  const bh = ratio >= 1 ? short : long;

  // Ruang kosongnya TIDAK simetris: label sisi kanan ("12 cm") ditulis di luar
  // persegi panjang, jadi kalau paddingnya sama di semua sisi label itu terpotong
  // di tepi SVG. Ini bug yang benar-benar terjadi dan tertangkap di screenshot.
  const padX = 8;
  const padTop = 30;
  const padRight = 66;
  const vbW = padX + bw + padRight;
  const vbH = padTop + bh + 10;

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      width={vbW}
      height={vbH}
      role="img"
      aria-label={`rectangle ${w} by ${h} ${unit}`}
      style={{ display: 'block', maxWidth: '100%' }}
    >
      <rect
        x={padX}
        y={padTop}
        width={bw}
        height={bh}
        fill="var(--c-surface)"
        stroke="var(--c-ink)"
        strokeWidth="3"
        rx="4"
      />

      {showCorners
        ? (
            [
              [padX, padTop, 1, 1],
              [padX + bw, padTop, -1, 1],
              [padX, padTop + bh, 1, -1],
              [padX + bw, padTop + bh, -1, -1],
            ] as const
          ).map(([x, y, sx, sy], i) => (
            <path
              key={i}
              d={`M ${x + sx * 14} ${y} L ${x + sx * 14} ${y + sy * 14} L ${x} ${y + sy * 14}`}
              fill="none"
              stroke="var(--c-unit-3)"
              strokeWidth="3"
            />
          ))
        : null}

      <text
        x={padX + bw / 2}
        y={padTop - 9}
        textAnchor="middle"
        fontSize="19"
        fontWeight="800"
        fill="var(--c-ink)"
      >
        {w} {unit}
      </text>
      <text
        x={padX + bw + 8}
        y={padTop + bh / 2 + 6}
        textAnchor="start"
        fontSize="19"
        fontWeight="800"
        fill="var(--c-ink)"
      >
        {h} {unit}
      </text>
    </svg>
  );
}
