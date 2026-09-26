import { useEffect, useRef, useState } from 'react';
import { loadSession } from '../store/session';
import { useProgress } from '../store/progress';
import { cloudEnabled, supabase } from './client';
import { pushCloud, reconcile, signedInEmail } from './cloud';
import type { ProgressState } from '../store/schema';

const BOOT_MS = 6000;
const POLL_MS = 30_000;

/**
 * Menjaga localStorage dan cloud tetap sama tanpa anak melihatnya.
 *
 * - Saat app dibuka (sebelum layar nama, kalau belum ada profil): tarik dulu.
 * - HP kembali ke depan / dibuka lagi: tarik kalau cloud lebih baru.
 * - Dua HP dipakai bergantian: poll pelan saat app terlihat.
 * - Setiap progress berubah: unggah; kalau app ditutup, unggah segera.
 * - Sesi kuis berjalan tidak ditimpa.
 */
export function useCloudSync(): { ready: boolean } {
  const [ready, setReady] = useState(!cloudEnabled);
  const applying = useRef(false);
  const pending = useRef<ProgressState | null>(null);
  const replaceAll = useProgress((s) => s.replaceAll);

  useEffect(() => {
    const client = supabase;
    if (!cloudEnabled || !client) {
      setReady(true);
      return;
    }

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

    const boot = async () => {
      try {
        await client.auth.getSession();
        await pull();
      } finally {
        setReady(true);
      }
    };

    void boot();
    const failOpen = window.setTimeout(() => setReady(true), BOOT_MS);

    const { data: auth } = client.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') void pull();
    });

    const onVisible = () => {
      if (document.visibilityState === 'visible') void pull();
    };
    document.addEventListener('visibilitychange', onVisible);

    const poll = window.setInterval(() => {
      if (document.visibilityState === 'visible' && !loadSession()) void pull();
    }, POLL_MS);

    return () => {
      window.clearTimeout(failOpen);
      window.clearInterval(poll);
      auth.subscription.unsubscribe();
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [replaceAll]);

  useEffect(() => {
    if (!cloudEnabled) return;
    let timer = 0;

    const flush = () => {
      window.clearTimeout(timer);
      const snapshot = pending.current;
      pending.current = null;
      if (!snapshot || applying.current) return;
      void (async () => {
        if (!(await signedInEmail())) return;
        await pushCloud(snapshot);
      })();
    };

    const unsub = useProgress.subscribe((s) => {
      if (applying.current) return;
      pending.current = s.data;
      window.clearTimeout(timer);
      timer = window.setTimeout(flush, 800);
    });

    const onHide = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', flush);

    return () => {
      window.clearTimeout(timer);
      unsub();
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', flush);
    };
  }, []);

  return { ready };
}
