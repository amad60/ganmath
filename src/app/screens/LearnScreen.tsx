import { useEffect, useMemo, useState } from 'react';
import type { ContentModule } from '../../content/types';
import { Button, Header, ProgressBar } from '../../components/ui';
import { learnCheck } from '../../engine/learnCheck';
import { WATCH_LOOK_MS } from '../../engine/learnPacing';
import { QuestionVisualView } from './QuestionScreen';
import { en } from '../../i18n/en';
import { LearnVisualView } from './LearnVisualView';
import { Mascot } from '../../components/mascot/Mascot';
import { teachingDuration, useReducedMotion } from '../../components/manipulatives/useReducedMotion';
import { sfx, unlockAudio } from '../sfx';

export type LearnScreenProps = {
  module: ContentModule;
  onDone: () => void;
  onExit: () => void;
  /** Seed soal pengecekan. Dibiarkan kosong di app; diisi test dan skrip audit
   *  supaya soalnya bisa diulang persis. */
  seed?: number;
};

/**
 * Tombol Next TIDAK aktif sampai anak benar-benar melakukan aksinya —
 * itu yang membedakan Learn dari slide pasif (docs/design/README.md keputusan #2).
 *
 * Untuk langkah `watch` Next menunggu jeda look (`WATCH_LOOK_MS`) atau flash
 * selesai. Dulu Next aktif seketika, dan 72% langkah di app ini `watch` — anak
 * mengetuk Next empat kali dalam tiga detik tanpa pernah melihat gambarnya.
 *
 * Setiap modul masih ditutup satu **pengecekan pemahaman**: satu soal dari aturan
 * modul itu sendiri (`engine/learnCheck.ts`). Ia bukan kuis — tidak dinilai, tidak
 * masuk hitungan, boleh diulang tanpa batas. Ia pintu: anak keluar dari materi
 * dengan menerapkan idenya sekali, selagi gambarnya masih di layar.
 *
 * Tombol Back di kaki layar mundur satu langkah (bukan keluar). Header Close tetap
 * keluar ke peta — anak yang salah ketuk Next bisa melihat lagi, anak yang mau
 * berhenti tidak perlu mundur satu-satu.
 */
export function LearnScreen({ module, onDone, onExit, seed: seedProp }: LearnScreenProps) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<number[]>(() => module.learn.map(() => 0));
  const [looked, setLooked] = useState<boolean[]>(() => module.learn.map(() => false));
  const [picked, setPicked] = useState<number | null>(null);
  const reduced = useReducedMotion();

  // Seed dikunci sekali per kunjungan: soalnya tidak boleh berganti di tengah anak
  // memikirkannya, tapi kunjungan berikutnya (mis. setelah diajar ulang) dapat yang baru.
  const [seed] = useState(() => seedProp ?? Date.now());
  const check = useMemo(() => learnCheck(module, seed), [module, seed]);

  const total = module.learn.length + (check ? 1 : 0);
  const onCheck = check != null && step === module.learn.length;
  const current = module.learn[step];
  const value = current ? (values[step] ?? 0) : 0;

  const markLooked = () => {
    setLooked((prev) => {
      if (prev[step]) return prev;
      const next = [...prev];
      next[step] = true;
      return next;
    });
  };

  useEffect(() => {
    if (onCheck || !current || current.action !== 'watch') return;
    if (looked[step]) return;
    const flashMs = current.visual.kind === 'ten-frame' ? current.visual.flashMs : undefined;
    if (flashMs != null) return;
    const t = window.setTimeout(markLooked, teachingDuration(WATCH_LOOK_MS, reduced));
    return () => window.clearTimeout(t);
    // markLooked membaca `step` terkini; step/looked/current adalah pemicunya.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, onCheck, current, reduced, looked]);

  if (!current && !onCheck) return null;

  const correct = check != null && picked === check.question.answer;
  const interactive = onCheck || current!.action !== 'watch';
  const reached = onCheck
    ? correct
    : current!.action === 'watch'
      ? Boolean(looked[step])
      : current!.target != null && value >= current!.target;
  const last = step === total - 1;
  const canPrev = step > 0;
  const flashing =
    !onCheck && current?.visual.kind === 'ten-frame' && current.visual.flashMs != null;

  const setValue = (n: number) => {
    setValues((prev) => {
      const next = [...prev];
      next[step] = n;
      return next;
    });
  };

  const advance = () => {
    unlockAudio();
    sfx.tap();
    if (last) return onDone();
    setStep(step + 1);
    setPicked(null);
  };

  const goPrev = () => {
    if (!canPrev) return;
    unlockAudio();
    sfx.tap();
    setStep(step - 1);
    setPicked(null);
  };

  return (
    <div className="flex h-full flex-col">
      <Header
        onBack={onExit}
        center={
          <ProgressBar value={step + 1} max={total} label={en.learn.stepOf(step + 1, total)} />
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
          <p className="flex-1 text-xl font-bold">
            {onCheck ? en.learn.checkPrompt : current!.prompt}
          </p>
        </div>

        {onCheck && check ? (
          <>
            {check.question.visual ? <QuestionVisualView visual={check.question.visual} /> : null}
            <p className="text-center text-2xl font-black">{check.question.text}</p>
            <div className="flex w-full flex-col gap-3">
              {check.choices.map((c) => (
                <Button
                  key={c}
                  full
                  variant="answer"
                  // Hanya pilihan yang SEDANG ditekan yang diberi warna. Menandai semua
                  // yang salah sekaligus mengubah pengecekan jadi vonis.
                  feedback={
                    picked === c ? (correct ? 'correct' : 'retry') : correct ? 'idle' : 'idle'
                  }
                  disabled={correct}
                  onClick={() => {
                    unlockAudio();
                    setPicked(c);
                    if (c === check.question.answer) sfx.correct();
                    else sfx.tap();
                  }}
                >
                  {check.options ? check.options[c] : c}
                </Button>
              ))}
            </div>
            {picked != null && !correct ? (
              <p className="text-ink-soft text-[18px] font-bold">{en.learn.checkRetry}</p>
            ) : null}
          </>
        ) : (
          <>
            <LearnVisualView
              // Manipulatif boleh menyimpan hitungannya sendiri (bagian mana yang sudah
              // disentuh); `key` memastikan itu ikut nol lagi saat langkahnya berganti.
              key={step}
              visual={current!.visual}
              value={value}
              onValue={setValue}
              interactive={interactive}
              onFlashEnd={markLooked}
            />

            {current!.caption ? (
              <p className="text-3xl font-black tabular-nums">{current!.caption}</p>
            ) : null}

            {current!.hint && !reached ? (
              <p className="text-ink-soft text-center text-[18px]">{current!.hint}</p>
            ) : null}

            {/* Umpan balik saat target tercapai — anak tahu dia sudah benar sebelum Next. */}
            {interactive && reached ? (
              <p className="text-xl font-black" style={{ color: 'var(--c-correct)' }}>
                ✓ {current!.target}
              </p>
            ) : null}
          </>
        )}
        </div>
      </main>

      <div className="safe-bottom px-6 pt-2">
        <div className="flex items-center gap-3">
          {canPrev ? (
            <Button variant="ghost" onClick={goPrev} aria-label={en.common.back}>
              {en.common.back}
            </Button>
          ) : null}
          <Button full={!canPrev} className={canPrev ? 'min-w-0 flex-1' : ''} disabled={!reached} onClick={advance}>
            {last ? en.learn.start : en.learn.next}
          </Button>
        </div>
        {!reached ? (
          <p className="text-ink-soft mt-2 text-center text-[15px]">
            {onCheck
              ? en.learn.checkHint
              : current!.action === 'watch'
                ? en.learn.lookToContinue
                : en.learn.tapToContinue}
          </p>
        ) : flashing ? (
          <p className="text-ink-soft mt-2 text-center text-[15px]">{en.learn.lookAgain}</p>
        ) : null}
      </div>
    </div>
  );
}
