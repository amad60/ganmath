import { useReducedMotion } from '../manipulatives/useReducedMotion';

export type EvidenceTextProps = {
  sentences: string[];
  title?: string;
  selectedIndex?: number | null;
  /** Kalimat yang sudah dipilih dan ternyata bukan petunjuk. Tidak bisa diketuk lagi. */
  rejectedIndices?: number[];
  /**
   * Warna kalimat `selectedIndex`. `correct` hanya untuk tebakan pertama yang kena.
   * Tebakan yang salah memakai `wrong` dan tidak menandai kalimat lain.
   */
  selectedTone?: 'correct' | 'wrong' | null;
  onSelect?: (index: number) => void;
  interactive?: boolean;
};

/**
 * Mekanik 1 Literasi: Detektif Bukti (Tap the Clue / Sentence Selection).
 *
 * Menampilkan micro-story (2–4 kalimat).
 * Jika `interactive` aktif (di QuestionScreen tipe clue-tap), setiap kalimat
 * adalah kartu tap yang lega (min height 44px, rounded-md, outline kontras)
 * sehingga anak melatih "evidence-based reading" dengan memilih kalimat bukti secara fisik.
 */
export function EvidenceText({
  sentences,
  title,
  selectedIndex = null,
  rejectedIndices = [],
  selectedTone = null,
  onSelect,
  interactive = true,
}: EvidenceTextProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className="flex w-full max-w-[390px] flex-col gap-2.5 rounded-[var(--r-lg)] p-4 shadow-sm"
      style={{
        background: 'var(--c-surface)',
        border: '2px solid var(--c-line)',
      }}
    >
      {title ? (
        <div className="flex items-center gap-2 border-b border-[var(--c-line)] pb-2">
          <span className="text-xl">📖</span>
          <h3 className="text-base font-black tracking-wide text-[var(--c-ink)]">{title}</h3>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        {sentences.map((sentence, idx) => {
          const isRejected = rejectedIndices.includes(idx);
          const isSelected = selectedIndex === idx && !isRejected;
          const tone = isRejected ? 'wrong' : isSelected ? selectedTone : null;
          const toneColor =
            tone === 'correct' ? 'var(--c-correct)' : tone === 'wrong' ? 'var(--c-retry)' : null;

          if (!interactive) {
            return (
              <p key={idx} className="text-base font-bold leading-relaxed text-[var(--c-ink)]">
                {sentence}
              </p>
            );
          }

          return (
            <button
              key={idx}
              type="button"
              aria-pressed={isSelected || isRejected}
              aria-disabled={isRejected}
              onClick={() => {
                if (!isRejected) onSelect?.(idx);
              }}
              className="flex min-h-[46px] w-full items-center rounded-[var(--r-md)] px-3.5 py-2 text-left text-[16px] font-bold leading-snug transition-all active:scale-[0.98]"
              style={{
                background: toneColor
                  ? tone === 'correct'
                    ? 'var(--c-correct-soft)'
                    : 'var(--c-retry-soft)'
                  : 'var(--c-surface-sunk)',
                border: `2px solid ${toneColor ?? 'transparent'}`,
                color: toneColor ?? 'var(--c-ink)',
                boxShadow: 'none',
                animation: tone && !reduced ? 'badge-pop 300ms ease-out both' : undefined,
                opacity: isRejected ? 0.72 : 1,
              }}
            >
              <span className="mr-2.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                style={{
                  background: toneColor ?? 'var(--c-ink-soft)',
                }}
              >
                {idx + 1}
              </span>
              <span>{sentence}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
