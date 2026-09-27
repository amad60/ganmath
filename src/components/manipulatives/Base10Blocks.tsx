import { useEffect, useState } from 'react';
import { teachingDuration, useReducedMotion } from './useReducedMotion';

export type Base10BlocksProps = {
  /** Lempeng ratusan (10×10). Dipakai mulai Grade 2. */
  hundreds?: number;
  tens: number;
  ones: number;
  size?: number;
  /**
   * Sepuluh satuan merapat jadi satu batang, lalu gambar akhirnya tampil.
   * Mati secara bawaan supaya gambar yang sudah jadi tidak berkedip di tes.
   */
  join?: boolean;
};

/**
 * Blok nilai tempat: batang puluhan dan kubus satuan.
 *
 * Ini alat yang nanti menjelaskan "menyimpan" tanpa satu kata pun — sepuluh satuan
 * bergabung jadi satu batang. Dipakai dari Grade 1 (puluhan–satuan) sampai Grade 4.
 */
const JOIN_MS = 560;

export function Base10Blocks({ hundreds = 0, tens, ones, size = 1, join = false }: Base10BlocksProps) {
  const reduced = useReducedMotion();
  const unit = 12 * size;
  const gap = 2 * size;
  const canJoin = join && tens >= 1 && ones < 10;
  const [joined, setJoined] = useState(!canJoin);
  const [packed, setPacked] = useState(false);

  useEffect(() => {
    if (!canJoin) {
      setJoined(true);
      return;
    }
    setJoined(false);
    setPacked(false);
    const packAt = window.setTimeout(() => setPacked(true), teachingDuration(80, reduced));
    const doneAt = window.setTimeout(() => setJoined(true), teachingDuration(JOIN_MS, reduced));
    return () => {
      window.clearTimeout(packAt);
      window.clearTimeout(doneAt);
    };
  }, [canJoin, tens, ones, hundreds, reduced]);

  const showLoose = canJoin && !joined;
  const looseTens = showLoose && ones < 10 ? Math.max(0, tens - 1) : tens;
  const looseOnes = showLoose && ones >= 10 ? ones - 10 : ones;
  const viewTens = showLoose ? looseTens : tens;
  const viewOnes = showLoose ? looseOnes + 10 : ones;

  return (
    <div
      className="flex flex-wrap items-end justify-center gap-3"
      aria-label={`${hundreds} hundreds, ${viewTens} tens and ${viewOnes} ones`}
    >
      {Array.from({ length: hundreds }, (_, i) => (
        <div
          key={`h${i}`}
          className="grid"
          style={{
            gridTemplateColumns: `repeat(10, ${unit * 0.62}px)`,
            gap: gap * 0.5,
            animation: `fade-rise ${teachingDuration(240, reduced)}ms ${i * 40}ms both`,
          }}
        >
          {Array.from({ length: 100 }, (_, j) => (
            <span
              key={j}
              style={{
                width: unit * 0.62,
                height: unit * 0.62,
                background: 'var(--c-unit-6)',
                borderRadius: 2,
                display: 'block',
              }}
            />
          ))}
        </div>
      ))}
      {showLoose ? (
        <div
          className="flex flex-col"
          style={{ gap: packed ? 0 : gap, transition: `gap ${teachingDuration(360, reduced)}ms ease-in` }}
        >
          {Array.from({ length: 10 }, (_, j) => (
            <span
              key={`loose${j}`}
              style={{
                width: unit,
                height: unit,
                background: 'var(--c-unit-3)',
                borderRadius: 3,
                display: 'block',
              }}
            />
          ))}
        </div>
      ) : null}
      {Array.from({ length: viewTens }, (_, i) => (
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

      {looseOnes > 0 && showLoose ? (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(5, auto)', gap }}>
          {Array.from({ length: looseOnes }, (_, i) => (
            <span
              key={`lo${i}`}
              style={{
                width: unit,
                height: unit,
                background: 'var(--c-unit-3)',
                borderRadius: 3,
                display: 'block',
              }}
            />
          ))}
        </div>
      ) : null}
      {!showLoose && ones > 0 ? (
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
