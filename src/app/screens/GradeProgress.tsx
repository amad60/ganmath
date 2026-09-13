import { useState, type ReactNode } from 'react';
import type { GradeReport, ModuleReport, UnitReport } from '../../engine/report';
import { ProgressBar } from '../../components/ui';

/**
 * Kemajuan per grade untuk orang tua: satu kartu per grade, bisa dibuka-tutup.
 *
 * Tertutup, kartunya menjawab pertanyaan pertama orang tua — sudah sampai mana dan
 * berapa lama. Terbuka, ia menjawab pertanyaan kedua — BAGAIMANA: mana yang langsung
 * bisa, mana yang butuh diulang, dan apakah ingatannya bertahan (ulangan berjarak).
 * Unit dan modulnya satu tingkat lagi di bawahnya, supaya kartu yang terbuka tidak
 * langsung jadi daftar 43 baris.
 */

export function formatDay(date: string, withWeekday = false): string {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(withWeekday ? { weekday: 'short' } : {}),
  });
}

const plural = (n: number, word: string) => `${n.toLocaleString('en-US')} ${word}${n === 1 ? '' : 's'}`;

function duration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function GradeProgress({ reports, openGrade }: { reports: GradeReport[]; openGrade: number | null }) {
  const [open, setOpen] = useState<number | null>(openGrade);
  return (
    <div className="flex flex-col gap-3">
      {reports.map((r) => (
        <GradeCard
          key={r.grade}
          report={r}
          open={open === r.grade}
          onToggle={() => setOpen(open === r.grade ? null : r.grade)}
        />
      ))}
    </div>
  );
}

function GradeCard({ report: r, open, onToggle }: { report: GradeReport; open: boolean; onToggle: () => void }) {
  const status = r.complete ? 'complete' : r.cleared > 0 || r.startedOn ? 'active' : 'idle';
  const when = r.complete
    ? `${plural(r.days ?? 0, 'day')} · ${formatDay(r.startedOn!)} – ${formatDay(r.completedOn!)}`
    : r.startedOn
      ? `Started ${formatDay(r.startedOn)} · last active ${formatDay(r.lastActiveOn!)}`
      : 'Not started yet';

  return (
    <section className="bg-surface rounded-[var(--r-lg)] shadow-[var(--shadow-card)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full flex-col gap-2 rounded-[var(--r-lg)] p-5 text-left"
      >
        <span className="flex w-full items-center justify-between gap-2">
          <span className="text-xl font-black">Grade {r.grade}</span>
          <span className="flex items-center gap-2">
            <StatusChip status={status} />
            <Chevron open={open} />
          </span>
        </span>
        <ProgressBar value={r.cleared} max={r.total} label={`${r.cleared}/${r.total}`} />
        <span className="text-ink-soft text-[15px] font-bold">{when}</span>
      </button>

      {open ? (
        <div className="flex flex-col gap-5 px-5 pb-5">
          {r.cleared === 0 ? (
            <p className="text-ink-soft text-[16px]">Nothing mastered in this grade yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Tile
                  label={r.complete ? 'Finished in' : 'Days so far'}
                  value={plural(r.days ?? 0, 'day')}
                  sub={plural(r.activeDays, 'active day')}
                />
                <Tile label="Stars" value={`${r.stars} / ${r.maxStars}`} sub={`${r.firstTry} first-try passes`} />
                <Tile
                  label="Accuracy"
                  value={r.accuracy == null ? '—' : `${Math.round(r.accuracy * 100)}%`}
                  sub={plural(r.questions, 'question')}
                />
                <Tile
                  label="Time answering"
                  value={`≈ ${duration(r.approxMinutes)}`}
                  sub={plural(r.sessions, 'session')}
                />
              </div>

              {r.perDay.length > 1 ? <PerDayChart days={r.perDay} /> : null}

              <Highlights report={r} />
            </>
          )}

          <div className="flex flex-col gap-2">
            <h3 className="text-[17px] font-black">Units</h3>
            {r.units.map((u) => (
              <UnitRow key={u.id} unit={u} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function StatusChip({ status }: { status: 'complete' | 'active' | 'idle' }) {
  // Status tidak pernah hanya warna: selalu ikon + kata.
  const look = {
    complete: { text: '✓ Completed', bg: 'var(--c-correct-soft)', fg: 'var(--c-ink)' },
    active: { text: '● In progress', bg: 'var(--c-primary-soft)', fg: 'var(--c-ink)' },
    idle: { text: '○ Not started', bg: 'var(--c-surface-sunk)', fg: 'var(--c-ink-soft)' },
  }[status];
  return (
    <span
      className="rounded-[var(--r-pill)] px-3 py-1 text-[13px] font-black whitespace-nowrap"
      style={{ background: look.bg, color: look.fg }}
    >
      {look.text}
    </span>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className="text-ink-soft inline-block text-[18px] font-black transition-transform"
      style={{ transform: open ? 'rotate(90deg)' : 'none' }}
    >
      ›
    </span>
  );
}

function Tile({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-sunk flex flex-col gap-0.5 rounded-[var(--r-md)] px-3 py-3">
      <span className="text-ink-soft text-[13px] font-bold">{label}</span>
      <span className="text-[22px] leading-tight font-black">{value}</span>
      <span className="text-ink-soft text-[13px] font-bold">{sub}</span>
    </div>
  );
}

/**
 * Modul dikuasai per hari. Satu seri → satu warna, tanpa legenda (judulnya sudah
 * menyebut apa yang digambar). Hanya satu angka yang ditulis di atas batangnya —
 * hari yang dipilih, awalnya hari tersibuk — sisanya lewat ketukan dan tabel
 * tersembunyi untuk pembaca layar.
 */
export function PerDayChart({ days }: { days: GradeReport['perDay'] }) {
  const peak = days.reduce((best, d, i) => (d.count > (days[best]?.count ?? 0) ? i : best), 0);
  const [picked, setPicked] = useState(peak);
  const max = Math.max(1, ...days.map((d) => d.count));
  const W = 320;
  const H = 110;
  const top = 18;
  const slot = W / days.length;
  const bar = Math.min(24, Math.max(3, slot - 4));
  const short = days.length <= 8;
  const sel = days[picked]!;

  return (
    <figure className="m-0 flex flex-col gap-1">
      <figcaption className="flex items-baseline justify-between gap-2">
        <span className="text-[17px] font-black">Modules mastered per day</span>
      </figcaption>
      <p className="text-ink-soft text-[14px] font-bold" aria-live="polite">
        {formatDay(sel.date, true)} · {plural(sel.count, 'module')}
      </p>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H + 22}`}
          width="100%"
          style={{ maxWidth: W, display: 'block' }}
          role="img"
          aria-label={`Modules mastered per day, ${days.length} days, most on ${formatDay(days[peak]!.date)} with ${days[peak]!.count}`}
        >
          {days.map((d, i) => {
            const h = d.count === 0 ? 0 : Math.max(4, ((H - top) * d.count) / max);
            const x = i * slot + (slot - bar) / 2;
            const y = H - h;
            const r = Math.min(4, bar / 2, h);
            return (
              <g key={d.date}>
                {h > 0 ? (
                  // Ujung data membulat 4px, pangkal di garis dasar tetap persegi.
                  <path
                    d={`M${x},${H} V${y + r} Q${x},${y} ${x + r},${y} H${x + bar - r} Q${x + bar},${y} ${x + bar},${y + r} V${H} Z`}
                    fill="var(--c-primary)"
                    opacity={i === picked ? 1 : 0.55}
                  />
                ) : null}
                {i === picked && d.count > 0 ? (
                  <text x={x + bar / 2} y={y - 5} textAnchor="middle" fontSize="12" fontWeight="900" fill="var(--c-ink)">
                    {d.count}
                  </text>
                ) : null}
                {short || i === 0 || i === days.length - 1 ? (
                  <text
                    x={x + bar / 2}
                    y={H + 16}
                    textAnchor={short ? 'middle' : i === 0 ? 'start' : 'end'}
                    fontSize="11"
                    fontWeight="700"
                    fill="var(--c-ink-soft)"
                  >
                    {short ? formatDay(d.date).split(' ')[1] : formatDay(d.date)}
                  </text>
                ) : null}
                {/* Sasaran sentuh selebar slot dan setinggi grafik — lebih besar dari batangnya. */}
                <rect
                  x={i * slot}
                  y={0}
                  width={slot}
                  height={H + 22}
                  fill="transparent"
                  onClick={() => setPicked(i)}
                  onPointerEnter={() => setPicked(i)}
                  style={{ cursor: 'pointer' }}
                  data-day={d.date}
                />
              </g>
            );
          })}
          <line x1={0} x2={W} y1={H} y2={H} stroke="var(--c-line)" strokeWidth={1} />
        </svg>
      </div>
      <table className="sr-only">
        <caption>Modules mastered per day</caption>
        <tbody>
          {days.map((d) => (
            <tr key={d.date}>
              <th scope="row">{formatDay(d.date, true)}</th>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function Highlights({ report: r }: { report: GradeReport }) {
  const [showExtra, setShowExtra] = useState(false);
  const rows: { icon: string; text: ReactNode }[] = [
    { icon: '🎯', text: `${r.firstTry} of ${r.cleared} passed the mastery check on the first try` },
  ];
  if (r.extraTries.length > 0) {
    rows.push({
      icon: '🔁',
      text: (
        <button
          type="button"
          className="text-left underline decoration-dotted underline-offset-4"
          aria-expanded={showExtra}
          onClick={() => setShowExtra(!showExtra)}
        >
          {plural(r.extraTries.length, 'module')} needed more than one try
        </button>
      ),
    });
  }
  if (r.speedOpen > 0) {
    rows.push({ icon: '⚡', text: `${plural(r.speedOpen, 'module')} still have a Speed Round open (correct, not yet fast)` });
  }
  if (r.skipped > 0) rows.push({ icon: '⏩', text: `${plural(r.skipped, 'module')} skipped with a check` });
  // Ulangan berjarak adalah bukti "masih ingat", jadi dilaporkan sebagai kemajuan,
  // bukan "0 dari 43" — di minggu pertama memang belum ada yang bisa tuntas.
  const next = r.reviews.nextDue ? ` · next check ${formatDay(r.reviews.nextDue)}` : '';
  rows.push({
    icon: '🧠',
    text:
      r.reviews.needsReview > 0
        ? `${plural(r.reviews.needsReview, 'module')} slipped in a memory check and went back to review${next}`
        : r.reviews.checked === 0
          ? `Memory checks start 3 days after a module is mastered${next}`
          : `${plural(r.reviews.checked, 'module')} still remembered days later` +
            (r.reviews.retained > 0 ? ` · ${r.reviews.retained} kept for good` : '') +
            next,
  });

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[17px] font-black">Highlights</h3>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {rows.map((row, i) => (
          <li key={i} className="flex gap-2 text-[15px] leading-snug font-bold">
            <span aria-hidden>{row.icon}</span>
            <span>{row.text}</span>
          </li>
        ))}
      </ul>
      {showExtra ? (
        <ul className="bg-sunk m-0 flex list-none flex-col gap-1 rounded-[var(--r-md)] px-3 py-2">
          {r.extraTries.map((m) => (
            <li key={m.id} className="flex justify-between gap-2 text-[14px] font-bold">
              <span>{m.title}</span>
              <span className="text-ink-soft whitespace-nowrap">{m.quizTries} tries</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function UnitRow({ unit: u }: { unit: UnitReport }) {
  const [open, setOpen] = useState(false);
  const done = u.cleared === u.total;
  return (
    <div className="rounded-[var(--r-md)] border-2 border-[var(--c-line)]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex min-h-11 w-full items-center justify-between gap-2 px-3 py-2 text-left"
      >
        <span className="flex flex-col">
          <span className="text-[15px] font-black">{u.title}</span>
          <span className="text-ink-soft text-[13px] font-bold">
            {done ? '✓ ' : ''}
            {u.cleared}/{u.total} · <span style={{ color: 'var(--c-star)' }} aria-hidden>★</span> {u.stars}/{u.total * 3}
            {u.days != null ? ` · ${plural(u.days, 'day')}` : ''}
          </span>
        </span>
        <Chevron open={open} />
      </button>
      {open ? (
        <ul className="m-0 flex list-none flex-col p-0">
          {u.modules.map((m) => (
            <ModuleRow key={m.id} m={m} />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function ModuleRow({ m }: { m: ModuleReport }) {
  const detail = [
    m.masteredOn ? formatDay(m.masteredOn) : null,
    m.accuracy != null ? `${Math.round(m.accuracy * 100)}%` : null,
    m.sessions ? plural(m.sessions, 'session') : null,
  ]
    .filter(Boolean)
    .join(' · ');
  return (
    <li className="flex flex-col gap-1 border-t-2 border-[var(--c-line)] px-3 py-2">
      <span className="flex items-center justify-between gap-2">
        <span className="text-[14px] font-black">{m.title}</span>
        <span aria-label={`${m.stars} of 3 stars`} className="whitespace-nowrap text-[14px]" style={{ color: 'var(--c-star)' }}>
          {'★'.repeat(m.stars)}
          <span style={{ opacity: 0.35 }}>{'☆'.repeat(3 - m.stars)}</span>
        </span>
      </span>
      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {tagsOf(m).map((t) => (
          <span key={t} className="bg-sunk rounded-[var(--r-pill)] px-2 py-0.5 text-[12px] font-black">
            {t}
          </span>
        ))}
        {detail ? <span className="text-ink-soft text-[12px] font-bold">{detail}</span> : null}
      </span>
    </li>
  );
}

export function tagsOf(m: ModuleReport): string[] {
  const tags: string[] = [];
  if (m.outcome === 'not-started') return ['not started'];
  if (m.outcome === 'in-progress') return ['learning'];
  if (m.skipped) tags.push('⏩ skipped');
  else if (m.quizTries === 1) tags.push('🎯 first try');
  else if (m.quizTries != null) tags.push(`🔁 ${m.quizTries} tries`);
  if (m.outcome === 'speed-open') tags.push('⚡ speed round open');
  if (m.outcome === 'needs-review') tags.push('🧠 needs review');
  if (m.outcome === 'retained') tags.push('🧠 kept for good');
  else if (m.reviewsPassed > 0) tags.push(`🧠 ${m.reviewsPassed}/4 memory checks`);
  return tags;
}
