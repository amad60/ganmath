import { useEffect, useRef } from 'react';
import { loadSession } from '../store/session';
import { useProgress } from '../store/progress';
import { cloudEnabled } from './client';
import { pushCloud, reconcile } from './cloud';

/**
 * Menjaga localStorage dan cloud tetap sama tanpa anak melihatnya.
 *
 * - Saat app dibuka (dan tidak di tengah sesi): tarik kalau cloud lebih baru.
 * - Setiap progress berubah: unggah setelah jeda singkat.
 * - Sesi berjalan tidak boleh ditimpa — jawaban di tengah kuis ada di kunci terpisah.
 */
export function useCloudSync(): void {
  const applying = useRef(false);
  const replaceAll = useProgress((s) => s.replaceAll);

  useEffect(() => {
    if (!cloudEnabled) return;

    const pull = async () => {
      if (loadSession()) return;
      const local = useProgress.getState().data;
      applying.current = true;
      try {
        const result = await reconcile(local);
        if (result.ok && result.action === 'applied-cloud') replaceAll(result.state);
      } finally {
        applying.current = false;
      }
    };

    void pull();
    const onVisible = () => {
      if (document.visibilityState === 'visible') void pull();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [replaceAll]);

  useEffect(() => {
    if (!cloudEnabled) return;
    let timer = 0;
    const unsub = useProgress.subscribe((s) => {
      if (applying.current) return;
      window.clearTimeout(timer);
      const snapshot = s.data;
      timer = window.setTimeout(() => {
        void pushCloud(snapshot);
      }, 800);
    });
    return () => {
      window.clearTimeout(timer);
      unsub();
    };
  }, []);
}
