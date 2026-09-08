import { useRef, useState } from 'react';
import type { ModuleState } from '../../engine/types';
import { all, moduleById } from '../../content';
import { storageIsAvailable } from '../../store/progress';
import type { ProgressState, Settings } from '../../store/schema';
import { readMeta, shouldRemindBackup, writeMeta } from '../../store/meta';
import { Button, Header, ProgressBar, Sheet } from '../../components/ui';
import { readProgressFile, saveProgressToFile } from '../backupFile';
import { summarize, buildBackup } from '../../store/backup';
import { APP_VERSION } from '../backupFile';

export type ParentScreenProps = {
  data: ProgressState;
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

export function ParentScreen({ data, onSettings, onImport, onReset, onBack }: ParentScreenProps) {
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
    .map((m) => ({ id: m.id, title: m.title, acc: accuracyOf(data.modules[m.id]) }))
    .filter((x): x is { id: string; title: string; acc: number } => x.acc != null && x.acc < 0.8)
    .sort((a, b) => a.acc - b.acc)
    .slice(0, 3);

  const remind = shouldRemindBackup(meta, mastered);

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

  return (
    <div className="mx-auto flex min-h-full max-w-[430px] flex-col">
      <Header onBack={onBack} backLabel="Back" center={<span className="text-2xl font-black">Parent Area</span>} />

      <main className="safe-bottom flex flex-col gap-6 px-6 py-5">
        <section className="bg-surface rounded-[var(--r-lg)] p-5 shadow-[var(--shadow-card)]">
          <Row label="Mastered" value={plural(mastered, 'module')} />
          <Row label="Needs review" value={plural(needsReview, 'module')} />
          <Row label="XP" value={String(data.xp)} />
          <Row
            label="Streak"
            value={`${plural(data.streak.current, 'day')} (best ${data.streak.best})`}
          />
          <div className="mt-3">
            <ProgressBar value={mastered} max={all.length} label={`${mastered}/${all.length}`} />
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-black">Struggling with</h2>
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

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-black">Settings</h2>
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

        {/* Pintu jump-level. Dengan konten yang ada sekarang, melompat dilakukan
            per modul lewat tombol ⏩ di peta; pemilihan grade disiapkan untuk konten
            berikutnya dan ditandai jujur mana yang belum ada. */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-black">Jump to level</h2>
          <p className="text-ink-soft text-[15px]">
            Already ahead? On the map, tap <b>⏩ I already know this</b> to skip a module by
            passing a short check instead of learning it first. Failing costs nothing.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((g) => {
              const available = g === 1;
              return (
                <button
                  key={g}
                  type="button"
                  disabled={!available}
                  className="rounded-[var(--r-md)] px-2 py-3 text-[16px] font-black disabled:opacity-45"
                  style={{
                    background: available ? 'var(--c-primary-soft)' : 'var(--c-surface-sunk)',
                    border: '2px solid var(--c-line)',
                  }}
                >
                  <span className="block">Grade {g}</span>
                  {available ? null : (
                    <span className="text-ink-soft block text-[12px] font-bold">soon</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

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
              // Dicatat supaya pengingat backup berikutnya dihitung dari sini.
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

        <Button variant="danger" full onClick={() => setConfirmReset(true)}>
          Reset progress
        </Button>
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
