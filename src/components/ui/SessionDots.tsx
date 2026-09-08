export type DotState = 'correct' | 'wrong' | 'current' | 'todo';

export type SessionDotsProps = { states: DotState[] };

/**
 * Deretan titik: satu titik per soal. Anak bisa melihat sisa berapa lagi tanpa
 * membaca angka, dan melihat hasilnya sejauh ini. Bar tanpa angka tidak cukup —
 * "masih berapa lagi" adalah pertanyaan pertama anak dalam sesi apa pun.
 */
export function SessionDots({ states }: SessionDotsProps) {
  return (
    <div className="flex items-center justify-center gap-1.5" aria-hidden>
      {states.map((s, i) => (
        <span
          key={i}
          style={{
            width: s === 'current' ? 14 : 10,
            height: s === 'current' ? 14 : 10,
            borderRadius: 999,
            background:
              s === 'correct'
                ? 'var(--c-correct)'
                : s === 'wrong'
                  ? 'var(--c-retry)'
                  : s === 'current'
                    ? 'var(--c-primary)'
                    : 'var(--c-line)',
            outline: s === 'current' ? '3px solid var(--c-primary-soft)' : undefined,
            transition: 'all 200ms var(--ease-std)',
          }}
        />
      ))}
    </div>
  );
}
