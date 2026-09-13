import type { SolidKind, SolidShapesVisual } from '../../engine/types';

type P = [number, number];
const poly = (pts: P[]) => pts.map((p) => p.join(',')).join(' ');

const COLOR = 'var(--c-unit-1)';
const shade = (pct: number) => `color-mix(in srgb, ${COLOR} ${pct}%, var(--c-surface))`;
const line = { stroke: 'var(--c-ink)', strokeWidth: 2.5, strokeLinejoin: 'round' as const };

/** Prisma tegak: depan persegi panjang, atas dan kanan digeser miring. */
function Prism({ x, y, w, h, d }: { x: number; y: number; w: number; h: number; d: number }) {
  return (
    <>
      <polygon points={poly([[x, y], [x + d, y - d], [x + w + d, y - d], [x + w, y]])} fill={shade(55)} {...line} />
      <polygon points={poly([[x + w, y], [x + w + d, y - d], [x + w + d, y + h - d], [x + w, y + h]])} fill={shade(100)} {...line} />
      <rect x={x} y={y} width={w} height={h} fill={shade(78)} {...line} />
    </>
  );
}

function Drawing({ name }: { name: SolidKind }) {
  switch (name) {
    case 'ball':
      return (
        <>
          <circle cx="50" cy="52" r="38" fill={shade(85)} {...line} />
          {/* Garis khatulistiwa putus-putus dan kilap: tanpa keduanya bola terbaca
              sebagai lingkaran datar — persis kekeliruan yang mau diajarkan di sini. */}
          <ellipse cx="50" cy="52" rx="38" ry="11" fill="none" stroke="var(--c-ink)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.45" />
          <ellipse cx="37" cy="36" rx="10" ry="6" fill="#fff" opacity="0.45" />
        </>
      );
    case 'cube':
      return <Prism x={18} y={34} w={48} h={48} d={16} />;
    case 'box':
      return <Prism x={6} y={50} w={68} h={32} d={16} />;
    case 'cylinder':
      return (
        <>
          <path d="M22,24 L22,78 A28,9 0 0 0 78,78 L78,24 Z" fill={shade(85)} {...line} />
          <ellipse cx="50" cy="24" rx="28" ry="9" fill={shade(55)} {...line} />
        </>
      );
    case 'cone':
      return (
        <>
          <path d="M20,80 A30,9 0 0 1 80,80" fill="none" stroke="var(--c-ink)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.45" />
          <path d="M50,10 L20,80 A30,9 0 0 0 80,80 Z" fill={shade(85)} {...line} />
        </>
      );
  }
}

/**
 * Bangun ruang yang digambar, bukan emoji.
 *
 * Versi pertama g1-u6-m2 memakai 🔴 sebagai "ball" — lingkaran DATAR, untuk mengajarkan
 * bahwa bangun ruang tidak datar. Emoji juga berbeda bentuk di tiap HP, jadi kubus dan
 * balok tidak bisa dibedakan dengan pasti. Gambar ini memberi bayangan tiga sisi dan
 * garis putus-putus untuk bagian yang tersembunyi.
 */
export function SolidShapes({ shapes }: SolidShapesVisual) {
  const one = shapes.length === 1;
  const size = one ? 140 : 92;
  return (
    <div className="flex max-w-full flex-wrap items-start justify-center gap-x-3 gap-y-4">
      {shapes.map((s, i) => (
        <figure key={i} className="m-0 flex flex-col items-center gap-1" style={{ width: one ? size : 104 }}>
          <svg
            viewBox="0 0 100 100"
            width={size}
            height={size}
            role="img"
            // Nama hanya disebut kalau gambarnya sendiri menuliskannya — di soal, itu jawabannya.
            aria-label={s.label ? s.name : 'solid shape'}
            data-solid={s.name}
            style={{ display: 'block', overflow: 'visible' }}
          >
            <Drawing name={s.name} />
          </svg>
          {s.label ? <figcaption className="text-[17px] leading-none font-black">{s.name}</figcaption> : null}
          {s.note ? (
            <span className="text-ink-soft text-center text-[14px] leading-tight font-bold">{s.note}</span>
          ) : null}
        </figure>
      ))}
    </div>
  );
}
