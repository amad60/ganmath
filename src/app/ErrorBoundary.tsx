import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '../components/ui';
import { Mascot } from '../components/mascot/Mascot';
import { en } from '../i18n/en';
import { clearSession } from '../store/session';

type Props = { children: ReactNode };
type State = { failures: number; message: string | null };

/**
 * Jaring terakhir. Tanpa ini, satu error render di mana pun berarti **layar putih**
 * untuk anak 6 tahun yang sedang sendirian — tanpa pesan, tanpa jalan keluar, dan
 * karena app ini PWA yang ter-cache, menutup lalu membukanya kembali mengulang error
 * yang sama. Progres sebenarnya aman di localStorage, tapi anak tidak tahu itu; yang
 * dia lihat adalah app-nya rusak.
 *
 * Dua tingkat pemulihan, dari yang paling tidak merusak:
 *  1. Coba lagi — render ulang. Cukup untuk error sekali lewat.
 *  2. Kalau gagal LAGI, tawarkan membuang sesi yang sedang berjalan lalu memuat ulang.
 *     Sesi tersimpan (soal yang sedang dikerjakan) adalah satu-satunya state yang
 *     bisa membuat error berulang terus, dan membuangnya hanya kehilangan beberapa
 *     soal — tidak pernah menyentuh progres modul, bintang, badge, atau streak.
 *
 * Progres anak TIDAK PERNAH dihapus dari sini. Apa pun yang terjadi.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { failures: 0, message: null };

  static getDerivedStateFromError(error: unknown): Partial<State> {
    return { message: error instanceof Error ? error.message : String(error) };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Tidak ada telemetry di app ini (semua data anak tinggal di HP-nya), jadi konsol
    // adalah satu-satunya jejak yang bisa dibaca orang tua kalau ini terjadi lagi.
    console.error('GanMath crash:', error, info.componentStack);
    this.setState((s) => ({ failures: s.failures + 1 }));
  }

  private retry = () => this.setState({ message: null });

  private startFresh = () => {
    clearSession();
    window.location.reload();
  };

  override render() {
    if (this.state.message == null) return this.props.children;

    return (
      <div className="safe-top safe-bottom mx-auto flex min-h-full max-w-[430px] flex-col items-center justify-center gap-5 px-6">
        <Mascot mood="encourage" size={110} />
        <div className="text-center">
          <h1 className="text-2xl font-black">{en.crash.title}</h1>
          {/* Yang paling ingin diketahui anak, dan yang paling menenangkan. */}
          <p className="text-ink-soft mt-1 text-[18px] font-bold">{en.crash.progressSafe}</p>
        </div>

        <div className="mt-2 w-full">
          <Button full onClick={this.retry}>
            {en.crash.tryAgain}
          </Button>
          {this.state.failures > 1 ? (
            <div className="mt-3">
              <Button variant="ghost" full onClick={this.startFresh}>
                {en.crash.startFresh}
              </Button>
            </div>
          ) : null}
        </div>

        {/* Untuk orang tua, bukan untuk anak: kecil, di bawah, tanpa warna peringatan. */}
        <p className="text-ink-soft mt-auto pb-1 text-center text-[12px] break-words opacity-70">
          {this.state.message}
        </p>
      </div>
    );
  }
}
