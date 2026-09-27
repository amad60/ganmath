import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { QuestionScreen } from './QuestionScreen';
import { createSession, currentQuestion } from '../../engine/session';
import { mysteryClues } from '../../content/readGrade1/r1-u4-m1';
import type { Question } from '../../engine/types';

function sessionWith(type: Question['type'], kind: 'practice' | 'quiz') {
  for (let seed = 1; seed <= 60; seed++) {
    const session = createSession(mysteryClues, kind, seed, 0);
    if (currentQuestion(session)?.type === type) return session;
  }
  throw new Error(`tidak ketemu soal ${type}`);
}

describe('Layar baca tidak membuka kunci jawaban', () => {
  it('tebakan salah pada latihan mengunci kalimat itu tanpa menandai yang benar', () => {
    vi.useFakeTimers();
    const session = sessionWith('clue-tap', 'practice');
    const q = currentQuestion(session)!;
    if (q.visual?.kind !== 'evidence-text') throw new Error('bukan teks');
    const wrong = q.visual.sentences.find((_, i) => i !== q.answer)!;
    const right = q.visual.sentences[q.answer]!;

    render(<QuestionScreen session={session} onSession={() => {}} onFinish={() => {}} onExit={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: new RegExp(wrong) }));

    expect(screen.getByText('Not that sentence.')).toBeInTheDocument();
    expect(screen.queryByText('Yes!')).not.toBeInTheDocument();
    expect(screen.queryByText('Not quite')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: new RegExp(right) })).toHaveAttribute('aria-disabled', 'false');
    expect(screen.getByRole('button', { name: new RegExp(wrong) })).toHaveAttribute('aria-disabled', 'true');
    vi.useRealTimers();
  });

  it('tebakan kedua yang kena tidak dihitung benar', () => {
    vi.useFakeTimers();
    const session = sessionWith('clue-tap', 'practice');
    const q = currentQuestion(session)!;
    if (q.visual?.kind !== 'evidence-text') throw new Error('bukan teks');
    const wrong = q.visual.sentences.find((_, i) => i !== q.answer)!;
    const right = q.visual.sentences[q.answer]!;
    const onSession = vi.fn();

    render(
      <QuestionScreen session={session} onSession={onSession} onFinish={() => {}} onExit={() => {}} />,
    );
    fireEvent.click(screen.getByRole('button', { name: new RegExp(wrong) }));
    fireEvent.click(screen.getByRole('button', { name: new RegExp(right) }));

    expect(screen.getByText('Not quite')).toBeInTheDocument();
    expect(screen.queryByText('Yes!')).not.toBeInTheDocument();
    expect(onSession).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('pilihan kata yang salah tidak menampilkan jawaban yang benar', () => {
    vi.useFakeTimers();
    const session = sessionWith('choose-text', 'quiz');
    const q = currentQuestion(session)!;
    const wrongId = q.choices?.find((c) => c !== q.answer);
    const wrongLabel = q.options?.[wrongId ?? -1];
    const rightLabel = q.options?.[q.answer];
    if (!wrongLabel || !rightLabel) throw new Error('pilihan kosong');

    render(<QuestionScreen session={session} onSession={() => {}} onFinish={() => {}} onExit={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: wrongLabel }));

    expect(screen.getByRole('button', { name: wrongLabel })).toHaveAttribute('data-feedback', 'retry');
    expect(screen.getByRole('button', { name: rightLabel })).not.toHaveAttribute('data-feedback', 'reveal');
    expect(screen.getByText('Not quite')).toBeInTheDocument();
    expect(screen.queryByText(new RegExp(`Try again · ${rightLabel}`))).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
