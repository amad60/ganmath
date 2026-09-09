import { clamp, ticksFor } from './scale';
import { teachingDuration, useReducedMotion } from './useReducedMotion';

export type AngleKind = 'acute' | 'right' | 'obtuse' | 'straight' | 'reflex';

/** Nama jenis sudut dalam English sederhana — dipakai label dan teks di layar. */
export const ANGLE_NAMES: Record<AngleKind, string> = {
  acute: 'acute angle',
  right: 'right angle',
  obtuse: 'obtuse angle',
  straight: 'straight angle',
  reflex: 'reflex angle',
};

/**
 * Jenis sudut dari besarnya. Fungsi murni supaya konten modul bisa memakai aturan
 * yang SAMA dengan yang digambar komponen — kalau tidak, gambar dan jawaban benar
 * bisa berbeda tanpa ada yang menyadari.
 */
export function angleKind(degrees: number): AngleKind {
  if (degrees === 90) return 'right';
  if (degrees === 180) return 'straight';
  if (degrees < 90) return 'acute';
  if (degrees < 180) return 'obtuse';
  return 'reflex';
}

export type AngleProps = {
  /** Besar sudut dalam derajat, 1–359. */
  degrees: number;
  /**
   * Putar seluruh sudut. Kaki dasarnya TIDAK boleh selalu mendatar: anak yang
   * hanya pernah melihat sudut siku tegak-mendatar mengira sudut miring 90°
   * bukan sudut siku. Memutar gambar adalah cara termurah mencegahnya.
   */
  rotate?: number;
  /** Busur penanda bagian yang diukur. Otomatis jadi tanda siku saat 90°. */
  showArc?: boolean;
  /** Tulis besarnya, mis. "60°". Dimatikan saat besarnya yang ditanyakan. */
  showValue?: boolean;
  /** Tulis namanya, mis. "right angle". */
  showName?: boolean;
  /** Skala derajat setengah lingkaran — busur derajat sederhana, tiap 10°. */
  showScale?: boolean;
  size?: number;
  color?: string;
};

const C = 60;
/** Panjang kaki sudut dalam satuan viewBox. */
const RAY = 46;
const ARC_R = 22;
/** Panjang garis skala tiap 30° (yang pendek separuhnya). */
const TICK_LONG = 9;
/** Jarak angka skala dari titik sudut, diukur dari ujung kaki. */
const LABEL_R = 19;

function dir(deg: number): [number, number] {
  const r = (deg * Math.PI) / 180;
  // y dibalik: di SVG sumbu y turun, sedangkan derajat naik berlawanan jarum jam.
  return [Math.cos(r), -Math.sin(r)];
}

/**
 * Titik sudut ditaruh supaya KOTAK PEMBATAS gambar yang jatuh di tengah, bukan
 * titik sudutnya. Menggeser titik sudut sejauh tetap ke arah garis bagi terlihat
 * benar untuk sudut lancip lalu meleset keluar bingkai untuk sudut refleks —
 * itu bug yang sungguh terjadi di 300°. Karena setiap titik yang digambar berada
 * dalam radius RAY dari titik sudut, cara ini menjamin gambar selalu muat.
 */
function vertexFor(rotate: number, deg: number, withScale: boolean): [number, number] {
  const xs: number[] = [0];
  const ys: number[] = [0];
  const put = (a: number, r: number, mx = 0, my = 0) => {
    const d = dir(a);
    xs.push(d[0] * r - mx, d[0] * r + mx);
    ys.push(d[1] * r - my, d[1] * r + my);
  };

  put(rotate, RAY);
  put(rotate + deg, RAY);
  // Busur menonjol melewati talinya di setiap arah sumbu yang dilewati sapuan.
  for (const a of [0, 90, 180, 270]) {
    if ((((a - rotate) % 360) + 360) % 360 <= deg) put(a, ARC_R);
  }

  if (withScale) {
    // Saat skala tampil, DIA yang jadi bentuk terbesar di layar — kalau yang
    // ditengahkan cuma sudutnya, setengah lingkarannya miring di dalam bingkai.
    for (const a of [0, 90, 180, 270]) {
      if ((((a - rotate) % 360) + 360) % 360 <= 180) put(a, RAY + TICK_LONG);
    }
    // Angka skala punya lebar; titik pusatnya saja tidak cukup.
    for (let t = 0; t <= 180; t += 30) put(rotate + t, RAY + LABEL_R, 10, 5);
  }

  return [
    C - (Math.min(...xs) + Math.max(...xs)) / 2,
    C - (Math.min(...ys) + Math.max(...ys)) / 2,
  ];
}

/**
 * Sudut: dua kaki dari satu titik, dengan busur yang menunjukkan bagian yang diukur.
 *
 * Sudut tidak bisa diajarkan dengan bangun datar biasa. Anak harus melihat bahwa yang
 * diukur adalah BUKAAN antara dua kaki, bukan panjang kakinya — maka kaki digambar
 * selalu sama panjang, dan busurnya diisi warna supaya bukaannya punya luas yang
 * terlihat. Sudut siku memakai tanda kotak, bukan busur, karena itulah lambang yang
 * akan dia temui di buku.
 */
export function Angle({
  degrees,
  rotate = 0,
  showArc = true,
  showValue,
  showName,
  showScale,
  // Skala derajat menambah cincin di luar kaki sudut. Kalau ukurannya tidak ikut
  // naik, gambarnya yang mengecil — dan angka 10px di HP 390px tidak terbaca.
  size = showScale ? 210 : 160,
  color = 'var(--c-unit-3)',
}: AngleProps) {
  const reduced = useReducedMotion();
  const deg = Math.round(clamp(degrees, 1, 359));
  const kind = angleKind(deg);

  const d0 = dir(rotate);
  const d1 = dir(rotate + deg);
  const dm = dir(rotate + deg / 2);
  const [vx, vy] = vertexFor(rotate, deg, Boolean(showScale));
  const at = (d: [number, number], r: number): [number, number] => [vx + d[0] * r, vy + d[1] * r];

  const [x0, y0] = at(d0, RAY);
  const [x1, y1] = at(d1, RAY);
  const [ax0, ay0] = at(d0, ARC_R);
  const [ax1, ay1] = at(d1, ARC_R);
  // sweep 0 = berlawanan jarum jam di layar, arah derajat yang membesar.
  const arc = `A ${ARC_R} ${ARC_R} 0 ${deg > 180 ? 1 : 0} 0 ${ax1} ${ay1}`;
  const isRight = deg === 90;

  const ticks = showScale ? ticksFor(0, 180, 10) : [];

  // Ruang tambahan hanya kalau dipakai: skala butuh cincin di luar kaki, nama butuh
  // satu baris di bawah. Menyediakannya selalu membuat gambar mengecil tanpa sebab.
  const pad = showScale ? 22 : 0;
  const vbW = 120 + pad * 2;
  const vbH = vbW + (showName ? 22 : 0);

  const sweep = teachingDuration(320, reduced);
  // Sudut kecil: angkanya didorong keluar, kalau tidak tertimpa kedua kakinya.
  const [tx, ty] = at(dm, ARC_R + (deg < 45 ? 26 : 15));

  /**
   * Label pembaca layar mengikuti apa yang TERLIHAT. Menyebut "60 degrees" saat
   * angkanya sengaja disembunyikan berarti membocorkan jawaban soal.
   */
  const label = showValue ? `${deg} degree angle` : showName ? ANGLE_NAMES[kind] : 'angle';

  const ray = (x: number, y: number, key: string) => (
    <line
      key={key}
      data-part="ray"
      x1={vx}
      y1={vy}
      x2={x}
      y2={y}
      stroke="var(--c-ink)"
      strokeWidth="4"
      strokeLinecap="round"
    />
  );

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${vbW} ${vbH}`}
      width={size}
      height={Math.round((size * vbH) / vbW)}
      role="img"
      aria-label={label}
      style={{ display: 'block', maxWidth: '100%' }}
    >
      {ticks.map((t) => {
        const long = t % 30 === 0;
        const [sx, sy] = at(dir(rotate + t), RAY + 2);
        const [ex, ey] = at(dir(rotate + t), RAY + (long ? TICK_LONG : 5));
        return (
          <line
            key={t}
            data-part="tick"
            x1={sx}
            y1={sy}
            x2={ex}
            y2={ey}
            stroke={long ? 'var(--c-ink-soft)' : 'var(--c-line)'}
            strokeWidth={long ? 2 : 1.5}
            strokeLinecap="round"
          />
        );
      })}
      {ticks
        .filter((t) => t % 30 === 0)
        .map((t) => {
          const [lx, ly] = at(dir(rotate + t), RAY + LABEL_R);
          return (
            <text
              key={t}
              data-part="tick-label"
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fontWeight="700"
              fill="var(--c-ink-soft)"
            >
              {t}
            </text>
          );
        })}

      {ray(x0, y0, 'base')}

      {/* Kaki kedua membuka dari kaki pertama: gerakannya SENDIRI yang mengajarkan
          bahwa sudut adalah besarnya putaran, bukan bentuk yang diam. */}
      <g
        style={{
          transformBox: 'view-box',
          transformOrigin: `${vx}px ${vy}px`,
          animation: `angle-open ${sweep}ms var(--ease-std) both`,
          ['--angle-open-from' as string]: `${deg}deg`,
        }}
      >
        {ray(x1, y1, 'arm')}
      </g>

      {showArc ? (
        <g style={{ animation: `fade-rise ${teachingDuration(200, reduced)}ms ${sweep}ms both` }}>
          {isRight ? (
            <path
              data-part="right-mark"
              d={`M ${at(d0, 15)[0]} ${at(d0, 15)[1]} L ${vx + (d0[0] + d1[0]) * 15} ${
                vy + (d0[1] + d1[1]) * 15
              } L ${at(d1, 15)[0]} ${at(d1, 15)[1]}`}
              fill="none"
              stroke={color}
              strokeWidth="3.5"
            />
          ) : (
            <>
              <path
                data-part="wedge"
                d={`M ${vx} ${vy} L ${ax0} ${ay0} ${arc} Z`}
                fill={color}
                opacity="0.2"
              />
              <path
                data-part="arc"
                d={`M ${ax0} ${ay0} ${arc}`}
                fill="none"
                stroke={color}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </>
          )}
        </g>
      ) : null}

      <circle cx={vx} cy={vy} r="4" fill="var(--c-ink)" />

      {showValue ? (
        <text
          data-part="value"
          x={tx}
          y={ty}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="17"
          fontWeight="900"
          fill="var(--c-ink)"
        >
          {deg}°
        </text>
      ) : null}

      {showName ? (
        <text
          data-part="name"
          x={C}
          y={120 + pad + 14}
          textAnchor="middle"
          fontSize="15"
          fontWeight="800"
          fill="var(--c-ink-soft)"
        >
          {ANGLE_NAMES[kind]}
        </text>
      ) : null}
    </svg>
  );
}
