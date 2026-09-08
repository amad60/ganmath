import type { ModuleState } from '../../engine/types';
import { isUnlocked } from '../../engine/unlock';
import { pathOrder, registry, moduleById, unitTitles } from '../../content';
import { Button, ProgressBar, StarRow } from '../../components/ui';
import { Mascot } from '../../components/mascot/Mascot';
import { en } from '../../i18n/en';

export type MapScreenProps = {
  states: Record<string, ModuleState>;
  nextId: string | null;
  xp: number;
  level: number;
  streak: number;
  onOpen: (moduleId: string) => void;
  onTestOut: (moduleId: string) => void;
  onParent: () => void;
  onBadges: () => void;
};

const CLEARED = ['mastered', 'retained', 'practiced'];

export function MapScreen({
  states,
  nextId,
  xp,
  level,
  streak,
  onOpen,
  onTestOut,
  onParent,
  onBadges,
}: MapScreenProps) {
  const done = pathOrder.filter((id) => CLEARED.includes(states[id]?.status ?? '')).length;
  const nextIndex = nextId ? pathOrder.indexOf(nextId) : -1;

  return (
    <div className="flex min-h-full flex-col">
      <header className="safe-top bg-bg sticky top-0 z-10 px-5 pt-2 pb-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[15px] font-black">
            {/* streak sebagai pencapaian, tanpa peringatan "akan hilang" */}
            <span style={{ color: 'var(--c-streak)' }}>🔥 {streak}</span>
            <span style={{ color: 'var(--c-star)' }}>⭐ {xp}</span>
            <span className="text-ink-soft">Lv.{level}</span>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              onClick={onBadges}
              aria-label="My badges"
              className="flex h-11 w-11 items-center justify-center rounded-full text-2xl"
            >
              🏅
            </button>
            <button
              type="button"
              onClick={onParent}
              aria-label="Parent area"
              className="flex h-11 w-11 items-center justify-center rounded-full text-2xl"
            >
              👤
            </button>
          </div>
        </div>
        <ProgressBar
          value={done}
          max={pathOrder.length}
          label={en.map.gradeProgress(done, pathOrder.length)}
        />
      </header>

      <main className="flex flex-1 flex-col items-center gap-4 px-5 py-5">
        {/* Kartu "Next up": anak tidak perlu memindai peta untuk tahu harus ngapain. */}
        {nextId ? (
          <div
            className="flex w-full items-center gap-4 rounded-[var(--r-lg)] p-4 shadow-[var(--shadow-card)]"
            style={{ background: 'var(--c-surface)', borderLeft: '6px solid var(--c-primary)' }}
          >
            <Mascot mood="idle" size={56} />
            <div className="min-w-0 flex-1">
              <p className="text-ink-soft text-[13px] font-black tracking-wide uppercase">
                {en.map.nextUp}
              </p>
              <p className="truncate text-xl font-black">{moduleById(nextId).title}</p>
              <p className="text-ink-soft text-[15px]">
                {unitTitles[moduleById(nextId).unitId]?.title ?? ''}
              </p>
            </div>
          </div>
        ) : null}

        {pathOrder.map((id, i) => {
          const def = moduleById(id);
          const st = states[id];
          const unlocked = isUnlocked(id, states, registry);
          const cleared = CLEARED.includes(st?.status ?? '');
          const isNext = id === nextId;
          const needsReview = st?.status === 'needs_review';
          const unit = unitTitles[def.unitId];
          const prevTitle = i > 0 ? moduleById(pathOrder[i - 1] as string).title : null;

          const bg = cleared
            ? 'var(--c-mastered)'
            : needsReview
              ? 'var(--c-review)'
              : unlocked
                ? (unit?.color ?? 'var(--c-primary)')
                : 'var(--c-locked)';

          return (
            <div
              key={id}
              className="flex w-full flex-col items-center"
              style={{ transform: `translateX(${i % 2 === 0 ? -30 : 30}px)` }}
            >
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => onOpen(id)}
                aria-label={`${def.title}${unlocked ? '' : ', locked'}`}
                className="flex items-center justify-center rounded-full shadow-[var(--shadow-card)] disabled:opacity-60"
                style={{
                  background: bg,
                  width: isNext ? 92 : 72,
                  height: isNext ? 92 : 72,
                  fontSize: isNext ? 40 : 30,
                  animation: isNext ? 'node-pulse 1.6s ease-in-out infinite' : undefined,
                }}
              >
                {cleared ? '⭐' : unlocked ? def.icon : '🔒'}
              </button>

              <span
                className="mt-2 text-center text-[15px] font-bold"
                style={{ opacity: unlocked ? 1 : 0.6 }}
              >
                {def.title}
              </span>

              {st && st.stars > 0 ? <StarRow stars={st.stars} size={16} /> : null}

              {/* Modul terkunci menjelaskan APA yang membukanya — bukan sekadar gembok bisu. */}
              {!unlocked && i === nextIndex + 1 && prevTitle ? (
                <span className="text-ink-soft mt-1 text-center text-[13px]">
                  {en.map.lockedHint}
                </span>
              ) : null}

              {isNext ? (
                <div className="mt-3 flex w-full flex-col gap-2">
                  <Button full onClick={() => onOpen(id)}>
                    {en.map.startNext}: {def.title}
                  </Button>
                  {/* Pintu jump-level: anak yang sudah bisa tidak perlu menempuh materinya. */}
                  <Button variant="ghost" full onClick={() => onTestOut(id)}>
                    ⏩ {en.map.skipAhead}
                  </Button>
                </div>
              ) : null}
            </div>
          );
        })}

        {!nextId ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <Mascot mood="celebrate" size={100} />
            <p className="text-ink-soft text-center font-bold">{en.map.allDone}</p>
          </div>
        ) : null}
      </main>
    </div>
  );
}
