import { useEffect, useRef, useState } from 'react';
import type { SessionKind } from '../../engine/types';
import { currentQuestion, isFinished, progressOf, submitAnswer, type SessionState } from '../../engine/session';
import { Button, Header, Keypad, ProgressBar } from '../../components/ui';
import { NumberLine, TenFrame } from '../../components/manipulatives';
import { en } from '../../i18n/en';

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
};

/**
 * Mastery Check sengaja terlihat BEDA dari Practice: header emas, tanpa visual
 * pendamping, tanpa tombol Hint. Anak harus tahu kapan dia sedang diuji.
 * Waktu diukur diam-diam — tidak ada timer yang terlihat.
 */
export function QuestionScreen({ session, onSession, onFinish, onExit }: QuestionScreenProps) {
  const question = currentQuestion(session);
  const [typed, setTyped] = useState('');
  const [feedback, setFeedback] = useState<{ value: number; correct: boolean } | null>(null);
  const [hintUsed, setHintUsed] = useState(false);

  const shownAt = useRef(0);
  const firstInputAt = useRef<number | null>(null);

  const isQuiz = session.kind === 'quiz' || session.kind === 'master';
  const isCompare = question?.type === 'compare-symbol';
  const isText = question?.type === 'choose-text';
  const isLine = question?.type === 'number-line-drop';

  const [linePick, setLinePick] = useState<number | null>(null);

  useEffect(() => {
    // Timer mulai setelah frame soal benar-benar tergambar, bukan saat state berubah.
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
    if (firstInputAt.current == null) firstInputAt.current = performance.now();
  };

  const answer = (value: number) => {
    if (feedback) return;
    touch();
    const now = performance.now();
    const correct = value === question.answer;
    setFeedback({ value, correct });

    const next = submitAnswer(session, {
      correct,
      thinkMs: Math.max(0, (firstInputAt.current ?? now) - shownAt.current),
      totalMs: Math.max(0, now - shownAt.current),
      hintUsed,
      nowMs: Date.now(),
    });

    window.setTimeout(() => {
      if (isFinished(next, Date.now())) onFinish(next);
      else onSession(next);
    }, correct ? 550 : 1400);
  };

  const { done, total } = progressOf(session);

  return (
    <div className="flex min-h-full flex-col">
      <Header
        onBack={onExit}
        tone={isQuiz ? 'mastery' : 'plain'}
        center={
          <div className="flex items-center gap-3">
            {isQuiz ? <span className="text-[15px] font-black">⭐ {TITLES[session.kind]}</span> : null}
            <ProgressBar value={done} max={total} />
          </div>
        }
      />

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-5 py-6">
        <p className="text-center text-[44px] leading-tight font-black">{question.text}</p>

        {/* Visual pendamping hanya di Practice/Review — Mastery Check tidak dibantu. */}
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
                setLinePick(v);
              }}
            />
            <Button
              full
              disabled={linePick == null || feedback != null}
              onClick={() => answer(linePick as number)}
            >
              {en.question.check}
            </Button>
          </div>
        ) : question.choices ? (
          <div className={`grid gap-3 ${isCompare ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {question.choices?.map((c) => (
              <Button
                key={c}
                variant="answer"
                onPointerDown={touch}
                onClick={() => answer(c)}
                // yang dipilih anak jadi hijau/oranye; kalau salah, jawaban benar
                // ikut menyala hijau — layar mengajarkan, bukan sekadar menilai
                feedback={
                  feedback == null
                    ? 'idle'
                    : c === feedback.value
                      ? feedback.correct
                        ? 'correct'
                        : 'retry'
                      : c === question.answer
                        ? 'correct'
                        : 'idle'
                }
              >
                {isText ? question.options?.[c] : isCompare ? COMPARE_LABEL[c as -1 | 0 | 1] : c}
              </Button>
            ))}
          </div>
        ) : (
          <Keypad
            value={typed}
            onChange={(v) => {
              touch();
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
          >
            {feedback.correct
              ? en.question.correct
              : `${en.question.retry} · ${
                  isText
                    ? (question.options?.[question.answer] ?? '')
                    : isCompare
                      ? COMPARE_LABEL[question.answer as -1 | 0 | 1]
                      : question.answer
                }`}
          </p>
        ) : null}
      </div>
    </div>
  );
}
