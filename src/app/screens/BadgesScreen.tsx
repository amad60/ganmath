import { useState } from 'react';
import { BADGES, type BadgeId } from '../../engine/gamification';
import type { ModuleState } from '../../engine/types';
import { all, pathOrderFor, unitTitles, moduleById } from '../../content';
import { BadgeCard, Button, Header, Icon, ProgressBar, Sheet, StarRow } from '../../components/ui';
import { Mascot } from '../../components/mascot/Mascot';
import { en } from '../../i18n/en';

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
const PREVIEW_COUNT = 6;

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
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState<BadgeId | null>(null);

  const pathOrder = pathOrderFor(grade);
  const allIds = Object.keys(BADGES) as BadgeId[];
  const done = pathOrder.filter((id) => CLEARED.includes(states[id]?.status ?? '')).length;

  // Badge disimpan berurutan saat didapat, jadi yang terakhir = yang terbaru.
  const latest = owned.at(-1) as BadgeId | undefined;
  // Kalau belum punya satu pun, tampilkan yang PALING DEKAT didapat sebagai pemicu.
  const nextBadge = allIds.find((id) => !owned.includes(id));

  const ordered: BadgeId[] = [
    ...allIds.filter((id) => owned.includes(id)).reverse(),
    ...allIds.filter((id) => !owned.includes(id)),
  ];
  const shown = showAll ? ordered : ordered.slice(0, PREVIEW_COUNT);

  const units = [...new Set(all.filter((m) => m.grade === grade).map((m) => m.unitId))].sort(
    (a, b) => Number(a.split('-u')[1] ?? 0) - Number(b.split('-u')[1] ?? 0),
  );

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
    .slice(0, 6);

  const nextIndex = nextId ? pathOrder.indexOf(nextId) : -1;
  const upcoming = nextIndex >= 0 ? pathOrder.slice(nextIndex, nextIndex + 3) : [];

  return (
    <div className="mx-auto flex min-h-full max-w-[430px] flex-col">
      <Header
        onBack={onBack}
        backLabel="Back"
        center={<span className="text-2xl font-black">My Progress</span>}
        right={<Mascot mood="happy" size={40} />}
      />

      <main className="safe-bottom flex flex-col gap-6 px-6 pt-5">
        {/* Badge naik ke ATAS. Ini bagian yang paling ingin dilihat anak, dan yang
            paling kuat menariknya kembali — menaruhnya di bawah progress bar
            membuat hadiahnya harus dicari dulu. */}
        <section className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-black">{en.badges.title}</h2>
            <span className="text-ink-soft text-[14px] font-black tabular-nums">
              {owned.length}/{allIds.length}
            </span>
          </div>

          {latest ? (
            <button
              type="button"
              onClick={() => setOpen(latest)}
              className="flex w-full items-center gap-4 rounded-[var(--r-lg)] p-4 text-left shadow-[var(--shadow-card)]"
              style={{ background: 'var(--c-surface)', borderLeft: '6px solid var(--c-badge)' }}
            >
              <span className="text-[44px] leading-none">{BADGES[latest].icon}</span>
              <div className="min-w-0 flex-1">
                <p
                  className="text-[12px] font-black tracking-wide uppercase"
                  style={{ color: 'var(--c-badge)' }}
                >
                  {en.badges.newest}
                </p>
                <p className="truncate text-[19px] leading-tight font-black">
                  {BADGES[latest].title}
                </p>
                <p className="text-ink-soft truncate text-[13px]">{BADGES[latest].hint}</p>
              </div>
            </button>
          ) : nextBadge ? (
            <div
              className="flex w-full items-center gap-4 rounded-[var(--r-lg)] p-4"
              style={{ background: 'var(--c-surface)', borderLeft: '6px solid var(--c-line)' }}
            >
              <Icon name="lock" size={30} color="var(--c-locked)" />
              <div className="min-w-0 flex-1">
                <p className="text-ink-soft text-[12px] font-black tracking-wide uppercase">
                  {en.badges.firstOne}
                </p>
                <p className="truncate text-[19px] leading-tight font-black">
                  {BADGES[nextBadge].title}
                </p>
                <p className="text-ink-soft truncate text-[13px]">{BADGES[nextBadge].hint}</p>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap justify-center gap-3">
            {shown.map((id) => (
              <BadgeCard
                key={id}
                id={id}
                owned={owned.includes(id)}
                onClick={() => setOpen(id)}
              />
            ))}
          </div>

          {/* Sebelas badge sekaligus membanjiri layar; enam cukup untuk menggoda. */}
          {ordered.length > PREVIEW_COUNT ? (
            <Button variant="ghost" full textSize={16} onClick={() => setShowAll(!showAll)}>
              {showAll ? en.badges.less : en.badges.more(ordered.length)}
            </Button>
          ) : null}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-black">Grade {grade}</h2>
          <ProgressBar value={done} max={pathOrder.length} label={`${done}/${pathOrder.length}`} />
          <p className="text-ink-soft text-[14px]">
            On the map, shapes and measuring are mixed between the number units on purpose —
            switching topics helps things stick.
          </p>
          {units.map((unitId) => {
            const ids = all.filter((m) => m.unitId === unitId).map((m) => m.id);
            const cleared = ids.filter((id) => CLEARED.includes(states[id]?.status ?? '')).length;
            const unitDone = cleared === ids.length;
            return (
              <div key={unitId} className="flex items-center gap-3">
                <span className="w-[104px] shrink-0 text-[15px] font-bold">
                  {unitTitles[unitId]?.title.split('·')[0]?.trim() ?? unitId}
                </span>
                <div className="flex-1">
                  <ProgressBar
                    value={cleared}
                    max={ids.length}
                    label={`${cleared}/${ids.length}`}
                    tone={unitDone ? 'star' : 'primary'}
                  />
                </div>
              </div>
            );
          })}
        </section>

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
                  <span className="flex w-8 justify-center text-[26px]">
                    {i === 0 ? def.icon : <Icon name="lock" size={22} color="var(--c-locked)" />}
                  </span>
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
              Math.min(3, Object.values(states).filter((s) => s.stars === 3).length) as 0 | 1 | 2 | 3
            }
            size={22}
          />
        </section>
      </main>

      {/* Menekan badge membuka ceritanya: ikon besar, cara mendapatkannya, dan
          statusnya. Badge terkunci tetap bisa dibuka — justru di situ letak
          pemicunya: anak tahu apa yang sedang dia kejar. */}
      <Sheet
        open={open != null}
        title={open ? BADGES[open].title : ''}
        onClose={() => setOpen(null)}
      >
        {open ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <span
              className="text-[64px] leading-none"
              style={{
                filter: owned.includes(open) ? undefined : 'grayscale(1)',
                opacity: owned.includes(open) ? 1 : 0.5,
                animation: owned.includes(open) ? 'star-pop 420ms both' : undefined,
              }}
            >
              {BADGES[open].icon}
            </span>
            <p className="text-[18px] font-bold">{BADGES[open].hint}</p>
            <p
              className="text-[16px] font-black"
              style={{
                color: owned.includes(open) ? 'var(--c-correct)' : 'var(--c-locked)',
              }}
            >
              {owned.includes(open) ? en.badges.earned : en.badges.notYet}
            </p>
            <Button variant="ghost" full onClick={() => setOpen(null)}>
              {en.map.cancel}
            </Button>
          </div>
        ) : null}
      </Sheet>
    </div>
  );
}
