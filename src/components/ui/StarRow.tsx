export type StarRowProps = {
  stars: 0 | 1 | 2 | 3;
  size?: number;
  animate?: boolean;
};

/** Bintang jatuh berurutan 200ms — perayaan yang tetap di bawah anggaran 3 detik. */
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
              color: earned ? 'var(--c-star)' : 'var(--c-locked)',
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
