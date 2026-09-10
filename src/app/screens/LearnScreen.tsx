import { useMemo, useState } from 'react';
import type { ContentModule } from '../../content/types';
import { Button, Header, ProgressBar } from '../../components/ui';
import { learnCheck } from '../../engine/learnCheck';
import { QuestionVisualView } from './QuestionScreen';
import { en } from '../../i18n/en';
import { LearnVisualView } from './LearnVisualView';
import { Mascot } from '../../components/mascot/Mascot';
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
 * Janji itu hanya separuh ditepati sampai sekarang. Dari 252 langkah Learn yang
 * menuntut aksi, 240 ada di tahap `concrete`, dan NOL dari 314 langkah `abstract`
 * meminta apa pun — untuk langkah `watch` tombol Next aktif seketika. Anak bisa
 * mengetuk Next empat kali dalam tiga detik dan sampai di ujung materi tanpa pernah
 * menyentuh idenya.
 *
 * Karena itu setiap modul kini ditutup satu **pengecekan pemahaman**: satu soal yang
 * dibuat dari aturan modul itu sendiri (lihat `engine/learnCheck.ts`). Ia bukan kuis —
 * tidak dinilai, tidak masuk hitungan apa pun, boleh diulang tanpa batas. Ia pintu:
 * anak keluar dari materi dengan menerapkan idenya sekali, selagi gambarnya masih di
 * layar, bukan delapan soal kemudian.
 */
export function LearnScreen({ module, onDone, onExit, seed: seedProp }: LearnScreenProps) {
  const [step, setStep] = useState(0);
  const [value, setValue] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  // Seed dikunci sekali per kunjungan: soalnya tidak boleh berganti di tengah anak
  // memikirkannya, tapi kunjungan berikutnya (mis. setelah diajar ulang) dapat yang baru.
  const [seed] = useState(() => seedProp ?? Date.now());
  const check = useMemo(() => learnCheck(module, seed), [module, seed]);

  const total = module.learn.length + (check ? 1 : 0);
  const onCheck = check != null && step === module.learn.length;
  const current = module.learn[step];
  if (!current && !onCheck) return null;

  const correct = check != null && picked === check.question.answer;
  const interactive = onCheck || current!.action !== 'watch';
  const reached = onCheck
    ? correct
    : current!.action === 'watch' || (current!.target != null && value >= current!.target);
  const last = step === total - 1;

  const advance = () => {
    unlockAudio();
    sfx.tap();
    if (last) return onDone();
    setStep(step + 1);
    setValue(0);
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
            />

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
        <Button full disabled={!reached} onClick={advance}>
          {last ? en.learn.start : en.learn.next}
        </Button>
        {!reached ? (
          <p className="text-ink-soft mt-2 text-center text-[15px]">
            {onCheck ? en.learn.checkHint : en.learn.tapToContinue}
          </p>
        ) : null}
      </div>
    </div>
  );
}
