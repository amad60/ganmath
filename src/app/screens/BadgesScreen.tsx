import { BADGES, type BadgeId } from '../../engine/gamification';
import type { ModuleState } from '../../engine/types';
import { all, pathOrder, unitTitles } from '../../content';
import { BadgeCard, Header, ProgressBar } from '../../components/ui';

export type BadgesScreenProps = {
  owned: string[];
  states: Record<string, ModuleState>;
  streakBest: number;
  streakCurrent: number;
  onBack: () => void;
};

const CLEARED = ['mastered', 'retained', 'practiced'];

export function BadgesScreen({
  owned,
  states,
  streakBest,
  streakCurrent,
  onBack,
}: BadgesScreenProps) {
  const units = [...new Set(all.map((m) => m.unitId))];
  const done = pathOrder.filter((id) => CLEARED.includes(states[id]?.status ?? '')).length;

  return (
    <div className="mx-auto flex min-h-full max-w-[430px] flex-col">
      <Header onBack={onBack} backLabel="Back" center={<span className="text-2xl font-black">My Badges</span>} />

      <main className="safe-bottom flex flex-col gap-6 p-5">
        <div className="flex flex-wrap justify-center gap-3">
          {(Object.keys(BADGES) as BadgeId[]).map((id) => (
            <BadgeCard key={id} id={id} owned={owned.includes(id)} />
          ))}
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-black">Grade 1</h2>
          <ProgressBar value={done} max={pathOrder.length} label={`${done}/${pathOrder.length}`} />

          {units.map((unitId) => {
            const ids = all.filter((m) => m.unitId === unitId).map((m) => m.id);
            const cleared = ids.filter((id) => CLEARED.includes(states[id]?.status ?? '')).length;
            return (
              <div key={unitId} className="flex items-center gap-3">
                <span className="w-[110px] shrink-0 text-[15px] font-bold">
                  {unitTitles[unitId]?.title.split('·')[0]?.trim() ?? unitId}
                </span>
                <div className="flex-1">
                  <ProgressBar value={cleared} max={ids.length} label={`${cleared}/${ids.length}`} />
                </div>
              </div>
            );
          })}
        </section>

        <section className="bg-surface rounded-[var(--r-lg)] p-5 shadow-[var(--shadow-card)]">
          <p className="text-xl font-black" style={{ color: 'var(--c-streak)' }}>
            🔥 Streak {streakCurrent} days
          </p>
          {/* rekor ditampilkan sebagai pencapaian — tidak pernah sebagai sesuatu yang hilang */}
          <p className="text-ink-soft text-[18px] font-bold">Best ever: {streakBest} days</p>
        </section>
      </main>
    </div>
  );
}
