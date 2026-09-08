import { useState } from 'react';
import type { ContentModule } from '../../content/types';
import { Button, Header, ProgressBar } from '../../components/ui';
import { en } from '../../i18n/en';
import { LearnVisualView } from './LearnVisualView';

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
    if (last) return onDone();
    setStep(step + 1);
    setValue(0);
  };

  return (
    <div className="flex min-h-full flex-col">
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

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-5 py-6">
        <p className="text-center text-xl font-bold">{current.prompt}</p>

        <LearnVisualView
          visual={current.visual}
          value={value}
          onValue={setValue}
          interactive={interactive}
        />

        {current.hint ? (
          <p className="text-ink-soft text-center text-[18px]">
            {reached ? '' : current.hint}
          </p>
        ) : null}
      </main>

      <div className="safe-bottom px-5 pb-4">
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
