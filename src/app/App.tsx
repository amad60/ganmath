import { useState } from 'react';
import { Button, Header, Keypad, ProgressBar, Sheet, StarRow } from '../components/ui';
import { CounterObjects, NumberBond, NumberLine, TenFrame } from '../components/manipulatives';

/**
 * Mesin state layar — bukan router (docs/tech/architecture.md §3).
 * S3: halaman demo UI kit. Layar nyata menyusul di S5.
 */
export function App() {
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');
  const [typed, setTyped] = useState('');
  const [sheet, setSheet] = useState(false);
  const [frame, setFrame] = useState(7);
  const [counted, setCounted] = useState(3);
  const [onLine, setOnLine] = useState<number>(4);
  const [onNeg, setOnNeg] = useState<number>(-3);

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
        right={<span className="text-ink-soft text-[15px] font-bold">S4 · kit</span>}
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

        <section className="flex flex-col items-center gap-3">
          <p className="text-ink-soft self-start text-[15px] font-bold">Ten frame · {frame}</p>
          <TenFrame value={frame} onChange={setFrame} split={5} />
        </section>

        <section className="flex flex-col items-center gap-3">
          <p className="text-ink-soft self-start text-[15px] font-bold">Number bond</p>
          <NumberBond whole={10} parts={[frame, null]} ask="part1" />
        </section>

        <section className="flex flex-col gap-3">
          <p className="text-ink-soft text-[15px] font-bold">Counter objects · {counted} counted</p>
          <CounterObjects count={8} counted={counted} onTap={(i) => setCounted(i + 1)} />
        </section>

        <section className="flex flex-col gap-3">
          <p className="text-ink-soft text-[15px] font-bold">Number line 0–10 · {onLine}</p>
          <NumberLine min={0} max={10} value={onLine} onChange={setOnLine} marks={[0]} />
          <p className="text-ink-soft text-[15px] font-bold">
            Siap Grade 6 sejak awal: −10…10 · {onNeg}
          </p>
          <NumberLine min={-10} max={10} value={onNeg} onChange={setOnNeg} />
          <p className="text-ink-soft text-[15px] font-bold">Siap pecahan: 0–2 langkah ¼</p>
          <NumberLine min={0} max={2} step={0.25} value={1.25} denominator={4} />
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
