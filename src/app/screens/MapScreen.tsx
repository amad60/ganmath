import type { ModuleState } from '../../engine/types';
import { isUnlocked } from '../../engine/unlock';
import { pathOrder, registry, moduleById, unitTitles } from '../../content';
import { Button, ProgressBar, StarRow } from '../../components/ui';
import { en } from '../../i18n/en';

export type MapScreenProps = {
  states: Record<string, ModuleState>;
  nextId: string | null;
  onOpen: (moduleId: string) => void;
  onParent: () => void;
};

const CLEARED = ['mastered', 'retained', 'practiced'];

export function MapScreen({ states, nextId, onOpen, onParent }: MapScreenProps) {
  const done = pathOrder.filter((id) => CLEARED.includes(states[id]?.status ?? '')).length;

  return (
    <div className="flex min-h-full flex-col">
      <header className="safe-top bg-bg sticky top-0 z-10 px-5 pt-2 pb-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-2xl font-black">{en.appName}</span>
          <button
            type="button"
            onClick={onParent}
            aria-label="Parent area"
            className="flex h-11 w-11 items-center justify-center rounded-full text-2xl"
          >
            👤
          </button>
        </div>
        <ProgressBar value={done} max={pathOrder.length} label={en.map.gradeProgress(done, pathOrder.length)} />
      </header>

      <main className="flex flex-1 flex-col items-center gap-5 px-5 py-6">
        {pathOrder.map((id, i) => {
          const def = moduleById(id);
          const st = states[id];
          const unlocked = isUnlocked(id, states, registry);
          const cleared = CLEARED.includes(st?.status ?? '');
          const isNext = id === nextId;
          const needsReview = st?.status === 'needs_review';
          const unit = unitTitles[def.unitId];

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
              style={{ transform: `translateX(${i % 2 === 0 ? -36 : 36}px)` }}
            >
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => onOpen(id)}
                aria-label={`${def.title}${unlocked ? '' : ', locked'}`}
                className="flex h-20 w-20 items-center justify-center rounded-full text-[34px] shadow-[var(--shadow-card)] disabled:opacity-70"
                style={{
                  background: bg,
                  animation: isNext ? 'node-pulse 1.6s ease-in-out infinite' : undefined,
                }}
              >
                {cleared ? '⭐' : unlocked ? def.icon : '🔒'}
              </button>
              <span className="mt-2 text-[15px] font-bold">{def.title}</span>
              {st && st.stars > 0 ? <StarRow stars={st.stars} size={16} /> : null}
            </div>
          );
        })}
      </main>

      <div className="safe-bottom bg-bg sticky bottom-0 px-5 pt-2 pb-3">
        {nextId ? (
          <Button full onClick={() => onOpen(nextId)}>
            {en.map.startNext}: {moduleById(nextId).title}
          </Button>
        ) : (
          <p className="text-ink-soft py-4 text-center font-bold">{en.map.allDone}</p>
        )}
      </div>
    </div>
  );
}
