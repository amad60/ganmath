import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../manipulatives/useReducedMotion';

export type CelebrationProps = {
  show: boolean;
  onDone: () => void;
};

const PARTICLES = 60;
const DURATION_MS = 3000;
const COLORS = ['var(--c-star)', 'var(--c-primary)', 'var(--c-correct)', 'var(--c-badge)'];

/**
 * Perayaan dibatasi 3 detik DAN bisa di-tap untuk dilewati — aturan 80/20:
 * minimal 80% waktu di app harus jadi waktu matematika
 * (docs/research/04-app-mechanics.md §4.2).
 */
export function Celebration({ show, onDone }: CelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!show) return;
    const timer = window.setTimeout(onDone, reduced ? 400 : DURATION_MS);
    if (reduced) return () => window.clearTimeout(timer);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return () => window.clearTimeout(timer);

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);

    const w = canvas.clientWidth;
    const parts = Array.from({ length: PARTICLES }, () => ({
      x: w / 2 + (Math.random() - 0.5) * w * 0.6,
      y: -20 - Math.random() * 120,
      vx: (Math.random() - 0.5) * 2.4,
      vy: 2 + Math.random() * 3,
      size: 6 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)] as string,
    }));

    let raf = 0;
    const start = performance.now();
    const styles = getComputedStyle(document.documentElement);
    const resolved = parts.map((p) => styles.getPropertyValue(p.color.slice(4, -1)).trim() || '#f2b90c');

    const tick = (now: number) => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      parts.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = resolved[i] as string;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if (now - start < DURATION_MS) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [show, reduced, onDone]);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={onDone}
      aria-label="Skip"
      className="fixed inset-0 z-40 cursor-default"
      style={{ background: 'transparent' }}
    >
      {reduced ? (
        <div
          className="absolute inset-0"
          style={{ background: 'var(--c-star)', opacity: 0.18 }}
          aria-hidden
        />
      ) : (
        <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
      )}
    </button>
  );
}
