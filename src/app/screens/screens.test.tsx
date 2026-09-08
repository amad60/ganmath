import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { QuestionScreen } from './QuestionScreen';
import { ResultScreen } from './ResultScreen';
import { OnboardingScreen } from './OnboardingScreen';
import { MapScreen } from './MapScreen';
import { Button } from '../../components/ui';
import { createSession } from '../../engine/session';
import { evaluate } from '../../engine/mastery';
import { emptyModuleState } from '../../engine/types';
import { moduleById, pathOrder } from '../../content';
import { session as fakeSession } from '../../engine/fixtures';

/**
 * Test-test ini ada karena bug nyata yang lolos ke tangan anak: warna benar/salah
 * tidak pernah muncul, karena dua utility background Tailwind saling bertabrakan.
 * Tidak ada satu pun test yang merender komponen waktu itu.
 */
describe('Button — umpan balik harus benar-benar terlihat', () => {
  it('warna berubah sesuai feedback, bukan bergantung urutan CSS', () => {
    const { rerender } = render(<Button feedback="idle">10</Button>);
    const idle = screen.getByRole('button').style.background;

    rerender(<Button feedback="correct">10</Button>);
    const correct = screen.getByRole('button').style.background;

    rerender(<Button feedback="retry">10</Button>);
    const retry = screen.getByRole('button').style.background;

    expect(correct).toContain('--c-correct');
    expect(retry).toContain('--c-retry');
    expect(new Set([idle, correct, retry]).size).toBe(3);
  });

  it('jawaban yang ditunjukkan setelah salah memakai warna lembut, bukan perayaan', () => {
    render(<Button feedback="reveal">10</Button>);
    expect(screen.getByRole('button').style.background).toContain('--c-correct-soft');
  });

  it('textSize benar-benar diterapkan, tidak kalah oleh utility ukuran varian', () => {
    render(
      <Button variant="answer" textSize={21}>
        three fourths
      </Button>,
    );
    expect(screen.getByRole('button').style.fontSize).toBe('21px');
  });
});

describe('QuestionScreen — anak harus tahu sisa berapa lagi', () => {
  // Quick Look: aturan pertamanya bertipe choose-number, jadi layar merender
  // tombol pilihan (bukan keypad) — itu yang ingin diuji di sini.
  const def = moduleById('g1-u1-m4');

  const setup = () =>
    render(
      <QuestionScreen
        session={createSession(def, 'quiz', 7, 0)}
        onSession={() => {}}
        onFinish={() => {}}
        onExit={() => {}}
      />,
    );

  it('menampilkan hitungan soal secara eksplisit', () => {
    setup();
    expect(screen.getByText(/^\d+ \/ \d+$/)).toBeInTheDocument();
  });

  it('menampilkan satu titik per soal sebagai tolok ukur', () => {
    const { container } = setup();
    const dots = container.querySelectorAll('[aria-hidden] > span');
    expect(dots.length).toBeGreaterThanOrEqual(8);
  });

  it('menekan jawaban langsung memberi warna pada tombol yang dipilih', () => {
    vi.useFakeTimers();
    const s = createSession(def, 'quiz', 7, 0);
    render(
      <QuestionScreen session={s} onSession={() => {}} onFinish={() => {}} onExit={() => {}} />,
    );
    const q = s.pending[0]!.question;
    const wrong = (q.choices ?? []).find((c) => c !== q.answer)!;

    fireEvent.click(screen.getByRole('button', { name: String(wrong) }));

    expect(screen.getByRole('button', { name: String(wrong) })).toHaveAttribute(
      'data-feedback',
      'retry',
    );
    // jawaban benar ikut ditunjukkan — layar mengajar, bukan sekadar menilai
    expect(screen.getByRole('button', { name: String(q.answer) })).toHaveAttribute(
      'data-feedback',
      'reveal',
    );
    vi.useRealTimers();
  });

  it('jawaban benar memberi warna benar', () => {
    vi.useFakeTimers();
    const s = createSession(def, 'quiz', 7, 0);
    render(
      <QuestionScreen session={s} onSession={() => {}} onFinish={() => {}} onExit={() => {}} />,
    );
    const q = s.pending[0]!.question;
    fireEvent.click(screen.getByRole('button', { name: String(q.answer) }));
    expect(screen.getByRole('button', { name: String(q.answer) })).toHaveAttribute(
      'data-feedback',
      'correct',
    );
    vi.useRealTimers();
  });

  it('Mastery Check tidak menampilkan tombol Hint', () => {
    setup();
    expect(screen.queryByText(/Hint/)).not.toBeInTheDocument();
  });
});

describe('ResultScreen — layar gagal tidak boleh terasa seperti vonis', () => {
  const def = moduleById('g1-u1-m1');
  const failing = evaluate(def, emptyModuleState(), fakeSession({ correct: 4 }));

  it('bintang tetap berwarna emas meski belum didapat', () => {
    const { container } = render(
      <ResultScreen
        module={def}
        evaluation={failing}
        xpGained={20}
        earnedBadges={[]}
        sessionsNeeded={2}
        nextLabel="Practice: Count to 5"
        onNext={() => {}}
        onBackToMap={() => {}}
      />,
    );
    const stars = within(container).getByLabelText(/of 3 stars/);
    const spans = stars.querySelectorAll('span');
    expect(spans.length).toBe(3);
    for (const s of spans) expect((s as HTMLElement).style.color).toContain('--c-star');
  });

  it('tombol utama selalu membawa maju, bukan kembali ke peta', () => {
    const onNext = vi.fn();
    render(
      <ResultScreen
        module={def}
        evaluation={failing}
        xpGained={0}
        earnedBadges={[]}
        sessionsNeeded={2}
        nextLabel="Practice: Count to 5"
        onNext={onNext}
        onBackToMap={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Practice: Count to 5' }));
    expect(onNext).toHaveBeenCalled();
  });

  it('tidak pernah menulis Failed', () => {
    render(
      <ResultScreen
        module={def}
        evaluation={failing}
        xpGained={0}
        earnedBadges={[]}
        sessionsNeeded={2}
        nextLabel="Practice: Count to 5"
        onNext={() => {}}
        onBackToMap={() => {}}
      />,
    );
    expect(screen.queryByText(/fail/i)).not.toBeInTheDocument();
  });
});

describe('Onboarding', () => {
  it('memakai maskot rubah, bukan robot, dan menyediakan avatar kucing', () => {
    render(<OnboardingScreen onDone={() => {}} />);
    expect(screen.getByLabelText(/Gan the fox/)).toBeInTheDocument();
    expect(screen.getByLabelText('cat')).toBeInTheDocument();
    expect(screen.queryByText('🤖')).not.toBeInTheDocument();
  });
});

describe('area aman', () => {
  it('safe-top/safe-bottom tidak pernah dipasangkan dengan padding di sisi yang sama', async () => {
    const { readFileSync, readdirSync } = await import('node:fs');
    const { join } = await import('node:path');
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
      );

    const offenders: string[] = [];
    for (const f of walk('src').filter((f) => f.endsWith('.tsx'))) {
      for (const m of readFileSync(f, 'utf8').matchAll(/className=\{?"([^"]*)"/g)) {
        const cls = m[1] ?? '';
        // safe-* menulis padding sisi itu sendiri; utility di sisi yang sama akan
        // saling menimpa dan pemenangnya ditentukan urutan file CSS.
        if (/\bsafe-top\b/.test(cls) && /\b(pt-|py-|p-)\d/.test(cls)) offenders.push(`${f}: ${cls}`);
        if (/\bsafe-bottom\b/.test(cls) && /\b(pb-|py-|p-)\d/.test(cls)) offenders.push(`${f}: ${cls}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe('pindah kelas', () => {
  it('hanya kelas yang punya konten yang bisa dipilih', async () => {
    const { availableGrades, pathOrderFor } = await import('../../content');
    expect(availableGrades).toEqual([1]);
    expect(pathOrderFor(1).length).toBeGreaterThan(0);
    expect(pathOrderFor(2)).toEqual([]);
  });

  it('gating dihitung di dalam kelas aktif, bukan lintas kelas', async () => {
    const { registryFor } = await import('../../content');
    const r = registryFor(1);
    expect(r.pathOrder.every((id) => r.modules[id]?.grade === 1)).toBe(true);
  });
});

describe('pilihan berupa kata', () => {
  it('dirender lebih kecil daripada pilihan angka supaya tidak terpotong', () => {
    const def = moduleById('g1-u6-m4');
    const s = createSession(def, 'quiz', 3, 0);
    const q = s.pending.find((p) => p.question.type === 'choose-text');
    expect(q).toBeTruthy();
    render(
      <QuestionScreen
        session={{ ...s, pending: [q!, ...s.pending.filter((x) => x !== q)] }}
        onSession={() => {}}
        onFinish={() => {}}
        onExit={() => {}}
      />,
    );
    const btn = screen.getByRole('button', { name: 'three fourths' });
    expect(btn.style.fontSize).toBe('21px');
  });
});

describe('MapScreen — pintu jump level', () => {
  it('menawarkan lewati modul untuk anak yang sudah bisa', () => {
    const onTestOut = vi.fn();
    render(
      <MapScreen
        states={{}}
        nextId={pathOrder[0] as string}
        xp={0}
        level={1}
        streak={0}
        grade={1}
        nextStepLabel="Learn"
        reviews={[]}
        onReview={() => {}}
        onOpen={() => {}}
        onTestOut={onTestOut}
        onParent={() => {}}
        onBadges={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /already know this/i }));
    expect(onTestOut).toHaveBeenCalledWith(pathOrder[0]);
  });

  it('modul terkunci tidak bisa ditekan', () => {
    render(
      <MapScreen
        states={{}}
        nextId={pathOrder[0] as string}
        xp={0}
        level={1}
        streak={0}
        grade={1}
        nextStepLabel="Learn"
        reviews={[]}
        onReview={() => {}}
        onOpen={() => {}}
        onTestOut={() => {}}
        onParent={() => {}}
        onBadges={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: /Count to 10, locked/ })).toBeDisabled();
  });
});
