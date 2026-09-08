export type PictogramRow = { label: string; icon: string; count: number };

export type PictogramProps = { rows: PictogramRow[] };

/** Piktogram: satu ikon = satu benda. Baris disejajarkan supaya bisa dibandingkan sekilas. */
export function Pictogram({ rows }: PictogramProps) {
  return (
    <div className="flex w-full flex-col gap-2" aria-label="Picture graph">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-14 shrink-0 text-[15px] font-bold">{r.label}</span>
          <span className="flex flex-wrap gap-1">
            {Array.from({ length: r.count }, (_, j) => (
              <span key={j} style={{ fontSize: 22, lineHeight: 1 }}>
                {r.icon}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
