import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { QuestionScreen } from './QuestionScreen';
import { createSession, currentQuestion } from '../../engine/session';
import { mysteryClues } from '../../content/readGrade1/r1-u4-m1';
import { pictureWords } from '../../content/readGrade6/r6-u3-m1';
import type { ContentModule } from '../../content/types';
import type { Question } from '../../engine/types';

function sessionWith(type: Question['type'], kind: 'practice' | 'quiz', module: ContentModule = mysteryClues) {
  for (let seed = 1; seed <= 60; seed++) {
    const session = createSession(module, kind, seed, 0);
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

  it('ketik kata menampilkan paragraf, menyembunyikan ejaan yang diterima, dan mencocokkan ketikan', () => {
    vi.useFakeTimers();
    const made = createSession(pictureWords, 'quiz', 1, 0);
    const at = made.pending.findIndex((p) => p.question.type === 'type-word');
    if (at < 0) throw new Error('tidak ketemu soal type-word');
    const session = {
      ...made,
      pending: [made.pending[at]!, ...made.pending.filter((_, i) => i !== at)],
    };
    const q = currentQuestion(session)!;
    if (q.visual?.kind !== 'evidence-text') throw new Error('paragraf tidak ikut soal');
    const accepted = q.options ?? [];
    expect(accepted.length).toBeGreaterThan(0);

    const view = render(
      <QuestionScreen session={session} onSession={() => {}} onFinish={() => {}} onExit={() => {}} />,
    );
    expect(screen.getByText(q.visual.sentences[0]!)).toBeInTheDocument();
    for (const word of accepted) {
      expect(screen.queryByRole('button', { name: new RegExp(`^${word}$`, 'i') })).not.toBeInTheDocument();
    }

    const input = screen.getByRole('textbox', { name: 'Type the word' });
    fireEvent.change(input, { target: { value: 'zzzz' } });
    fireEvent.click(screen.getByRole('button', { name: 'Check' }));
    expect(screen.getByText('Not quite')).toBeInTheDocument();
    for (const word of accepted) {
      expect(screen.queryByText(new RegExp(`\\b${word}\\b`, 'i'))).not.toBeInTheDocument();
    }

    view.unmount();
    render(<QuestionScreen session={session} onSession={() => {}} onFinish={() => {}} onExit={() => {}} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Type the word' }), {
      target: { value: `${accepted[0]!.toUpperCase()}!` },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Check' }));
    expect(screen.getByRole('status')).toHaveTextContent('Yes!');
    vi.useRealTimers();
  });
});
