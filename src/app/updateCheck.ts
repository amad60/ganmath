/**
 * Mengecek versi baru app secara AKTIF.
 *
 * Dulu pengecekan diserahkan seluruhnya ke browser, yang hanya memeriksa service
 * worker saat halaman benar-benar dimuat. PWA di HP hampir tidak pernah dimuat ulang:
 * ditutup = ditaruh di latar, dibuka = dilanjutkan. Akibatnya tawaran "New version
 * ready" baru muncul setelah app dimatikan paksa — kadang berhari-hari setelah deploy.
 *
 * Fungsi ini dipakai tiga pemicu (`usePwa`): app kembali ke depan, jam berkala, dan
 * tombol "Check for updates" orang tua. Ia TIDAK menerapkan update; penerapan tetap
 * menunggu tap, karena anak bisa sedang di tengah sesi.
 */
export type UpdateStatus =
  | 'idle'
  | 'checking'
  /** Versi baru sudah terunduh dan menunggu tap. */
  | 'available'
  | 'latest'
  | 'offline'
  /** Tidak ada service worker (mode dev, atau browser tanpa dukungan). */
  | 'unsupported'
  | 'error';

/** Paling lama menunggu versi baru selesai terpasang sebelum menyerah. */
const INSTALL_WAIT_MS = 20_000;

function waitInstalled(worker: ServiceWorker, timeoutMs: number): Promise<boolean> {
  if (worker.state === 'installed' || worker.state === 'activated') return Promise.resolve(true);
  return new Promise((resolve) => {
    const done = (ok: boolean) => {
      clearTimeout(timer);
      worker.removeEventListener('statechange', onChange);
      resolve(ok);
    };
    const onChange = () => {
      if (worker.state === 'installed' || worker.state === 'activated') done(true);
      else if (worker.state === 'redundant') done(false);
    };
    const timer = setTimeout(() => done(false), timeoutMs);
    worker.addEventListener('statechange', onChange);
  });
}

export async function checkForUpdate(
  reg: ServiceWorkerRegistration | null,
  online: boolean,
  timeoutMs = INSTALL_WAIT_MS,
): Promise<Exclude<UpdateStatus, 'idle' | 'checking'>> {
  if (!reg) return 'unsupported';
  if (reg.waiting) return 'available';
  if (!online) return 'offline';
  try {
    await reg.update();
  } catch {
    return 'error';
  }
  if (reg.waiting) return 'available';
  // Versi baru ditemukan dan sedang diunduh: tunggu sampai siap dipakai, supaya
  // jawabannya bukan "sudah terbaru" padahal update-nya tinggal beberapa detik lagi.
  const incoming = reg.installing;
  if (incoming) return (await waitInstalled(incoming, timeoutMs)) ? 'available' : 'error';
  return 'latest';
}
