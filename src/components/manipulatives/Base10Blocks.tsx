import { teachingDuration, useReducedMotion } from './useReducedMotion';

export type Base10BlocksProps = {
  tens: number;
  ones: number;
  size?: number;
};

/**
 * Blok nilai tempat: batang puluhan dan kubus satuan.
 *
 * Ini alat yang nanti menjelaskan "menyimpan" tanpa satu kata pun — sepuluh satuan
 * bergabung jadi satu batang. Dipakai dari Grade 1 (puluhan–satuan) sampai Grade 4.
 */
export function Base10Blocks({ tens, ones, size = 1 }: Base10BlocksProps) {
  const reduced = useReducedMotion();
  const unit = 12 * size;
  const gap = 2 * size;

  return (
    <div
      className="flex flex-wrap items-end justify-center gap-3"
      aria-label={`${tens} tens and ${ones} ones`}
    >
      {Array.from({ length: tens }, (_, i) => (
        <div
          key={`t${i}`}
          className="flex flex-col"
          style={{
            gap,
            animation: `fade-rise ${teachingDuration(240, reduced)}ms ${i * 40}ms both`,
          }}
        >
          {Array.from({ length: 10 }, (_, j) => (
            <span
              key={j}
              style={{
                width: unit,
                height: unit,
                background: 'var(--c-primary)',
                borderRadius: 3,
                display: 'block',
              }}
            />
          ))}
        </div>
      ))}

      {ones > 0 ? (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(5, auto)', gap }}>
          {Array.from({ length: ones }, (_, i) => (
            <span
              key={`o${i}`}
              style={{
                width: unit,
                height: unit,
                background: 'var(--c-unit-3)',
                borderRadius: 3,
                display: 'block',
                animation: `fade-rise ${teachingDuration(240, reduced)}ms ${(tens + i) * 40}ms both`,
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
