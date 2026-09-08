import { useEffect, useRef, useState } from 'react';
import type { SessionKind } from '../../engine/types';
import {
  currentQuestion,
  isFinished,
  progressOf,
  submitAnswer,
  type SessionState,
} from '../../engine/session';
import { Button, Header, Keypad, SessionDots, type Feedback } from '../../components/ui';
import type { DotState } from '../../components/ui/SessionDots';
import { NumberLine, TenFrame } from '../../components/manipulatives';
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

      <main className="flex flex-1 flex-col items-center justify-center gap-5 px-5 py-4">
        <p className="text-center text-[44px] leading-tight font-black">{question.text}</p>

        {!isQuiz && question.params.n != null ? (
          <TenFrame value={hintUsed ? (question.params.n as number) : 0} animate={hintUsed} />
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

      <div className="safe-bottom px-5 pb-4">
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
                disabled={feedback != null}
                onPointerDown={touch}
                onClick={() => answer(c)}
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
