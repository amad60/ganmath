import { useCallback, useEffect, useRef, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';
import { readMeta, writeMeta } from '../store/meta';
import { checkForUpdate, type UpdateStatus } from './updateCheck';

export type PwaState = {
  needRefresh: boolean;
  applyUpdate: () => void;
  canInstall: boolean;
  promptInstall: () => void;
  /** Hasil pengecekan manual terakhir (tombol "Check for updates" orang tua). */
  updateStatus: UpdateStatus;
  checkUpdate: () => void;
};

type InstallPromptEvent = Event & { prompt: () => Promise<void> };

/** Cek berkala selama app terbuka. */
const PERIODIC_CHECK_MS = 60 * 60 * 1000;
/** Kembali ke depan berkali-kali dalam semenit tidak perlu memukul server berkali-kali. */
const FOREGROUND_THROTTLE_MS = 60 * 1000;

/**
 * Update service worker TIDAK PERNAH otomatis reload — anak bisa sedang di tengah
 * sesi. Yang muncul cuma tawaran kecil, dan penerapannya menunggu tap.
 *
 * Yang otomatis hanya MENGECEK: saat app kembali ke depan (cara PWA di HP "dibuka
 * lagi" — tanpa memuat ulang halaman, jadi browser sendiri tidak pernah mengecek),
 * dan tiap jam selama terbuka. Lihat `updateCheck.ts`.
 *
 * Prompt "Add to Home Screen" ditahan sampai anak menyelesaikan modul pertama:
 * PWA terinstal jauh lebih tahan dari penghapusan storage oleh iOS Safari, tapi
 * memintanya sebelum anak punya sesuatu untuk dijaga hanya akan ditolak.
 */
export function usePwa(hasProgress: boolean): PwaState {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [update, setUpdate] = useState<(() => void) | null>(null);
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>('idle');
  const regRef = useRef<ServiceWorkerRegistration | null>(null);
  const lastCheck = useRef(0);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh: () => setNeedRefresh(true),
      onRegisteredSW: (_url, reg) => {
        regRef.current = reg ?? null;
        void navigator.storage?.persist?.();
      },
    });
    setUpdate(() => () => void updateSW(true));

    // Diam-diam: kalau ada versi baru, `onNeedRefresh` yang memunculkan tawarannya.
    const quietCheck = () => {
      const reg = regRef.current;
      if (!reg || !navigator.onLine) return;
      const now = Date.now();
      if (now - lastCheck.current < FOREGROUND_THROTTLE_MS) return;
      lastCheck.current = now;
      void reg.update().catch(() => {});
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') quietCheck();
    };
    document.addEventListener('visibilitychange', onVisible);
    const timer = window.setInterval(quietCheck, PERIODIC_CHECK_MS);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as InstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      document.removeEventListener('visibilitychange', onVisible);
      window.clearInterval(timer);
    };
  }, []);

  const checkUpdate = useCallback(() => {
    setUpdateStatus('checking');
    lastCheck.current = Date.now();
    void checkForUpdate(regRef.current, navigator.onLine).then((status) => {
      setUpdateStatus(status);
      if (status === 'available') setNeedRefresh(true);
    });
  }, []);

  const meta = readMeta();
  const canInstall = installEvent != null && hasProgress && !meta.installPromptShown;

  return {
    needRefresh,
    applyUpdate: () => update?.(),
    canInstall,
    promptInstall: () => {
      writeMeta({ installPromptShown: true });
      void installEvent?.prompt();
      setInstallEvent(null);
    },
    updateStatus,
    checkUpdate,
  };
}
