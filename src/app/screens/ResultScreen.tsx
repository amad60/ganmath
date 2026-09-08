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
  /** Judul modul berikutnya — ditampilkan sebagai KETERANGAN, bukan tombol. */
  nextTitle: string | null;
  onBackToMap: () => void;
};

/**
 * SATU tombol. Titik.
 *
 * Versi sebelumnya menumpuk tiga tombol tanpa hierarki — lanjut ke modul berikutnya,
 * Master Round, dan kembali ke peta — plus judul modul di paling bawah yang terbaca
 * seperti tombol keempat. Anak 6 tahun tidak sedang memilih rute; dia ingin tahu
 * hasilnya lalu melanjutkan.
 *
 * Master Round dipindah sepenuhnya ke peta (tekan modul yang sudah selesai), supaya
 * satu aksi hanya punya satu rumah. Peta juga sudah punya tombol utama yang menyebut
 * langkah berikutnya, jadi layar ini tidak perlu menduplikasinya.
 *
 * Layar ini juga tidak pernah menulis "Failed" — yang ditulis adalah jarak menuju lulus.
 */
export function ResultScreen({
  module,
  evaluation,
  xpGained,
  earnedBadges,
  sessionsNeeded,
  nextTitle,
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
      <Mascot mood={mastered ? 'celebrate' : 'encourage'} size={100} />

      <StarRow stars={next.stars} size={44} animate />

      <div className="text-center">
        <h1 className="text-2xl font-black">
          {mastered ? en.result.niceWork : en.result.keepGoing}
        </h1>
        {/* Nama modul sebagai keterangan di ATAS, bukan teks nyasar di paling bawah
            yang terbaca seperti tombol. */}
        <p className="text-ink-soft text-[15px] font-bold">{module.title}</p>
      </div>

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

      <div className="w-full">
        {/* Bar kemajuan hanya masuk akal SELAMA modul belum tuntas. Menampilkan
            "1/2" di samping tulisan "Module mastered!" saling bertentangan. */}
        {!mastered ? (
          <ProgressBar
            value={Math.min(detail.passingSessions, sessionsNeeded)}
            max={sessionsNeeded}
            label={`${Math.min(detail.passingSessions, sessionsNeeded)}/${sessionsNeeded}`}
            tone="star"
          />
        ) : null}
        <p
          className="mt-2 text-center text-[18px] font-bold"
          style={{ color: mastered ? 'var(--c-correct)' : 'var(--c-ink-soft)' }}
        >
          {message}
        </p>
        {mastered && nextTitle ? (
          <p className="mt-1 text-center text-[16px] font-bold">
            {en.result.nextUpIs(nextTitle)}
          </p>
        ) : null}
      </div>

      <div className="mt-auto w-full pb-1">
        <Button full onClick={onBackToMap}>
          {en.result.backToMap}
        </Button>
      </div>

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
