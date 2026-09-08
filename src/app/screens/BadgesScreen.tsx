import { BADGES, type BadgeId } from '../../engine/gamification';
import type { ModuleState } from '../../engine/types';
import { all, pathOrderFor, unitTitles, moduleById } from '../../content';
import { BadgeCard, Header, ProgressBar, StarRow } from '../../components/ui';
import { Mascot } from '../../components/mascot/Mascot';

export type BadgesScreenProps = {
  owned: string[];
  states: Record<string, ModuleState>;
  streakBest: number;
  streakCurrent: number;
  nextId: string | null;
  grade: number;
  onBack: () => void;
};

const CLEARED = ['mastered', 'retained', 'practiced'];

type HistoryRow = { date: string; title: string; accuracy: number; passed: boolean; kind: string };

export function BadgesScreen({
  owned,
  states,
  streakBest,
  streakCurrent,
  nextId,
  grade,
  onBack,
}: BadgesScreenProps) {
  const pathOrder = pathOrderFor(grade);
  // Diurutkan numerik. Mengikuti path order membuat daftarnya terbaca
  // "Unit 1, Unit 6, Unit 2" — benar secara jalur, tapi terlihat seperti bug.
  const units = [...new Set(all.filter((m) => m.grade === grade).map((m) => m.unitId))].sort(
    (a, b) => Number(a.split('-u')[1] ?? 0) - Number(b.split('-u')[1] ?? 0),
  );
  const done = pathOrder.filter((id) => CLEARED.includes(states[id]?.status ?? '')).length;

  // Riwayat: apa yang sudah dikerjakan anak, terbaru dulu.
  const history: HistoryRow[] = Object.entries(states)
    .flatMap(([id, st]) =>
      st.attempts.map((a) => ({
        date: a.date,
        title: moduleById(id).title,
        accuracy: a.accuracy,
        passed: a.passed,
        kind: a.kind,
      })),
    )
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 8);

  // Milestone berikutnya: modul yang sedang dituju, dan dua modul terkunci sesudahnya.
  const nextIndex = nextId ? pathOrder.indexOf(nextId) : -1;
  const upcoming = nextIndex >= 0 ? pathOrder.slice(nextIndex, nextIndex + 3) : [];
  const lockedBadges = (Object.keys(BADGES) as BadgeId[]).filter((b) => !owned.includes(b)).slice(0, 3);

  return (
    <div className="mx-auto flex min-h-full max-w-[430px] flex-col">
      <Header
        onBack={onBack}
        backLabel="Back"
        center={<span className="text-2xl font-black">My Progress</span>}
        right={<Mascot mood="happy" size={40} />}
      />

      <main className="safe-bottom flex flex-col gap-6 px-6 py-5">
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-black">Grade {grade}</h2>
          <ProgressBar value={done} max={pathOrder.length} label={`${done}/${pathOrder.length}`} />
          {units.map((unitId) => {
            const ids = all.filter((m) => m.unitId === unitId).map((m) => m.id);
            const cleared = ids.filter((id) => CLEARED.includes(states[id]?.status ?? '')).length;
            return (
              <div key={unitId} className="flex items-center gap-3">
                <span className="w-[104px] shrink-0 text-[15px] font-bold">
                  {unitTitles[unitId]?.title.split('·')[0]?.trim() ?? unitId}
                </span>
                <div className="flex-1">
                  <ProgressBar value={cleared} max={ids.length} label={`${cleared}/${ids.length}`} />
                </div>
              </div>
            );
          })}
        </section>

        {/* Milestone berikutnya: anak bisa melihat apa yang sedang dia kejar. */}
        {upcoming.length > 0 ? (
          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-black">Coming next</h2>
            {upcoming.map((id, i) => {
              const def = moduleById(id);
              return (
                <div
                  key={id}
                  className="flex items-center gap-3 rounded-[var(--r-md)] p-3"
                  style={{
                    background: i === 0 ? 'var(--c-primary-soft)' : 'var(--c-surface)',
                    border: '2px solid var(--c-line)',
                  }}
                >
                  <span className="text-[26px]">{i === 0 ? def.icon : '🔒'}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[18px] font-black">{def.title}</p>
                    <p className="text-ink-soft text-[13px]">
                      {unitTitles[def.unitId]?.title ?? def.unitId}
                    </p>
                  </div>
                  {i === 0 ? (
                    <span className="text-[13px] font-black" style={{ color: 'var(--c-primary)' }}>
                      NOW
                    </span>
                  ) : null}
                </div>
              );
            })}
          </section>
        ) : null}

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-black">Badges</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {(Object.keys(BADGES) as BadgeId[]).map((id) => (
              <BadgeCard key={id} id={id} owned={owned.includes(id)} />
            ))}
          </div>
          {lockedBadges.length > 0 ? (
            <div className="flex flex-col gap-1">
              {lockedBadges.map((id) => (
                <p key={id} className="text-ink-soft text-[15px]">
                  🔒 {BADGES[id].hint}
                </p>
              ))}
            </div>
          ) : null}
        </section>

        {/* Riwayat: orang tua dan anak bisa melihat apa yang sudah dikerjakan. */}
        {history.length > 0 ? (
          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-black">Recent rounds</h2>
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[18px] font-bold">{h.title}</p>
                  <p className="text-ink-soft text-[13px]">
                    {h.date} · {h.kind}
                  </p>
                </div>
                <span
                  className="text-[18px] font-black"
                  style={{ color: h.passed ? 'var(--c-correct)' : 'var(--c-retry)' }}
                >
                  {Math.round(h.accuracy * 100)}%
                </span>
              </div>
            ))}
          </section>
        ) : null}

        <section className="bg-surface flex items-center justify-between rounded-[var(--r-lg)] p-5 shadow-[var(--shadow-card)]">
          <div>
            <p className="text-xl font-black" style={{ color: 'var(--c-streak)' }}>
              🔥 {streakCurrent} days
            </p>
            <p className="text-ink-soft text-[15px] font-bold">Best ever: {streakBest}</p>
          </div>
          <StarRow
            stars={
              Math.min(
                3,
                Object.values(states).filter((s) => s.stars === 3).length,
              ) as 0 | 1 | 2 | 3
            }
            size={22}
          />
        </section>
      </main>
    </div>
  );
}
