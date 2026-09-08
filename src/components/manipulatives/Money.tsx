export type MoneyProps = {
  /** Pecahan rupiah, mis. [2000, 1000, 500] */
  items: number[];
  size?: number;
};

const STYLE: Record<number, { bg: string; coin: boolean }> = {
  500: { bg: '#C9A227', coin: true },
  1000: { bg: '#9E9E9E', coin: true },
  2000: { bg: '#8D9E6B', coin: false },
  5000: { bg: '#B5764A', coin: false },
  10000: { bg: '#8E6FA8', coin: false },
  20000: { bg: '#6FA88E', coin: false },
};

export function formatRupiah(v: number): string {
  return `Rp${v.toLocaleString('id-ID')}`;
}

/**
 * Uang rupiah — pecahan yang benar-benar dipegang anak.
 * Koin digambar bulat, uang kertas persegi panjang, supaya bisa dibedakan sekilas
 * tanpa membaca angkanya.
 */
export function Money({ items, size = 1 }: MoneyProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2" aria-label="Money">
      {items.map((v, i) => {
        const st = STYLE[v] ?? { bg: 'var(--c-locked)', coin: false };
        return st.coin ? (
          <span
            key={i}
            className="flex items-center justify-center font-black text-white"
            style={{
              width: 54 * size,
              height: 54 * size,
              borderRadius: 999,
              background: st.bg,
              border: '3px solid rgb(0 0 0 / 0.25)',
              fontSize: 13 * size,
            }}
          >
            {v >= 1000 ? `${v / 1000}rb` : v}
          </span>
        ) : (
          <span
            key={i}
            className="flex items-center justify-center font-black text-white"
            style={{
              width: 84 * size,
              height: 48 * size,
              borderRadius: 6,
              background: st.bg,
              border: '2px solid rgb(0 0 0 / 0.25)',
              fontSize: 14 * size,
            }}
          >
            {formatRupiah(v)}
          </span>
        );
      })}
    </div>
  );
}
