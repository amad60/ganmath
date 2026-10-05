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
import type { ColumnPlace } from '../../components/manipulatives/columnPlaces';
import { sfx, unlockAudio } from '../sfx';
import { UnitIntroModal } from '../../components/unit-intro/UnitIntroModal';
import { watchWork } from './learnWork';

function columnLabel(op: '+' | '−', place: ColumnPlace): string {
  if (op === '−') return place === 'tens' ? en.learn.takeTens : en.learn.takeOnes;
  if (place === 'tens') return en.learn.addTens;
  if (place === 'hundreds') return en.learn.addHundreds;
  return en.learn.addOnes;
}

export type LearnScreenProps = {
  module: ContentModule;
  onDone: () => void;
  onExit: () => void;
  /** Seed soal pengecekan. Dibiarkan kosong di app; diisi test dan skrip audit
   *  supaya soalnya bisa diulang persis. */
  seed?: number;
  /**
   * Materi dibuka ulang dari peta / layar hasil ("See lesson"). Tombol terakhir
   * menjadi "Done", bukan "Start practice" — yang menyusul hanya kembali, bukan
   * latihan. App yang menjamin progres tidak disentuh; layar ini hanya labelnya.
   */
  review?: boolean;
};

/** Jejak satu langkah `tap-clue`: kalimat yang sudah ditolak, dan apakah buktinya ketemu. */
type ClueState = { rejected: number[]; found: boolean };

/**
 * Tombol Next TIDAK aktif sampai anak benar-benar melakukan aksinya —
 * itu yang membedakan Learn dari slide pasif (docs/design/README.md keputusan #2).
 *
 * Untuk langkah `watch` Next menunggu jeda look (`WATCH_LOOK_MS`) atau flash
 * selesai. Dulu Next aktif seketika, dan 72% langkah di app ini `watch` — anak
 * mengetuk Next empat kali dalam tiga detik tanpa pernah melihat gambarnya.
 *
 * Setiap modul masih ditutup satu **pengecekan pemahaman**: satu soal dari aturan
 * modul itu sendiri (`engine/learnCheck.ts`). Ia bukan kuis — tidak dinilai dan
 * tidak masuk hitungan. Salah sekali, soalnya berganti, supaya mengetuk semua
 * tombol tidak membuka pintu.
 *
 * Tombol Back di kaki layar mundur satu langkah (bukan keluar). Header Close tetap
 * keluar ke peta — anak yang salah ketuk Next bisa melihat lagi, anak yang mau
 * berhenti tidak perlu mundur satu-satu.
 */
export function LearnScreen({ module, onDone, onExit, seed: seedProp, review }: LearnScreenProps) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<number[]>(() => module.learn.map(() => 0));
  const [looked, setLooked] = useState<boolean[]>(() => module.learn.map(() => false));
  const [picked, setPicked] = useState<number | null>(null);
  const [missedCheck, setMissedCheck] = useState(false);
  const [opened, setOpened] = useState<number[]>(() => module.learn.map(() => 0));
  const [bundled, setBundled] = useState<boolean[]>(() => module.learn.map(() => false));
  const [showUnitIntro, setShowUnitIntro] = useState(false);
  const [clues, setClues] = useState<ClueState[]>(() =>
    module.learn.map(() => ({ rejected: [], found: false })),
  );
  const reduced = useReducedMotion();

  // Seed awal dikunci per kunjungan. Salah di pengecekan menaikkan seed, jadi
  // soal berikutnya baru — mengetuk empat tombol pada soal yang sama tidak lolos.
  const [seed, setSeed] = useState(() => seedProp ?? Date.now());
  const check = useMemo(() => learnCheck(module, seed), [module, seed]);

  const total = module.learn.length + (check ? 1 : 0);
  const onCheck = check != null && step === module.learn.length;
  const current = module.learn[step];
  const value = current ? (values[step] ?? 0) : 0;
  /**
   * `tap-clue` memakai `target` sebagai INDEKS kalimat, bukan jumlah — gerbang
   * umum `value >= target` akan langsung lolos untuk kalimat ke-0. Jadi langkah
   * ini punya gerbangnya sendiri: kalimat buktinya benar-benar diketuk.
   */
  const clueStep =
    !onCheck && current?.action === 'tap-clue' && current.visual.kind === 'evidence-text'
      ? current.visual
      : null;
  const clue = clues[step] ?? { rejected: [], found: false };

  const work = useMemo(
    () => (current?.action === 'watch' ? watchWork(current.visual) : null),
    [current],
  );

  const markLooked = () => {
    setLooked((prev) => {
      if (prev[step]) return prev;
      const next = [...prev];
      next[step] = true;
      return next;
    });
  };

  useEffect(() => {
    if (onCheck || !current || current.action !== 'watch' || work) return;
    if (looked[step]) return;
    const flashMs = current.visual.kind === 'ten-frame' ? current.visual.flashMs : undefined;
    if (flashMs != null) return;
    const t = window.setTimeout(markLooked, teachingDuration(WATCH_LOOK_MS, reduced));
    return () => window.clearTimeout(t);
    // markLooked membaca `step` terkini; step/looked/current adalah pemicunya.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, onCheck, current, reduced, looked, work]);

  if (!current && !onCheck) return null;

  const correct = check != null && picked === check.question.answer;
  const interactive = onCheck || current!.action !== 'watch' || work?.kind === 'fraction';
  const columnDone = work?.kind === 'column' && (opened[step] ?? 0) >= work.places.length;
  const fractionDone = work?.kind === 'fraction' && value >= work.need;
  const bundleDone = work?.kind === 'bundle' && Boolean(bundled[step]);
  const rowsDone = work?.kind === 'rows' && (opened[step] ?? 0) >= work.rows - 1;
  const reached = onCheck
    ? correct
    : clueStep
      ? clue.found
      : work
        ? columnDone || fractionDone || bundleDone || rowsDone
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

  /**
   * Ketukan di cerita bukti. Salah: kalimat itu dikunci dan satu baris pendek
   * muncul — tanpa skor, tanpa membuka kalimat yang benar. Kalau jawabannya
   * dibuka di ketukan salah pertama, anak cukup mengetuk asal lalu membaca
   * sorotannya; yang dilatih justru membaca ulang ceritanya.
   */
  const tapClue = (index: number) => {
    if (!current || clue.found) return;
    unlockAudio();
    const hit = index === current.target;
    if (hit) sfx.correct();
    else sfx.tap();
    setClues((prev) => {
      const next = [...prev];
      const was = next[step] ?? { rejected: [], found: false };
      next[step] = hit
        ? { ...was, found: true }
        : { ...was, rejected: was.rejected.includes(index) ? was.rejected : [...was.rejected, index] };
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
        right={
          module.grade <= 6 && module.unitId ? (
            <button
              type="button"
              aria-label="Unit Intro"
              onClick={() => setShowUnitIntro(true)}
              className="flex h-9 items-center gap-1 rounded-full px-2.5 text-xs font-black shadow-xs"
              style={{
                background: 'var(--c-primary-soft)',
                color: 'var(--c-primary)',
              }}
            >
              <span>🎬</span>
              <span>Intro</span>
            </button>
          ) : null
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
                    if (c === check.question.answer) {
                      setMissedCheck(false);
                      setPicked(c);
                      sfx.correct();
                      return;
                    }
                    sfx.tap();
                    setMissedCheck(true);
                    setPicked(null);
                    const nextSeed = seed + 1;
                    if (learnCheck(module, nextSeed)) setSeed(nextSeed);
                  }}
                >
                  {check.options ? check.options[c] : c}
                </Button>
              ))}
            </div>
            {(picked != null && !correct) || (missedCheck && !correct) ? (
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
              onValue={clueStep ? tapClue : setValue}
              interactive={interactive}
              onFlashEnd={markLooked}
              reveal={
                work?.kind === 'column'
                  ? (opened[step] ?? 0)
                  : work?.kind === 'rows'
                    ? (opened[step] ?? 0) + 1
                    : undefined
              }
              bundled={work?.kind === 'bundle' ? Boolean(bundled[step]) : false}
              fractionTap={work?.kind === 'fraction'}
              clue={clueStep && clue.found ? current!.target : undefined}
              rejected={clueStep ? clue.rejected : undefined}
            />

            {clueStep && !clue.found && clue.rejected.length > 0 ? (
              <p className="text-ink-soft text-center text-[18px] font-bold">{en.learn.clueRetry}</p>
            ) : null}

            {current!.caption ? (
              <p className="text-3xl font-black tabular-nums">{current!.caption}</p>
            ) : null}

            {work?.kind === 'column' && !columnDone ? (
              <Button
                onClick={() => {
                  unlockAudio();
                  sfx.tap();
                  setOpened((prev) => {
                    const next = [...prev];
                    next[step] = (next[step] ?? 0) + 1;
                    return next;
                  });
                }}
              >
                {columnLabel(work.op, work.places[opened[step] ?? 0] ?? 'ones')}
              </Button>
            ) : null}

            {work?.kind === 'rows' && !rowsDone ? (
              <Button
                onClick={() => {
                  unlockAudio();
                  sfx.tap();
                  setOpened((prev) => {
                    const next = [...prev];
                    next[step] = (next[step] ?? 0) + 1;
                    return next;
                  });
                }}
              >
                {en.learn.addRow}
              </Button>
            ) : null}

            {work?.kind === 'bundle' && !bundleDone ? (
              <Button
                onClick={() => {
                  unlockAudio();
                  sfx.tap();
                  setBundled((prev) => {
                    const next = [...prev];
                    next[step] = true;
                    return next;
                  });
                }}
              >
                {work.label === 'make' ? en.learn.makeTen : en.learn.openTen}
              </Button>
            ) : null}

            {current!.hint && !reached ? (
              <p className="text-ink-soft text-center text-[18px]">{current!.hint}</p>
            ) : null}

            {/* Umpan balik saat target tercapai — anak tahu dia sudah benar sebelum Next. */}
            {/* Adegan sains tidak memakai angka: keterangannya sendiri sudah umpan baliknya. */}
            {interactive && reached && current!.target != null && !clueStep && current!.action !== 'explore' ? (
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
            {last ? (review ? en.learn.done : en.learn.start) : en.learn.next}
          </Button>
        </div>
        {!reached ? (
          <p className="text-ink-soft mt-2 text-center text-[15px]">
            {onCheck
              ? en.learn.checkHint
              : clueStep
                ? en.learn.tapClue
                : work?.kind === 'fraction'
                ? en.learn.tapParts
                : work
                  ? en.learn.tapToContinue
                  : current!.action === 'watch'
                    ? en.learn.lookToContinue
                    : en.learn.tapToContinue}
          </p>
        ) : flashing ? (
          <p className="text-ink-soft mt-2 text-center text-[15px]">{en.learn.lookAgain}</p>
        ) : null}
      </div>

      <UnitIntroModal
        unitId={showUnitIntro ? module.unitId : null}
        onClose={() => setShowUnitIntro(false)}
      />
    </div>
  );
}
