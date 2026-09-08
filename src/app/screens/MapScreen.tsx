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
  /** Kartu tawaran pasang ke home screen — dirender DI DALAM aliran, bukan menempel
   *  di atas konten, supaya tidak pernah menutupi node terakhir. */
  install?: { label: string; onAccept: () => void; onDismiss: () => void } | null;
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
  install,
}: MapScreenProps) {
  const done = pathOrder.filter((id) => CLEARED.includes(states[id]?.status ?? '')).length;
  const nextIndex = nextId ? pathOrder.indexOf(nextId) : -1;
  const nextDef = nextId ? moduleById(nextId) : null;

  return (
    <div className="mx-auto flex min-h-full max-w-[430px] flex-col">
      <header className="safe-top bg-bg sticky top-0 z-20 px-5 pt-2 pb-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[15px] font-black">
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

      <main className="flex flex-1 flex-col items-center gap-0 px-6 pt-4 pb-[168px]">
        {nextDef ? (
          <div
            className="mb-2 flex w-full items-center gap-3 rounded-[var(--r-lg)] p-3 shadow-[var(--shadow-card)]"
            style={{ background: 'var(--c-surface)', borderLeft: '6px solid var(--c-primary)' }}
          >
            <Mascot mood="idle" size={48} />
            <div className="min-w-0 flex-1">
              <p className="text-ink-soft text-[12px] font-black tracking-wide uppercase">
                {en.map.nextUp}
              </p>
              <p className="truncate text-[19px] leading-tight font-black">{nextDef.title}</p>
              <p className="text-ink-soft truncate text-[13px]">
                {unitTitles[nextDef.unitId]?.title ?? ''}
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
          const accent = unit?.color ?? 'var(--c-primary)';

          return (
            <div key={id} className="flex w-full flex-col items-center">
              {/* Penghubung: jalur, bukan daftar. Terisi warna kalau sudah dilewati. */}
              {i > 0 ? (
                <div
                  aria-hidden
                  style={{
                    width: 5,
                    height: 26,
                    borderRadius: 999,
                    background: cleared || unlocked ? accent : 'var(--c-line)',
                    opacity: cleared || unlocked ? 0.55 : 1,
                  }}
                />
              ) : null}

              <div
                className="flex flex-col items-center"
                // Geser kecil untuk kesan berkelok, tapi elemen di dalamnya tidak
                // pernah selebar container — inilah yang dulu membuat tombol Start
                // menembus tepi kanan layar.
                style={{ transform: `translateX(${i % 2 === 0 ? -22 : 22}px)` }}
              >
                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => onOpen(id)}
                  aria-label={`${def.title}${unlocked ? '' : ', locked'}`}
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: isNext ? 84 : 68,
                    height: isNext ? 84 : 68,
                    fontSize: isNext ? 34 : 27,
                    // Latar terang + cincin warna: emoji tetap terbaca, tidak
                    // bertabrakan dengan warna pekat.
                    background: cleared
                      ? 'var(--c-star)'
                      : unlocked
                        ? 'var(--c-surface)'
                        : 'var(--c-surface-sunk)',
                    border: `4px solid ${cleared ? 'var(--c-star)' : unlocked ? accent : 'var(--c-line)'}`,
                    boxShadow: unlocked ? 'var(--shadow-card)' : 'none',
                    opacity: unlocked ? 1 : 0.75,
                    animation: isNext ? 'node-pulse 1.8s ease-in-out infinite' : undefined,
                  }}
                >
                  {cleared ? '⭐' : unlocked ? def.icon : '🔒'}
                </button>

                <span
                  className="mt-1.5 text-center text-[15px] font-bold"
                  style={{ opacity: unlocked ? 1 : 0.55 }}
                >
                  {def.title}
                </span>

                {st && st.stars > 0 ? <StarRow stars={st.stars} size={15} /> : null}

                {!unlocked && i === nextIndex + 1 ? (
                  <span className="text-ink-soft mt-0.5 text-center text-[13px]">
                    {en.map.lockedHint}
                  </span>
                ) : null}

                {needsReview ? (
                  <span
                    className="mt-0.5 text-[13px] font-black"
                    style={{ color: 'var(--c-review)' }}
                  >
                    ⟲ {en.map.review}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}

        {/* Tawaran pasang: kartu biasa di dalam aliran, jadi tidak pernah menutupi node. */}
        {install ? (
          <div
            className="mt-6 flex w-full flex-col gap-2 rounded-[var(--r-lg)] p-4"
            style={{ background: 'var(--c-primary-soft)' }}
          >
            <p className="text-[16px] font-bold">{install.label}</p>
            <div className="flex gap-2">
              <Button className="h-12 flex-1 px-4 text-[16px]" onClick={install.onAccept}>
                {en.map.installYes}
              </Button>
              <Button variant="ghost" onClick={install.onDismiss}>
                {en.map.later}
              </Button>
            </div>
          </div>
        ) : null}

        {!nextId ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <Mascot mood="celebrate" size={100} />
            <p className="text-ink-soft text-center font-bold">{en.map.allDone}</p>
          </div>
        ) : null}
      </main>

      {/* Aksi utama menempel di bawah: selalu dalam jangkauan jempol, tidak pernah
          ikut tergeser oleh tata letak jalur. */}
      {nextDef ? (
        <div
          className="safe-bottom sticky bottom-0 z-20 flex flex-col gap-2 px-5 pt-3 pb-3"
          style={{
            background:
              'linear-gradient(to top, var(--c-bg) 72%, color-mix(in srgb, var(--c-bg) 0%, transparent))',
          }}
        >
          <Button full onClick={() => onOpen(nextDef.id)}>
            {en.map.startNext}: {nextDef.title}
          </Button>
          <Button variant="ghost" full onClick={() => onTestOut(nextDef.id)}>
            ⏩ {en.map.skipAhead}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
