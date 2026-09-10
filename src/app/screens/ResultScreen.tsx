import { useEffect, useState } from 'react';
import type { Evaluation } from '../../engine/mastery';
import type { SessionKind } from '../../engine/types';
import type { ContentModule } from '../../content/types';
import type { BadgeId } from '../../engine/gamification';
import { BadgeCard, Button, Celebration, ProgressBar, StarRow } from '../../components/ui';
import { Mascot } from '../../components/mascot/Mascot';
import { en } from '../../i18n/en';
import { sfx } from '../sfx';

export type ResultScreenProps = {
  module: ContentModule;
  /** Sesi APA yang baru saja selesai. Wajib: pesan hasil berbeda per jenis sesi. */
  kind: SessionKind;
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
  kind,
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

  /**
   * Master Round tidak pernah MENGUBAH status — ia hanya menentukan bintang ke-3.
   * Membaca `next.status` untuk menyusun pesannya berarti melaporkan keadaan yang
   * sudah ada SEBELUM sesi ini: anak yang baru saja mengerjakan Master Round
   * dijawab "Almost! Just be a bit quicker.", kalimat tentang kecepatan kuis yang
   * tidak ada hubungannya dengan ronde yang barusan dia mainkan — dan kalimat itu
   * muncul sama persis entah dia menang atau tidak.
   */
  const masterRound = kind === 'master';
  const thirdStar = evaluation.events.some((e) => e.type === 'star' && e.stars === 3);
  const gotStar = evaluation.events.some((e) => e.type === 'star');

  /**
   * `practiced` sekarang berarti LEWAT dengan bintang di tangan — tinggal
   * kecepatannya. Layar ini dulu memperlakukannya sebagai "belum": judul
   * "Keep going!", bar sesi, dan tidak ada perayaan. Anak yang benar semua
   * pantas dirayakan meski dia lambat.
   */
  const cleared = mastered || practiced;
  const [celebrating, setCelebrating] = useState(
    cleared || gotStar || earnedBadges.length > 0,
  );

  useEffect(() => {
    if (earnedBadges.length > 0) sfx.badge();
    else if (cleared || gotStar) sfx.star();
  }, [earnedBadges.length, cleared, gotStar]);

  const testedOut = evaluation.events.some((e) => e.type === 'tested-out');
  const testoutFailed = evaluation.events.some((e) => e.type === 'testout-failed');

  const message = testedOut
    ? en.result.testedOut
    : testoutFailed
      ? en.result.testoutFailed
      : masterRound
        ? thirdStar
          ? en.result.masterWon
          : en.result.masterMissed
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
          {cleared || thirdStar ? en.result.niceWork : en.result.keepGoing}
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
        {/* Master Round tidak dihitung sebagai langkah menuju kelulusan modul, jadi
            bar "sesi lulus" di sini hanya angka yang membingungkan. */}
        {!cleared && !masterRound ? (
          <ProgressBar
            value={Math.min(detail.passingSessions, sessionsNeeded)}
            max={sessionsNeeded}
            label={`${Math.min(detail.passingSessions, sessionsNeeded)}/${sessionsNeeded}`}
            tone="star"
          />
        ) : null}
        <p
          className="mt-2 text-center text-[18px] font-bold"
          style={{ color: cleared || thirdStar ? 'var(--c-correct)' : 'var(--c-ink-soft)' }}
        >
          {message}
        </p>
        {cleared && nextTitle ? (
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
