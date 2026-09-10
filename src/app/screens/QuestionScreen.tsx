import { useEffect, useRef, useState } from 'react';
import type { Question, SessionKind } from '../../engine/types';
import { formatAnswer, parseTypedAnswer, sameAnswer } from '../../engine/answer';
import {
  currentQuestion,
  isFinished,
  progressOf,
  submitAnswer,
  type SessionState,
} from '../../engine/session';
import { Button, Header, Keypad, SessionDots, type Feedback } from '../../components/ui';
import { LearnVisualView } from './LearnVisualView';
import { modules as moduleRegistry } from '../../content';
import type { LearnStep } from '../../content/types';
import type { DotState } from '../../components/ui/SessionDots';
import {
  Angle,
  Bars,
  Circle,
  ArrayGrid,
  CoordinatePlane,
  RectShape,
  Base10Blocks,
  Clock,
  FractionShape,
  Money,
  NumberLine,
  Pictogram,
  Shape2D,
  ShapeNet,
  Solid3D,
  TallyChart,
  TenFrame,
} from '../../components/manipulatives';
import { Mascot, type MascotMood } from '../../components/mascot/Mascot';
import { en } from '../../i18n/en';
import { sfx, unlockAudio } from '../sfx';

export type QuestionScreenProps = {
  session: SessionState;
  onSession: (next: SessionState) => void;
  onFinish: (final: SessionState) => void;
  onExit: () => void;
};

const COMPARE_LABEL: Record<-1 | 0 | 1, string> = { [-1]: '<', 0: '=', 1: '>' };

const TITLES: Record<SessionKind, string> = {
  practice: en.question.practice,
  quiz: en.question.masteryCheck,
  review: en.question.review,
  master: en.question.master,
  speed: en.question.speed,
  testout: en.question.testout,
};

/**
 * Mastery Check sengaja terlihat BEDA dari Practice: header emas, tanpa visual
 * pendamping, tanpa tombol Hint. Waktu diukur diam-diam — tidak ada timer terlihat.
 */
/**
 * Memisahkan kalimat dari deretan simbol ("How many dots? ●●●●●●").
 * Sebelumnya keduanya dirender dalam satu paragraf 44px, jadi titik-titiknya
 * tampil raksasa dan berat. Sekarang kalimatnya lebih kecil, simbolnya jadi
 * baris tersendiri yang bisa membungkus rapi.
 */
function QuestionText({ text }: { text: string }) {
  const match = text.match(/^(.*?[?:.]?)\s*([^\w\s.,?!=+×÷/-]+)$/u);
  const words = match ? match[1] : text;
  const symbols = match ? [...(match[2] ?? '')] : [];

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <p className="text-center text-[34px] leading-tight font-black text-balance">{words}</p>
      {symbols.length > 0 ? (
        <div className="flex max-w-full flex-wrap items-center justify-center gap-2">
          {symbols.map((sym, i) => {
            const size = symbols.length > 8 ? 26 : 34;
            // Titik polos dirender sebagai lingkaran berwarna: '●' hitam pekat
            // terasa berat dan tidak seperti alat hitung.
            if (sym === '●') {
              return (
                <span
                  key={i}
                  style={{
                    width: size,
                    height: size,
                    borderRadius: 999,
                    background: 'var(--c-primary)',
                    display: 'inline-block',
                  }}
                />
              );
            }
            return (
              <span key={i} style={{ fontSize: size, lineHeight: 1 }}>
                {sym}
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function QuestionVisualView({ visual }: { visual: NonNullable<Question['visual']> }) {
  switch (visual.kind) {
    case 'ten-frame':
      return <TenFrame value={visual.value} capacity={visual.capacity ?? 10} split={visual.split} />;
    case 'base10':
      return (
        <Base10Blocks hundreds={visual.hundreds ?? 0} tens={visual.tens} ones={visual.ones} />
      );
    case 'shape2d':
      return <Shape2D name={visual.name} size={110} showCorners={visual.showCorners} />;
    case 'angle':
      return (
        <Angle
          degrees={visual.degrees}
          rotate={visual.rotate}
          showValue={visual.showValue}
          showName={visual.showName}
          showScale={visual.showScale}
        />
      );
    case 'bars':
      return (
        <Bars
          lengths={visual.lengths}
          values={visual.values}
          max={visual.max}
          step={visual.step}
          showValues={visual.showValues}
          labels={visual.labels}
        />
      );
    case 'fraction':
      return (
        <FractionShape
          parts={visual.parts}
          shaded={visual.shaded}
          shape={visual.shape ?? 'circle'}
          unequal={visual.unequal}
          size={130}
        />
      );
    case 'number-line':
      return (
        <NumberLine
          min={visual.min}
          max={visual.max}
          step={visual.step}
          value={visual.value ?? null}
          marks={visual.marks ?? []}
        />
      );
    case 'clock':
      return <Clock hour={visual.hour} minute={visual.minute} />;
    case 'money':
      return <Money items={visual.items} />;
    case 'tally':
      return <TallyChart count={visual.count} />;
    case 'rect':
      return (
        <RectShape w={visual.w} h={visual.h} unit={visual.unit} showCorners={visual.showCorners} />
      );
    case 'array':
      return (
        <ArrayGrid
          rows={visual.rows}
          cols={visual.cols}
          highlightRow={visual.highlightRow}
          square={visual.square}
        />
      );
    case 'pictogram':
      return <Pictogram rows={visual.rows} />;
    case 'solid':
      return (
        <Solid3D
          l={visual.l}
          w={visual.w}
          h={visual.h}
          cubes={visual.cubes ?? true}
          showDimensions={visual.showDimensions}
          showVolume={visual.showVolume}
          showName={visual.showName}
          highlightLayer={visual.highlightLayer}
          unit={visual.unit}
        />
      );
    case 'net':
      return (
        <ShapeNet
          solid={visual.solid}
          layout={visual.layout}
          l={visual.l}
          w={visual.w}
          h={visual.h}
          showName={visual.showName}
          numberFaces={visual.numberFaces}
        />
      );
    case 'circle':
      return (
        <Circle
          r={visual.r}
          d={visual.d}
          mark={visual.mark}
          showValue={visual.showValue}
          showCenter={visual.showCenter}
          showCircumference={visual.showCircumference}
          showArea={visual.showArea}
          unit={visual.unit}
          size={170}
        />
      );
    case 'coordinate-grid':
      return (
        <CoordinatePlane
          points={visual.points}
          quadrants={visual.quadrants}
          range={visual.range}
          shape={visual.shape}
          showCoords={visual.showCoords}
          guides={visual.guides}
          showAxisNames={visual.showAxisNames}
          showOrigin={visual.showOrigin}
          size={280}
        />
      );
  }
}

/**
 * Materi yang dipanggil ulang saat anak menekan Hint.
 *
 * Hint dulu hanya punya SATU cabang: ten-frame, dan hanya kalau soalnya kebetulan
 * punya parameter bernama `n` — 68 dari 240 modul. Untuk sisanya app menulis
 * "Look at the picture." padahal tidak ada gambar apa pun di layar. Anak yang macet
 * menekan satu-satunya tombol bantuan yang dia punya, tidak terjadi apa-apa, dan dia
 * tetap macet. Di app yang prinsip pertamanya belajar mandiri, itu lubang terbesar.
 *
 * Perbaikannya tidak menulis 240 teks bantuan baru: materinya SUDAH ada di mode
 * Learn modul itu. Yang dipilih adalah langkah bergambar terakhir — tahap pictorial
 * kalau ada, karena di situlah idenya terlihat sebagai gambar, bukan sebagai lambang.
 */
function hintStep(moduleId: string): LearnStep | null {
  const steps = moduleRegistry[moduleId]?.learn ?? [];
  if (steps.length === 0) return null;
  const pictorial = steps.filter((l) => l.stage === 'pictorial');
  return (pictorial.at(-1) ?? steps.at(-1)) ?? null;
}

export function QuestionScreen({ session, onSession, onFinish, onExit }: QuestionScreenProps) {
  const question = currentQuestion(session);
  const [typed, setTyped] = useState('');
  const [linePick, setLinePick] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ value: number; correct: boolean } | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const hint = hintStep(session.moduleId);
  const hintRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hintUsed) return;
    // Ditunda satu frame: manipulatif punya animasi masuk, dan menggulung sebelum
    // tingginya final membuat browser menghitung dari tinggi yang salah — hasilnya
    // bantuan justru terlempar ke luar area gulung. Terukur di Chrome sungguhan.
    const t = setTimeout(() => {
      const el = hintRef.current;
      // jsdom tidak punya scrollIntoView; app tidak boleh jatuh karenanya.
      if (typeof el?.scrollIntoView === 'function') el.scrollIntoView({ block: 'nearest' });
    }, 120);
    return () => clearTimeout(t);
  }, [hintUsed]);

  const shownAt = useRef(0);
  const firstInputAt = useRef<number | null>(null);

  // Tes-lewat diperlakukan seperti ujian: tanpa hint, tanpa visual pendamping.
  const isQuiz =
    session.kind === 'quiz' || session.kind === 'master' || session.kind === 'testout';
  const isCompare = question?.type === 'compare-symbol';
  const isText = question?.type === 'choose-text';
  const isLine = question?.type === 'number-line-drop';

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      shownAt.current = performance.now();
      firstInputAt.current = null;
    });
    setTyped('');
    setLinePick(null);
    setHintUsed(false);
    setFeedback(null);
    return () => cancelAnimationFrame(id);
  }, [question?.id]);

  if (!question) return null;

  const touch = () => {
    unlockAudio();
    if (firstInputAt.current == null) firstInputAt.current = performance.now();
  };

  const answer = (value: number) => {
    if (feedback) return;
    touch();
    const now = performance.now();
    // Dibandingkan sebagai NILAI, bukan string atau `===` mentah: jawaban desimal
    // yang dihitung modul bisa lahir sebagai 0.30000000000000004 (0.1 + 0.2),
    // dan "0.50" adalah angka yang sama dengan "0.5". Lihat `sameAnswer`.
    const correct = sameAnswer(value, question.answer);
    setFeedback({ value, correct });
    if (correct) sfx.correct();
    else sfx.retry();

    const next = submitAnswer(session, {
      correct,
      thinkMs: Math.max(0, (firstInputAt.current ?? now) - shownAt.current),
      totalMs: Math.max(0, now - shownAt.current),
      hintUsed,
      nowMs: Date.now(),
    });

    window.setTimeout(
      () => {
        if (isFinished(next, Date.now())) onFinish(next);
        else onSession(next);
      },
      correct ? 700 : 1600,
    );
  };

  const { done, total } = progressOf(session);
  const dots: DotState[] = Array.from({ length: total }, (_, i) => {
    const r = session.results[i];
    if (r) return r.correct ? 'correct' : 'wrong';
    return i === done ? 'current' : 'todo';
  });

  const mood: MascotMood = feedback ? (feedback.correct ? 'happy' : 'encourage') : 'idle';

  const choiceFeedback = (c: number): Feedback => {
    if (!feedback) return 'idle';
    if (sameAnswer(c, feedback.value)) return feedback.correct ? 'correct' : 'retry';
    if (sameAnswer(c, question.answer)) return 'reveal';
    return 'idle';
  };

  const label = (c: number) =>
    isText ? question.options?.[c] : isCompare ? COMPARE_LABEL[c as -1 | 0 | 1] : formatAnswer(c);

  return (
    <div className="mx-auto flex h-full max-w-[430px] flex-col">
      <Header
        onBack={onExit}
        tone={isQuiz ? 'mastery' : 'plain'}
        center={
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 text-[15px] font-black">
              {isQuiz ? <span>⭐ {TITLES[session.kind]}</span> : null}
              {/* Angka eksplisit: anak tahu persis sisa berapa lagi. */}
              <span className={isQuiz ? '' : 'text-ink-soft'}>
                {Math.min(done + 1, total)} / {total}
              </span>
            </div>
            <SessionDots states={dots} />
          </div>
        }
        // Kalau Gan sudah tampil besar di badan layar, jangan ada dua Gan sekaligus.
        right={question.visual ? <Mascot mood={mood} size={40} /> : null}
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pt-6 pb-2">
        {/* Soal dikelompokkan tepat DI ATAS tombol jawaban, bukan melayang di tengah:
            mata dan jempol anak jadi berdekatan, dan ruang kosongnya jatuh di atas
            (tempat yang tidak dipakai) alih-alih memisahkan soal dari jawabannya.

            Ruang kosong itu dibuat dengan `mt-auto`, BUKAN `justify-end` di induknya:
            saat isinya lebih tinggi daripada layar (gambar 3D besar + soal dua baris),
            `justify-end` mendorong bagian atas isi keluar batas gulung — gambarnya
            terpotong dan tidak bisa digulung balik. Margin auto menyusut jadi nol
            begitu ruangnya habis, jadi semuanya tetap terjangkau. */}
        <div className="mt-auto flex w-full flex-col items-center gap-4">
        {/* Soal fakta murni (7 × 8 = ?) tidak punya gambar, jadi separuh layar
            tadinya kosong melompong dan terlihat seperti halaman gagal dimuat.
            `my-auto` menaruh Gan tepat di tengah ruang sisa: ruangnya jadi terpakai,
            dan reaksi wajahnya memberi umpan balik yang tidak bisa diberikan angka. */}
        {!question.visual ? <Mascot mood={mood} size={190} className="my-auto opacity-90" /> : null}

        {/* key = id soal: setiap soal baru memainkan animasi masuknya sendiri,
            jadi pergantian soal terasa sebagai perpindahan, bukan teks yang berkedip. */}
        <div
          key={question.id}
          className="flex w-full flex-col items-center gap-4"
          style={{ animation: 'question-in 260ms var(--ease-std)' }}
        >
          {question.visual ? <QuestionVisualView visual={question.visual} /> : null}
          <QuestionText text={question.text} />
        </div>

        {/* Bantuan hanya muncul SETELAH hint ditekan. Sebelumnya layar menampilkan
            grid kosong tanpa makna di sebelah soal.

            Ten-frame didahulukan kalau ada, karena ia dibangun dari angka SOAL INI —
            lebih menolong daripada materi umum. Kalau tidak ada, materi Learn modul
            itu yang dipanggil ulang, sehingga setiap modul punya bantuan yang nyata. */}
        {/* Bantuan digulung ke tampilan begitu muncul. Manipulatif materi bisa
            setinggi 300px lebih, dan di layar 393×873 sebagian modul mendorongnya
            ke bawah lipatan: anak menekan Hint, layarnya tidak berubah, dan dari
            tempat duduknya tombol itu tetap terasa rusak. Diukur di Chrome
            sungguhan — g6-u4-m3 gambarnya berakhir di 638px sementara area
            gulungnya habis di 473px. */}
        <div ref={hintRef} className="flex w-full flex-col items-center">
        {!isQuiz && hintUsed ? (
          question.params.n != null ? (
            <TenFrame value={question.params.n as number} animate />
          ) : hint ? (
            <div className="flex w-full flex-col items-center gap-2">
              <LearnVisualView visual={hint.visual} value={0} onValue={() => {}} interactive={false} />
              <p className="text-ink-soft text-center text-[18px] font-bold">{hint.prompt}</p>
            </div>
          ) : null
        ) : null}
        </div>

        {!isQuiz ? (
          <Button
            variant="ghost"
            disabled={hintUsed || feedback != null}
            onClick={() => {
              touch();
              setHintUsed(true);
            }}
          >
            💡 {en.question.hint}
          </Button>
        ) : null}

        {/* Kalimat ini dulu muncul sendirian, menyuruh anak melihat gambar yang tidak
            pernah ada. Sekarang ia hanya muncul kalau memang ADA yang bisa dilihat. */}
        {hintUsed && (question.params.n != null || hint) ? (
          <p className="text-ink-soft text-[18px]">{en.question.showMe}</p>
        ) : null}

        </div>
      </main>

      <div className="safe-bottom shrink-0 px-6 pt-2">
        {isLine ? (
          <div className="flex flex-col gap-3">
            <NumberLine
              min={question.range?.[0] ?? 0}
              max={question.range?.[1] ?? 10}
              step={question.step}
              value={linePick}
              onChange={(v) => {
                touch();
                sfx.tap();
                setLinePick(v);
              }}
            />
            <Button
              full
              feedback={feedback ? (feedback.correct ? 'correct' : 'retry') : 'idle'}
              disabled={linePick == null || feedback != null}
              onClick={() => answer(linePick as number)}
            >
              {linePick == null ? en.question.pickOnLine : `${en.question.check} · ${linePick}`}
            </Button>
          </div>
        ) : question.choices ? (
          <div className={`grid gap-3 ${isCompare ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {question.choices.map((c) => (
              <Button
                key={c}
                variant="answer"
                // Bukan `disabled`: tombol yang diredupkan membuat seluruh layar
                // terlihat mati begitu anak menjawab. Cukup matikan interaksinya.
                onPointerDown={touch}
                onClick={() => (feedback ? undefined : answer(c))}
                aria-disabled={feedback != null}
                // Pilihan berupa KATA tidak boleh memakai ukuran huruf angka:
                // 36px membuat "three fourths" membungkus dua baris dan terpotong.
                {...(isText ? { textSize: 21 } : {})}
                className={`${isText ? 'px-3' : ''} ${
                  feedback != null ? 'pointer-events-none' : ''
                }`}
                feedback={choiceFeedback(c)}
              >
                {label(c)}
              </Button>
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-col gap-2">
            {/* Angka yang sedang diketik menempel DI ATAS keypad, di luar area yang
                menggulung. Saat isinya panjang (gambar 3D + soal dua baris) kotak ini
                dulu ikut terdorong ke bawah keypad: anak mengetik tanpa bisa melihat
                angka yang sudah masuk. */}
            <div
              // min-w, bukan w: kotaknya tetap seukuran semula untuk jawaban pendek,
              // tapi jawaban 4–6 digit melebar alih-alih terpotong.
              className="flex h-16 min-w-32 self-center items-center justify-center rounded-[var(--r-md)] px-4 text-[40px] font-black"
              style={{
                background: 'var(--c-surface)',
                border: '3px solid var(--c-line)',
                color: typed ? 'var(--c-ink)' : 'var(--c-locked)',
              }}
              aria-live="polite"
            >
              {typed || '?'}
            </div>
            <Keypad
            value={typed}
            onChange={(v) => {
              touch();
              sfx.tap();
              setTyped(v);
            }}
            onSubmit={() => {
              const n = parseTypedAnswer(typed);
              if (n != null) answer(n);
            }}
            // Lebar input ikut soalnya. Konstanta 3 dulu membuat setiap soal
            // berjawaban ≥1000 (9990, 999 × 9 = 8991, pembagian panjang) buntu:
            // anak tidak bisa mengetik digit terakhirnya.
            maxLength={question.maxDigits}
            // Tombol . dan − ikut ATURAN soal, bukan jawaban soal ini — kalau
            // per soal, munculnya minus sudah membocorkan tandanya.
            allowDecimal={question.allowDecimal}
            allowNegative={question.allowNegative}
              disabled={feedback != null}
            />
          </div>
        )}

        {feedback ? (
          <p
            className="mt-3 text-center text-xl font-black"
            style={{ color: feedback.correct ? 'var(--c-correct)' : 'var(--c-retry)' }}
            role="status"
          >
            {feedback.correct
              ? en.question.correct
              : `${en.question.retry} · ${label(question.answer)}`}
          </p>
        ) : null}
      </div>
    </div>
  );
}
