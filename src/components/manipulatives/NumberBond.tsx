export type BondSlot = number | null;

export type NumberBondProps = {
  whole: BondSlot;
  parts: [BondSlot, BondSlot];
  /** Slot mana yang sedang ditanyakan — ditandai kotak berkedip, bukan teks. */
  ask?: 'whole' | 'part0' | 'part1';
  onPick?: (slot: 'whole' | 'part0' | 'part1') => void;
};

/**
 * Number bond: hubungan part–whole, dasar seluruh penjumlahan & pengurangan
 * (dan nanti pecahan, faktor, serta rasio). Digambar SVG supaya tajam di semua ukuran.
 */
export function NumberBond({ whole, parts, ask, onPick }: NumberBondProps) {
  const slots = [
    { key: 'whole' as const, value: whole, x: 100, y: 34 },
    { key: 'part0' as const, value: parts[0], x: 46, y: 122 },
    { key: 'part1' as const, value: parts[1], x: 154, y: 122 },
  ];

  return (
    <svg
      viewBox="0 0 200 160"
      className="h-[160px] w-[200px]"
      role="img"
      aria-label={`Number bond: whole ${whole ?? 'unknown'}, parts ${parts[0] ?? 'unknown'} and ${parts[1] ?? 'unknown'}`}
    >
      <line x1="100" y1="60" x2="46" y2="98" stroke="var(--c-line)" strokeWidth="4" strokeLinecap="round" />
      <line x1="100" y1="60" x2="154" y2="98" stroke="var(--c-line)" strokeWidth="4" strokeLinecap="round" />

      {slots.map((s) => {
        const asking = ask === s.key;
        return (
          <g
            key={s.key}
            onClick={() => onPick?.(s.key)}
            style={{ cursor: onPick ? 'pointer' : 'default' }}
          >
            <circle
              cx={s.x}
              cy={s.y}
              r="26"
              fill={asking ? 'var(--c-primary-soft)' : 'var(--c-surface)'}
              stroke={asking ? 'var(--c-primary)' : 'var(--c-line)'}
              strokeWidth="3"
              strokeDasharray={asking ? '6 5' : undefined}
            >
              {asking ? (
                <animate
                  attributeName="stroke-opacity"
                  values="1;0.35;1"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
              ) : null}
            </circle>
            <text
              x={s.x}
              y={s.y + 10}
              textAnchor="middle"
              fontSize="28"
              fontWeight="900"
              fill="var(--c-ink)"
            >
              {s.value ?? '?'}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
