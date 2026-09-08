import { useEffect, useState } from 'react';

/**
 * Animasi manipulatif TETAP jalan saat prefers-reduced-motion — hanya dipercepat 50%,
 * karena blok yang bergabung jadi puluhan itu MATERI, bukan dekorasi
 * (docs/design/animation.md §4).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const root = typeof document === 'undefined' ? null : document.documentElement;
    const fromSetting = () => root?.dataset.reduceMotion === 'true';
    const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;

    const sync = () => setReduced(Boolean(mq?.matches) || fromSetting());
    sync();

    mq?.addEventListener('change', sync);
    // Setelan orang tua diterapkan lewat atribut pada <html>; diamati supaya
    // togglenya berlaku seketika, bukan setelah app dibuka ulang.
    const observer = root ? new MutationObserver(sync) : null;
    observer?.observe(root as HTMLElement, { attributes: true, attributeFilter: ['data-reduce-motion'] });

    return () => {
      mq?.removeEventListener('change', sync);
      observer?.disconnect();
    };
  }, []);

  return reduced;
}

/** Durasi animasi materi: separuh saat reduced motion, tidak pernah nol. */
export function teachingDuration(ms: number, reduced: boolean): number {
  return reduced ? Math.round(ms / 2) : ms;
}
