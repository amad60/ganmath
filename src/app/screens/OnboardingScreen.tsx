import { useState } from 'react';
import type { Avatar } from '../../store/schema';
import { Button } from '../../components/ui';
import { Mascot } from '../../components/mascot/Mascot';
import { unlockAudio } from '../sfx';

export type OnboardingScreenProps = {
  onDone: (name: string, avatar: Avatar) => void;
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
 * Dua input saja: nama dan avatar. Tidak ada umur, kelas, atau email.
 * Setelah ini anak langsung masuk modul pertama — bukan ke peta — supaya dia
 * segera mengerjakan sesuatu (docs/design/wireframes.md §1).
 */
export function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<Avatar>('cat');

  return (
    <div className="safe-top safe-bottom mx-auto flex min-h-full max-w-[430px] flex-col gap-6 p-5">
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <Mascot mood="happy" size={120} />
        <h1 className="text-2xl font-black">Hi! I am Gan.</h1>
        <p className="text-xl font-bold">What is your name?</p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 16))}
          aria-label="Your name"
          autoComplete="off"
          className="bg-surface w-full rounded-[var(--r-md)] border-2 border-[var(--c-line)] px-4 py-4 text-center text-2xl font-black"
        />

        <p className="text-ink-soft text-[18px] font-bold">Pick your look</p>
        <div className="flex flex-wrap justify-center gap-3">
          {AVATARS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAvatar(a.id)}
              aria-label={a.id}
              className="flex h-16 w-16 items-center justify-center rounded-[var(--r-md)] text-[36px]"
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
