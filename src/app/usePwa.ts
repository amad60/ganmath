import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';
import { readMeta, writeMeta } from '../store/meta';

export type PwaState = {
  needRefresh: boolean;
  applyUpdate: () => void;
  canInstall: boolean;
  promptInstall: () => void;
};

type InstallPromptEvent = Event & { prompt: () => Promise<void> };

/**
 * Update service worker TIDAK PERNAH otomatis reload — anak bisa sedang di tengah
 * sesi. Yang muncul cuma tawaran kecil, dan penerapannya menunggu tap.
 *
 * Prompt "Add to Home Screen" ditahan sampai anak menyelesaikan modul pertama:
 * PWA terinstal jauh lebih tahan dari penghapusan storage oleh iOS Safari, tapi
 * memintanya sebelum anak punya sesuatu untuk dijaga hanya akan ditolak.
 */
export function usePwa(hasProgress: boolean): PwaState {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [update, setUpdate] = useState<(() => void) | null>(null);
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh: () => setNeedRefresh(true),
      onRegisteredSW: () => {
        void navigator.storage?.persist?.();
      },
    });
    setUpdate(() => () => void updateSW(true));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as InstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
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
  };
}
