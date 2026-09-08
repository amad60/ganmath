export type IconName = 'trophy' | 'parent' | 'close' | 'back' | 'lock' | 'skip';

export type IconProps = { name: IconName; size?: number; color?: string };

/**
 * Ikon antarmuka digambar SVG, bukan emoji.
 *
 * Emoji dirender berbeda di tiap sistem, ukurannya tidak bisa diatur presisi, dan
 * warnanya tidak bisa mengikuti tema — di sebelah maskot yang digambar SVG, emoji
 * terlihat seperti tempelan. Emoji tetap dipakai untuk ISI pelajaran (buah, balok),
 * di mana keragamannya justru tidak masalah.
 */
export function Icon({ name, size = 24, color = 'var(--c-ink)' }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (name) {
    case 'trophy':
      return (
        <svg {...common}>
          <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
          <path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" />
          <path d="M12 14v4M9 20h6" />
        </svg>
      );
    case 'parent':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.6" />
          <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
        </svg>
      );
    case 'close':
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...common}>
          <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
          <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case 'skip':
      return (
        <svg {...common}>
          <path d="M5 6l6 6-6 6M13 6l6 6-6 6" />
        </svg>
      );
    case 'back':
      return (
        <svg {...common}>
          <path d="M15 5l-7 7 7 7" />
        </svg>
      );
  }
}
