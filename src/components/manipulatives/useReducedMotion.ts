import { useEffect, useState } from 'react';

/**
 * Animasi manipulatif TETAP jalan saat prefers-reduced-motion — hanya dipercepat 50%,
 * karena blok yang bergabung jadi puluhan itu MATERI, bukan dekorasi
 * (docs/design/animation.md §4).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof matchMedia !== 'function') return;
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/** Durasi animasi materi: separuh saat reduced motion, tidak pernah nol. */
export function teachingDuration(ms: number, reduced: boolean): number {
  return reduced ? Math.round(ms / 2) : ms;
}
