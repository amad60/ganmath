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
    case 'g2-u1':
      return <AnimationG2U1 reduced={reduced} />;
    case 'g2-u2':
      return <AnimationG2U2 reduced={reduced} />;
    case 'g2-u3':
      return <AnimationG2U3 reduced={reduced} />;
    case 'g2-u4':
      return <AnimationG2U4 reduced={reduced} />;
    case 'g2-u5':
      return <AnimationG2U5 reduced={reduced} />;
    case 'g2-u6':
      return <AnimationG2U6 reduced={reduced} />;
    case 'g2-u7':
      return <AnimationG2U7 reduced={reduced} />;
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

/** G2-U1: Numbers to 1000 — 10 flat 100-squares stacking into 1000 cube */
function AnimationG2U1({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        {/* Hundred Flats */}
        <div
          className="relative flex h-20 w-24 items-center justify-center rounded-xl p-2 shadow-sm"
          style={{
            background: 'var(--c-surface)',
            border: '2px solid var(--c-unit-1)',
          }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-14 w-14 rounded-md border-2 border-[var(--c-unit-1)] shadow-xs"
              style={{
                background: 'var(--c-primary-soft)',
                transform: `translate(${i * 6 - 12}px, ${i * -3 + 6}px)`,
                animation: reduced ? undefined : `fade-rise 300ms ease-out ${i * 90}ms both`,
              }}
            />
          ))}
        </div>

        <span className="text-xl font-black text-ink-soft">➔</span>

        {/* Big 1000 Cube preview */}
        <div
          className="flex flex-col items-center justify-center rounded-xl px-3 py-2 shadow-sm"
          style={{
            background: 'var(--c-unit-1)',
            color: '#ffffff',
            animation: reduced ? undefined : 'badge-pop 800ms ease-out 500ms both',
          }}
        >
          <span className="text-2xl font-black tabular-nums">1000</span>
          <span className="text-[11px] font-bold tracking-wider uppercase opacity-90">10 hundreds</span>
        </div>
      </div>

      <span className="text-sm font-black text-ink-soft">
        10 hundreds make <span className="text-[var(--c-unit-1)]">One Thousand!</span> 🧱
      </span>
    </div>
  );
}

/** G2-U2: Add & Subtract — Written Column Partial Sums (26 + 37) */
function AnimationG2U2({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="flex items-center gap-5 rounded-2xl px-4 py-2 shadow-sm"
        style={{
          background: 'var(--c-surface)',
          border: '2px solid var(--c-line)',
        }}
      >
        {/* Vertical problem */}
        <div className="font-mono text-base font-black leading-tight tabular-nums">
          <div>&nbsp;&nbsp;26</div>
          <div className="border-b-2 border-[var(--c-ink)] pb-0.5">+ 37</div>
          <div className="pt-0.5 text-ink-soft text-xs">
            <div style={{ animation: reduced ? undefined : 'fade-rise 300ms ease-out 200ms both' }}>
              &nbsp;&nbsp;13 <span className="font-sans text-[10px] text-ink-soft">(ones)</span>
            </div>
            <div style={{ animation: reduced ? undefined : 'fade-rise 300ms ease-out 400ms both' }}>
              + 50 <span className="font-sans text-[10px] text-ink-soft">(tens)</span>
            </div>
          </div>
        </div>

        {/* Visual arrow & breakdown */}
        <div className="flex flex-col items-start gap-1">
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-black"
            style={{
              background: 'var(--c-correct-soft)',
              color: 'var(--c-correct)',
              animation: reduced ? undefined : 'apple-hop 400ms ease-out 200ms both',
            }}
          >
            6 + 7 = 13
          </span>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-black"
            style={{
              background: 'var(--c-primary-soft)',
              color: 'var(--c-primary)',
              animation: reduced ? undefined : 'apple-hop 400ms ease-out 400ms both',
            }}
          >
            20 + 30 = 50
          </span>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-black shadow-xs"
            style={{
              background: 'var(--c-star)',
              color: '#3a2c00',
              animation: reduced ? undefined : 'badge-pop 500ms ease-out 600ms both',
            }}
          >
            13 + 50 = 63 ✨
          </span>
        </div>
      </div>
      <span className="text-xs font-black text-ink-soft">
        Add ones first, then tens!
      </span>
    </div>
  );
}

/** G2-U3: Mental Math — Jumping by +10 & +100 fast */
function AnimationG2U3({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        {/* Step 1: 45 */}
        <div className="flex h-12 w-14 items-center justify-center rounded-xl border-2 border-[var(--c-line)] bg-[var(--c-surface)] text-xl font-black shadow-sm tabular-nums">
          45
        </div>

        {/* Jump +10 */}
        <div className="flex flex-col items-center">
          <span
            className="text-xs font-black text-[var(--c-unit-3)]"
            style={{ animation: reduced ? undefined : 'apple-hop 600ms ease-out 200ms both' }}
          >
            +10
          </span>
          <span className="text-xl font-bold text-[var(--c-unit-3)]">➔</span>
        </div>

        {/* Step 2: 55 */}
        <div
          className="flex h-12 w-14 items-center justify-center rounded-xl border-2 border-[var(--c-unit-3)] bg-[var(--c-primary-soft)] text-xl font-black shadow-sm tabular-nums"
          style={{ animation: reduced ? undefined : 'badge-pop 500ms ease-out 300ms both' }}
        >
          55
        </div>

        {/* Jump +100 */}
        <div className="flex flex-col items-center">
          <span
            className="text-xs font-black text-[var(--c-correct)]"
            style={{ animation: reduced ? undefined : 'apple-hop 600ms ease-out 500ms both' }}
          >
            +100
          </span>
          <span className="text-xl font-bold text-[var(--c-correct)]">➔</span>
        </div>

        {/* Step 3: 155 */}
        <div
          className="flex h-12 w-16 items-center justify-center rounded-xl border-2 border-[var(--c-correct)] bg-[var(--c-correct-soft)] text-xl font-black shadow-sm tabular-nums"
          style={{ animation: reduced ? undefined : 'badge-pop 500ms ease-out 600ms both' }}
        >
          155
        </div>
      </div>

      <span className="text-sm font-black text-ink-soft">
        Change only the place you jump! ⚡
      </span>
    </div>
  );
}

/** G2-U4: Meet Multiplication — 3 rows of 4 array grid */
function AnimationG2U4({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="grid grid-cols-4 gap-1.5 rounded-xl p-2.5 shadow-sm"
        style={{
          background: 'var(--c-surface)',
          border: '2px solid var(--c-unit-4)',
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="h-5 w-5 rounded-full bg-[var(--c-unit-4)] shadow-xs"
            style={{
              animation: reduced ? undefined : `apple-hop 350ms ease-out ${i * 40}ms both`,
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm font-black">
        <span className="rounded-md bg-[var(--c-primary-soft)] px-2 py-0.5 text-[var(--c-primary)]">
          3 rows
        </span>
        <span>×</span>
        <span className="rounded-md bg-[var(--c-primary-soft)] px-2 py-0.5 text-[var(--c-primary)]">
          4 dots
        </span>
        <span>=</span>
        <span className="rounded-md bg-[var(--c-unit-4)] px-2.5 py-0.5 text-white">
          12 dots!
        </span>
      </div>
    </div>
  );
}

/** G2-U5: Even, Odd & Patterns — Pair of dots (Fair Share) */
function AnimationG2U5({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex items-center justify-center gap-6">
      {/* Even: 6 dots (3 pairs) */}
      <div className="flex flex-col items-center gap-1.5">
        <div
          className="flex flex-col gap-1 rounded-xl p-2 shadow-sm"
          style={{
            background: 'var(--c-surface)',
            border: '2px solid var(--c-correct)',
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5"
              style={{ animation: reduced ? undefined : `slide-merge-left 1s ease-in-out infinite alternate ${i * 100}ms` }}
            >
              <span className="h-4 w-4 rounded-full bg-[var(--c-correct)]" />
              <span className="h-4 w-4 rounded-full bg-[var(--c-correct)]" />
            </div>
          ))}
        </div>
        <span className="rounded-full bg-[var(--c-correct-soft)] px-2 py-0.5 text-xs font-black text-[var(--c-correct)]">
          6 is Even (Pairs!)
        </span>
      </div>

      {/* Odd: 7 dots (3 pairs + 1 lonely) */}
      <div className="flex flex-col items-center gap-1.5">
        <div
          className="flex flex-col gap-1 rounded-xl p-2 shadow-sm"
          style={{
            background: 'var(--c-surface)',
            border: '2px solid var(--c-retry)',
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-full bg-[var(--c-retry)]" />
              <span className="h-4 w-4 rounded-full bg-[var(--c-retry)]" />
            </div>
          ))}
          <div className="flex items-center">
            <span
              className="h-4 w-4 rounded-full bg-[var(--c-unit-4)] shadow-xs"
              style={{ animation: reduced ? undefined : 'pulse-guess 1s ease-in-out infinite' }}
            />
          </div>
        </div>
        <span className="rounded-full bg-[var(--c-retry-soft)] px-2 py-0.5 text-xs font-black text-[var(--c-retry)]">
          7 is Odd (+1 left)
        </span>
      </div>
    </div>
  );
}

/** G2-U6: Measure — Ruler measuring a pencil & Weight scale */
function AnimationG2U6({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Pencil */}
      <div
        className="flex h-5 w-48 items-center rounded-r-full shadow-xs"
        style={{
          background: 'linear-gradient(90deg, #F5A623 85%, #4A4A4A 100%)',
          animation: reduced ? undefined : 'shape-float 2s ease-in-out infinite alternate',
        }}
      >
        <span className="ml-2 text-[10px] font-black text-white opacity-80">✏️ Pencil</span>
      </div>

      {/* Ruler */}
      <div
        className="flex w-52 flex-col rounded-md p-1 shadow-sm"
        style={{
          background: '#FFF8E1',
          border: '2px solid #CCA21B',
        }}
      >
        <div className="flex justify-between px-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="h-2.5 w-0.5 bg-[#8D6E1A]" />
              <span className="text-[10px] font-black text-[#8D6E1A]">{i * 2}</span>
            </div>
          ))}
        </div>
      </div>

      <span className="text-xs font-black text-ink-soft">
        Start at <span className="text-[var(--c-unit-6)]">0 cm</span> to measure length! 📏
      </span>
    </div>
  );
}

/** G2-U7: Time, Money & Data — Quarter past clock + Rupiah notes + Bar chart */
function AnimationG2U7({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex items-center justify-center gap-5">
      {/* Quarter past clock */}
      <div className="flex flex-col items-center gap-1">
        <div
          className="relative flex h-14 w-14 items-center justify-center rounded-full border-3 shadow-xs"
          style={{
            borderColor: 'var(--c-unit-7)',
            background: 'var(--c-surface)',
          }}
        >
          <div className="z-10 h-2 w-2 rounded-full bg-[var(--c-ink)]" />
          {/* Hour hand pointing at 2 */}
          <div
            className="absolute h-3.5 w-1 rounded-full bg-[var(--c-ink)]"
            style={{
              bottom: '50%',
              transformOrigin: 'bottom center',
              transform: 'rotate(60deg)',
            }}
          />
          {/* Minute hand pointing at 3 (15 min) */}
          <div
            className="absolute h-5 w-0.5 rounded-full bg-[var(--c-unit-4)]"
            style={{
              bottom: '50%',
              transformOrigin: 'bottom center',
              transform: 'rotate(90deg)',
            }}
          />
        </div>
        <span className="text-[11px] font-black text-ink-soft">2:15</span>
      </div>

      {/* Money notes */}
      <div className="flex flex-col items-center gap-1">
        <div
          className="flex h-11 w-16 items-center justify-center rounded-md border-2 font-black shadow-xs"
          style={{
            borderColor: '#2e9e6b',
            background: '#dff3e9',
            color: '#1a5c3e',
            animation: reduced ? undefined : 'coin-shine 2.5s ease-in-out infinite',
          }}
        >
          <span className="text-[11px] leading-tight">Rp<br />5.000</span>
        </div>
        <span className="text-[11px] font-black text-ink-soft">Money</span>
      </div>

      {/* Mini Bar Chart */}
      <div className="flex flex-col items-center gap-1">
        <div
          className="flex h-14 w-16 items-end justify-center gap-1.5 rounded-md border border-[var(--c-line)] p-1.5 shadow-xs"
          style={{ background: 'var(--c-surface)' }}
        >
          <span className="h-6 w-3 rounded-xs bg-[var(--c-unit-1)]" />
          <span className="h-10 w-3 rounded-xs bg-[var(--c-unit-3)]" />
          <span className="h-8 w-3 rounded-xs bg-[var(--c-unit-7)]" />
        </div>
        <span className="text-[11px] font-black text-ink-soft">Bar Chart</span>
      </div>
    </div>
  );
}

