import { useState } from 'react';
import type { Avatar } from '../../store/schema';
import { Button } from '../../components/ui';
import { Mascot } from '../../components/mascot/Mascot';
import { unlockAudio } from '../sfx';
import { CloudSignIn } from './CloudSignIn';

export type OnboardingScreenProps = {
  onDone: (name: string, avatar: Avatar) => void;
  /**
   * Muncul hanya kalau app pernah dipakai tapi progressnya hilang — iOS Safari
   * menghapus data situs yang tidak dibuka ±7 hari. Tanpa jalan ini, anak yang
   * kehilangan progress hanya melihat layar "anak baru" dan mulai dari nol.
   */
  onRestore?: (() => void) | null;
  /** HP baru: orang tua bisa tarik progress dari akun yang sudah dipakai di HP lain. */
  cloudRestore?: boolean;
  /** Tunggu sesi cloud (magic link / session) sebelum minta nama. */
  loading?: boolean;
};

// Rubah tidak ada di sini: itu Gan, si maskot. Avatar adalah anaknya, bukan Gan.
const AVATARS: { id: Avatar; icon: string }[] = [
  { id: 'cat', icon: '🐱' },
  { id: 'panda', icon: '🐼' },
  { id: 'tiger', icon: '🐯' },
  { id: 'koala', icon: '🐨' },
  { id: 'bunny', icon: '🐰' },
];

/**
 * Dua input anak: nama dan avatar. Pintu orang tua di bawah: tarik progress
 * dari HP lain lewat email, supaya iPhone baru tidak mulai dari nol.
 */
export function OnboardingScreen({
  onDone,
  onRestore,
  cloudRestore = false,
  loading = false,
}: OnboardingScreenProps) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<Avatar>('cat');
  const [showCloud, setShowCloud] = useState(false);

  if (loading) {
    return (
      <div className="safe-top safe-bottom mx-auto flex min-h-full max-w-[430px] flex-col items-center justify-center gap-4 px-6">
        <Mascot mood="happy" size={120} />
        <p className="text-center text-xl font-bold">Looking for your progress…</p>
      </div>
    );
  }

  return (
    <div className="safe-top safe-bottom mx-auto flex min-h-full max-w-[430px] flex-col gap-5 px-6">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <Mascot mood="happy" size={120} />
        <h1 className="text-2xl font-black">Hi! I am Gan.</h1>
        <p className="text-xl font-bold">What is your name?</p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 16))}
          aria-label="Your name"
          placeholder="Type your name"
          autoComplete="off"
          className="bg-surface w-full rounded-[var(--r-md)] border-2 border-[var(--c-line)] px-4 py-4 text-center text-2xl font-black placeholder:font-bold placeholder:text-[var(--c-locked)]"
        />

        <p className="text-ink-soft text-[18px] font-bold">Pick your look</p>
        <div className="grid w-full grid-cols-5 gap-2">
          {AVATARS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAvatar(a.id)}
              aria-label={a.id}
              className="flex aspect-square w-full items-center justify-center rounded-[var(--r-md)] text-[30px]"
              style={{
                background: avatar === a.id ? 'var(--c-primary-soft)' : 'var(--c-surface)',
                outline: avatar === a.id ? '3px solid var(--c-primary)' : '2px solid var(--c-line)',
              }}
            >
              {a.icon}
            </button>
          ))}
        </div>
      </div>

      {onRestore ? (
        <div
          className="rounded-[var(--r-md)] p-3 text-center"
          style={{ background: 'var(--c-retry-soft)' }}
        >
          <p className="text-[16px] font-bold">Welcome back! Your progress is missing.</p>
          <Button variant="ghost" full onClick={onRestore}>
            Load progress from a file
          </Button>
        </div>
      ) : null}

      {cloudRestore ? (
        <div
          className="flex flex-col gap-3 rounded-[var(--r-md)] p-3"
          style={{ background: 'var(--c-primary-soft)' }}
        >
          {showCloud ? (
            <>
              <p className="text-[16px] font-bold">Load this child from another phone.</p>
              <CloudSignIn submitLabel="Load progress" />
              <Button variant="ghost" full onClick={() => setShowCloud(false)}>
                Not now
              </Button>
            </>
          ) : (
            <Button variant="ghost" full onClick={() => setShowCloud(true)}>
              Used GanMath on another phone?
            </Button>
          )}
        </div>
      ) : null}

      <Button
        full
        disabled={name.trim().length === 0}
        onClick={() => {
          unlockAudio(); // iOS: audio harus dibuka oleh gestur pertama pengguna
          onDone(name.trim(), avatar);
        }}
      >
        Let&apos;s go!
      </Button>
    </div>
  );
}
