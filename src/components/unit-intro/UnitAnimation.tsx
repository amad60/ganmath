import { useEffect, useState } from 'react';
import { useReducedMotion } from '../manipulatives/useReducedMotion';
import { ScienceScene } from '../science/ScienceScene';
import { scienceModulesList } from '../../content/scienceIndex';
import type { ScienceSceneVisual } from '../../engine/types';

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

  // Science (setiap level yang sudah punya adegan): intro memutar adegan concrete modulnya sendiri — tanaman yang
  // disiram dan tidak, es di matahari dan di dingin — bukan roket generik. Anak
  // melihat sebab-akibat unit itu sebelum menyentuhnya. Tingginya ikut adegan,
  // bukan kotak 190px: gambar 4:3 plus keterangan tidak muat di sana.
  const scene = /^s\d+-/.test(unitId) ? scienceIntroScene(unitId) : null;
  if (scene) {
    return (
      <div
        className="flex w-full flex-col items-center rounded-[var(--r-md)] px-2 py-3"
        style={{ background: 'var(--c-surface-sunk)', border: '2px solid var(--c-line)' }}
      >
        <ScienceScene key={replayKey} visual={scene} compact />
      </div>
    );
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

/**
 * Adegan `change`/`tap-part` pertama di unit Science Level 1, atau null kalau unit
 * itu belum punya — unit seperti itu tetap jatuh ke animasi bawaan.
 */
export function scienceIntroScene(unitId: string): ScienceSceneVisual | null {
  for (const m of scienceModulesList) {
    if (m.unitId !== unitId) continue;
    for (const step of m.learn) {
      const v = step.visual;
      if (v.kind === 'science-scene' && v.mode !== 'predict') return v;
    }
  }
  return null;
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
    case 'g3-u1':
      return <AnimationG3U1 reduced={reduced} />;
    case 'g3-u2':
      return <AnimationG3U2 reduced={reduced} />;
    case 'g3-u3':
      return <AnimationG3U3 reduced={reduced} />;
    case 'g3-u4':
      return <AnimationG3U4 reduced={reduced} />;
    case 'g3-u5':
      return <AnimationG3U5 reduced={reduced} />;
    case 'g3-u6':
      return <AnimationG3U6 reduced={reduced} />;
    case 'g3-u7':
      return <AnimationG3U7 reduced={reduced} />;
    case 'g4-u1':
      return <AnimationG4U1 reduced={reduced} />;
    case 'g4-u2':
      return <AnimationG4U2 reduced={reduced} />;
    case 'g4-u3':
      return <AnimationG4U3 reduced={reduced} />;
    case 'g4-u4':
      return <AnimationG4U4 reduced={reduced} />;
    case 'g4-u5':
      return <AnimationG4U5 reduced={reduced} />;
    case 'g4-u6':
      return <AnimationG4U6 reduced={reduced} />;
    case 'g4-u7':
      return <AnimationG4U7 reduced={reduced} />;
    case 'g5-u1':
      return <AnimationG5U1 reduced={reduced} />;
    case 'g5-u2':
      return <AnimationG5U2 reduced={reduced} />;
    case 'g5-u3':
      return <AnimationG5U3 reduced={reduced} />;
    case 'g5-u4':
      return <AnimationG5U4 reduced={reduced} />;
    case 'g5-u5':
      return <AnimationG5U5 reduced={reduced} />;
    case 'g5-u6':
      return <AnimationG5U6 reduced={reduced} />;
    case 'g5-u7':
      return <AnimationG5U7 reduced={reduced} />;
    case 'g6-u1':
      return <AnimationG6U1 reduced={reduced} />;
    case 'g6-u2':
      return <AnimationG6U2 reduced={reduced} />;
    case 'g6-u3':
      return <AnimationG6U3 reduced={reduced} />;
    case 'g6-u4':
      return <AnimationG6U4 reduced={reduced} />;
    case 'g6-u5':
      return <AnimationG6U5 reduced={reduced} />;
    case 'g6-u6':
      return <AnimationG6U6 reduced={reduced} />;
    case 'g6-u7':
      return <AnimationG6U7 reduced={reduced} />;
    case 'r1-u1':
      return <AnimationR1U1 reduced={reduced} />;
    case 'r1-u2':
      return <AnimationR1U2 reduced={reduced} />;
    case 'r1-u3':
      return <AnimationR1U3 reduced={reduced} />;
    case 'r1-u4':
      return <AnimationR1U4 reduced={reduced} />;
    case 'r2-u1':
      return <AnimationR2U1 reduced={reduced} />;
    case 'r2-u2':
      return <AnimationR2U2 reduced={reduced} />;
    case 'r2-u3':
      return <AnimationR2U3 reduced={reduced} />;
    case 'r3-u1':
      return <AnimationR3U1 reduced={reduced} />;
    case 'r3-u2':
      return <AnimationR3U2 reduced={reduced} />;
    case 'r2-u4':
      return <AnimationR2U4 reduced={reduced} />;
    case 'r3-u3':
      return <AnimationR3U3 reduced={reduced} />;
    case 'r3-u4':
      return <AnimationR3U4 reduced={reduced} />;
    case 'r4-u1':
      return <AnimationR4U1 reduced={reduced} />;
    case 'r4-u2':
      return <AnimationR4U2 reduced={reduced} />;
    case 'r4-u3':
      return <AnimationR4U3 reduced={reduced} />;
    case 'r4-u4':
      return <AnimationR4U4 reduced={reduced} />;
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

/** G3-U1: Numbers to 10.000 — 4 thousands blocks + number line rounding */
function AnimationG3U1({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        {/* Big Thousands blocks */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex h-12 w-10 flex-col items-center justify-center rounded-lg border-2 border-[var(--c-unit-1)] shadow-xs"
              style={{
                background: 'var(--c-primary-soft)',
                animation: reduced ? undefined : `apple-hop 400ms ease-out ${i * 120}ms both`,
              }}
            >
              <span className="text-[11px] font-black text-[var(--c-unit-1)]">1.000</span>
            </div>
          ))}
        </div>

        <span className="text-lg font-black text-ink-soft">=</span>

        <div
          className="flex flex-col items-center justify-center rounded-xl px-3 py-2 shadow-sm"
          style={{
            background: 'var(--c-unit-1)',
            color: '#ffffff',
            animation: reduced ? undefined : 'badge-pop 600ms ease-out 500ms both',
          }}
        >
          <span className="text-xl font-black tabular-nums">4.000</span>
          <span className="text-[10px] font-bold tracking-wider uppercase opacity-90">Four Thousand</span>
        </div>
      </div>

      <span className="text-xs font-black text-ink-soft">
        Read and round numbers up to <span className="text-[var(--c-unit-1)]">10.000!</span> 🏔️
      </span>
    </div>
  );
}

/** G3-U2: Times Tables — Turn around fact 6 × 7 = 7 × 6 = 42 */
function AnimationG3U2({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 shadow-sm"
          style={{
            background: 'var(--c-surface)',
            border: '2px solid var(--c-unit-2)',
            animation: reduced ? undefined : 'slide-merge-left 1.2s ease-in-out infinite alternate',
          }}
        >
          <span className="text-base font-black text-[var(--c-unit-2)]">6 × 7</span>
        </div>

        <span className="text-2xl font-black text-ink-soft">⇄</span>

        <div
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 shadow-sm"
          style={{
            background: 'var(--c-surface)',
            border: '2px solid var(--c-unit-2)',
            animation: reduced ? undefined : 'slide-merge-right 1.2s ease-in-out infinite alternate',
          }}
        >
          <span className="text-base font-black text-[var(--c-unit-2)]">7 × 6</span>
        </div>
      </div>

      <div
        className="rounded-full px-4 py-1 text-base font-black shadow-xs"
        style={{
          background: 'var(--c-correct-soft)',
          color: 'var(--c-correct)',
          animation: reduced ? undefined : 'badge-pop 700ms ease-out 400ms both',
        }}
      >
        Both make 42! 🎯
      </div>
    </div>
  );
}

/** G3-U3: Division — 12 split into 3 equal baskets of 4 */
function AnimationG3U3({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        {Array.from({ length: 3 }).map((_, bIdx) => (
          <div
            key={bIdx}
            className="flex flex-col items-center rounded-xl p-2 shadow-xs"
            style={{
              background: 'var(--c-surface)',
              border: '2px solid var(--c-unit-3)',
              animation: reduced ? undefined : `fade-rise 300ms ease-out ${bIdx * 150}ms both`,
            }}
          >
            <div className="grid grid-cols-2 gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="h-3.5 w-3.5 rounded-full bg-[var(--c-unit-3)]" />
              ))}
            </div>
            <span className="mt-1 text-[11px] font-black text-[var(--c-unit-3)]">4 dots</span>
          </div>
        ))}
      </div>

      <span className="rounded-full bg-[var(--c-primary-soft)] px-3 py-0.5 text-sm font-black text-[var(--c-primary)]">
        12 shared by 3 = 4 each! 🧺
      </span>
    </div>
  );
}

/** G3-U4: Add & Subtract to 1000 — 3-digit column regrouping */
function AnimationG3U4({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="flex items-center gap-4 rounded-xl px-4 py-2 shadow-sm"
        style={{
          background: 'var(--c-surface)',
          border: '2px solid var(--c-unit-4)',
        }}
      >
        <div className="font-mono text-base font-black leading-tight tabular-nums">
          <div>&nbsp;&nbsp;248</div>
          <div className="border-b-2 border-[var(--c-ink)] pb-0.5">+ 175</div>
          <div className="pt-0.5 text-xs text-ink-soft">
            <div style={{ animation: reduced ? undefined : 'fade-rise 300ms ease-out 200ms both' }}>
              &nbsp;&nbsp;&nbsp;13 <span className="font-sans text-[10px]">(8 + 5)</span>
            </div>
            <div style={{ animation: reduced ? undefined : 'fade-rise 300ms ease-out 350ms both' }}>
              &nbsp;&nbsp;110 <span className="font-sans text-[10px]">(40 + 70)</span>
            </div>
            <div style={{ animation: reduced ? undefined : 'fade-rise 300ms ease-out 500ms both' }}>
              + 300 <span className="font-sans text-[10px]">(200 + 100)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span
            className="rounded-full px-3 py-1 text-sm font-black shadow-xs"
            style={{
              background: 'var(--c-unit-4)',
              color: '#ffffff',
              animation: reduced ? undefined : 'badge-pop 600ms ease-out 600ms both',
            }}
          >
            423 ✨
          </span>
          <span className="text-[11px] font-bold text-ink-soft">3-digit power!</span>
        </div>
      </div>
    </div>
  );
}

/** G3-U5: Fractions — 1 circle split in 4 with 3 shaded (3/4) */
function AnimationG3U5({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-4">
        {/* Fraction pie circle */}
        <svg
          viewBox="0 0 60 60"
          className="h-16 w-16"
          style={{ animation: reduced ? undefined : 'shape-float 2.5s ease-in-out infinite alternate' }}
        >
          <circle cx="30" cy="30" r="28" fill="var(--c-surface)" stroke="var(--c-unit-5)" strokeWidth="3" />
          {/* Top-right slice */}
          <path d="M 30 30 L 30 2 A 28 28 0 0 1 58 30 Z" fill="var(--c-unit-5)" />
          {/* Bottom-right slice */}
          <path d="M 30 30 L 58 30 A 28 28 0 0 1 30 58 Z" fill="var(--c-unit-5)" />
          {/* Bottom-left slice */}
          <path d="M 30 30 L 30 58 A 28 28 0 0 1 2 30 Z" fill="var(--c-unit-5)" />
          {/* Dividing lines */}
          <line x1="30" y1="2" x2="30" y2="58" stroke="var(--c-line)" strokeWidth="2" />
          <line x1="2" y1="30" x2="58" y2="30" stroke="var(--c-line)" strokeWidth="2" />
        </svg>

        <div className="flex flex-col items-start gap-1 font-black">
          <span className="text-2xl text-[var(--c-unit-5)]">3/4</span>
          <span className="text-xs text-ink-soft">3 of 4 equal parts</span>
        </div>
      </div>

      <span className="text-xs font-black text-ink-soft">
        Fractions are equal slices of one whole! 🍕
      </span>
    </div>
  );
}

/** G3-U6: Shapes & Perimeter — Rectangle with 4 sides adding up */
function AnimationG3U6({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative flex h-16 w-32 items-center justify-center rounded-lg border-3 border-[var(--c-unit-6)] shadow-xs"
        style={{
          background: 'var(--c-primary-soft)',
          animation: reduced ? undefined : 'badge-pop 800ms ease-out both',
        }}
      >
        <span className="absolute -top-3 text-[11px] font-black text-[var(--c-unit-6)]">6 cm</span>
        <span className="absolute -bottom-3 text-[11px] font-black text-[var(--c-unit-6)]">6 cm</span>
        <span className="absolute -left-5 text-[11px] font-black text-[var(--c-unit-6)]">3 cm</span>
        <span className="absolute -right-5 text-[11px] font-black text-[var(--c-unit-6)]">3 cm</span>
        <span className="text-xs font-black text-ink-soft">Fence</span>
      </div>

      <div
        className="mt-1 rounded-full px-3 py-0.5 text-xs font-black"
        style={{
          background: 'var(--c-surface)',
          border: '1.5px solid var(--c-line)',
        }}
      >
        Perimeter = 6 + 3 + 6 + 3 = <span className="text-[var(--c-unit-6)]">18 cm</span> 📏
      </div>
    </div>
  );
}

/** G3-U7: Time, Money & Data — Exact clock to minute + 100.000 rupiah note */
function AnimationG3U7({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex items-center justify-center gap-6">
      {/* Clock to the minute */}
      <div className="flex flex-col items-center gap-1">
        <div
          className="relative flex h-15 w-15 items-center justify-center rounded-full border-3 shadow-xs"
          style={{
            borderColor: 'var(--c-unit-7)',
            background: 'var(--c-surface)',
          }}
        >
          <div className="z-10 h-2 w-2 rounded-full bg-[var(--c-ink)]" />
          <div
            className="absolute h-3 w-1 rounded-full bg-[var(--c-ink)]"
            style={{
              bottom: '50%',
              transformOrigin: 'bottom center',
              transform: 'rotate(120deg)',
            }}
          />
          <div
            className="absolute h-5.5 w-0.5 rounded-full bg-[var(--c-unit-4)]"
            style={{
              bottom: '50%',
              transformOrigin: 'bottom center',
              transform: 'rotate(252deg)',
            }}
          />
        </div>
        <span className="text-[11px] font-black text-ink-soft">4:42</span>
      </div>

      {/* 100k note */}
      <div className="flex flex-col items-center gap-1">
        <div
          className="flex h-12 w-20 items-center justify-center rounded-md border-2 font-black shadow-xs"
          style={{
            borderColor: '#E84A5F',
            background: '#FFE8EC',
            color: '#B81424',
            animation: reduced ? undefined : 'coin-shine 2.5s ease-in-out infinite',
          }}
        >
          <span className="text-[11px] leading-tight">Rp<br />100.000</span>
        </div>
        <span className="text-[11px] font-black text-ink-soft">Big Money!</span>
      </div>
    </div>
  );
}

/** G4-U1: Big Numbers — Numbers to 1.000.000 (Hundred thousands to 1 Million) */
function AnimationG4U1({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <div className="rounded-xl border-2 border-[var(--c-unit-1)] bg-[var(--c-surface)] px-2.5 py-1.5 text-center shadow-xs">
          <span className="block text-xs font-bold text-ink-soft">100.000 × 10</span>
          <span className="text-sm font-black text-[var(--c-unit-1)]">Hundred Thousands</span>
        </div>
        <span className="text-xl font-black text-ink-soft">➔</span>
        <div
          className="rounded-xl bg-[var(--c-unit-1)] px-3 py-1.5 text-center text-white shadow-sm"
          style={{ animation: reduced ? undefined : 'badge-pop 700ms ease-out both' }}
        >
          <span className="block text-lg font-black tracking-wide tabular-nums">1.000.000</span>
          <span className="text-[10px] font-bold uppercase opacity-90">One Million!</span>
        </div>
      </div>
      <span className="text-xs font-black text-ink-soft">Place value counts all the way to 1.000.000 🗺️</span>
    </div>
  );
}

/** G4-U2: Multiply & Divide Bigger — Split to Multiply 4 × 23 = 4×20 + 4×3 */
function AnimationG4U2({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <span className="rounded-lg border-2 border-[var(--c-line)] bg-[var(--c-surface)] px-2.5 py-1 text-sm font-black">
          4 × 23
        </span>
        <span className="text-sm font-black text-ink-soft">=</span>
        <span
          className="rounded-lg bg-[var(--c-primary-soft)] px-2 py-1 text-xs font-black text-[var(--c-primary)]"
          style={{ animation: reduced ? undefined : 'apple-hop 400ms ease-out 200ms both' }}
        >
          4 × 20 (80)
        </span>
        <span className="text-xs font-black">+</span>
        <span
          className="rounded-lg bg-[var(--c-correct-soft)] px-2 py-1 text-xs font-black text-[var(--c-correct)]"
          style={{ animation: reduced ? undefined : 'apple-hop 400ms ease-out 400ms both' }}
        >
          4 × 3 (12)
        </span>
      </div>
      <div
        className="rounded-full bg-[var(--c-unit-2)] px-4 py-0.5 text-sm font-black text-white shadow-xs"
        style={{ animation: reduced ? undefined : 'badge-pop 600ms ease-out 600ms both' }}
      >
        80 + 12 = 92 ✨
      </div>
    </div>
  );
}

/** G4-U3: Factors & Multiples — Factor rainbow for 12 */
function AnimationG4U3({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-1 font-mono text-xs font-black">
          <span className="rounded-md bg-[var(--c-surface)] px-2 py-0.5 border border-[var(--c-unit-3)]">1 × 12 = 12</span>
          <span className="rounded-md bg-[var(--c-surface)] px-2 py-0.5 border border-[var(--c-unit-3)]">2 × 6 = 12</span>
          <span className="rounded-md bg-[var(--c-surface)] px-2 py-0.5 border border-[var(--c-unit-3)]">3 × 4 = 12</span>
        </div>
        <div
          className="flex flex-col items-center rounded-xl bg-[var(--c-unit-3)] px-3 py-2 text-white shadow-xs"
          style={{ animation: reduced ? undefined : 'badge-pop 600ms ease-out 400ms both' }}
        >
          <span className="text-xs font-bold uppercase">Factors of 12</span>
          <span className="text-sm font-black">1, 2, 3, 4, 6, 12</span>
        </div>
      </div>
      <span className="text-xs font-black text-ink-soft">Pairs that multiply to make the number! 🧩</span>
    </div>
  );
}

/** G4-U4: Equivalent Fractions — 1/2 = 2/4 = 4/8 */
function AnimationG4U4(_props: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3 font-black">
        <div className="flex flex-col items-center gap-0.5">
          <div className="h-6 w-14 rounded-sm border-2 border-[var(--c-unit-4)] bg-[var(--c-surface)] overflow-hidden flex">
            <span className="h-full w-1/2 bg-[var(--c-unit-4)]" />
          </div>
          <span className="text-xs">1/2</span>
        </div>
        <span className="text-lg text-ink-soft">=</span>
        <div className="flex flex-col items-center gap-0.5">
          <div className="h-6 w-14 rounded-sm border-2 border-[var(--c-unit-4)] bg-[var(--c-surface)] overflow-hidden flex">
            <span className="h-full w-1/4 bg-[var(--c-unit-4)] border-r border-white" />
            <span className="h-full w-1/4 bg-[var(--c-unit-4)]" />
          </div>
          <span className="text-xs">2/4</span>
        </div>
        <span className="text-lg text-ink-soft">=</span>
        <div className="flex flex-col items-center gap-0.5">
          <div className="h-6 w-14 rounded-sm border-2 border-[var(--c-unit-4)] bg-[var(--c-surface)] overflow-hidden flex">
            <span className="h-full w-1/8 bg-[var(--c-unit-4)] border-r border-white" />
            <span className="h-full w-1/8 bg-[var(--c-unit-4)] border-r border-white" />
            <span className="h-full w-1/8 bg-[var(--c-unit-4)] border-r border-white" />
            <span className="h-full w-1/8 bg-[var(--c-unit-4)]" />
          </div>
          <span className="text-xs">4/8</span>
        </div>
      </div>
      <span className="text-xs font-black text-ink-soft">Multiply top and bottom by the same number! 🍕</span>
    </div>
  );
}

/** G4-U5: Decimals Begin — Tenths & Hundredths grid */
function AnimationG4U5({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <span className="text-xl font-black text-[var(--c-unit-5)]">3/10</span>
          <span className="text-xs font-bold text-ink-soft">fraction</span>
        </div>
        <span className="text-2xl font-black text-ink-soft">⇄</span>
        <div
          className="flex flex-col items-center rounded-xl bg-[var(--c-unit-5)] px-3 py-1.5 text-white shadow-xs"
          style={{ animation: reduced ? undefined : 'badge-pop 700ms ease-out both' }}
        >
          <span className="text-2xl font-black tracking-wider">0.3</span>
          <span className="text-[10px] font-bold uppercase opacity-90">decimal</span>
        </div>
      </div>
      <span className="text-xs font-black text-ink-soft">A decimal point is just another way to write parts! 🎯</span>
    </div>
  );
}

/** G4-U6: Angles & Area — Angle rotation & Square grid area */
function AnimationG4U6(_props: { reduced: boolean }) {
  return (
    <div className="flex items-center justify-center gap-6">
      {/* 90 deg right angle */}
      <div className="flex flex-col items-center gap-1">
        <svg viewBox="0 0 50 50" className="h-14 w-14">
          <line x1="10" y1="40" x2="45" y2="40" stroke="var(--c-ink)" strokeWidth="3" strokeLinecap="round" />
          <line x1="10" y1="40" x2="10" y2="5" stroke="var(--c-unit-6)" strokeWidth="3" strokeLinecap="round" />
          <rect x="10" y="30" width="10" height="10" fill="none" stroke="var(--c-unit-6)" strokeWidth="2" />
        </svg>
        <span className="text-xs font-black text-[var(--c-unit-6)]">90° Right Angle</span>
      </div>
      {/* Area 3x3 grid */}
      <div className="flex flex-col items-center gap-1">
        <div className="grid grid-cols-3 gap-0.5 rounded-sm border-2 border-[var(--c-ink)] bg-white p-0.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="h-3.5 w-3.5 bg-[var(--c-primary-soft)] border border-[var(--c-line)]" />
          ))}
        </div>
        <span className="text-xs font-black text-ink-soft">Area = 9 sq units</span>
      </div>
    </div>
  );
}

/** G4-U7: Data — Line plot with X marks */
function AnimationG4U7(_props: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col items-center">
        {/* X marks */}
        <div className="flex gap-4 mb-1 text-sm font-black text-[var(--c-unit-7)]">
          <div className="flex flex-col items-center leading-none"><span>✕</span><span>✕</span></div>
          <div className="flex flex-col items-center leading-none"><span>✕</span><span>✕</span><span>✕</span><span>✕</span></div>
          <div className="flex flex-col items-center leading-none"><span>✕</span></div>
          <div className="flex flex-col items-center leading-none"><span>✕</span><span>✕</span><span>✕</span></div>
        </div>
        {/* Baseline */}
        <div className="flex gap-4 border-t-2 border-[var(--c-ink)] pt-1 text-xs font-black tabular-nums">
          <span className="w-4 text-center">1</span>
          <span className="w-4 text-center">2</span>
          <span className="w-4 text-center">3</span>
          <span className="w-4 text-center">4</span>
        </div>
      </div>
      <span className="text-xs font-black text-ink-soft">Count frequencies on line plots! 📊</span>
    </div>
  );
}

/** G5-U1: Fraction Operations — Unlike denominators (1/2 + 1/3 = 3/6 + 2/6 = 5/6) */
function AnimationG5U1({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 font-black text-sm">
        <span className="rounded-md border border-[var(--c-line)] bg-white px-2 py-0.5">1/2 + 1/3</span>
        <span className="text-ink-soft">➔</span>
        <span
          className="rounded-md bg-[var(--c-primary-soft)] px-2 py-0.5 text-[var(--c-primary)]"
          style={{ animation: reduced ? undefined : 'fade-rise 400ms ease-out 200ms both' }}
        >
          3/6 + 2/6
        </span>
        <span className="text-ink-soft">=</span>
        <span
          className="rounded-md bg-[var(--c-unit-1)] px-2 py-0.5 text-white"
          style={{ animation: reduced ? undefined : 'badge-pop 600ms ease-out 400ms both' }}
        >
          5/6 ✨
        </span>
      </div>
      <span className="text-xs font-black text-ink-soft">Make denominators match first! 🧲</span>
    </div>
  );
}

/** G5-U2: Decimals — Line up decimal points 3.25 + 1.40 */
function AnimationG5U2({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="font-mono text-base font-black leading-tight tabular-nums rounded-xl border border-[var(--c-line)] bg-white px-4 py-2 shadow-xs">
        <div>&nbsp;&nbsp;3<span className="text-[var(--c-unit-2)] font-black">.</span>25</div>
        <div className="border-b-2 border-[var(--c-ink)] pb-0.5">+ 1<span className="text-[var(--c-unit-2)] font-black">.</span>40</div>
        <div
          className="pt-1 text-[var(--c-unit-2)]"
          style={{ animation: reduced ? undefined : 'fade-rise 400ms ease-out 300ms both' }}
        >
          &nbsp;&nbsp;4<span className="font-black">.</span>65
        </div>
      </div>
      <span className="text-xs font-black text-ink-soft">Line up the dot straight down! 🎯</span>
    </div>
  );
}

/** G5-U3: Percent — 10x10 grid with 50% shaded */
function AnimationG5U3(_props: { reduced: boolean }) {
  return (
    <div className="flex items-center justify-center gap-5">
      <div className="grid grid-cols-10 gap-0.5 rounded-sm border border-[var(--c-line)] bg-white p-1">
        {Array.from({ length: 100 }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-xxs ${i < 50 ? 'bg-[var(--c-unit-3)]' : 'bg-[var(--c-surface-sunk)]'}`}
          />
        ))}
      </div>
      <div className="flex flex-col font-black">
        <span className="text-2xl text-[var(--c-unit-3)]">50%</span>
        <span className="text-xs text-ink-soft">50 out of 100</span>
        <span className="text-xs text-[var(--c-correct)]">= 1/2 = 0.5</span>
      </div>
    </div>
  );
}

/** G5-U4: Multiply & Divide Fluently — 2-digit × 2-digit area model */
function AnimationG5U4(_props: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="grid grid-cols-2 gap-1 rounded-lg border-2 border-[var(--c-unit-4)] bg-white p-2 font-mono text-xs font-black">
        <div className="rounded-xs bg-[var(--c-primary-soft)] p-1 text-center">20×30 = 600</div>
        <div className="rounded-xs bg-[var(--c-correct-soft)] p-1 text-center">20×4 = 80</div>
        <div className="rounded-xs bg-[var(--c-retry-soft)] p-1 text-center">5×30 = 150</div>
        <div className="rounded-xs bg-amber-100 p-1 text-center">5×4 = 20</div>
      </div>
      <span className="text-xs font-black text-ink-soft">Area model breaks large products into 4 boxes! 📦</span>
    </div>
  );
}

/** G5-U5: Volume & Measurement — 3D Box length × width × height */
function AnimationG5U5(_props: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 70 50" className="h-14 w-20">
          {/* Isometric box */}
          <polygon points="10,25 35,10 60,25 35,40" fill="var(--c-primary-soft)" stroke="var(--c-unit-5)" strokeWidth="2" />
          <polygon points="10,25 35,40 35,50 10,35" fill="var(--c-unit-5)" opacity="0.8" stroke="var(--c-unit-5)" strokeWidth="1" />
          <polygon points="35,40 60,25 60,35 35,50" fill="var(--c-unit-5)" opacity="0.6" stroke="var(--c-unit-5)" strokeWidth="1" />
        </svg>
        <div className="flex flex-col font-black text-xs">
          <span>L × W × H</span>
          <span className="text-sm text-[var(--c-unit-5)]">4 × 3 × 2 = 24</span>
          <span className="text-ink-soft">cubic units</span>
        </div>
      </div>
      <span className="text-xs font-black text-ink-soft">Volume counts how many blocks fill inside! 🧊</span>
    </div>
  );
}

/** G5-U6: Shapes in Space — Unfolding cube net */
function AnimationG5U6(_props: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Cross cube net */}
      <div className="flex flex-col items-center font-black">
        <span className="h-5 w-5 border border-[var(--c-unit-6)] bg-[var(--c-primary-soft)]" />
        <div className="flex">
          <span className="h-5 w-5 border border-[var(--c-unit-6)] bg-[var(--c-primary-soft)]" />
          <span className="h-5 w-5 border border-[var(--c-unit-6)] bg-[var(--c-unit-6)] text-white text-[9px] flex items-center justify-center">cube</span>
          <span className="h-5 w-5 border border-[var(--c-unit-6)] bg-[var(--c-primary-soft)]" />
          <span className="h-5 w-5 border border-[var(--c-unit-6)] bg-[var(--c-primary-soft)]" />
        </div>
        <span className="h-5 w-5 border border-[var(--c-unit-6)] bg-[var(--c-primary-soft)]" />
      </div>
      <span className="text-xs font-black text-ink-soft">Fold the 6 flat squares to build a solid cube! 📦</span>
    </div>
  );
}

/** G5-U7: Data & Speed — Distance / Time = Speed */
function AnimationG5U7({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <span className="text-3xl" style={{ animation: reduced ? undefined : 'slide-merge-left 1.2s ease-in-out infinite alternate' }}>🚗</span>
        <div className="flex flex-col font-black">
          <span className="text-sm text-[var(--c-unit-7)]">120 km in 2 hours</span>
          <span className="rounded-full bg-[var(--c-unit-7)] px-2.5 py-0.5 text-xs text-white text-center">
            Speed = 60 km/h ⚡
          </span>
        </div>
      </div>
      <span className="text-xs font-black text-ink-soft">Speed tells distance traveled each hour!</span>
    </div>
  );
}

/** G6-U1: Integers — Negative number line (-5 to +5) */
function AnimationG6U1(_props: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 240 50" className="w-full max-w-[260px]">
        <line x1="10" y1="30" x2="230" y2="30" stroke="var(--c-ink)" strokeWidth="3" />
        {/* Ticks */}
        <line x1="30" y1="24" x2="30" y2="36" stroke="var(--c-unit-1)" strokeWidth="2.5" />
        <text x="30" y="46" textAnchor="middle" fontSize="10" fontWeight="900" fill="var(--c-unit-1)">-5</text>
        <line x1="120" y1="20" x2="120" y2="40" stroke="var(--c-ink)" strokeWidth="3.5" />
        <text x="120" y="46" textAnchor="middle" fontSize="11" fontWeight="900" fill="var(--c-ink)">0</text>
        <line x1="210" y1="24" x2="210" y2="36" stroke="var(--c-correct)" strokeWidth="2.5" />
        <text x="210" y="46" textAnchor="middle" fontSize="10" fontWeight="900" fill="var(--c-correct)">+5</text>
        {/* Negative jump arc */}
        <path d="M 120 25 Q 75 5 30 25" fill="none" stroke="var(--c-unit-1)" strokeWidth="2.5" strokeDasharray="4 2" />
      </svg>
      <span className="text-xs font-black text-ink-soft">Numbers below zero live on the left! ❄️</span>
    </div>
  );
}

/** G6-U2: Ratio & Proportion — Scaling ratios 2 : 3 = 4 : 6 */
function AnimationG6U2({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 font-black">
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-[var(--c-surface)] border border-[var(--c-unit-2)] px-2.5 py-1 text-sm text-[var(--c-unit-2)]">
          2 : 3
        </span>
        <span className="text-xs text-ink-soft">× 2 ➔</span>
        <span
          className="rounded-lg bg-[var(--c-unit-2)] px-3 py-1 text-sm text-white shadow-xs"
          style={{ animation: reduced ? undefined : 'badge-pop 600ms ease-out both' }}
        >
          4 : 6 ✨
        </span>
      </div>
      <span className="text-xs text-ink-soft">Scale both sides equally like a cooking recipe! 🥣</span>
    </div>
  );
}

/** G6-U3: Algebra Begins — Mystery balance n + 4 = 10 */
function AnimationG6U3({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3 font-black text-sm">
        <div className="rounded-xl border-2 border-[var(--c-unit-3)] bg-white px-3 py-1">
          <span className="rounded-md bg-[var(--c-unit-3)] px-1.5 py-0.5 text-white">n</span> + 4 = 10
        </div>
        <span className="text-xs text-ink-soft">➔</span>
        <div
          className="rounded-xl bg-[var(--c-correct-soft)] px-3 py-1 text-[var(--c-correct)]"
          style={{ animation: reduced ? undefined : 'badge-pop 600ms ease-out 300ms both' }}
        >
          n = 10 - 4 = <span className="underline">6</span>!
        </div>
      </div>
      <span className="text-xs font-black text-ink-soft">Undo operations to reveal the mystery number n! 🔍</span>
    </div>
  );
}

/** G6-U4: Circles — Radius, Diameter, Circumference (π × d) */
function AnimationG6U4(_props: { reduced: boolean }) {
  return (
    <div className="flex items-center justify-center gap-5">
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <circle cx="30" cy="30" r="26" fill="var(--c-primary-soft)" stroke="var(--c-unit-4)" strokeWidth="3" />
        <line x1="4" y1="30" x2="56" y2="30" stroke="var(--c-ink)" strokeWidth="2.5" />
        <circle cx="30" cy="30" r="3" fill="var(--c-ink)" />
      </svg>
      <div className="flex flex-col font-black text-xs gap-0.5">
        <span className="text-[var(--c-unit-4)]">Radius = 1/2 Diameter</span>
        <span>Diameter (d) = full width</span>
        <span className="rounded-xs bg-[var(--c-unit-4)] px-1.5 py-0.5 text-white text-[10px]">Perimeter = π × d</span>
      </div>
    </div>
  );
}

/** G6-U5: Solids — Cylinder and Prism volume (Base Area × Height) */
function AnimationG6U5(_props: { reduced: boolean }) {
  return (
    <div className="flex items-center justify-center gap-5">
      <svg viewBox="0 0 50 60" className="h-16 w-14">
        {/* Cylinder */}
        <ellipse cx="25" cy="12" rx="20" ry="8" fill="var(--c-primary-soft)" stroke="var(--c-unit-5)" strokeWidth="2.5" />
        <path d="M 5 12 L 5 45 A 20 8 0 0 0 45 45 L 45 12" fill="var(--c-primary-soft)" stroke="var(--c-unit-5)" strokeWidth="2.5" />
        <ellipse cx="25" cy="45" rx="20" ry="8" fill="none" stroke="var(--c-unit-5)" strokeWidth="2.5" />
      </svg>
      <div className="flex flex-col font-black text-xs gap-0.5">
        <span className="text-sm text-[var(--c-unit-5)]">Prism & Cylinder</span>
        <span>Volume = Base Area × Height</span>
        <span className="text-ink-soft">Stack bases all the way up! 🏛️</span>
      </div>
    </div>
  );
}

/** G6-U6: Coordinates — 4 quadrants grid with (x, y) point */
function AnimationG6U6({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <svg viewBox="0 0 60 60" className="h-16 w-16 bg-white rounded-lg border border-[var(--c-line)]">
        {/* Axes */}
        <line x1="30" y1="2" x2="30" y2="58" stroke="var(--c-ink)" strokeWidth="2" />
        <line x1="2" y1="30" x2="58" y2="30" stroke="var(--c-ink)" strokeWidth="2" />
        {/* Point at (2, 2) */}
        <circle cx="45" cy="15" r="4" fill="var(--c-unit-6)" style={{ animation: reduced ? undefined : 'pulse-guess 1.2s infinite' }} />
        <text x="47" y="12" fontSize="9" fontWeight="900" fill="var(--c-unit-6)">(x, y)</text>
      </svg>
      <div className="flex flex-col font-black text-xs">
        <span className="text-[var(--c-unit-6)]">Point (x, y)</span>
        <span>Crawl across x first,</span>
        <span className="text-ink-soft">then fly up y! 🚀</span>
      </div>
    </div>
  );
}

/** G6-U7: Statistics & Chance — Dice probability & Mean/Median */
function AnimationG6U7({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex items-center justify-center gap-5">
      <span className="text-3xl" style={{ animation: reduced ? undefined : 'coin-shine 2s infinite' }}>🎲</span>
      <div className="flex flex-col font-black text-xs">
        <span className="text-sm text-[var(--c-unit-7)]">Probability & Stats</span>
        <span>Median = exact middle value</span>
        <span className="text-ink-soft">Chance = wanted / total outcomes</span>
      </div>
    </div>
  );
}

/** R1-U1: Who, Where & What — Storybook + Character highlight */
function AnimationR1U1({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-xs border-2 border-[#10b981]"
        style={{ animation: reduced ? undefined : 'badge-pop 700ms ease-out both' }}
      >
        <span className="text-3xl">🐱</span>
        <div className="flex flex-col font-bold text-xs leading-tight">
          <span className="text-[#059669] font-black text-sm">Mimi the Cat</span>
          <span className="text-ink-soft">Sat in the sunny garden 🌳</span>
        </div>
      </div>
      <span className="text-xs font-black text-ink-soft">
        Spot <span className="text-[#059669]">WHO</span> is here and <span className="text-[#059669]">WHERE</span>! 🔍
      </span>
    </div>
  );
}

/** R1-U2: Beginning, Middle & End — Sequence 1-2-3 */
function AnimationR1U2({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 font-black text-xs">
        <div className="flex flex-col items-center rounded-xl bg-white p-2 border border-[#059669] shadow-xs">
          <span className="text-xl">🌱</span>
          <span className="mt-1 text-ink-soft">1. Seed</span>
        </div>
        <span className="text-lg text-ink-soft">➔</span>
        <div
          className="flex flex-col items-center rounded-xl bg-white p-2 border border-[#059669] shadow-xs"
          style={{ animation: reduced ? undefined : 'apple-hop 400ms ease-out 200ms both' }}
        >
          <span className="text-xl">💧</span>
          <span className="mt-1 text-ink-soft">2. Water</span>
        </div>
        <span className="text-lg text-ink-soft">➔</span>
        <div
          className="flex flex-col items-center rounded-xl bg-[#d1fae5] p-2 border border-[#059669] shadow-xs text-[#065f46]"
          style={{ animation: reduced ? undefined : 'apple-hop 400ms ease-out 400ms both' }}
        >
          <span className="text-xl">🌻</span>
          <span className="mt-1">3. Bloom!</span>
        </div>
      </div>
      <span className="text-xs font-black text-ink-soft">First, next, and last! ⏳</span>
    </div>
  );
}

/** R1-U3: Why Did It Happen? — Cause & Effect */
function AnimationR1U3({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center rounded-xl bg-white p-2 border border-[#0d9488] shadow-xs">
          <span className="text-2xl">🌧️</span>
          <span className="text-[11px] font-black text-ink-soft">Heavy Rain</span>
        </div>
        <span className="text-2xl font-black text-[#0d9488]">➔</span>
        <div
          className="flex flex-col items-center rounded-xl bg-[#ccfbf1] p-2 border border-[#0d9488] shadow-xs text-[#115e59]"
          style={{ animation: reduced ? undefined : 'badge-pop 600ms ease-out 300ms both' }}
        >
          <span className="text-2xl">☂️</span>
          <span className="text-[11px] font-black">Open Umbrella</span>
        </div>
      </div>
      <span className="text-xs font-black text-ink-soft">Find WHY things happen! ⚡</span>
    </div>
  );
}

/** R1-U4: Mystery Clues — Riddle detective */
function AnimationR1U4({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2.5 border-2 border-[#0284c7] shadow-xs"
        style={{ animation: reduced ? undefined : 'badge-pop 700ms ease-out both' }}
      >
        <span className="text-3xl">🕵️</span>
        <div className="flex flex-col text-xs font-bold leading-tight">
          <span className="text-ink-soft">Soft fur + long ears + hops...</span>
          <span className="text-sm font-black text-[#0284c7] mt-0.5">It's a Rabbit! 🐰</span>
        </div>
      </div>
      <span className="text-xs font-black text-ink-soft">Use smart clues to solve the mystery! ✨</span>
    </div>
  );
}

/** R2-U1: The Big Idea — Main idea & details */
function AnimationR2U1({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex items-center gap-2 rounded-xl bg-[#d1fae5] px-3.5 py-1.5 border border-[#10b981] text-[#065f46] font-black text-sm"
        style={{ animation: reduced ? undefined : 'badge-pop 600ms ease-out both' }}
      >
        <span>💡</span>
        <span>Main Idea: Honeybees work hard</span>
      </div>
      <div className="flex gap-2 text-[11px] font-bold text-ink-soft">
        <span className="rounded-md bg-white border border-[var(--c-line)] px-2 py-0.5">Sip nectar</span>
        <span className="rounded-md bg-white border border-[var(--c-line)] px-2 py-0.5">Make honey</span>
      </div>
      <span className="text-xs font-black text-ink-soft">Find what the story is mostly about!</span>
    </div>
  );
}

/** R2-U2: Fact or Feeling? — Fact vs Opinion scale */
function AnimationR2U2({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex items-center justify-center gap-6">
      <div className="flex flex-col items-center rounded-xl bg-white p-2.5 border-2 border-[#059669] shadow-xs">
        <span className="text-xl">✅</span>
        <span className="text-xs font-black text-[#059669] mt-0.5">FACT</span>
        <span className="text-[10px] text-ink-soft font-bold">Can be proven true</span>
      </div>
      <span className="text-lg font-black text-ink-soft">vs</span>
      <div
        className="flex flex-col items-center rounded-xl bg-[#fef3c7] p-2.5 border-2 border-[#d97706] shadow-xs text-[#92400e]"
        style={{ animation: reduced ? undefined : 'apple-hop 600ms ease-out 300ms both' }}
      >
        <span className="text-xl">💭</span>
        <span className="text-xs font-black mt-0.5">OPINION</span>
        <span className="text-[10px] font-bold opacity-90">What someone feels</span>
      </div>
    </div>
  );
}

/** R2-U3: Character Feelings — Show, don't tell */
function AnimationR2U3(_props: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center rounded-xl bg-white p-2.5 border border-[#0d9488] shadow-xs">
          <span className="text-2xl">😄</span>
          <span className="text-[11px] font-black text-[#0d9488] mt-1">Jump & cheer</span>
          <span className="text-[10px] text-ink-soft font-bold">➔ Excited!</span>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-white p-2.5 border border-[#0d9488] shadow-xs">
          <span className="text-2xl">🫣</span>
          <span className="text-[11px] font-black text-[#0d9488] mt-1">Fidget fingers</span>
          <span className="text-[10px] text-ink-soft font-bold">➔ Nervous</span>
        </div>
      </div>
      <span className="text-xs font-black text-ink-soft">Look at actions to discover emotions! 🎭</span>
    </div>
  );
}

/** R3-U1: Follow the Steps — Recipe & Procedural checklist */
function AnimationR3U1({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex flex-col gap-1 rounded-xl bg-white p-3 border-2 border-[#10b981] shadow-xs text-xs font-black">
        <span className="flex items-center gap-2 text-[#059669]">
          <span>☑</span> 1. Peel ripe banana
        </span>
        <span className="flex items-center gap-2 text-[#059669]">
          <span>☑</span> 2. Add milk and yogurt
        </span>
        <span
          className="flex items-center gap-2 text-[var(--c-primary)]"
          style={{ animation: reduced ? undefined : 'apple-hop 400ms ease-out 300ms both' }}
        >
          <span>⏳</span> 3. Blend for 30 seconds!
        </span>
      </div>
      <span className="text-xs font-black text-ink-soft">Follow steps in exact order! 📋</span>
    </div>
  );
}

/** R3-U2: Animal Adaptations — Chameleon & features */
function AnimationR3U2({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex items-center justify-center gap-5">
      <div
        className="flex items-center justify-center text-4xl"
        style={{ animation: reduced ? undefined : 'coin-shine 2s infinite' }}
      >
        🦎
      </div>
      <div className="flex flex-col font-black text-xs">
        <span className="text-sm text-[#0284c7]">Color Camouflage</span>
        <span className="text-ink-soft">Feature ➔ Survival in the wild!</span>
        <span className="rounded-full bg-[#e0f2fe] px-2 py-0.5 text-[#0369a1] text-[10px] mt-1 text-center">
          Adaptation power!
        </span>
      </div>
    </div>
  );
}

function AnimationR2U4({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 font-black">
      <span className="rounded-full bg-[#dbeafe] px-3 py-1 text-xs text-[#1d4ed8]">Big idea: Bees work hard</span>
      <div className="flex gap-2 text-[11px]">
        <span
          className="rounded-md bg-white px-2 py-1 text-[#0369a1]"
          style={{ animation: reduced ? undefined : 'badge-pop 500ms ease-out both', border: '2px solid #0284c7' }}
        >
          Pollen on their legs
        </span>
        <span className="rounded-md bg-white px-2 py-1 text-ink-soft line-through" style={{ border: '2px solid var(--c-line)' }}>
          The moon
        </span>
      </div>
      <span className="text-xs text-ink-soft">Keep the detail. Drop what wanders.</span>
    </div>
  );
}

function AnimationR3U3({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex items-center gap-3 font-black text-xs">
      <div className="rounded-xl bg-white px-3 py-2 text-center" style={{ border: '2px solid #0d9488' }}>
        <div className="text-2xl">🪁</div>
        String snapped
      </div>
      <span className="text-lg text-[#0d9488]">➔</span>
      <div
        className="rounded-xl bg-[#ccfbf1] px-3 py-2 text-center text-[#115e59]"
        style={{ animation: reduced ? undefined : 'badge-pop 600ms ease-out 200ms both', border: '2px solid #0d9488' }}
      >
        <div className="text-2xl">🪢</div>
        Tie a new knot
      </div>
    </div>
  );
}

function AnimationR3U4({ reduced }: { reduced: boolean }) {
  const steps = ['🌱 Seed', '🌿 Shoot', '🌼 Flower'];
  return (
    <div className="flex items-center gap-2 font-black text-[11px]">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <span
            className="rounded-xl bg-white px-2 py-2"
            style={{
              border: '2px solid #059669',
              animation: reduced ? undefined : `apple-hop 400ms ease-out ${i * 180}ms both`,
            }}
          >
            {label}
          </span>
          {i < steps.length - 1 ? <span className="text-ink-soft">➔</span> : null}
        </div>
      ))}
    </div>
  );
}

function AnimationR4U1(_props: { reduced: boolean }) {
  return (
    <div className="flex items-center gap-3 font-black text-xs">
      <div className="rounded-xl bg-white px-3 py-2 text-center" style={{ border: '2px solid #10b981' }}>
        <div className="text-2xl">🌳</div>
        Park
      </div>
      <div className="rounded-full bg-[#d1fae5] px-2 py-1 text-[#065f46]">BOTH play</div>
      <div className="rounded-xl bg-white px-3 py-2 text-center" style={{ border: '2px solid #10b981' }}>
        <div className="text-2xl">🏖️</div>
        Beach
      </div>
    </div>
  );
}

function AnimationR4U2({ reduced }: { reduced: boolean }) {
  const chips = [
    ['Teach', '📘'],
    ['Amuse', '😄'],
    ['Ask', '✋'],
  ];
  return (
    <div className="flex gap-2 font-black text-[11px]">
      {chips.map(([label, icon], i) => (
        <div
          key={label}
          className="flex flex-col items-center rounded-xl bg-white px-3 py-2"
          style={{
            border: '2px solid #059669',
            animation: reduced ? undefined : `badge-pop 500ms ease-out ${i * 120}ms both`,
          }}
        >
          <span className="text-xl">{icon}</span>
          {label}
        </div>
      ))}
    </div>
  );
}

function AnimationR4U3({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 font-black text-xs">
      <span className="rounded-lg bg-white px-3 py-1" style={{ border: '2px solid #0d9488' }}>
        Water is <span className="text-[#0d9488]">scarce</span>
      </span>
      <span className="text-ink-soft">➔</span>
      <span
        className="rounded-lg bg-[#ccfbf1] px-3 py-1 text-[#115e59]"
        style={{ animation: reduced ? undefined : 'badge-pop 600ms ease-out 200ms both' }}
      >
        almost none left
      </span>
    </div>
  );
}

function AnimationR4U4({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 font-black text-xs">
      <span className="text-ink-soft">Lina gave her coat away</span>
      <span className="text-lg">⬇</span>
      <span
        className="rounded-full bg-[#e0f2fe] px-3 py-1 text-[#0369a1]"
        style={{ animation: reduced ? undefined : 'badge-pop 600ms ease-out 200ms both' }}
      >
        Lesson: kindness matters
      </span>
    </div>
  );
}




