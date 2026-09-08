export type StarRowProps = {
  stars: 0 | 1 | 2 | 3;
  size?: number;
  animate?: boolean;
};

/**
 * Bintang yang belum didapat digambar sebagai bintang emas berongga, BUKAN abu-abu.
 * Nol bintang abu-abu membuat layar hasil terasa seperti vonis; bintang emas kosong
 * membacanya sebagai "ini yang sedang kamu kejar".
 */
export function StarRow({ stars, size = 40, animate = false }: StarRowProps) {
  return (
    <div className="flex items-center gap-2" aria-label={`${stars} of 3 stars`}>
      {[1, 2, 3].map((i) => {
        const earned = i <= stars;
        return (
          <span
            key={i}
            aria-hidden
            style={{
              fontSize: size,
              lineHeight: 1,
              color: 'var(--c-star)',
              opacity: earned ? 1 : 0.35,
              filter: earned ? 'drop-shadow(0 2px 4px rgb(242 185 12 / 0.45))' : undefined,
              animation: animate && earned ? `star-pop 400ms ${(i - 1) * 200}ms both` : undefined,
            }}
          >
            {earned ? '★' : '☆'}
          </span>
        );
      })}
    </div>
  );
}
