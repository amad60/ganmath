import { useState } from 'react';
import type { ContentModule } from '../../content/types';
import { Button, Header, ProgressBar } from '../../components/ui';
import { en } from '../../i18n/en';
import { LearnVisualView } from './LearnVisualView';
import { Mascot } from '../../components/mascot/Mascot';
import { sfx, unlockAudio } from '../sfx';

export type LearnScreenProps = {
  module: ContentModule;
  onDone: () => void;
  onExit: () => void;
};

/**
 * Tombol Next TIDAK aktif sampai anak benar-benar melakukan aksinya —
 * itu yang membedakan Learn dari slide pasif (docs/design/README.md keputusan #2).
 */
export function LearnScreen({ module, onDone, onExit }: LearnScreenProps) {
  const [step, setStep] = useState(0);
  const [value, setValue] = useState(0);

  const current = module.learn[step];
  if (!current) return null;

  const interactive = current.action !== 'watch';
  const reached = !interactive || (current.target != null && value >= current.target);
  const last = step === module.learn.length - 1;

  const advance = () => {
    unlockAudio();
    sfx.tap();
    if (last) return onDone();
    setStep(step + 1);
    setValue(0);
  };

  return (
    <div className="flex h-full flex-col">
      <Header
        onBack={onExit}
        center={
          <ProgressBar
            value={step + 1}
            max={module.learn.length}
            label={en.learn.stepOf(step + 1, module.learn.length)}
          />
        }
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-5">
        {/* `m-auto` pada pembungkus, bukan `justify-center` pada induknya: isi yang
            lebih tinggi daripada layar akan terpotong DI DUA SISI kalau dipusatkan
            lewat justify-center, dan bagian atasnya tidak bisa digulung balik. */}
        <div className="m-auto flex w-full flex-col items-center gap-5">
        {/* Gan ikut menjelaskan: dia menunjuk saat ada aksi, dan bersorak saat tercapai. */}
        <div className="flex items-center gap-3">
          <Mascot mood={reached ? 'happy' : interactive ? 'thinking' : 'idle'} size={64} />
          <p className="flex-1 text-xl font-bold">{current.prompt}</p>
        </div>

        <LearnVisualView
          // Manipulatif boleh menyimpan hitungannya sendiri (bagian mana yang sudah
          // disentuh); `key` memastikan itu ikut nol lagi saat langkahnya berganti.
          key={step}
          visual={current.visual}
          value={value}
          onValue={setValue}
          interactive={interactive}
        />

        {current.hint && !reached ? (
          <p className="text-ink-soft text-center text-[18px]">{current.hint}</p>
        ) : null}

        {/* Umpan balik saat target tercapai — anak tahu dia sudah benar sebelum menekan Next. */}
        {interactive && reached ? (
          <p className="text-xl font-black" style={{ color: 'var(--c-correct)' }}>
            ✓ {current.target}
          </p>
        ) : null}
        </div>
      </main>

      <div className="safe-bottom px-6 pt-2">
        <Button full disabled={!reached} onClick={advance}>
          {last ? en.learn.start : en.learn.next}
        </Button>
        {!reached ? (
          <p className="text-ink-soft mt-2 text-center text-[15px]">{en.learn.tapToContinue}</p>
        ) : null}
      </div>
    </div>
  );
}
