import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { LearnScreen } from './LearnScreen';
import { QuestionScreen } from './QuestionScreen';
import { UnitIntroModal } from '../../components/unit-intro/UnitIntroModal';
import { scienceIntroScene } from '../../components/unit-intro/UnitAnimation';
import { createSession } from '../../engine/session';
import { moduleById } from '../../content';
import type { SessionState } from '../../engine/session';

afterEach(() => vi.useRealTimers());

/** Sesi kuis yang soal pertamanya `pick-picture`. */
function pictureFirst(moduleId: string): SessionState {
  const s = createSession(moduleById(moduleId), 'quiz', 5, 0);
  const at = s.pending.findIndex((p) => p.question.type === 'pick-picture');
  const pending = [s.pending[at]!, ...s.pending.filter((_, i) => i !== at)];
  return { ...s, pending };
}

describe('Science Level 1 di layar', () => {
  it('Learn s1-u1: Next terkunci sampai kedua pilihan dicoba DAN akibatnya terlihat', () => {
    vi.useFakeTimers();
    render(<LearnScreen module={moduleById('s1-u1-m1')} onDone={() => {}} onExit={() => {}} seed={1} />);
    const next = screen.getByRole('button', { name: /next|start/i });
    expect(next).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /^💧/ }));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(next).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /No water/ }));
    // Baru diketuk, gerakannya belum selesai: Next belum boleh menyala.
    expect(next).toBeDisabled();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(next).not.toBeDisabled();
  });

  it('Learn s1-u1: tebakan salah di langkah pictorial tetap membuka Next setelah hasilnya diputar', () => {
    vi.useFakeTimers();
    render(<LearnScreen module={moduleById('s1-u1-m1')} onDone={() => {}} onExit={() => {}} seed={1} />);
    fireEvent.click(screen.getByRole('button', { name: /^💧/ }));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    fireEvent.click(screen.getByRole('button', { name: /No water/ }));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: 'It can fly' }));
    expect(screen.getByText("Let's see!")).toBeTruthy();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('A fish needs water to live.')).toBeTruthy();
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
  });

  it('soal pick-picture: tiga kartu GAMBAR tanpa tulisan, jawaban benar dinilai benar', () => {
    vi.useFakeTimers();
    const s = pictureFirst('s1-u3-m1');
    const q = s.pending[0]!.question;
    const onSession = vi.fn();
    render(<QuestionScreen session={s} onSession={onSession} onFinish={() => {}} onExit={() => {}} />);
    expect(screen.getByText(q.text)).toBeTruthy();
    if (q.visual?.kind !== 'science-scene') throw new Error('bukan adegan');
    const cards = q.visual.options.map((o) => screen.getByRole('button', { name: o.label }));
    expect(cards).toHaveLength(3);
    // Kartunya gambar: isinya emoji, bukan kalimat yang bisa dicocokkan kata per kata.
    for (const [i, c] of cards.entries()) expect(c.textContent).toBe(q.visual.options[i]!.icon);
    fireEvent.click(cards[q.answer]!);
    expect(screen.getByRole('status').textContent).toBe('Yes!');
  });

  it('soal pick-picture di kuis: salah tidak membuka kartu yang benar', () => {
    const s = pictureFirst('s1-u7-m1');
    const q = s.pending[0]!.question;
    if (q.visual?.kind !== 'science-scene') throw new Error('bukan adegan');
    render(<QuestionScreen session={s} onSession={() => {}} onFinish={() => {}} onExit={() => {}} />);
    const wrong = (q.answer + 1) % 3;
    fireEvent.click(screen.getByRole('button', { name: q.visual.options[wrong]!.label }));
    const right = screen.getByRole('button', { name: q.visual.options[q.answer]!.label });
    expect(right.getAttribute('data-feedback')).toBe('idle');
  });

  it('intro unit s1 memutar adegan modulnya, bukan roket generik', async () => {
    vi.useFakeTimers();
    for (let n = 1; n <= 10; n++) expect(scienceIntroScene(`s1-u${n}`), `s1-u${n}`).toBeTruthy();
    expect(scienceIntroScene('s2-u1')).toBeNull();
    render(<UnitIntroModal unitId="s1-u3" onClose={() => {}} />);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.queryByText(/Ready for s1-u3/)).toBeNull();
    expect(screen.getByRole('img', { name: /Picture/ })).toBeTruthy();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('The ice melts into water.')).toBeTruthy();
  });
});
