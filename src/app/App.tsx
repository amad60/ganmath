import { useState } from 'react';
import { Button, Header, Keypad, ProgressBar, Sheet, StarRow } from '../components/ui';

/**
 * Mesin state layar — bukan router (docs/tech/architecture.md §3).
 * S3: halaman demo UI kit. Layar nyata menyusul di S5.
 */
export function App() {
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');
  const [typed, setTyped] = useState('');
  const [sheet, setSheet] = useState(false);

  const applyTheme = (t: 'system' | 'light' | 'dark') => {
    setTheme(t);
    const root = document.documentElement;
    if (t === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', t);
  };

  return (
    <div className="mx-auto flex min-h-full max-w-[430px] flex-col">
      <Header
        center={<span className="text-2xl font-black">GanMath</span>}
        right={<span className="text-ink-soft text-[15px] font-bold">S3 · UI kit</span>}
      />

      <main className="safe-bottom flex flex-col gap-6 p-5">
        <section className="flex gap-2">
          {(['system', 'light', 'dark'] as const).map((t) => (
            <Button
              key={t}
              variant={theme === t ? 'primary' : 'ghost'}
              className="h-11 px-4 text-[15px]"
              onClick={() => applyTheme(t)}
            >
              {t}
            </Button>
          ))}
        </section>

        <section className="flex flex-col gap-3">
          <ProgressBar value={16} max={43} label="16/43" />
          <ProgressBar value={2} max={3} label="Module" tone="star" />
        </section>

        <section className="flex items-center justify-between">
          <StarRow stars={2} />
          <StarRow stars={3} size={28} animate />
        </section>

        <section>
          <p className="mb-3 text-center text-[56px] leading-none font-black">7 + 3 = ?</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="answer">9</Button>
            <Button variant="answer" feedback="correct">
              10
            </Button>
            <Button variant="answer" feedback="retry">
              11
            </Button>
            <Button variant="answer">8</Button>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <p className="text-ink-soft text-[15px] font-bold">Keypad · typed: {typed || '—'}</p>
          <Keypad value={typed} onChange={setTyped} onSubmit={() => setTyped('')} />
        </section>

        <section className="flex flex-col gap-3">
          <Button full onClick={() => setSheet(true)}>
            Open sheet
          </Button>
          <Button variant="danger">Reset progress</Button>
        </section>
      </main>

      <Sheet
        open={sheet}
        title="Load from file?"
        onClose={() => setSheet(false)}
        footer={
          <>
            <Button full onClick={() => setSheet(false)}>
              Replace my progress
            </Button>
            <Button variant="ghost" full onClick={() => setSheet(false)}>
              Cancel
            </Button>
          </>
        }
      >
        File: 24 modules mastered, 3 days ago.
        <br />
        Now: 16 modules mastered.
      </Sheet>
    </div>
  );
}
