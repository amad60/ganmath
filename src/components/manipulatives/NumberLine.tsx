import { useRef } from 'react';
import {
  clamp,
  formatValue,
  fromRatio,
  maxTicksFor,
  snapToStep,
  stepFor,
  ticksFor,
  toRatio,
} from './scale';
import { teachingDuration, useReducedMotion } from './useReducedMotion';

export type NumberLineProps = {
  min: number;
  max: number;
  /**
   * Jarak antar posisi yang bisa disentuh anak. Kosongkan untuk langkah otomatis
   * yang diturunkan dari lebar rentang (`stepFor`) — isi hanya kalau materinya
   * memang butuh langkah yang bukan bilangan bulat (pecahan, desimal).
   */
  step?: number;
  value?: number | null;
  onChange?: (next: number) => void;
  /** Penanda tambahan, mis. titik awal lompatan. */
  marks?: number[];
  /** >1 menampilkan label sebagai pecahan (dipakai mulai Grade 3). */
  denominator?: number;
  height?: number;
};

/**
 * Garis bilangan. Sengaja mendukung domain NEGATIF dan langkah PECAHAN sejak awal
 * meski Grade 1 tidak memakainya — menambahkannya belakangan berarti menulis ulang
 * komponen yang sudah dipakai ratusan modul (docs/curriculum/grades-2-6.md).
 *
 * Penanda MELOMPAT per satuan, bukan meluncur: melompat itu sendiri mengajarkan hitungan.
 */
export function NumberLine({
  min,
  max,
  step,
  value = null,
  onChange,
  marks = [],
  denominator,
  height = 96,
}: NumberLineProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Langkah efektif: dari data kalau ditulis, kalau tidak diturunkan dari rentang.
  // Satu nilai ini dipakai bersama oleh snap, label tick, dan hitungan lompatan —
  // kalau ketiganya memakai angka yang berbeda, penanda mendarat di tempat yang
  // tidak ada tanda-tandanya.
  const effectiveStep = step != null && step > 0 ? step : stepFor(min, max);
  const ticks = ticksFor(min, max, effectiveStep, maxTicksFor(min, max, denominator));
  // Tanda kecil tanpa angka di setiap posisi yang bisa disentuh: label boleh jarang
  // supaya terbaca, tapi anak tetap melihat ke mana penandanya bisa mendarat.
  const stops = (max - min) / effectiveStep + 1;
  const labelled = new Set(ticks);
  const minorTicks =
    stops > ticks.length && stops <= 41
      ? ticksFor(min, max, effectiveStep, Number.POSITIVE_INFINITY).filter(
          (t) => !labelled.has(t),
        )
      : [];
  const jumps = value == null ? 0 : Math.abs(Math.round((value - min) / effectiveStep));

  const handle = (clientX: number) => {
    if (!onChange || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    onChange(clamp(snapToStep(fromRatio(ratio, min, max), min, effectiveStep), min, max));
  };

  return (
    <div
      ref={ref}
      className="relative w-full touch-none select-none"
      style={{ height }}
      onPointerDown={(e) => handle(e.clientX)}
      onPointerMove={(e) => (e.buttons === 1 ? handle(e.clientX) : undefined)}
      role={onChange ? 'slider' : 'img'}
      aria-label="Number line"
      aria-valuemin={onChange ? min : undefined}
      aria-valuemax={onChange ? max : undefined}
      aria-valuenow={onChange && value != null ? value : undefined}
      data-step={effectiveStep}
    >
      <div
        className="absolute right-0 left-0 rounded-full"
        style={{ top: height / 2 - 2, height: 4, background: 'var(--c-line)' }}
      />

      {minorTicks.map((t) => (
        <div
          key={`n${t}`}
          className="absolute -translate-x-1/2"
          style={{
            left: `${toRatio(t, min, max) * 100}%`,
            top: height / 2 - 5,
            width: 2,
            height: 10,
            background: 'var(--c-line)',
            opacity: 0.55,
          }}
        />
      ))}

      {ticks.map((t) => {
        const isZero = t === 0 && min < 0;
        return (
          <div
            key={t}
            className="absolute flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${toRatio(t, min, max) * 100}%`, top: height / 2 - 10 }}
          >
            <div
              style={{
                width: isZero ? 4 : 2,
                height: isZero ? 20 : 14,
                background: isZero ? 'var(--c-ink)' : 'var(--c-line)',
              }}
            />
            <span className="text-ink-soft mt-1 text-[13px] font-bold">
              {formatValue(t, denominator)}
            </span>
          </div>
        );
      })}

      {marks.map((m) => (
        <div
          key={`m${m}`}
          className="absolute -translate-x-1/2 rounded-full"
          style={{
            left: `${toRatio(m, min, max) * 100}%`,
            top: height / 2 - 9,
            width: 14,
            height: 14,
            background: 'var(--c-unit-3)',
          }}
        />
      ))}

      {value != null ? (
        <div
          className="absolute -translate-x-1/2"
          style={{
            left: `${toRatio(value, min, max) * 100}%`,
            top: height / 2 - 30,
            transition: `left ${teachingDuration(Math.min(600, 120 + jumps * 40), reduced)}ms steps(${Math.max(1, jumps)}, end)`,
          }}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-[15px] font-black text-white"
            style={{ background: 'var(--c-primary)' }}
          >
            {formatValue(value, denominator)}
          </div>
          <div
            className="mx-auto"
            style={{
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '8px solid var(--c-primary)',
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
