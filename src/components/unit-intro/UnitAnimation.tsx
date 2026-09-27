import { useEffect, useState } from 'react';
import { useReducedMotion } from '../manipulatives/useReducedMotion';

export type UnitAnimationProps = {
  unitId: string;
  replayKey?: number;
};

export function UnitAnimation({ unitId, replayKey = 0 }: UnitAnimationProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
    const t = setTimeout(() => setActive(true), 20);
    return () => clearTimeout(t);
  }, [unitId, replayKey]);

  if (!active) {
    return <div className="h-[180px] w-full" />;
  }

  return (
    <div
      className="relative flex h-[190px] w-full items-center justify-center overflow-hidden rounded-[var(--r-md)] px-2 py-3"
      style={{
        background: 'var(--c-surface-sunk)',
        border: '2px solid var(--c-line)',
      }}
    >
      {renderUnitVisual(unitId, reduced)}
    </div>
  );
}

function renderUnitVisual(unitId: string, reduced: boolean) {
  switch (unitId) {
    case 'g1-u1':
      return <AnimationU1 reduced={reduced} />;
    case 'g1-u2':
      return <AnimationU2 reduced={reduced} />;
    case 'g1-u3':
      return <AnimationU3 reduced={reduced} />;
    case 'g1-u4':
      return <AnimationU4 reduced={reduced} />;
    case 'g1-u5':
      return <AnimationU5 reduced={reduced} />;
    case 'g1-u6':
      return <AnimationU6 reduced={reduced} />;
    case 'g1-u7':
      return <AnimationU7 reduced={reduced} />;
    case 'g1-u8':
      return <AnimationU8 reduced={reduced} />;
    default:
      return <AnimationDefault unitId={unitId} />;
  }
}

/** Unit 1: Numbers to 10 — Ten-Frame with 5 bouncing apples/dots filling sequentially */
function AnimationU1({ reduced }: { reduced: boolean }) {
  const items = [0, 1, 2, 3, 4];
  return (
    <div className="flex flex-col items-center gap-2">
      {/* 2x5 Ten-Frame */}
      <div
        className="grid grid-cols-5 gap-1.5 rounded-xl p-2.5 shadow-sm"
        style={{
          background: 'var(--c-surface)',
          border: '3px solid var(--c-line)',
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => {
          const filled = i < 5;
          return (
            <div
              key={i}
              className="relative flex h-11 w-11 items-center justify-center rounded-lg border-2"
              style={{
                borderColor: filled ? 'var(--c-unit-1)' : 'var(--c-line)',
                background: filled ? 'var(--c-primary-soft)' : 'transparent',
              }}
            >
              {filled ? (
                <span
                  className="text-2xl"
                  style={{
                    animation: reduced
                      ? undefined
                      : `apple-hop 400ms ease-out ${i * 180}ms both`,
                  }}
                >
                  🍎
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2 font-black tracking-wide" style={{ color: 'var(--c-unit-1)' }}>
        {items.map((n) => (
          <span
            key={n}
            className="text-lg tabular-nums"
            style={{
              animation: reduced
                ? undefined
                : `fade-rise 300ms ease-out ${n * 180 + 100}ms both`,
            }}
          >
            {n + 1}
          </span>
        ))}
        <span className="text-ink-soft text-sm font-bold">... to 10!</span>
      </div>
    </div>
  );
}

/** Unit 2: Add & Subtract — 3 blue dots + 2 red dots slide and merge into 5 */
function AnimationU2({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-4 text-2xl font-black">
        {/* Left group */}
        <div
          className="flex items-center gap-1 rounded-2xl p-2"
          style={{
            background: 'var(--c-primary-soft)',
            animation: reduced ? undefined : 'slide-merge-left 1.2s ease-in-out infinite alternate',
          }}
        >
          <span className="h-6 w-6 rounded-full bg-[var(--c-primary)]" />
          <span className="h-6 w-6 rounded-full bg-[var(--c-primary)]" />
          <span className="h-6 w-6 rounded-full bg-[var(--c-primary)]" />
        </div>

        <span className="text-3xl font-black text-[var(--c-unit-2)]">+</span>

        {/* Right group */}
        <div
          className="flex items-center gap-1 rounded-2xl p-2"
          style={{
            background: '#FFE8E6',
            animation: reduced ? undefined : 'slide-merge-right 1.2s ease-in-out infinite alternate',
          }}
        >
          <span className="h-6 w-6 rounded-full bg-[var(--c-unit-4)]" />
          <span className="h-6 w-6 rounded-full bg-[var(--c-unit-4)]" />
        </div>
      </div>

      <div
        className="flex items-center gap-2 rounded-full px-4 py-1 text-base font-black shadow-sm"
        style={{
          background: 'var(--c-correct-soft)',
          color: 'var(--c-correct)',
          animation: reduced ? undefined : 'badge-pop 800ms ease-out both',
        }}
      >
        <span>3 + 2 = 5</span>
        <span>✨</span>
      </div>
    </div>
  );
}

/** Unit 3: Numbers to 20 — 1 full Ten-Frame + 4 ones = 14 */
function AnimationU3({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        {/* Full Ten Frame */}
        <div
          className="flex flex-col items-center rounded-xl p-2 shadow-sm"
          style={{
            background: 'var(--c-surface)',
            border: '2px solid var(--c-unit-3)',
          }}
        >
          <div className="grid grid-cols-5 gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="h-4 w-4 rounded-full bg-[var(--c-unit-3)]"
                style={{
                  animation: reduced ? undefined : `fade-rise 300ms ease-out ${i * 40}ms both`,
                }}
              />
            ))}
          </div>
          <span className="mt-1 text-xs font-black text-[var(--c-unit-3)]">10 (one ten)</span>
        </div>

        <span className="text-xl font-black">+</span>

        {/* Extra ones */}
        <div
          className="flex flex-col items-center rounded-xl p-2 shadow-sm"
          style={{
            background: 'var(--c-surface)',
            border: '2px solid var(--c-line)',
          }}
        >
          <div className="grid grid-cols-2 gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className="h-4 w-4 rounded-full bg-[var(--c-primary)]"
                style={{
                  animation: reduced ? undefined : `apple-hop 400ms ease-out ${500 + i * 80}ms both`,
                }}
              />
            ))}
          </div>
          <span className="mt-1 text-xs font-black text-[var(--c-primary)]">4 ones</span>
        </div>
      </div>

      <div
        className="rounded-full px-3 py-0.5 text-base font-black text-[var(--c-ink)]"
        style={{
          background: 'var(--c-surface)',
          border: '2px solid var(--c-line)',
        }}
      >
        10 + 4 = <span className="text-[var(--c-unit-3)]">14</span>
      </div>
    </div>
  );
}

/** Unit 4: Add & Subtract to 20 — Bridging to 10 on number line */
function AnimationU4({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex w-full max-w-[300px] flex-col items-center gap-2">
      <svg viewBox="0 0 280 80" className="w-full">
        {/* Baseline */}
        <line x1="20" y1="60" x2="260" y2="60" stroke="var(--c-ink)" strokeWidth="3" strokeLinecap="round" />

        {/* Ticks */}
        <line x1="40" y1="54" x2="40" y2="66" stroke="var(--c-ink)" strokeWidth="3" />
        <text x="40" y="76" textAnchor="middle" fontSize="12" fontWeight="900" fill="var(--c-ink)">
          8
        </text>

        <line x1="140" y1="50" x2="140" y2="70" stroke="var(--c-unit-4)" strokeWidth="3" />
        <text x="140" y="76" textAnchor="middle" fontSize="13" fontWeight="900" fill="var(--c-unit-4)">
          10
        </text>

        <line x1="230" y1="54" x2="230" y2="66" stroke="var(--c-ink)" strokeWidth="3" />
        <text x="230" y="76" textAnchor="middle" fontSize="12" fontWeight="900" fill="var(--c-ink)">
          13
        </text>

        {/* Jump 1: 8 to 10 (+2) */}
        <path
          d="M 40 55 Q 90 20 140 55"
          fill="none"
          stroke="var(--c-unit-4)"
          strokeWidth="3.5"
          strokeDasharray="6 3"
          style={{ animation: reduced ? undefined : 'arc-dash 1.2s ease-in-out infinite' }}
        />
        <text x="90" y="32" textAnchor="middle" fontSize="12" fontWeight="900" fill="var(--c-unit-4)">
          +2
        </text>

        {/* Jump 2: 10 to 13 (+3) */}
        <path
          d="M 140 55 Q 185 24 230 55"
          fill="none"
          stroke="var(--c-primary)"
          strokeWidth="3.5"
          strokeDasharray="6 3"
          style={{ animation: reduced ? undefined : 'arc-dash 1.2s ease-in-out infinite 300ms' }}
        />
        <text x="185" y="34" textAnchor="middle" fontSize="12" fontWeight="900" fill="var(--c-primary)">
          +3
        </text>
      </svg>

      <span className="text-sm font-black text-ink-soft">
        8 + 5 : jump to 10 first! (<span className="text-[var(--c-unit-4)]">13</span>)
      </span>
    </div>
  );
}

/** Unit 5: Numbers to 100 — 10 rods stacking into 100 */
function AnimationU5({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex items-center gap-1 rounded-xl p-2 shadow-sm"
        style={{
          background: 'var(--c-surface)',
          border: '2px solid var(--c-unit-5)',
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-0.5 rounded-sm p-0.5"
            style={{
              background: 'var(--c-primary-soft)',
              animation: reduced ? undefined : `rod-stack 500ms ease-out ${i * 70}ms both`,
            }}
          >
            {Array.from({ length: 6 }).map((_, j) => (
              <span key={j} className="h-1.5 w-2 rounded-xs bg-[var(--c-unit-5)]" />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-base font-black">
        <span className="text-ink-soft">10 tens =</span>
        <span className="rounded-lg bg-[var(--c-star)] px-2 py-0.5 text-white shadow-xs">
          100! 💯
        </span>
      </div>
    </div>
  );
}

/** Unit 6: Shapes — Triangle, Square & Circle glowing */
function AnimationU6({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex items-center justify-center gap-6">
      {/* Triangle */}
      <div className="flex flex-col items-center gap-1">
        <svg
          viewBox="0 0 50 50"
          className="h-14 w-14"
          style={{ animation: reduced ? undefined : 'shape-float 2s ease-in-out infinite alternate' }}
        >
          <polygon
            points="25,5 45,45 5,45"
            fill="var(--c-primary-soft)"
            stroke="var(--c-primary)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <circle cx="25" cy="5" r="3.5" fill="var(--c-unit-4)" />
          <circle cx="45" cy="45" r="3.5" fill="var(--c-unit-4)" />
          <circle cx="5" cy="45" r="3.5" fill="var(--c-unit-4)" />
        </svg>
        <span className="text-xs font-black text-ink-soft">3 corners</span>
      </div>

      {/* Square */}
      <div className="flex flex-col items-center gap-1">
        <svg
          viewBox="0 0 50 50"
          className="h-14 w-14"
          style={{ animation: reduced ? undefined : 'shape-float 2s ease-in-out infinite alternate 300ms' }}
        >
          <rect
            x="8"
            y="8"
            width="34"
            height="34"
            rx="4"
            fill="#dff3e9"
            stroke="var(--c-correct)"
            strokeWidth="3.5"
          />
        </svg>
        <span className="text-xs font-black text-ink-soft">4 sides</span>
      </div>

      {/* Circle */}
      <div className="flex flex-col items-center gap-1">
        <svg
          viewBox="0 0 50 50"
          className="h-14 w-14"
          style={{ animation: reduced ? undefined : 'shape-float 2s ease-in-out infinite alternate 600ms' }}
        >
          <circle
            cx="25"
            cy="25"
            r="19"
            fill="#fdf0de"
            stroke="var(--c-unit-3)"
            strokeWidth="3.5"
          />
        </svg>
        <span className="text-xs font-black text-ink-soft">Round!</span>
      </div>
    </div>
  );
}

/** Unit 7: Measure & Time — Clock spinning & Rupiah coin */
function AnimationU7({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex items-center justify-center gap-8">
      {/* Clock */}
      <div className="flex flex-col items-center gap-1">
        <div
          className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 shadow-sm"
          style={{
            borderColor: 'var(--c-unit-7)',
            background: 'var(--c-surface)',
          }}
        >
          {/* Center pin */}
          <div className="z-10 h-2.5 w-2.5 rounded-full bg-[var(--c-ink)]" />
          {/* Hour hand */}
          <div
            className="absolute h-4 w-1 rounded-full bg-[var(--c-ink)]"
            style={{
              bottom: '50%',
              transformOrigin: 'bottom center',
              transform: 'rotate(90deg)',
            }}
          />
          {/* Minute hand */}
          <div
            className="absolute h-6 w-0.5 rounded-full bg-[var(--c-unit-4)]"
            style={{
              bottom: '50%',
              transformOrigin: 'bottom center',
              animation: reduced ? undefined : 'clock-spin 4s linear infinite',
            }}
          />
        </div>
        <span className="text-xs font-black text-ink-soft">Time</span>
      </div>

      {/* Coin */}
      <div className="flex flex-col items-center gap-1">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full border-3 text-center font-black shadow-sm"
          style={{
            borderColor: '#CCA21B',
            background: 'linear-gradient(135deg, #FFE873 0%, #F5C518 100%)',
            color: '#704800',
            animation: reduced ? undefined : 'coin-shine 2s ease-in-out infinite',
          }}
        >
          <span className="text-[12px] leading-tight">Rp<br />1000</span>
        </div>
        <span className="text-xs font-black text-ink-soft">Money</span>
      </div>
    </div>
  );
}

/** Unit 8: Patterns & Data — Sequence 🔴 🔵 🔴 🔵 ❓ */
function AnimationU8({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--c-unit-4)] text-lg shadow-xs">
          🔴
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--c-primary)] text-lg shadow-xs">
          🔵
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--c-unit-4)] text-lg shadow-xs">
          🔴
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--c-primary)] text-lg shadow-xs">
          🔵
        </span>
        <span
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl font-black shadow-md"
          style={{
            background: 'var(--c-unit-8)',
            color: '#FFFFFF',
            animation: reduced ? undefined : 'pulse-guess 1.2s ease-in-out infinite',
          }}
        >
          ❓
        </span>
      </div>

      <span className="text-sm font-black text-ink-soft">
        What comes next? It repeats!
      </span>
    </div>
  );
}

function AnimationDefault({ unitId }: { unitId: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="text-4xl">🚀</span>
      <p className="text-sm font-bold text-ink-soft">Ready for {unitId}!</p>
    </div>
  );
}
