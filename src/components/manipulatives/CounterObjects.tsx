import { teachingDuration, useReducedMotion } from './useReducedMotion';

export type CounterObjectsProps = {
  count: number;
  icon?: string;
  /** Berapa objek yang sudah "dihitung" anak — dipakai modul Count to 5/10. */
  counted?: number;
  onTap?: (index: number) => void;
  columns?: number;
};

/**
 * Objek yang bisa ditap sambil dihitung. Objek yang sudah dihitung menyusut
 * sedikit dan diberi nomor, supaya anak melihat apa yang sudah dia hitung —
 * ini menghilangkan kesalahan paling umum: menghitung objek yang sama dua kali.
 */
export function CounterObjects({
  count,
  icon = '🍎',
  counted = 0,
  onTap,
  columns = 5,
}: CounterObjectsProps) {
  const reduced = useReducedMotion();
  return (
    <div
      className="grid justify-center gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      aria-label={`${count} objects, ${counted} counted`}
    >
      {Array.from({ length: count }, (_, i) => {
        const done = i < counted;
        return (
          <button
            key={i}
            type="button"
            disabled={!onTap}
            onClick={() => onTap?.(i)}
            aria-label={done ? `Object ${i + 1}, counted` : `Object ${i + 1}`}
            className="relative flex h-14 w-14 items-center justify-center rounded-[var(--r-sm)]"
            style={{
              background: done ? 'var(--c-correct-soft)' : 'transparent',
              transform: done ? 'scale(0.92)' : 'scale(1)',
              transition: `transform ${teachingDuration(200, reduced)}ms var(--ease-std), background ${teachingDuration(200, reduced)}ms linear`,
            }}
          >
            <span className="text-[34px] leading-none">{icon}</span>
            {done ? (
              <span
                className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-[13px] font-black text-white"
                style={{ background: 'var(--c-correct)' }}
              >
                {i + 1}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
