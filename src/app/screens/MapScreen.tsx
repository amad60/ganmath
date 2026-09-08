import { useEffect, useRef, useState } from 'react';
import type { ModuleState } from '../../engine/types';
import { isUnlocked } from '../../engine/unlock';
import { moduleById, registryFor, unitModules, unitTitles } from '../../content';
import { Button, Icon, ProgressBar, Sheet, StarRow } from '../../components/ui';
import { Mascot } from '../../components/mascot/Mascot';
import { en } from '../../i18n/en';

export type MapScreenProps = {
  states: Record<string, ModuleState>;
  nextId: string | null;
  xp: number;
  level: number;
  streak: number;
  grade: number;
  /** Label langkah berikutnya, mis. "Learn" / "Practice" / "Mastery Check". */
  nextStepLabel: string;
  reviews: { moduleId: string; title: string }[];
  onOpen: (moduleId: string) => void;
  onReview: (moduleId: string) => void;
  onMaster: (moduleId: string) => void;
  onTestOut: (moduleId: string) => void;
  onSkipUnit: (unitId: string) => void;
  onParent: () => void;
  onBadges: () => void;
  install?: { label: string; onAccept: () => void; onDismiss: () => void } | null;
};

const CLEARED = ['mastered', 'retained', 'practiced'];

export function MapScreen(props: MapScreenProps) {
  const {
    states,
    nextId,
    xp,
    level,
    streak,
    grade,
    nextStepLabel,
    reviews,
    onOpen,
    onReview,
    onMaster,
    onTestOut,
    onSkipUnit,
    onParent,
    onBadges,
    install,
  } = props;

  /** Modul selesai yang sedang ditanyakan "mau diapakan". */
  const [chosen, setChosen] = useState<string | null>(null);
  const [skipOpen, setSkipOpen] = useState(false);
  /** Bagian unit yang sengaja dibuka anak meski sudah tuntas. */
  const [opened, setOpened] = useState<Set<number>>(new Set());
  const nextRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Dengan 38–43 modul, membuka peta berarti mendarat di bagian yang SUDAH
    // selesai dan harus menggulir jauh untuk menemukan diri sendiri. Peta selalu
    // dibuka pada posisi anak berada.
    // Panggilan opsional: tidak semua lingkungan punya scrollIntoView, dan peta
    // tidak boleh jatuh hanya karena tidak bisa menggulir.
    nextRef.current?.scrollIntoView?.({ block: 'center' });
  }, [nextId]);

  const registry = registryFor(grade);
  const pathOrder = registry.pathOrder;
  const done = pathOrder.filter((id) => CLEARED.includes(states[id]?.status ?? '')).length;
  const nextDef = nextId ? moduleById(nextId) : null;

  /**
   * Peta dikelompokkan per UNIT, tapi mengikuti **potongan berurutan** di path order —
   * bukan per unit yang unik.
   *
   * Unit bentuk, ukur, dan pola sengaja DISISIPKAN sebagai jeda di antara blok
   * aritmetika, jadi satu unit bisa muncul beberapa kali di sepanjang jalur.
   * Versi sebelumnya mengelompokkan per kemunculan pertama, sehingga SELURUH modul
   * Unit 6 ditarik ke posisi ketujuh — padahal tiga di antaranya baru terbuka jauh
   * di belakang. Urutan yang dilihat anak jadi tidak sama dengan urutan yang
   * sebenarnya dia tempuh.
   */
  const sections: { unitId: string; ids: string[]; repeat: number }[] = [];
  const seenUnits = new Map<string, number>();
  for (const id of pathOrder) {
    const u = moduleById(id).unitId;
    const last = sections.at(-1);
    if (last && last.unitId === u) {
      last.ids.push(id);
      continue;
    }
    const repeat = (seenUnits.get(u) ?? 0) + 1;
    seenUnits.set(u, repeat);
    sections.push({ unitId: u, ids: [id], repeat });
  }

  const chosenState = chosen ? states[chosen] : undefined;

  return (
    <div className="mx-auto flex min-h-full max-w-[430px] flex-col">
      <header
        className="safe-top bg-bg sticky top-0 z-20 px-6 pb-3"
        style={{ boxShadow: 'inset 0 -1px 0 var(--c-line)' }}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-[15px] font-black tabular-nums">
            <Stat icon="🔥" value={streak} color="var(--c-streak)" />
            <Stat icon="⭐" value={xp} color="var(--c-star)" />
            <span className="text-ink-soft">Lv.{level}</span>
            {/* Kelas aktif harus terlihat di layar utama, bukan hanya di Parent Area. */}
            <span
              className="rounded-[var(--r-pill)] px-2 py-0.5 text-[13px]"
              style={{ background: 'var(--c-primary-soft)', color: 'var(--c-primary)' }}
            >
              G{grade}
            </span>
          </div>
          <div className="-mr-2 flex items-center gap-1">
            <IconButton label="My badges" onClick={onBadges} name="trophy" />
            <IconButton label="Parent area" onClick={onParent} name="parent" />
          </div>
        </div>
        <ProgressBar
          value={done}
          max={pathOrder.length}
          label={en.map.gradeProgress(done, pathOrder.length)}
        />
      </header>

      <main className="flex flex-1 flex-col items-center gap-0 px-6 pt-4 pb-[150px]">
        {reviews.length > 0 ? (
          <section
            className="mb-4 flex w-full flex-col gap-2 rounded-[var(--r-lg)] p-4"
            style={{ background: 'var(--c-surface)', borderLeft: '6px solid var(--c-review)' }}
          >
            <p className="text-ink-soft text-[12px] font-black tracking-wide uppercase">
              {en.map.reviewDue}
            </p>
            {reviews.map((r) => (
              <Button
                key={r.moduleId}
                variant="answer"
                textSize={17}
                full
                className="h-12"
                onClick={() => onReview(r.moduleId)}
              >
                ⟲ {r.title}
              </Button>
            ))}
          </section>
        ) : null}

        {/* Kartu "berikutnya" adalah TOMBOL, bukan hiasan — ini yang paling jelas ditekan. */}
        {nextDef ? (
          <button
            type="button"
            onClick={() => onOpen(nextDef.id)}
            className="mb-4 flex w-full items-center gap-3 rounded-[var(--r-lg)] p-3 text-left shadow-[var(--shadow-card)]"
            style={{ background: 'var(--c-surface)', borderLeft: '6px solid var(--c-primary)' }}
          >
            <Mascot mood="idle" size={48} />
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-black tracking-wide uppercase" style={{ color: 'var(--c-primary)' }}>
                {nextStepLabel}
              </p>
              <p className="truncate text-[19px] leading-tight font-black">{nextDef.title}</p>
              <p className="text-ink-soft truncate text-[13px]">
                {unitTitles[nextDef.unitId]?.title ?? ''}
              </p>
            </div>
            <Icon name="skip" size={20} color="var(--c-primary)" />
          </button>
        ) : null}

        {sections.map((section, sectionIndex) => {
          const { unitId, ids, repeat } = section;
          // Kemajuan yang ditampilkan adalah kemajuan SELURUH unit, bukan potongan ini
          // saja — kalau tidak, "1/2" di dua tempat berbeda untuk unit yang sama akan
          // membingungkan.
          const unitIds = pathOrder.filter((id) => moduleById(id).unitId === unitId);
          const cleared = unitIds.filter((id) => CLEARED.includes(states[id]?.status ?? '')).length;
          const unit = unitTitles[unitId];
          const accent = unit?.color ?? 'var(--c-primary)';
          const unitDone = cleared === unitIds.length;
          const hasNext = nextId != null && ids.includes(nextId);
          // Unit yang sudah tuntas dilipat: daftar 40 node membuat yang penting
          // tenggelam. Bagian tempat anak berada tidak pernah dilipat.
          const collapsed = unitDone && !hasNext && !opened.has(sectionIndex);

          return (
            <section key={`${unitId}-${sectionIndex}`} className="flex w-full flex-col items-center">
              {/* Judul unit: anak bisa melihat "aku ada di bagian apa", dan berapa sisanya. */}
              <button
                type="button"
                disabled={!unitDone || hasNext}
                onClick={() =>
                  setOpened((prev) => {
                    const next = new Set(prev);
                    if (next.has(sectionIndex)) next.delete(sectionIndex);
                    else next.add(sectionIndex);
                    return next;
                  })
                }
                className="mt-2 mb-3 flex w-full items-center gap-3"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: unitDone ? 'var(--c-star)' : accent }}
                />
                <span className="text-left text-[15px] font-black">
                  {unit?.title ?? unitId}
                  {repeat > 1 ? (
                    <span className="text-ink-soft font-bold"> · {en.map.unitAgain}</span>
                  ) : null}
                </span>
                <span
                  className="ml-auto text-[13px] font-black tabular-nums"
                  style={{ color: unitDone ? 'var(--c-star)' : 'var(--c-ink-soft)' }}
                >
                  {cleared}/{unitIds.length}
                </span>
                {unitDone && !hasNext ? (
                  <span
                    className="text-[13px] font-black"
                    style={{ color: 'var(--c-primary)' }}
                  >
                    {collapsed ? en.map.expand : en.map.collapse}
                  </span>
                ) : null}
              </button>

              {collapsed ? (
                <div
                  className="mb-2 flex w-full items-center justify-center gap-2 rounded-[var(--r-md)] py-3"
                  style={{ background: 'var(--c-surface)', border: '2px solid var(--c-line)' }}
                >
                  <span style={{ fontSize: 18 }}>⭐</span>
                  <span className="text-ink-soft text-[15px] font-bold">
                    {en.map.unitDone(ids.length)}
                  </span>
                </div>
              ) : null}

              {(collapsed ? [] : ids).map((id, i) => {
                const def = moduleById(id);
                const st = states[id];
                const unlocked = isUnlocked(id, states, registry);
                const isCleared = CLEARED.includes(st?.status ?? '');
                const isNext = id === nextId;
                const needsReview =
                  st?.status === 'needs_review' || reviews.some((r) => r.moduleId === id);

                return (
                  <div
                    key={id}
                    ref={id === nextId ? nextRef : undefined}
                    className="flex w-full flex-col items-center"
                  >
                    {i > 0 ? (
                      <div
                        aria-hidden
                        style={{
                          width: 5,
                          height: 22,
                          borderRadius: 999,
                          background: isCleared || unlocked ? accent : 'var(--c-line)',
                          opacity: isCleared || unlocked ? 0.55 : 1,
                        }}
                      />
                    ) : null}

                    <div
                      className="flex flex-col items-center"
                      style={{ transform: `translateX(${i % 2 === 0 ? -28 : 28}px)` }}
                    >
                      <button
                        type="button"
                        disabled={!unlocked}
                        onClick={() => (isCleared ? setChosen(id) : onOpen(id))}
                        aria-label={`${def.title}${unlocked ? '' : ', locked'}`}
                        className="flex items-center justify-center rounded-full"
                        style={{
                          width: isNext ? 80 : 64,
                          height: isNext ? 80 : 64,
                          fontSize: isNext ? 32 : 26,
                          background: isCleared
                            ? 'var(--c-star)'
                            : unlocked
                              ? 'var(--c-surface)'
                              : 'var(--c-surface-sunk)',
                          border: `4px solid ${isCleared ? 'var(--c-star)' : unlocked ? accent : 'var(--c-line)'}`,
                          boxShadow: unlocked ? 'var(--shadow-card)' : 'none',
                          opacity: unlocked ? 1 : 0.75,
                          animation: isNext ? 'node-pulse 1.8s ease-in-out infinite' : undefined,
                        }}
                      >
                        {isCleared ? (
                          '⭐'
                        ) : unlocked ? (
                          def.icon
                        ) : (
                          <Icon name="lock" size={24} color="var(--c-locked)" />
                        )}
                      </button>

                      <span
                        className="mt-1.5 text-center text-[15px] font-bold"
                        style={{ opacity: unlocked ? 1 : 0.55 }}
                      >
                        {def.title}
                      </span>

                      {st && st.stars > 0 ? <StarRow stars={st.stars} size={15} /> : null}

                      {/*
                        Setiap node menjelaskan apa yang terjadi kalau ditekan, DAN
                        warnanya menyatakan jenisnya. Empat arti, empat warna:
                        biru = bisa dikerjakan sekarang, hijau = sudah selesai,
                        biru muda = minta diulang, abu = terkunci.
                      */}
                      <span
                        className="mt-0.5 text-center text-[12px] font-bold"
                        style={{
                          color: needsReview
                            ? 'var(--c-review)'
                            : isCleared
                              ? 'var(--c-correct)'
                              : unlocked
                                ? 'var(--c-primary)'
                                : 'var(--c-locked)',
                        }}
                      >
                        {needsReview
                          ? en.map.tapReview
                          : isCleared
                            ? en.map.tapDone
                            : unlocked
                              ? en.map.tapStart
                              : en.map.lockedHint}
                      </span>
                    </div>
                  </div>
                );
              })}
            </section>
          );
        })}

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

      {/* SATU tombol utama. Pintu melompat dipindah ke dalam lembar terpisah supaya
          tidak ada tiga tombol bersaing di tempat yang sama. */}
      {nextDef ? (
        <div
          className="safe-bottom sticky bottom-0 z-20 flex flex-col gap-1 px-6 pt-3"
          style={{
            background:
              'linear-gradient(to top, var(--c-bg) 72%, color-mix(in srgb, var(--c-bg) 0%, transparent))',
          }}
        >
          <Button full onClick={() => onOpen(nextDef.id)}>
            {nextStepLabel}: {nextDef.title}
          </Button>
          <Button variant="ghost" full textSize={15} onClick={() => setSkipOpen(true)}>
            {en.map.skipAhead}
          </Button>
        </div>
      ) : null}

      <Sheet open={skipOpen} title={en.map.skipTitle} onClose={() => setSkipOpen(false)}>
        <p className="mb-4 text-[16px]">{en.map.skipExplain}</p>
        <div className="flex flex-col gap-3">
          <Button
            full
            onClick={() => {
              setSkipOpen(false);
              if (nextDef) onTestOut(nextDef.id);
            }}
          >
            {en.map.skipModule(nextDef?.title ?? '')}
          </Button>
          {nextDef && unitModules(nextDef.unitId).length >= 3 ? (
            <Button
              variant="answer"
              textSize={17}
              full
              className="h-14"
              onClick={() => {
                setSkipOpen(false);
                onSkipUnit(nextDef.unitId);
              }}
            >
              {en.map.skipUnitNamed(unitTitles[nextDef.unitId]?.title ?? '')}
            </Button>
          ) : null}
          <Button variant="ghost" full onClick={() => setSkipOpen(false)}>
            {en.map.cancel}
          </Button>
        </div>
      </Sheet>

      <Sheet
        open={chosen != null}
        title={chosen ? moduleById(chosen).title : ''}
        onClose={() => setChosen(null)}
      >
        <div className="mb-4 flex items-center gap-3">
          <StarRow stars={chosenState?.stars ?? 0} size={26} />
          <span className="text-ink-soft text-[15px]">
            {(chosenState?.stars ?? 0) >= 3 ? en.map.starsFull : en.map.starsHint}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            full
            onClick={() => {
              const id = chosen;
              setChosen(null);
              if (id) onReview(id);
            }}
          >
            {en.map.doReview}
          </Button>
          {(chosenState?.stars ?? 0) < 3 ? (
            <Button
              variant="answer"
              textSize={17}
              full
              className="h-14"
              onClick={() => {
                const id = chosen;
                setChosen(null);
                if (id) onMaster(id);
              }}
            >
              {en.map.doMaster}
            </Button>
          ) : null}
          <Button variant="ghost" full onClick={() => setChosen(null)}>
            {en.map.cancel}
          </Button>
        </div>
      </Sheet>
    </div>
  );
}

function Stat({ icon, value, color }: { icon: string; value: number; color: string }) {
  return (
    <span className="flex items-center gap-1" style={{ color }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      {value}
    </span>
  );
}

function IconButton({
  label,
  onClick,
  name,
}: {
  label: string;
  onClick: () => void;
  name: 'trophy' | 'parent';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full"
    >
      <Icon name={name} size={23} color="var(--c-ink-soft)" />
    </button>
  );
}
