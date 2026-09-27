import { useRef, useState } from 'react';
import type { ModuleState } from '../../engine/types';
import { all, availableGrades, moduleById, pathOrderFor, unitTitles } from '../../content';
import {
  readModulesList,
  readPathOrderFor,
  readUnitTitles,
} from '../../content/readIndex';
import { gradeReport } from '../../engine/report';
import { GradeProgress } from './GradeProgress';
import { storageIsAvailable } from '../../store/progress';
import type { ProgressState, Settings } from '../../store/schema';
import { readMeta, shouldRemindBackup, writeMeta } from '../../store/meta';
import { Button, Header, ProgressBar, Sheet } from '../../components/ui';
import { readProgressFile, saveProgressToFile } from '../backupFile';
import { summarize, buildBackup } from '../../store/backup';
import { APP_VERSION } from '../backupFile';
import { CloudSyncPanel } from './CloudSync';

export type ParentScreenProps = {
  data: ProgressState;
  onGrade: (grade: number) => void;
  onReadGrade?: (readGrade: number) => void;
  onSettings: (patch: Partial<Settings>) => void;
  onImport: (state: ProgressState) => void;
  onReset: () => void;
  onBack: () => void;
};

const CLEARED = ['mastered', 'retained'];

function accuracyOf(s: ModuleState | undefined): number | null {
  if (!s || s.totals.questions === 0) return null;
  return s.totals.correct / s.totals.questions;
}

export function ParentScreen({
  data,
  onGrade,
  onReadGrade,
  onSettings,
  onImport,
  onReset,
  onBack,
}: ParentScreenProps) {
  const [tab, setTab] = useState<'progress' | 'settings' | 'sync'>('progress');
  const activeGrade = data.profile.grade ?? 1;
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<{ state: ProgressState; text: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const meta = readMeta();
  const mastered = Object.values(data.modules).filter((m) => CLEARED.includes(m.status)).length;
  const needsReview = Object.values(data.modules).filter((m) => m.status === 'needs_review').length;

  // Diagnosis, bukan sekadar angka: topik dengan akurasi terendah lebih dulu.
  const struggling = all
    .filter((m) => m.grade === activeGrade)
    .map((m) => ({ id: m.id, title: m.title, acc: accuracyOf(data.modules[m.id]) }))
    .filter((x): x is { id: string; title: string; acc: number } => x.acc != null && x.acc < 0.8)
    .sort((a, b) => a.acc - b.acc)
    .slice(0, 3);

  const remind = shouldRemindBackup(meta, mastered);

  // Semua grade yang punya konten, bukan hanya yang aktif: grade yang sudah tuntas
  // justru yang paling ingin dilihat orang tua, dan dulu hilang begitu anak naik kelas.
  const reports = availableGrades.map((g) =>
    gradeReport(
      g,
      pathOrderFor(g).map((id) => {
        const m = moduleById(id);
        return { id, title: m.title, unitId: m.unitId };
      }),
      data.modules,
      (uid) => unitTitles[uid]?.title ?? uid,
    ),
  );
  // Yang terbuka duluan: grade dengan aktivitas terakhir yang sudah punya hasil —
  // biasanya yang baru saja dituntaskan. Seri (tuntas Grade 1 dan membuka Grade 2 di
  // hari yang sama) dimenangkan grade yang punya modul dikuasai: kartu kosong bukan
  // hal pertama yang ingin dilihat orang tua.
  const latest = [...reports]
    .filter((r) => r.lastActiveOn)
    .sort((a, b) => (b.lastActiveOn ?? '').localeCompare(a.lastActiveOn ?? '') || b.cleared - a.cleared)[0];
  // Grade yang belum disentuh tidak diberi kartu — kecuali grade yang sedang aktif.
  const shown = reports.filter((r) => r.startedOn || r.grade === activeGrade);
  const hidden = reports.filter((r) => !shown.includes(r)).map((r) => r.grade);

  // Laporan Read Grade 1, 2, 3
  const readReports = [1, 2, 3].map((rg) =>
    gradeReport(
      rg,
      readPathOrderFor(rg).map((id) => {
        const m = moduleById(id);
        return { id, title: m.title, unitId: m.unitId };
      }),
      data.modules,
      (uid) => readUnitTitles[uid]?.title ?? uid,
    ),
  );
  const shownRead = readReports.filter((r) => r.startedOn);

  const pickFile = async (file: File | undefined) => {
    if (!file) return;
    const result = await readProgressFile(file);
    if (!result.ok) return setError(result.error);
    const incoming = summarize(buildBackup(result.state, APP_VERSION, result.state.updatedAt));
    setPending({
      state: result.state,
      text: `File: ${incoming.mastered} modules mastered.\nNow: ${mastered} modules mastered.`,
    });
  };

  const totalAllModules = all.length + readModulesList.length;

  return (
    <div className="mx-auto flex min-h-full max-w-[430px] flex-col">
      <Header onBack={onBack} backLabel="Back" center={<span className="text-2xl font-black">Parent Area</span>} />

      <main className="safe-bottom flex flex-col gap-5 px-6 pt-4">
        {/* Tab Navigation */}
        <div className="flex w-full items-center justify-between rounded-[var(--r-md)] bg-[var(--c-surface-sunk)] p-1 border border-[var(--c-line)]">
          <button
            type="button"
            onClick={() => setTab('progress')}
            className="flex-1 rounded-lg py-2 text-center text-xs font-black transition-all"
            style={{
              background: tab === 'progress' ? 'var(--c-surface)' : 'transparent',
              color: tab === 'progress' ? 'var(--c-primary)' : 'var(--c-ink-soft)',
              boxShadow: tab === 'progress' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            📊 Progress
          </button>
          <button
            type="button"
            onClick={() => setTab('settings')}
            className="flex-1 rounded-lg py-2 text-center text-xs font-black transition-all"
            style={{
              background: tab === 'settings' ? 'var(--c-surface)' : 'transparent',
              color: tab === 'settings' ? 'var(--c-primary)' : 'var(--c-ink-soft)',
              boxShadow: tab === 'settings' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            ⚙️ Settings
          </button>
          <button
            type="button"
            onClick={() => setTab('sync')}
            className="flex-1 rounded-lg py-2 text-center text-xs font-black transition-all"
            style={{
              background: tab === 'sync' ? 'var(--c-surface)' : 'transparent',
              color: tab === 'sync' ? 'var(--c-primary)' : 'var(--c-ink-soft)',
              boxShadow: tab === 'sync' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            ☁️ Sync & Data
          </button>
        </div>

        {tab === 'progress' ? (
          <>
            <section className="bg-surface rounded-[var(--r-lg)] p-5 shadow-[var(--shadow-card)]">
              <Row label="Mastered" value={plural(mastered, 'module')} />
              <Row label="Needs review" value={plural(needsReview, 'module')} />
              <Row label="XP" value={String(data.xp)} />
              <Row
                label="Streak"
                value={`${plural(data.streak.current, 'day')} (best ${data.streak.best})`}
              />
              <div className="mt-3">
                <ProgressBar value={mastered} max={totalAllModules} label={`${mastered}/${totalAllModules}`} />
              </div>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-black">Math Progress by grade</h2>
              <GradeProgress reports={shown} openGrade={latest?.grade ?? activeGrade} />
              {hidden.length > 0 ? (
                <p className="text-ink-soft mt-2 text-[15px]">
                  {hidden.length === 1 ? `Grade ${hidden[0]}` : `Grades ${hidden[0]}–${hidden.at(-1)}`} will
                  show up here once started.
                </p>
              ) : null}
            </section>

            {/* Jump to Math level */}
            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-black">Jump to level</h2>
              <p className="text-ink-soft text-[15px]">
                Pick the grade your child is in. On the map, <b>Skip ahead</b> lets a child pass a
                short check instead of learning a module first — one module, or a whole unit.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((g) => {
                  const available = availableGrades.includes(g);
                  const active = g === activeGrade;
                  const count = pathOrderFor(g).length;
                  return (
                    <button
                      key={g}
                      type="button"
                      disabled={!available}
                      onClick={() => onGrade(g)}
                      aria-pressed={active}
                      className="rounded-[var(--r-md)] px-2 py-3 text-[16px] font-black disabled:opacity-45"
                      style={{
                        background: active
                          ? 'var(--c-primary)'
                          : available
                            ? 'var(--c-primary-soft)'
                            : 'var(--c-surface-sunk)',
                        color: active ? 'var(--c-primary-ink)' : 'var(--c-ink)',
                        border: `2px solid ${active ? 'var(--c-primary)' : 'var(--c-line)'}`,
                      }}
                    >
                      <span className="block">Grade {g}</span>
                      <span
                        className="block text-[12px] font-bold"
                        style={{ opacity: 0.75 }}
                      >
                        {available ? `${count} modules` : 'soon'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {shownRead.length > 0 ? (
              <section>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl">📖</span>
                  <h2 className="text-xl font-black">Reading Progress (Literasi)</h2>
                </div>
                <GradeProgress reports={shownRead} openGrade={data.profile.readGrade ?? 1} trackTitle="Read Level" />
              </section>
            ) : null}

            <section className="flex flex-col gap-2">
              <h3 className="text-base font-black">Jump to Reading Level</h3>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((rg) => {
                  const active = rg === (data.profile.readGrade ?? 1);
                  const count = readPathOrderFor(rg).length;
                  return (
                    <button
                      key={`read-${rg}`}
                      type="button"
                      onClick={() => onReadGrade?.(rg)}
                      aria-pressed={active}
                      className="rounded-[var(--r-md)] px-2 py-2 text-[15px] font-black"
                      style={{
                        background: active ? '#059669' : '#d1fae5',
                        color: active ? '#ffffff' : '#065f46',
                        border: `2px solid ${active ? '#059669' : 'var(--c-line)'}`,
                      }}
                    >
                      <span className="block">Level {rg}</span>
                      <span className="block text-[11px] font-bold opacity-80">{count} modules</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-black">Struggling with · Grade {activeGrade}</h2>
              {struggling.length === 0 ? (
                <p className="text-ink-soft text-[18px]">Nothing yet — accuracy looks good.</p>
              ) : (
                struggling.map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-1">
                    <span className="text-[18px] font-bold">{moduleById(s.id).title}</span>
                    <span className="text-[18px] font-black" style={{ color: 'var(--c-retry)' }}>
                      {Math.round(s.acc * 100)}%
                    </span>
                  </div>
                ))
              )}
            </section>
          </>
        ) : null}

        {tab === 'settings' ? (
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-black">Preferences</h2>
            <Toggle
              label="Sound"
              on={data.settings.sound}
              onToggle={() => onSettings({ sound: !data.settings.sound })}
            />
            <Toggle
              label="Reduce motion"
              on={data.settings.reducedMotion === true}
              onToggle={() =>
                onSettings({ reducedMotion: data.settings.reducedMotion === true ? null : true })
              }
            />
            <div className="flex items-center justify-between">
              <span className="text-[18px] font-bold">Mastery threshold</span>
              <select
                value={data.settings.masteryAccuracyOverride ?? ''}
                onChange={(e) =>
                  onSettings({
                    masteryAccuracyOverride: e.target.value === '' ? null : Number(e.target.value),
                  })
                }
                className="bg-surface rounded-[var(--r-sm)] border-2 border-[var(--c-line)] px-3 py-2 text-[18px] font-bold"
              >
                <option value="">Default (80%)</option>
                <option value="0.7">70%</option>
                <option value="0.9">90%</option>
                <option value="1">100%</option>
              </select>
            </div>
          </section>
        ) : null}

        {tab === 'sync' ? (
          <>
            <CloudSyncPanel />

            <section className="flex flex-col gap-3">
              <h2 className="text-xl font-black">Progress backup</h2>
              {!storageIsAvailable() ? (
                <p className="text-[18px] font-bold" style={{ color: 'var(--c-retry)' }}>
                  This browser is not saving data. Save to a file often.
                </p>
              ) : null}
              {remind ? (
                <p className="text-ink-soft text-[18px]">Time to save a backup file.</p>
              ) : null}
              <Button
                full
                onClick={() => {
                  saveProgressToFile(data);
                  writeMeta({ lastBackupAt: new Date().toISOString() });
                  setSavedAt(new Date().toISOString());
                }}
              >
                Save to file
              </Button>
              <Button variant="ghost" full onClick={() => fileRef.current?.click()}>
                Load from file
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                hidden
                onChange={(e) => void pickFile(e.target.files?.[0])}
              />
              <p className="text-ink-soft text-[15px]">
                Last backup:{' '}
                {savedAt ?? meta.lastBackupAt
                  ? new Date((savedAt ?? meta.lastBackupAt) as string).toLocaleDateString()
                  : 'never'}
              </p>
            </section>

            <section className="pt-2">
              <Button variant="danger" full onClick={() => setConfirmReset(true)}>
                Reset progress
              </Button>
            </section>
          </>
        ) : null}
      </main>

      <Sheet
        open={pending != null}
        title="Replace progress?"
        onClose={() => setPending(null)}
        footer={
          <>
            <Button
              full
              onClick={() => {
                if (pending) onImport(pending.state);
                setPending(null);
              }}
            >
              Replace
            </Button>
            <Button variant="ghost" full onClick={() => setPending(null)}>
              Cancel
            </Button>
          </>
        }
      >
        {/* Impor tidak pernah menggabungkan — perbandingan ini yang mencegah kehilangan diam-diam */}
        <span className="whitespace-pre-line">{pending?.text}</span>
      </Sheet>

      <Sheet
        open={error != null}
        title="Cannot load file"
        onClose={() => setError(null)}
        footer={
          <Button full onClick={() => setError(null)}>
            OK
          </Button>
        }
      >
        {error}
      </Sheet>

      <Sheet
        open={confirmReset}
        title="Reset everything?"
        onClose={() => setConfirmReset(false)}
        footer={
          <>
            <Button
              variant="danger"
              full
              onClick={() => {
                onReset();
                setConfirmReset(false);
              }}
            >
              Yes, erase progress
            </Button>
            <Button variant="ghost" full onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
          </>
        }
      >
        This erases every module, badge and streak. Save a backup file first.
      </Sheet>
    </div>
  );
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-ink-soft text-[18px] font-bold">{label}</span>
      <span className="text-xl font-black">{value}</span>
    </div>
  );
}

function Toggle({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[18px] font-bold">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onToggle}
        className="h-9 w-16 rounded-[var(--r-pill)] p-1 transition-colors"
        style={{ background: on ? 'var(--c-correct)' : 'var(--c-locked)' }}
      >
        <span
          className="block h-7 w-7 rounded-full bg-white transition-transform"
          style={{ transform: on ? 'translateX(28px)' : 'translateX(0)' }}
        />
      </button>
    </div>
  );
}
