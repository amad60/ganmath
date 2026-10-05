import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type {
  SceneBg,
  SceneColor,
  SceneItem,
  SceneOption,
  ScienceSceneVisual,
} from '../../engine/types';
import { teachingDuration, useReducedMotion } from '../manipulatives/useReducedMotion';
import { en } from '../../i18n/en';

/**
 * Waktu gerak adegan. Lapisan gambar baru masuk 400ms, lalu benda yang punya `fx`
 * bergerak 600ms mulai 200ms — semuanya selesai di 800ms, batas keras animasi yang
 * menahan anak (docs/design/animation.md §1, kelas "naratif"). Keterangan baru
 * muncul SETELAH itu: anak melihat akibatnya dulu, baru membaca namanya. Kalau
 * kalimatnya muncul bersamaan, mata anak yang lancar membaca akan lari ke teks dan
 * gambarnya jadi hiasan — persis masalah Science versi Read.
 */
export const SCENE_MORPH_MS = 400;
export const SCENE_FX_DELAY_MS = 200;
export const SCENE_FX_MS = 600;
export const SCENE_SETTLE_MS = SCENE_FX_DELAY_MS + SCENE_FX_MS;
/** Jeda antar pilihan saat adegan memutar dirinya sendiri (intro unit, Hint). */
export const SCENE_AUTOPLAY_MS = 2600;

const BG: Record<SceneBg, string> = {
  day: 'linear-gradient(#bfe3ff, #eaf6ff)',
  night: 'linear-gradient(#1d2547, #3a3f6b)',
  cloudy: 'linear-gradient(#a9b3c1, #dde3ea)',
  water: 'linear-gradient(#cfeaff, #7fc3ec)',
  room: 'linear-gradient(#fff4e3, #f3e2c7)',
  plain: 'var(--c-surface)',
};

const COLOR: Record<SceneColor, string> = {
  green: '#3f9e4d',
  brown: '#8a5a33',
  blue: '#4c9bd4',
  gray: '#9aa0a8',
  yellow: '#f2c230',
  white: '#ffffff',
  red: '#d4574c',
};

export type ScienceSceneProps = {
  visual: ScienceSceneVisual;
  /**
   * true = anak yang menggerakkan (Learn). false = adegan memutar pilihannya sendiri
   * SEKALI lalu berhenti — dipakai intro unit dan panel Hint, tempat anak menonton.
   */
  interactive?: boolean;
  /** Banyak pilihan BERBEDA yang sudah dilihat akibatnya (predict: 1 setelah hasilnya diputar). */
  onValue?: (n: number) => void;
  compact?: boolean;
  /**
   * Hanya gambar awal, tanpa tombol dan tanpa putar sendiri — gambar soal
   * `pick-picture`. Memutar hasilnya di soal sama dengan menjawabnya.
   */
  still?: boolean;
};

/**
 * Satu komponen untuk tiga gerakan sains Level 1: ubah satu hal, ketuk bagian,
 * tebak lalu lihat. Lihat `ScienceSceneVisual` untuk alasannya.
 *
 * Nilai yang dilaporkan ke Learn adalah jumlah pilihan BERBEDA yang sudah dicoba,
 * dan baru dilaporkan setelah keterangannya muncul — mengetuk tombol yang sama lima
 * kali tidak membuka Next, dan mengetuk cepat-cepat tanpa melihat juga tidak.
 */
export function ScienceScene({
  visual,
  interactive = false,
  onValue,
  compact,
  still,
}: ScienceSceneProps) {
  const reduced = useReducedMotion();
  /** Pilihan yang gambarnya sedang tampil (`change`/`predict`) atau bagian yang menyala (`tap-part`). */
  const [shown, setShown] = useState<number | null>(null);
  /** Naik setiap gambar berganti → lapisan gambar dipasang ulang dan memutar geraknya lagi. */
  const [stamp, setStamp] = useState(0);
  const [caption, setCaption] = useState<number | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const explored = useRef(new Set<number>());
  /** Jadwal putar-sendiri (intro, Hint). Terpisah dari jeda keterangan di bawah. */
  const timers = useRef<number[]>([]);
  /** Jeda keterangan pilihan TERAKHIR. Pilihan baru membatalkan keterangan yang lama. */
  const captionTimer = useRef<number | null>(null);

  const clearTimers = () => {
    for (const t of timers.current) window.clearTimeout(t);
    timers.current = [];
    if (captionTimer.current != null) window.clearTimeout(captionTimer.current);
    captionTimer.current = null;
  };
  useEffect(() => clearTimers, []);

  const settle = teachingDuration(visual.mode === 'tap-part' ? 300 : SCENE_SETTLE_MS, reduced);

  /** Menampilkan akibat pilihan `i`, lalu keterangannya setelah geraknya selesai. */
  const play = (i: number, report: boolean) => {
    if (captionTimer.current != null) window.clearTimeout(captionTimer.current);
    setShown(i);
    setStamp((s) => s + 1);
    setCaption(null);
    captionTimer.current = window.setTimeout(() => {
      captionTimer.current = null;
      setCaption(i);
      if (!report) return;
      explored.current.add(i);
      onValue?.(visual.mode === 'predict' ? 1 : explored.current.size);
    }, settle);
  };

  // Putar sendiri: setiap pilihan sekali, berurutan, lalu berhenti di yang terakhir.
  // Tidak berulang tanpa akhir — satu-satunya animasi tak berujung di app adalah
  // denyut node peta (docs/design/animation.md §2).
  useEffect(() => {
    if (interactive || still) return;
    const order =
      visual.mode === 'predict' ? [visual.correct ?? 0] : visual.options.map((_, i) => i);
    const gap = teachingDuration(SCENE_AUTOPLAY_MS, reduced);
    order.forEach((i, k) => {
      timers.current.push(window.setTimeout(() => play(i, false), 900 + k * gap));
    });
    return clearTimers;
    // Diputar ulang hanya kalau adegannya sendiri berganti (Replay memasang ulang komponen).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visual, interactive, still]);

  const option: SceneOption | null = shown != null ? (visual.options[shown] ?? null) : null;
  const showsResult = visual.mode !== 'tap-part' && option?.result != null;
  const items = showsResult ? (option?.result ?? []) : visual.base;
  const bg = (showsResult ? option?.bg : undefined) ?? visual.bg ?? 'plain';
  const lit = visual.mode === 'tap-part' ? shown : null;
  const partsTappable = interactive && visual.mode === 'tap-part';

  const width = compact ? 240 : 320;
  const captionOption = caption != null ? visual.options[caption] : null;

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div
        role="img"
        aria-label={captionOption ? captionOption.caption : describe(visual)}
        className="relative w-full overflow-hidden rounded-[var(--r-md)]"
        style={{
          maxWidth: width,
          aspectRatio: '4 / 3',
          background: BG[bg],
          border: '3px solid var(--c-line)',
          containerType: 'inline-size',
        }}
      >
        <div
          // `tap-part` tidak berganti gambar — hanya bagian yang menyala. Memasang ulang
          // lapisannya akan mengganti tombol yang baru disentuh di bawah jempol anak.
          key={visual.mode === 'tap-part' ? 0 : stamp}
          className="absolute inset-0"
          style={
            stamp > 0 && visual.mode !== 'tap-part'
              ? {
                  animation: `scene-in ${teachingDuration(SCENE_MORPH_MS, reduced)}ms cubic-bezier(.2,.8,.2,1) both`,
                }
              : undefined
          }
        >
          {items.map((item, idx) => (
            <SceneThing
              key={idx}
              item={item}
              reduced={reduced}
              animate={visual.mode !== 'tap-part' && (stamp > 0 || !interactive)}
              lit={lit != null && item.part === lit}
              tappable={partsTappable && item.part != null}
              label={item.part != null ? visual.options[item.part]?.label : undefined}
              onTap={() => {
                if (item.part != null) play(item.part, true);
              }}
            />
          ))}
        </div>
      </div>

      {still ? null : (
        <>
          {/* Tinggi tetap: keterangan yang muncul tidak boleh mendorong tombol di bawahnya
              tepat saat jempol anak sedang menuju ke sana. */}
          <div className="flex min-h-[56px] w-full flex-col items-center justify-center" aria-live="polite">
            {visual.mode === 'predict' && picked != null ? (
              <p className="text-[18px] font-black" style={{ color: verdictColor(picked, visual) }}>
                {picked === visual.correct ? en.science.yes : en.science.letsSee}
              </p>
            ) : null}
            {captionOption ? (
              <p
                key={caption}
                className="text-center text-[20px] font-black"
                style={{ animation: 'fade-rise 250ms var(--ease-std) both' }}
              >
                {visual.mode === 'tap-part' ? (
                  <span style={{ color: 'var(--c-primary)' }}>{captionOption.label}: </span>
                ) : null}
                {captionOption.caption}
              </p>
            ) : null}
          </div>

          {interactive && visual.mode === 'change' ? (
            <div className="flex w-full flex-wrap justify-center gap-3">
              {visual.options.map((o, i) => (
                <button
                  key={i}
                  type="button"
                  aria-pressed={shown === i}
                  onClick={() => play(i, true)}
                  className="flex min-h-[56px] min-w-[96px] items-center justify-center gap-2 rounded-[var(--r-pill)] px-4 text-[18px] font-black"
                  style={{
                    background: shown === i ? 'var(--c-primary-soft)' : 'var(--c-surface)',
                    border: `3px solid ${shown === i ? 'var(--c-primary)' : 'var(--c-line)'}`,
                    boxShadow: '0 4px 0 rgb(0 0 0 / 0.12)',
                  }}
                >
                  <span className="text-[26px] leading-none">{o.icon}</span>
                  <span>{o.label}</span>
                </button>
              ))}
            </div>
          ) : null}

          {interactive && visual.mode === 'predict' ? (
            <div className="grid w-full grid-cols-3 gap-3" style={{ maxWidth: width + 40 }}>
              {visual.options.map((o, i) => {
                const mine = picked === i;
                const right = picked != null && i === visual.correct;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={picked != null}
                    aria-label={o.label}
                    onClick={() => {
                      setPicked(i);
                      // Hasil yang BENAR yang diputar, apa pun pilihannya. Anak yang
                      // menebak salah tetap pulang dengan gambaran yang benar — tebakan
                      // salah di sini adalah awal pelajaran, bukan vonis.
                      play(visual.correct ?? 0, true);
                    }}
                    className="flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-[var(--r-md)] px-1 py-2"
                    style={{
                      background: right ? 'var(--c-correct-soft)' : 'var(--c-surface)',
                      // Pilihan salah ditandai netral (garis biru), bukan merah: belum
                      // tahu itu wajar, karena itulah gunanya melihat.
                      border: `3px solid ${right ? 'var(--c-correct)' : mine ? 'var(--c-primary)' : 'var(--c-line)'}`,
                      opacity: picked != null && !mine && !right ? 0.6 : 1,
                    }}
                  >
                    <span className="text-[40px] leading-none">{o.icon}</span>
                    <span className="text-[14px] leading-tight font-bold">{o.label}</span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {partsTappable ? (
            <p className="text-ink-soft text-center text-[15px] font-bold">{en.science.tapParts}</p>
          ) : null}
        </>
      )}
    </div>
  );
}

function verdictColor(picked: number, v: ScienceSceneVisual): string {
  return picked === v.correct ? 'var(--c-correct)' : 'var(--c-primary)';
}

/** Kalimat untuk pembaca layar: benda-benda yang tergambar, tanpa membocorkan hasil. */
function describe(v: ScienceSceneVisual): string {
  const icons = v.base.map((b) => b.icon).filter(Boolean);
  return `Picture: ${icons.join(' ')}`;
}

function SceneThing({
  item,
  reduced,
  animate,
  lit,
  tappable,
  label,
  onTap,
}: {
  item: SceneItem;
  reduced: boolean;
  animate: boolean;
  lit: boolean;
  tappable: boolean;
  label?: string;
  onTap: () => void;
}) {
  const size = item.size ?? 16;
  // Posisi dan rotasi statis di pembungkus luar; GERAK di elemen dalam. Kalau
  // keduanya di satu elemen, animasi `transform` menimpa translate(-50%,-50%)
  // dan bendanya melompat ke pojok selama bergerak.
  const outer: CSSProperties = {
    position: 'absolute',
    left: `${item.x}%`,
    top: `${item.y}%`,
    transform: `translate(-50%, -50%) rotate(${item.rotate ?? 0}deg)${item.flip ? ' scaleX(-1)' : ''}`,
    ...(item.bar ? { width: `${item.bar.w}%`, height: `${item.bar.h}%` } : {}),
  };
  const fx = animate && item.fx;
  const inner: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    opacity: item.dim ? 0.45 : 1,
    transformOrigin: item.fx === 'grow' || item.fx === 'droop' ? '50% 100%' : '50% 50%',
    // Bagian yang baru diketuk berdenyut sekali; selain itu `fx` miliknya sendiri.
    // Denyutnya di elemen DALAM: di pembungkus luar ia akan menimpa translate posisinya.
    ...(lit
      ? { animation: `sci-pulse ${teachingDuration(300, reduced)}ms ease-out both` }
      : fx
        ? {
            animation: `sci-${item.fx} ${teachingDuration(SCENE_FX_MS, reduced)}ms ease-in-out ${teachingDuration(SCENE_FX_DELAY_MS, reduced)}ms both`,
            willChange: 'transform, opacity',
          }
        : {}),
  };
  const body = item.bar ? (
    <span
      style={{
        ...inner,
        background: COLOR[item.bar.color],
        // Tanah/air selebar adegan bersudut lurus; batang dan akar membulat.
        borderRadius: item.bar.w >= 90 ? 0 : 999,
      }}
    />
  ) : (
    <span style={{ ...inner, fontSize: `${size}cqw`, lineHeight: 1 }}>{item.icon}</span>
  );

  const ring: CSSProperties = lit
    ? {
        boxShadow: '0 0 0 3px var(--c-primary)',
        background: 'rgb(255 255 255 / 0.55)',
      }
    : {};

  if (tappable) {
    return (
      <button
        type="button"
        aria-label={label}
        aria-pressed={lit}
        onClick={onTap}
        // Sasaran sentuh ≥44px walaupun bendanya kecil (batang tanaman selebar 12px):
        // jempol anak 6 tahun bukan kursor tetikus (CLAUDE.md §2).
        className="flex items-center justify-center rounded-[var(--r-sm)]"
        style={{ ...outer, minWidth: 44, minHeight: 44, padding: 0, ...ring }}
      >
        {item.bar ? (
          <span style={{ width: item.bar.w > 10 ? '100%' : 12, height: '100%', display: 'flex' }}>{body}</span>
        ) : (
          body
        )}
      </button>
    );
  }
  return (
    <span aria-hidden="true" style={outer}>
      {body}
    </span>
  );
}
