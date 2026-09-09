import { SOLID_NAMES, netEdges, netFaces, type NetFace, type SolidName } from './solids';
import { teachingDuration, useReducedMotion } from './useReducedMotion';

/** Lebar maksimum gambar di layar 390px, sudah dikurangi padding layar soal. */
const MAX_W = 320;
/** Tinggi maksimum — jaring salib kubus itu lebar dan pendek, limas tinggi dan sempit. */
const MAX_H = 210;
const FONT = 15;
const CHAR_W = 9;

export type ShapeNetProps = {
  solid: SolidName;
  /**
   * Susunan jaring. Bangun yang sama punya beberapa bentangan yang sah — anak yang
   * hanya pernah melihat satu gambar akan menghafalnya, bukan memahaminya.
   */
  layout?: number;
  /** Ukuran balok, hanya berpengaruh untuk `rectangular-prism`. */
  l?: number;
  w?: number;
  h?: number;
  /** Tulis nama bangun hasil lipatannya. Dimatikan saat itu yang ditanyakan. */
  showName?: boolean;
  /** Beri nomor tiap sisi — untuk mengajarkan "a cube has 6 faces". */
  numberFaces?: boolean;
  size?: number;
  color?: string;
};

function centroid(face: NetFace): [number, number] {
  if (face.circle) return [face.circle.cx, face.circle.cy];
  const n = face.points.length;
  let x = 0;
  let y = 0;
  for (const p of face.points) {
    x += p[0];
    y += p[1];
  }
  return [x / n, y / n];
}

/**
 * Jaring-jaring: bangun ruang yang dibentangkan jadi datar.
 *
 * Yang harus terlihat bukan "kumpulan kotak" tapi SATU lembar yang bisa dilipat,
 * jadi garis lipat digambar putus-putus dan garis potong (tepi luar) digambar tebal.
 * Tanpa beda itu jaring kubus dan jaring balok terlihat sama saja bagi anak, dan
 * soal "which net folds into a cube?" berubah jadi tebak-tebakan.
 */
export function ShapeNet({
  solid,
  layout = 0,
  l,
  w,
  h,
  showName,
  numberFaces,
  size = MAX_W,
  color = 'var(--c-unit-5)',
}: ShapeNetProps) {
  const reduced = useReducedMotion();
  const dims: { l?: number; w?: number; h?: number } = {};
  if (l != null) dims.l = l;
  if (w != null) dims.w = w;
  if (h != null) dims.h = h;

  const faces = netFaces(solid, dims, layout);
  const edges = netEdges(faces);

  // Skala dipilih dari kotak pembatas jaring, bukan ditebak: jaring salib kubus
  // 4×3 satuan dan jaring tabung 6.3×3.6 satuan tidak bisa memakai skala yang sama.
  const px: number[] = [];
  const py: number[] = [];
  for (const f of faces)
    for (const p of f.points) {
      px.push(p[0]);
      py.push(p[1]);
    }
  const x0 = Math.min(...px);
  const y0 = Math.min(...py);
  const spanX = Math.max(...px) - x0 || 1;
  const spanY = Math.max(...py) - y0 || 1;
  const u = Math.min(size / spanX, MAX_H / spanY);

  const at = (p: [number, number]): [number, number] => [(p[0] - x0) * u, (p[1] - y0) * u];

  const rows = showName ? [SOLID_NAMES[solid]] : [];
  const pad = 4;
  const bodyW = spanX * u;
  const bodyH = spanY * u;
  const nameW = rows.length ? (rows[0] as string).length * CHAR_W : 0;
  const vbW = Math.max(bodyW, nameW) + pad * 2;
  const vbH = bodyH + pad * 2 + (rows.length ? 24 : 0);
  const offX = (vbW - pad * 2 - bodyW) / 2;

  const aria = showName ? `net of a ${SOLID_NAMES[solid]}` : 'net of a solid shape';
  const fade = teachingDuration(220, reduced);

  return (
    <svg
      viewBox={`0 0 ${vbW.toFixed(2)} ${vbH.toFixed(2)}`}
      width={Math.round(vbW)}
      height={Math.round(vbH)}
      role="img"
      aria-label={aria}
      style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
    >
      <g transform={`translate(${(pad + offX).toFixed(2)} ${pad})`}>
        {faces.map((f, i) =>
          f.circle ? (
            <circle
              key={i}
              data-part="face"
              cx={at([f.circle.cx, f.circle.cy])[0]}
              cy={at([f.circle.cx, f.circle.cy])[1]}
              r={f.circle.r * u}
              fill={color}
              fillOpacity="0.22"
              stroke="var(--c-ink)"
              strokeWidth="2.5"
              style={{ animation: `fade-rise ${fade}ms ${i * 45}ms both` }}
            />
          ) : (
            <polygon
              key={i}
              data-part="face"
              points={f.points.map((p) => at(p).map((n) => n.toFixed(2)).join(',')).join(' ')}
              fill={color}
              fillOpacity="0.22"
              stroke="none"
              style={{ animation: `fade-rise ${fade}ms ${i * 45}ms both` }}
            />
          ),
        )}

        {edges.map((e, i) => {
          const [ax, ay] = at(e.a);
          const [bx, by] = at(e.b);
          return (
            <line
              key={i}
              data-part={e.fold ? 'fold' : 'cut'}
              x1={ax}
              y1={ay}
              x2={bx}
              y2={by}
              stroke={e.fold ? 'var(--c-ink-soft)' : 'var(--c-ink)'}
              strokeWidth={e.fold ? 1.8 : 2.5}
              strokeDasharray={e.fold ? '6 5' : undefined}
              strokeLinecap="round"
            />
          );
        })}

        {numberFaces
          ? faces.map((f, i) => {
              const [cx, cy] = at(centroid(f));
              return (
                <text
                  key={i}
                  data-part="face-number"
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={FONT}
                  fontWeight="900"
                  fill="var(--c-ink)"
                >
                  {i + 1}
                </text>
              );
            })
          : null}
      </g>

      {rows.map((t) => (
        <text
          key={t}
          data-part="name"
          x={vbW / 2}
          y={pad + bodyH + 15}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={FONT}
          fontWeight="800"
          fill="var(--c-ink-soft)"
        >
          {t}
        </text>
      ))}
    </svg>
  );
}
