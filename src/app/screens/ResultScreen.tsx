import type { Evaluation } from '../../engine/mastery';
import type { ContentModule } from '../../content/types';
import { Button, ProgressBar, StarRow } from '../../components/ui';
import { en } from '../../i18n/en';

export type ResultScreenProps = {
  module: ContentModule;
  evaluation: Evaluation;
  onContinue: () => void;
  onRetry: () => void;
};

/**
 * Layar ini tidak pernah menulis "Failed". Yang ditulis adalah JARAK MENUJU LULUS
 * (docs/design/README.md keputusan #5).
 */
export function ResultScreen({ module, evaluation, onContinue, onRetry }: ResultScreenProps) {
  const { next, detail } = evaluation;
  const mastered = next.status === 'mastered' || next.status === 'retained';
  const practiced = next.status === 'practiced';

  const message = mastered
    ? en.result.mastered
    : practiced
      ? en.result.almost
      : detail.accuracyPass
        ? en.result.almost
        : en.result.keepGoing;

  return (
    <div className="safe-top safe-bottom flex min-h-full flex-col items-center justify-center gap-6 px-5 py-8">
      <div className="text-[72px] leading-none">{mastered ? '🎉' : '💪'}</div>

      <StarRow stars={next.stars} size={48} animate />

      <h1 className="text-center text-2xl font-black">
        {mastered ? en.result.niceWork : en.result.keepGoing}
      </h1>

      <div className="bg-surface w-full rounded-[var(--r-lg)] p-5 shadow-[var(--shadow-card)]">
        <Row label={en.result.correct} value={`${Math.round(detail.accuracy * 100)}%`} />
        <Row label={en.result.speed} value={en.common.seconds(detail.medianThinkMs / 1000)} />
      </div>

      <div className="w-full">
        <ProgressBar
          value={detail.passingSessions}
          max={Math.max(detail.passingSessions, mastered ? detail.passingSessions : 2)}
          label={en.result.moduleProgress}
          tone="star"
        />
        <p className="text-ink-soft mt-2 text-center text-[18px]">{message}</p>
      </div>

      <div className="mt-auto flex w-full flex-col gap-3">
        <Button full onClick={onContinue}>
          {en.result.continue}
        </Button>
        {!mastered ? (
          <Button variant="ghost" full onClick={onRetry}>
            {practiced ? en.result.speedRound : en.result.tryAgain}
          </Button>
        ) : null}
      </div>

      <p className="text-ink-soft text-[13px]">{module.title}</p>
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
