export type ClockProps = {
  hour: number;
  /** Grade 1 memakai 0 dan 30; Grade 2 memakai kelipatan lima. */
  minute: number;
  size?: number;
};

/** Jam analog. Jarum jam ikut bergeser saat setengah jam — itu yang sering keliru dibaca anak. */
export function Clock({ hour, minute, size = 130 }: ClockProps) {
  const hourAngle = ((hour % 12) + minute / 60) * 30 - 90;
  const minuteAngle = (minute / 60) * 360 - 90;
  const hand = (angle: number, len: number, width: number, color: string) => {
    const rad = (angle * Math.PI) / 180;
    return (
      <line
        x1="50"
        y1="50"
        x2={50 + len * Math.cos(rad)}
        y2={50 + len * Math.sin(rad)}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
    );
  };

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={`${hour} ${minute === 30 ? 'thirty' : "o'clock"}`}
      style={{ display: 'block' }}
    >
      <circle cx="50" cy="50" r="45" fill="var(--c-surface)" stroke="var(--c-ink)" strokeWidth="3" />
      {/* Titik hanya di posisi tanpa angka: 12/3/6/9 sudah punya angkanya sendiri. */}
      {Array.from({ length: 12 }, (_, i) => {
        if (i % 3 === 0) return null;
        const a = ((i * 30 - 90) * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={50 + 38 * Math.cos(a)}
            cy={50 + 38 * Math.sin(a)}
            r="1.6"
            fill="var(--c-ink)"
          />
        );
      })}
      {[12, 3, 6, 9].map((n, i) => {
        const a = ((i * 90 - 90) * Math.PI) / 180;
        return (
          <text
            key={n}
            x={50 + 33 * Math.cos(a)}
            y={50 + 33 * Math.sin(a) + 5}
            textAnchor="middle"
            fontSize="13"
            fontWeight="900"
            fill="var(--c-ink)"
          >
            {n}
          </text>
        );
      })}
      {hand(minuteAngle, 32, 3, 'var(--c-unit-3)')}
      {hand(hourAngle, 22, 5, 'var(--c-primary)')}
      <circle cx="50" cy="50" r="3.5" fill="var(--c-ink)" />
    </svg>
  );
}
