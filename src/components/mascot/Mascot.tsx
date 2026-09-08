export type MascotMood = 'idle' | 'thinking' | 'happy' | 'celebrate' | 'encourage' | 'sleepy';

export type MascotProps = { mood?: MascotMood; size?: number; className?: string };

/**
 * Gan — rubah kecil. Badan tetap, ekspresi hanya dari mata & mulut, jadi enam emosi
 * cuma butuh beberapa path tambahan. Digambar SVG supaya tajam di semua ukuran dan
 * tetap ringan untuk offline.
 *
 * Aturan keras: Gan TIDAK PERNAH sedih atau kecewa saat anak salah. Ekspresi terburuk
 * yang dia punya adalah `encourage` — kepala miring dan senyum kecil.
 */
export function Mascot({ mood = 'idle', size = 96, className = '' }: MascotProps) {
  const tilt = mood === 'encourage' ? -8 : mood === 'thinking' ? 6 : 0;
  const bounce = mood === 'happy' || mood === 'celebrate';

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`Gan the fox, ${mood}`}
      style={{
        transform: `rotate(${tilt}deg)`,
        animation: bounce ? 'mascot-bounce 600ms ease-out' : undefined,
      }}
    >
      {/* telinga */}
      <path d="M22 46 L30 14 L52 34 Z" fill="#E8763A" />
      <path d="M98 46 L90 14 L68 34 Z" fill="#E8763A" />
      <path d="M28 42 L33 24 L45 35 Z" fill="#F7C9AE" />
      <path d="M92 42 L87 24 L75 35 Z" fill="#F7C9AE" />

      {/* kepala */}
      <ellipse cx="60" cy="62" rx="40" ry="36" fill="#F08A4B" />
      {/* pipi & moncong */}
      <ellipse cx="60" cy="76" rx="26" ry="20" fill="#FFF3E6" />
      <ellipse cx="26" cy="70" rx="9" ry="7" fill="#F7C9AE" opacity="0.75" />
      <ellipse cx="94" cy="70" rx="9" ry="7" fill="#F7C9AE" opacity="0.75" />

      {/* mata */}
      {mood === 'sleepy' ? (
        <>
          <path d="M38 62 q7 6 14 0" stroke="#2B2118" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M68 62 q7 6 14 0" stroke="#2B2118" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : mood === 'happy' || mood === 'celebrate' ? (
        <>
          <path d="M38 64 q7 -8 14 0" stroke="#2B2118" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M68 64 q7 -8 14 0" stroke="#2B2118" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="45" cy="62" r="5.5" fill="#2B2118" />
          <circle cx="75" cy="62" r="5.5" fill="#2B2118" />
          <circle cx="47" cy="60" r="1.8" fill="#fff" />
          <circle cx="77" cy="60" r="1.8" fill="#fff" />
        </>
      )}

      {/* hidung & mulut */}
      <ellipse cx="60" cy="74" rx="5" ry="4" fill="#2B2118" />
      {mood === 'celebrate' ? (
        <ellipse cx="60" cy="86" rx="9" ry="7" fill="#2B2118" />
      ) : mood === 'encourage' ? (
        <path d="M52 86 q8 5 16 0" stroke="#2B2118" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M52 84 q8 7 16 0" stroke="#2B2118" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}

      {mood === 'thinking' ? (
        <>
          <circle cx="100" cy="30" r="5" fill="var(--c-primary)" opacity="0.85" />
          <circle cx="110" cy="20" r="3" fill="var(--c-primary)" opacity="0.6" />
        </>
      ) : null}
    </svg>
  );
}
