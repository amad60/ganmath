import { useEffect, useRef, useState } from 'react';
import type { Question, SessionKind } from '../../engine/types';
import {
  currentQuestion,
  isFinished,
  progressOf,
  submitAnswer,
  type SessionState,
} from '../../engine/session';
import { Button, Header, Keypad, SessionDots, type Feedback } from '../../components/ui';
import type { DotState } from '../../components/ui/SessionDots';
import {
  Bars,
  Base10Blocks,
  FractionShape,
  NumberLine,
  Shape2D,
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

function QuestionVisualView({ visual }: { visual: NonNullable<Question['visual']> }) {
  switch (visual.kind) {
    case 'ten-frame':
      return <TenFrame value={visual.value} capacity={visual.capacity ?? 10} split={visual.split} />;
    case 'base10':
      return <Base10Blocks tens={visual.tens} ones={visual.ones} />;
    case 'shape2d':
      return <Shape2D name={visual.name} size={110} showCorners={visual.showCorners} />;
    case 'bars':
      return <Bars lengths={visual.lengths} labels={visual.labels} />;
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
          value={visual.value ?? null}
          marks={visual.marks ?? []}
        />
      );
  }
}

export function QuestionScreen({ session, onSession, onFinish, onExit }: QuestionScreenProps) {
  const question = currentQuestion(session);
  const [typed, setTyped] = useState('');
  const [linePick, setLinePick] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ value: number; correct: boolean } | null>(null);
  const [hintUsed, setHintUsed] = useState(false);

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
    const correct = value === question.answer;
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
    if (c === feedback.value) return feedback.correct ? 'correct' : 'retry';
    if (c === question.answer) return 'reveal';
    return 'idle';
  };

  const label = (c: number) =>
    isText ? question.options?.[c] : isCompare ? COMPARE_LABEL[c as -1 | 0 | 1] : c;

  return (
    <div className="mx-auto flex min-h-full max-w-[430px] flex-col">
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
        right={<Mascot mood={mood} size={40} />}
      />

      <main
        // Soal dikelompokkan tepat DI ATAS tombol jawaban, bukan melayang di tengah:
        // mata dan jempol anak jadi berdekatan, dan ruang kosongnya jatuh di atas
        // (tempat yang tidak dipakai) alih-alih memisahkan soal dari jawabannya.
        className="flex min-h-0 flex-1 flex-col items-center justify-end gap-4 overflow-y-auto px-6 pt-6 pb-2"
      >
        {question.visual ? <QuestionVisualView visual={question.visual} /> : null}

        <QuestionText text={question.text} />

        {/* Ten-frame hanya muncul SETELAH hint ditekan. Sebelumnya layar menampilkan
            grid kosong tanpa makna di sebelah soal. */}
        {!isQuiz && hintUsed && question.params.n != null ? (
          <TenFrame value={question.params.n as number} animate />
        ) : null}

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

        {hintUsed ? <p className="text-ink-soft text-[18px]">{en.question.showMe}</p> : null}

        {/* Jawaban yang sedang diketik selalu terlihat besar, bukan hanya di keypad. */}
        {!question.choices && !isLine ? (
          <div
            className="flex h-16 w-32 items-center justify-center rounded-[var(--r-md)] text-[40px] font-black"
            style={{
              background: 'var(--c-surface)',
              border: '3px solid var(--c-line)',
              color: typed ? 'var(--c-ink)' : 'var(--c-locked)',
            }}
            aria-live="polite"
          >
            {typed || '?'}
          </div>
        ) : null}
      </main>

      <div className="safe-bottom shrink-0 px-6 pt-2 pb-6">
        {isLine ? (
          <div className="flex flex-col gap-3">
            <NumberLine
              min={question.range?.[0] ?? 0}
              max={question.range?.[1] ?? 10}
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
          <Keypad
            value={typed}
            onChange={(v) => {
              touch();
              sfx.tap();
              setTyped(v);
            }}
            onSubmit={() => answer(Number(typed))}
            disabled={feedback != null}
          />
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
