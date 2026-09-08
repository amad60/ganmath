/**
 * Mesin state layar — bukan router. Lihat docs/tech/architecture.md §3.
 * S0: kerangka + smoke test token desain. Layar nyata menyusul di S5.
 */
export function App() {
  return (
    <div className="safe-top safe-bottom mx-auto flex min-h-full max-w-[430px] flex-col gap-6 p-5">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-black">GanMath</h1>
        <span className="text-ink-soft text-[15px] font-bold">S0 · setup</span>
      </header>

      <p className="text-ink-soft text-[15px]">
        Smoke test token desain. Ganti tema HP ke dark untuk mengecek palet gelap.
      </p>

      <div className="grid grid-cols-4 gap-3">
        {(
          [
            ['primary', 'bg-primary'],
            ['correct', 'bg-correct'],
            ['retry', 'bg-retry'],
            ['star', 'bg-star'],
            ['badge', 'bg-badge'],
            ['streak', 'bg-streak'],
            ['locked', 'bg-locked'],
            ['danger', 'bg-danger'],
          ] as const
        ).map(([name, cls]) => (
          <div key={name} className="flex flex-col items-center gap-1">
            <div className={`h-12 w-12 rounded-[var(--r-sm)] ${cls}`} />
            <span className="text-[13px] font-bold">{name}</span>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-[var(--r-lg)] p-5 shadow-[var(--shadow-card)]">
        <p className="text-[56px] leading-none font-black">7 + 3</p>
        <p className="mt-2 text-xl font-bold">Instruction size</p>
        <p className="text-ink-soft mt-1 text-[18px]">Body text size for the Learn screen.</p>
      </div>

      <button
        type="button"
        className="bg-primary text-primary-ink mt-auto h-16 rounded-[var(--r-pill)] text-xl font-black
                   shadow-[0_4px_0_rgb(0_0_0/0.18)] transition-transform duration-100
                   active:translate-y-[3px] active:shadow-[var(--shadow-press)]"
      >
        Button 64px
      </button>
    </div>
  );
}
