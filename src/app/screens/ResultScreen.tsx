import { useEffect, useState } from 'react';
import type { Evaluation } from '../../engine/mastery';
import type { ContentModule } from '../../content/types';
import type { BadgeId } from '../../engine/gamification';
import { BadgeCard, Button, Celebration, ProgressBar, StarRow } from '../../components/ui';
import { Mascot } from '../../components/mascot/Mascot';
import { en } from '../../i18n/en';
import { sfx } from '../sfx';

export type ResultScreenProps = {
  module: ContentModule;
  evaluation: Evaluation;
  xpGained: number;
  earnedBadges: string[];
  sessionsNeeded: number;
  /** Apa yang harus dikerjakan anak setelah ini, sudah jadi kalimat. */
  nextLabel: string;
  onNext: () => void;
  onBackToMap: () => void;
};

/**
 * Tidak pernah menulis "Failed". Yang ditulis adalah JARAK MENUJU LULUS, dalam
 * kalimat yang bisa ditindaklanjuti anak.
 */
export function ResultScreen({
  module,
  evaluation,
  xpGained,
  earnedBadges,
  sessionsNeeded,
  nextLabel,
  onNext,
  onBackToMap,
}: ResultScreenProps) {
  const { next, detail } = evaluation;
  const mastered = next.status === 'mastered' || next.status === 'retained';
  const practiced = next.status === 'practiced';
  const [celebrating, setCelebrating] = useState(mastered || earnedBadges.length > 0);

  useEffect(() => {
    if (earnedBadges.length > 0) sfx.badge();
    else if (mastered) sfx.star();
  }, [earnedBadges.length, mastered]);

  const testedOut = evaluation.events.some((e) => e.type === 'tested-out');
  const testoutFailed = evaluation.events.some((e) => e.type === 'testout-failed');

  void practiced;
  const message = testedOut
    ? en.result.testedOut
    : testoutFailed
      ? en.result.testoutFailed
      : mastered
    ? en.result.mastered
    : practiced
      ? en.result.almost
      : detail.accuracyPass
        ? en.result.oneMore
        : en.result.keepPractising;

  return (
    <div className="safe-top safe-bottom mx-auto flex min-h-full max-w-[430px] flex-col items-center gap-4 px-6">
      <Mascot mood={mastered ? 'celebrate' : 'encourage'} size={110} />

      <StarRow stars={next.stars} size={48} animate />

      <h1 className="text-center text-2xl font-black">
        {mastered ? en.result.niceWork : en.result.keepGoing}
      </h1>

      <div className="bg-surface w-full rounded-[var(--r-lg)] p-5 shadow-[var(--shadow-card)]">
        <Row label={en.result.correct} value={`${Math.round(detail.accuracy * 100)}%`} />
        <Row label={en.result.speed} value={en.common.seconds(detail.medianThinkMs / 1000)} />
        <Row label={en.result.xp} value={`+${xpGained}`} />
      </div>

      {earnedBadges.length > 0 ? (
        <div className="flex w-full flex-col items-center gap-2">
          <p className="text-[18px] font-black" style={{ color: 'var(--c-badge)' }}>
            {en.result.newBadge}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {earnedBadges.map((id) => (
              <BadgeCard key={id} id={id as BadgeId} owned size="lg" />
            ))}
          </div>
        </div>
      ) : null}

      {/* Jarak menuju lulus, bukan vonis. */}
      <div className="w-full">
        <ProgressBar
          value={Math.min(detail.passingSessions, sessionsNeeded)}
          max={sessionsNeeded}
          label={`${Math.min(detail.passingSessions, sessionsNeeded)}/${sessionsNeeded}`}
          tone="star"
        />
        <p className="text-ink-soft mt-2 text-center text-[18px]">{message}</p>
      </div>

      {/* Tombol utama SELALU membawa maju ke langkah berikutnya. Sebelumnya tombolnya
          mengembalikan ke peta, dan dari peta anak menemukan modul yang sama lagi —
          terasa seperti berputar di tempat meski dia baru saja berhasil. */}
      <div className="mt-auto flex w-full flex-col gap-3">
        <Button full onClick={onNext}>
          {nextLabel}
        </Button>
        <Button variant="ghost" full onClick={onBackToMap}>
          {en.result.backToMap}
        </Button>
      </div>

      <p className="text-ink-soft text-[13px]">{module.title}</p>

      <Celebration show={celebrating} onDone={() => setCelebrating(false)} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-ink-soft text-[18px] font-bold">{label}</span>
      <span className="text-xl font-black">{value}</span>
    </div>
  );
}
