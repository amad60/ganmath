import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { QuestionScreen } from './QuestionScreen';
import { ResultScreen } from './ResultScreen';
import { OnboardingScreen } from './OnboardingScreen';
import { MapScreen } from './MapScreen';
import { LearnScreen } from './LearnScreen';
import { LearnVisualView } from './LearnVisualView';
import { Button, Keypad } from '../../components/ui';
import { createSession } from '../../engine/session';
import { evaluate } from '../../engine/mastery';
import { emptyModuleState, MAX_ANSWER_DIGITS } from '../../engine/types';
import { moduleById, pathOrder } from '../../content';
import { ACTION_VISUALS } from '../../content/lint';
import type { LearnVisual } from '../../content/types';
import type { ModuleDef, ModuleState } from '../../engine/types';
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

/**
 * Keypad dulu terkunci di 3 digit lewat default diam-diam. Setiap soal berjawaban
 * ≥1000 (g3-u1-m2 sampai 9990, dan seluruh Grade 4–6) jadi buntu: anak bisa
 * mengetik tiga digit lalu keypadnya berhenti menanggapi.
 */
describe('Keypad — lebar input mengikuti soal', () => {
  const type = (digits: string) => {
    for (const d of digits) fireEvent.click(screen.getByRole('button', { name: d }));
  };

  it('menerima jawaban 4 digit kalau soalnya memang selebar itu', () => {
    let value = '';
    const { rerender } = render(
      <Keypad value={value} onChange={(v) => (value = v)} onSubmit={() => {}} maxLength={4} />,
    );
    for (const d of '9990') {
      fireEvent.click(screen.getByRole('button', { name: d }));
      rerender(
        <Keypad value={value} onChange={(v) => (value = v)} onSubmit={() => {}} maxLength={4} />,
      );
    }
    expect(value).toBe('9990');
  });

  it('tetap berhenti di lebar yang diminta soal', () => {
    let value = '';
    const { rerender } = render(
      <Keypad value={value} onChange={(v) => (value = v)} onSubmit={() => {}} maxLength={2} />,
    );
    for (const d of '1234') {
      fireEvent.click(screen.getByRole('button', { name: d }));
      rerender(
        <Keypad value={value} onChange={(v) => (value = v)} onSubmit={() => {}} maxLength={2} />,
      );
    }
    expect(value).toBe('12');
  });

  it('tidak pernah membiarkan anak mengetik dua puluh digit', () => {
    let value = '';
    const { rerender } = render(
      <Keypad value={value} onChange={(v) => (value = v)} onSubmit={() => {}} maxLength={20} />,
    );
    for (let i = 0; i < 20; i++) {
      fireEvent.click(screen.getByRole('button', { name: '7' }));
      rerender(
        <Keypad value={value} onChange={(v) => (value = v)} onSubmit={() => {}} maxLength={20} />,
      );
    }
    expect(value).toHaveLength(MAX_ANSWER_DIGITS);
  });

  it('QuestionScreen meneruskan lebar soal ke keypad, bukan konstanta 3', () => {
    // g3-u1-m2 adalah korban nyatanya: "9 thousands 9 hundreds 9 tens = ?" = 9990.
    const base = createSession(moduleById('g3-u1-m2'), 'quiz', 1, 0);
    const i = base.pending.findIndex((p) => p.question.type === 'keypad');
    expect(i).toBeGreaterThanOrEqual(0);
    const s = { ...base, pending: base.pending.slice(i) };
    const q = s.pending[0]!.question;
    expect(q.maxDigits).toBe(4);

    render(
      <QuestionScreen session={s} onSession={() => {}} onFinish={() => {}} onExit={() => {}} />,
    );
    type(String(q.answer));
    expect(screen.getByText(String(q.answer))).toBeInTheDocument();
  });
});

/**
 * Keypad hanya punya 0–9, jadi tiga unit yang inti materinya justru menuliskan
 * angka desimal/negatif (g5-u2, g5-u3, g6-u1) hanya bisa dibangun sebagai soal
 * pilihan — anak tidak pernah menuliskan sendiri keterampilan yang diuji.
 * Tombol `.` dan `−` menutup lubang itu, dengan satu syarat keras: kemunculannya
 * ikut ATURAN soal, bukan jawaban soal yang sedang tampil.
 */
describe('Keypad — titik desimal dan minus', () => {
  const pad = (props: Partial<ComponentProps<typeof Keypad>> = {}) => {
    let value = props.value ?? '';
    const view = render(
      <Keypad
        value={value}
        onChange={(v) => (value = v)}
        onSubmit={() => {}}
        maxLength={3}
        {...props}
      />,
    );
    const press = (name: string) => {
      fireEvent.click(screen.getByRole('button', { name }));
      view.rerender(
        <Keypad
          value={value}
          onChange={(v) => (value = v)}
          onSubmit={() => {}}
          maxLength={3}
          {...props}
        />,
      );
    };
    return { press, get: () => value };
  };

  it('tombolnya tidak ada sama sekali untuk soal bilangan bulat positif', () => {
    render(<Keypad value="" onChange={() => {}} onSubmit={() => {}} maxLength={3} />);
    expect(screen.queryByRole('button', { name: 'Point' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Minus' })).not.toBeInTheDocument();
    // 12 tombol: 0–9, hapus, kirim. Tata letak lama tidak berubah sedikit pun.
    expect(screen.getAllByRole('button')).toHaveLength(12);
  });

  it('hanya tombol yang diminta rule yang muncul', () => {
    const { unmount } = render(
      <Keypad value="" onChange={() => {}} onSubmit={() => {}} maxLength={3} allowDecimal />,
    );
    expect(screen.getByRole('button', { name: 'Point' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Minus' })).not.toBeInTheDocument();
    unmount();

    render(
      <Keypad value="" onChange={() => {}} onSubmit={() => {}} maxLength={3} allowNegative />,
    );
    expect(screen.getByRole('button', { name: 'Minus' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Point' })).not.toBeInTheDocument();
  });

  it('✓ tetap di pojok kanan bawah dan ⌫ tepat di atasnya — zona jempol', () => {
    const { container } = render(
      <Keypad
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        maxLength={3}
        allowDecimal
        allowNegative
      />,
    );
    const cellOf = (name: string) =>
      (screen.getByRole('button', { name }).parentElement as HTMLElement).style;

    expect(container.firstElementChild).toHaveClass('grid-cols-4');
    expect(cellOf('Check').gridRow).toBe('4');
    expect(cellOf('Check').gridColumn).toBe('4');
    expect(cellOf('Delete').gridRow).toBe('3');
    expect(cellOf('Delete').gridColumn).toBe('4');
    // Tombol jarang pakai naik ke atas, jauh dari jempol.
    expect(cellOf('Point').gridRow).toBe('2');
    expect(cellOf('Minus').gridRow).toBe('1');
    // Blok angka 3×3 tidak digeser; 0 melebar mengisi sisa baris terakhir.
    expect(cellOf('1').gridColumn).toBe('1');
    expect(cellOf('9').gridRow).toBe('3');
    expect(cellOf('0').gridColumn).toBe('1 / span 3');
  });

  it('maksimal satu titik desimal', () => {
    const p = pad({ allowDecimal: true, maxLength: 4 });
    p.press('1');
    p.press('Point');
    p.press('5');
    p.press('Point');
    expect(p.get()).toBe('1.5');
  });

  it('menekan titik lebih dulu memberi 0., bukan .', () => {
    const p = pad({ allowDecimal: true });
    p.press('Point');
    p.press('5');
    expect(p.get()).toBe('0.5');
  });

  it('titik dimatikan kalau tidak ada lagi jatah digit di belakangnya', () => {
    const p = pad({ allowDecimal: true, maxLength: 2 });
    p.press('1');
    p.press('2');
    expect(screen.getByRole('button', { name: 'Point' })).toBeDisabled();
  });

  it('minus selalu di paling depan, walau ditekan belakangan', () => {
    const p = pad({ allowNegative: true });
    p.press('4');
    p.press('2');
    p.press('Minus');
    expect(p.get()).toBe('−42');
    // dan bisa dibatalkan tanpa menghapus angkanya
    p.press('Minus');
    expect(p.get()).toBe('42');
  });

  it('tanda dan titik tidak memakan jatah lebar input', () => {
    const p = pad({ allowDecimal: true, allowNegative: true, maxLength: 3 });
    p.press('Minus');
    for (const d of '1234') p.press(d);
    p.press('Point');
    expect(p.get()).toBe('−123');
  });

  it('tidak bisa mengirim masukan yang belum sah', () => {
    for (const value of ['', '−', '5.', '−0.']) {
      const { unmount } = render(
        <Keypad
          value={value}
          onChange={() => {}}
          onSubmit={() => {}}
          maxLength={3}
          allowDecimal
          allowNegative
        />,
      );
      expect(screen.getByRole('button', { name: 'Check' })).toBeDisabled();
      unmount();
    }
    render(
      <Keypad
        value="−0.5"
        onChange={() => {}}
        onSubmit={() => {}}
        maxLength={3}
        allowDecimal
        allowNegative
      />,
    );
    expect(screen.getByRole('button', { name: 'Check' })).toBeEnabled();
  });

  it('QuestionScreen menerima jawaban desimal yang diketik anak', () => {
    vi.useFakeTimers();
    const def: ModuleDef = {
      ...moduleById('g1-u1-m1'),
      questionTypes: ['keypad'],
      rules: [
        {
          type: 'keypad',
          skill: 'add-decimals',
          params: { a: [1, 9] },
          // 0.1 + 0.2 dan kawan-kawannya: jawabannya lahir dengan galat float.
          answer: (p) => (p.a as number) / 10 + 0.2,
          text: (p) => `0.${p.a} + 0.2 = ?`,
        },
      ],
    };
    const s = createSession(def, 'practice', 3, 0);
    const q = s.pending[0]!.question;
    expect(q.allowDecimal).toBe(true);

    render(
      <QuestionScreen session={s} onSession={() => {}} onFinish={() => {}} onExit={() => {}} />,
    );
    for (const ch of String(q.answer)) {
      fireEvent.click(screen.getByRole('button', { name: ch === '.' ? 'Point' : ch }));
    }
    fireEvent.click(screen.getByRole('button', { name: 'Check' }));
    expect(screen.getByRole('status')).toHaveTextContent('Yes!');
    vi.useRealTimers();
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
        kind="quiz"
        evaluation={failing}
        xpGained={20}
        earnedBadges={[]}
        sessionsNeeded={2}
        nextTitle="More or Less"
        onBackToMap={() => {}}
      />,
    );
    const stars = within(container).getByLabelText(/of 3 stars/);
    const spans = stars.querySelectorAll('span');
    expect(spans.length).toBe(3);
    for (const s of spans) expect((s as HTMLElement).style.color).toContain('--c-star');
  });

  /**
   * Master Round tidak pernah mengubah status modul — ia hanya menentukan bintang
   * ke-3. Layar ini dulu menyusun pesannya dari `next.status`, jadi anak yang baru
   * saja bermain Master Round dijawab "Almost! Just be a bit quicker.": kalimat
   * tentang kecepatan KUIS, bukan tentang ronde yang barusan dia mainkan — dan
   * kalimat yang sama muncul entah dia menang atau kalah.
   */
  const practiced: ModuleState = {
    status: 'practiced',
    stars: 0,
    reviewStage: 0,
    consecutiveFails: 0,
    attempts: [],
    totals: { sessions: 3, questions: 28, correct: 28 },
  };

  it('Master Round yang kalah tidak dijawab dengan kalimat tentang kecepatan kuis', () => {
    const round = evaluate(def, practiced, fakeSession({ kind: 'master', thinkMs: 9000 }));
    render(
      <ResultScreen
        module={def}
        kind="master"
        evaluation={round}
        xpGained={10}
        earnedBadges={[]}
        sessionsNeeded={2}
        nextTitle={null}
        onBackToMap={() => {}}
      />,
    );
    expect(screen.queryByText(/be a bit quicker/i)).not.toBeInTheDocument();
    expect(screen.getByText(/come back for the third star/i)).toBeInTheDocument();
    // Master Round bukan langkah menuju kelulusan modul: bar "sesi lulus" tidak berlaku.
    expect(screen.queryByText('1/2')).not.toBeInTheDocument();
  });

  it('Master Round yang menang merayakan bintang ke-3', () => {
    const round = evaluate(def, practiced, fakeSession({ kind: 'master', thinkMs: 2000 }));
    render(
      <ResultScreen
        module={def}
        kind="master"
        evaluation={round}
        xpGained={10}
        earnedBadges={[]}
        sessionsNeeded={2}
        nextTitle={null}
        onBackToMap={() => {}}
      />,
    );
    expect(screen.getByText(/you know these by heart/i)).toBeInTheDocument();
    expect(within(screen.getByLabelText(/of 3 stars/)).queryAllByText('★')).toHaveLength(3);
  });

  it('hanya punya SATU tombol, supaya arahnya tidak pernah ambigu', () => {
    const onBackToMap = vi.fn();
    render(
      <ResultScreen
        module={def}
        kind="quiz"
        evaluation={failing}
        xpGained={0}
        earnedBadges={[]}
        sessionsNeeded={2}
        nextTitle="More or Less"
        onBackToMap={onBackToMap}
      />,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
    fireEvent.click(buttons[0] as HTMLElement);
    expect(onBackToMap).toHaveBeenCalled();
  });

  it('tidak pernah menulis Failed', () => {
    render(
      <ResultScreen
        module={def}
        kind="quiz"
        evaluation={failing}
        xpGained={0}
        earnedBadges={[]}
        sessionsNeeded={2}
        nextTitle="More or Less"
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

describe('badge di My Progress', () => {
  const props = (owned: string[] = []) => ({
    owned,
    states: {},
    streakBest: 3,
    streakCurrent: 1,
    nextId: pathOrder[0] as string,
    grade: 1,
    onBack: () => {},
  });

  it('badge muncul lebih dulu daripada progress kelas', async () => {
    const { BadgesScreen } = await import('./BadgesScreen');
    const { container } = render(<BadgesScreen {...props(['first-step'])} />);
    const headings = [...container.querySelectorAll('h2')].map((h) => h.textContent);
    expect(headings[0]).toBe('Badges');
  });

  it('menyorot badge terbaru', async () => {
    const { BadgesScreen } = await import('./BadgesScreen');
    render(<BadgesScreen {...props(['first-step', 'module-master'])} />);
    expect(screen.getByText(/Newest badge/i)).toBeInTheDocument();
    // Yang terbaru adalah yang paling akhir didapat.
    expect(screen.getAllByText('Module Master').length).toBeGreaterThan(0);
  });

  it('anak yang belum punya badge tetap diberi target', async () => {
    const { BadgesScreen } = await import('./BadgesScreen');
    render(<BadgesScreen {...props([])} />);
    expect(screen.getByText(/Your first badge/i)).toBeInTheDocument();
  });

  it('tidak membanjiri layar: sebagian dulu, sisanya lewat "see all"', async () => {
    const { BadgesScreen } = await import('./BadgesScreen');
    render(<BadgesScreen {...props([])} />);
    const seeAll = screen.getByRole('button', { name: /See all/i });
    const before = screen.getAllByRole('button', { name: /Locked badge|Earned|First Step/i }).length;
    fireEvent.click(seeAll);
    const after = screen.getAllByRole('button', { name: /Locked badge|Earned|First Step/i }).length;
    expect(after).toBeGreaterThan(before);
  });

  it('badge bisa ditekan dan menjelaskan cara mendapatkannya', async () => {
    const { BadgesScreen } = await import('./BadgesScreen');
    render(<BadgesScreen {...props([])} />);
    const first = screen.getAllByRole('button', { name: /Locked badge/i })[0] as HTMLElement;
    fireEvent.click(first);
    expect(screen.getByText(/Not yet — keep going/i)).toBeInTheDocument();
  });
});

describe('pindah kelas', () => {
  it('hanya kelas yang punya konten yang bisa dipilih', async () => {
    const { availableGrades, pathOrderFor } = await import('../../content');
    // Kelas bertambah seiring konten ditulis; yang dijaga adalah aturannya, bukan angkanya.
    for (const g of availableGrades) expect(pathOrderFor(g).length).toBeGreaterThan(0);
    for (const g of [1, 2, 3, 4, 5, 6]) {
      if (!availableGrades.includes(g)) expect(pathOrderFor(g)).toEqual([]);
    }
    expect(availableGrades).toContain(1);
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
  const mapProps = (over: Partial<Parameters<typeof MapScreen>[0]> = {}) => ({
    states: {},
    nextId: pathOrder[0] as string,
    xp: 0,
    level: 1,
    streak: 0,
    grade: 1,
    nextStepLabel: 'Learn',
    reviews: [],
    onOpen: () => {},
    onReview: () => {},
    onMaster: () => {},
    onTestOut: () => {},
    onSkipUnit: () => {},
    onParent: () => {},
    onBadges: () => {},
    ...over,
  });

  /**
   * Bug nyata yang sampai ke tangan anak: dia menjawab 100% benar di "Add to 10"
   * tapi lambat, jadi statusnya `practiced`. Karena `practiced` ikut dihitung
   * "cleared", menekan nodenya membuka lembar "sudah selesai" — isinya Quick Review
   * dan Master Round. Padahal Master Round menuntut ≤3 detik, LEBIH ketat daripada
   * ambang 8 detik yang belum dia lewati, dan Speed Round (satu-satunya sesi yang
   * bisa menaikkan practiced → mastered) tidak punya tombol di mana pun.
   *
   * Enginenya benar sejak awal: `nextStepFor` mengembalikan 'speed'. Yang putus
   * navigasinya — dan tidak ada satu pun test yang menekan node itu.
   */
  const practicedState: ModuleState = {
    status: 'practiced',
    stars: 0,
    reviewStage: 0,
    consecutiveFails: 0,
    attempts: [],
    totals: { sessions: 3, questions: 28, correct: 28 },
  };

  it('modul practiced membuka Speed Round, bukan lembar "sudah selesai"', () => {
    const onOpen = vi.fn();
    const onMaster = vi.fn();
    const first = pathOrder[0] as string;
    render(
      <MapScreen
        {...mapProps({
          states: { [first]: practicedState },
          nextId: pathOrder[1] as string,
          onOpen,
          onMaster,
        })}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: moduleById(first).title }));
    expect(onOpen).toHaveBeenCalledWith(first);
    // Lembar yang menawarkan Master Round tidak boleh terbuka sama sekali.
    expect(screen.queryByRole('button', { name: /Master Round/i })).not.toBeInTheDocument();
    expect(onMaster).not.toHaveBeenCalled();
  });

  it('node practiced mengatakan yang sebenarnya: belum selesai, dan belum berbintang', () => {
    const first = pathOrder[0] as string;
    render(
      <MapScreen
        {...mapProps({ states: { [first]: practicedState }, nextId: pathOrder[1] as string })}
      />,
    );
    expect(screen.getByText(/Speed Round/i)).toBeInTheDocument();
    // Nol bintang: node tidak boleh memasang ⭐ seolah sudah didapat.
    const node = screen.getByRole('button', { name: moduleById(first).title });
    expect(node.textContent).not.toContain('⭐');
  });

  it('Master Round hanya ditawarkan ke modul yang benar-benar sudah dikuasai', () => {
    const first = pathOrder[0] as string;
    const mastered: ModuleState = { ...practicedState, status: 'mastered', stars: 2 };
    render(
      <MapScreen
        {...mapProps({ states: { [first]: mastered }, nextId: pathOrder[1] as string })}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: moduleById(first).title }));
    expect(screen.getByRole('button', { name: /Master Round/i })).toBeInTheDocument();
  });

  it('pintu melompat dijelaskan dulu, tidak langsung menembak', () => {
    const onTestOut = vi.fn();
    const onSkipUnit = vi.fn();
    render(<MapScreen {...mapProps({ onTestOut, onSkipUnit })} />);

    // Tombolnya membuka penjelasan, bukan langsung memulai tes.
    fireEvent.click(screen.getByRole('button', { name: /skip ahead/i }));
    expect(onTestOut).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /skip just/i }));
    expect(onTestOut).toHaveBeenCalledWith(pathOrder[0]);
  });

  it('lompat satu unit ditawarkan di lembar yang sama', () => {
    const onSkipUnit = vi.fn();
    render(<MapScreen {...mapProps({ onSkipUnit })} />);
    fireEvent.click(screen.getByRole('button', { name: /skip ahead/i }));
    fireEvent.click(screen.getByRole('button', { name: /skip the whole/i }));
    expect(onSkipUnit).toHaveBeenCalledWith('g1-u1');
  });

  it('peta menunjukkan unit, bukan satu daftar panjang tanpa struktur', () => {
    render(<MapScreen {...mapProps()} />);
    // Muncul di kartu 'berikutnya' dan sebagai judul bagian — keduanya disengaja.
    expect(screen.getAllByText(/Unit 1 · Numbers to 10/).length).toBeGreaterThan(0);
  });

  it('urutan node di peta SAMA dengan urutan yang benar-benar ditempuh anak', async () => {
    const { pathOrderFor } = await import('../../content');
    render(<MapScreen {...mapProps()} />);
    // Peta hanya menampilkan kelas aktif.
    const titles = pathOrderFor(1).map((id) => moduleById(id).title);
    const rendered = screen
      .getAllByRole('button')
      .map((b) => b.getAttribute('aria-label') ?? '')
      .map((l) => l.replace(', locked', ''))
      .filter((l) => titles.includes(l));

    // Unit bentuk/ukur/pola sengaja disisipkan sebagai jeda, jadi satu unit bisa
    // muncul beberapa kali. Yang tidak boleh: modul ditarik keluar dari urutannya.
    expect(rendered).toEqual(titles);
  });

  it('unit yang sudah tuntas dilipat supaya yang penting tidak tenggelam', async () => {
    const { pathOrderFor } = await import('../../content');
    const ids = pathOrderFor(1).slice(0, 6);
    const done: ModuleState = {
      status: 'mastered',
      stars: 2,
      reviewStage: 1,
      consecutiveFails: 0,
      attempts: [],
      totals: { sessions: 2, questions: 20, correct: 20 },
    };
    const states: Record<string, ModuleState> = Object.fromEntries(
      ids.map((id) => [id, done]),
    );
    render(<MapScreen {...mapProps({ states, nextId: pathOrderFor(1)[6] as string })} />);

    // Unit 1 tuntas → dilipat jadi satu baris ringkasan, nodenya tidak lagi dirender.
    expect(screen.getByText(/All 6 done/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Count to 5' })).not.toBeInTheDocument();

    // Tapi bisa dibuka lagi.
    fireEvent.click(screen.getByText(/Unit 1 · Numbers to 10/));
    expect(screen.getByRole('button', { name: 'Count to 5' })).toBeInTheDocument();
  });

  it('baris ringkasan unit yang dilipat bisa ditekan, bukan cuma kata "Show"', async () => {
    // Barisnya berbentuk kartu bergaris — anak akan menekannya. Dulu tidak terjadi
    // apa-apa: satu-satunya kontrol adalah kata "Show" kecil di kanan atas.
    const { pathOrderFor } = await import('../../content');
    const ids = pathOrderFor(1).slice(0, 6);
    const done: ModuleState = {
      status: 'mastered',
      stars: 2,
      reviewStage: 1,
      consecutiveFails: 0,
      attempts: [],
      totals: { sessions: 2, questions: 20, correct: 20 },
    };
    const states: Record<string, ModuleState> = Object.fromEntries(ids.map((id) => [id, done]));
    render(<MapScreen {...mapProps({ states, nextId: pathOrderFor(1)[6] as string })} />);

    fireEvent.click(screen.getByRole('button', { name: /All 6 done/ }));
    expect(screen.getByRole('button', { name: 'Count to 5' })).toBeInTheDocument();
  });

  it('bagian tempat anak berada tidak pernah dilipat', async () => {
    const { pathOrderFor } = await import('../../content');
    render(<MapScreen {...mapProps({ nextId: pathOrderFor(1)[0] as string })} />);
    expect(screen.queryByText(/All 6 done/)).not.toBeInTheDocument();
  });

  it('penjelasan kunci muncul sekali, bukan di bawah setiap modul terkunci', async () => {
    // Diulang 35 kali di kelas 3, kalimat itu berubah jadi derau; peta jadi sulit
    // dipindai justru di kelas yang modulnya paling banyak.
    const { pathOrderFor } = await import('../../content');
    render(<MapScreen {...mapProps({ nextId: pathOrderFor(1)[0] as string })} />);
    expect(screen.getAllByText(/Finish the one before/)).toHaveLength(1);
  });

  it('kelas aktif terlihat di layar utama', () => {
    render(<MapScreen {...mapProps({ grade: 2 })} />);
    expect(screen.getByText('G2')).toBeInTheDocument();
  });

  it('pil kelas adalah jalan masuk mengganti kelas, bukan label mati', () => {
    // "Bagaimana cara pindah kelas?" adalah pertanyaan pertama orang tua, dan pil
    // berwarna aksen ini terlihat bisa ditekan. Ia harus benar-benar bisa.
    const onParent = vi.fn();
    render(<MapScreen {...mapProps({ grade: 3, onParent })} />);
    fireEvent.click(screen.getByRole('button', { name: /Grade 3/i }));
    expect(onParent).toHaveBeenCalled();
  });

  it('setiap node menjelaskan apa yang terjadi kalau ditekan', () => {
    render(<MapScreen {...mapProps()} />);
    expect(screen.getAllByText(/Tap to start/).length).toBeGreaterThan(0);
  });

  it('modul yang sudah selesai menanyakan mau diapakan, tidak langsung jalan', () => {
    const onReview = vi.fn();
    const onOpen = vi.fn();
    render(
      <MapScreen
        {...mapProps({
          onReview,
          onOpen,
          states: {
            [pathOrder[0] as string]: {
              status: 'mastered',
              stars: 2,
              reviewStage: 1,
              consecutiveFails: 0,
              attempts: [],
              totals: { sessions: 2, questions: 20, correct: 20 },
            },
          },
          nextId: pathOrder[1] as string,
        })}
      />,
    );
    // Nama harus persis: /Count to 5/ juga cocok dengan "Count to 50".
    fireEvent.click(screen.getByRole('button', { name: 'Count to 5' }));
    expect(onOpen).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /Quick Review/ }));
    expect(onReview).toHaveBeenCalledWith(pathOrder[0]);
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
        onMaster={() => {}}
        onSkipUnit={() => {}}
        onOpen={() => {}}
        onTestOut={() => {}}
        onParent={() => {}}
        onBadges={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: /Count to 10, locked/ })).toBeDisabled();
  });
});

describe('QuestionScreen — soal tanpa gambar tidak boleh terlihat kosong', () => {
  // Regresi visual: pada soal fakta murni (7 × 8 = ?) tidak ada gambar apa pun,
  // sehingga separuh layar kosong dan terbaca seperti halaman yang gagal dimuat.
  const factDef = moduleById('g3-u2-m8'); // Times Table Check — semua aturannya angka saja

  const renderQ = (id: string) =>
    render(
      <QuestionScreen
        session={createSession(moduleById(id), 'quiz', 7, 0)}
        onSession={() => {}}
        onFinish={() => {}}
        onExit={() => {}}
      />,
    );

  it('menaruh Gan di ruang kosong', () => {
    renderQ(factDef.id);
    expect(screen.getAllByRole('img', { name: /Gan the fox/ })).toHaveLength(1);
    expect(screen.getByRole('img', { name: /Gan the fox/ }).getAttribute('width')).toBe('190');
  });

  it('tidak menampilkan dua Gan sekaligus saat soal punya gambar', () => {
    renderQ('g1-u7-m4'); // Tell the Time — tiap soal membawa gambar jam
    const gans = screen.getAllByRole('img', { name: /Gan the fox/ });
    expect(gans).toHaveLength(1);
    expect(gans[0]?.getAttribute('width')).toBe('40');
  });
});

/**
 * Bug nyata: di Grade 1 "Flat Shapes" layar pertama meminta "Tap the three corners",
 * tapi bangunnya digambar sebagai gambar mati. Tombol Next tidak pernah aktif, jadi
 * anak terjebak di layar itu — tidak bisa lanjut, tidak bisa apa-apa selain keluar.
 */
describe('LearnScreen — setiap langkah yang meminta aksi harus bisa diselesaikan', () => {
  it('sudut segitiga di g1-u6-m1 bisa disentuh sampai Next terbuka', () => {
    const done = vi.fn();
    const mod = moduleById('g1-u6-m1');
    expect(mod).toBeTruthy();
    render(<LearnScreen module={mod!} onDone={done} onExit={() => {}} />);

    const next = screen.getByRole('button', { name: /next|start/i });
    expect(next).toBeDisabled();

    const corners = screen.getAllByRole('button', { name: /^Corner \d/ });
    expect(corners).toHaveLength(3);
    for (const c of corners) fireEvent.click(c);
    expect(next).not.toBeDisabled();

    // Menyentuh sudut yang sama dua kali tidak boleh menghitung dua kali.
    fireEvent.click(corners[0]!);
    expect(screen.getAllByRole('button', { name: /Corner \d, counted/ })).toHaveLength(3);
  });

  it('sisi persegi di g1-u6-m3 dihitung per sisi, bukan per sudut', () => {
    const mod = moduleById('g1-u6-m3');
    render(<LearnScreen module={mod!} onDone={() => {}} onExit={() => {}} />);
    const sides = screen.getAllByRole('button', { name: /^Side \d/ });
    expect(sides).toHaveLength(4);
    const next = screen.getByRole('button', { name: /next|start/i });
    for (const s of sides) fireEvent.click(s);
    expect(next).not.toBeDisabled();
  });

  /**
   * Linter konten (aturan `learn-action`) memakai tabel ACTION_VISUALS untuk menolak
   * aksi di atas manipulatif yang tidak bisa menerimanya. Tabel itu hanya berguna
   * kalau isinya benar — jadi tabelnya diuji di sini terhadap layar yang sebenarnya,
   * bukan dipercaya begitu saja.
   */
  it('ACTION_VISUALS jujur: manipulatif di tabel memang mengirim nilai balik', () => {
    const samples: Record<string, LearnVisual> = {
      'counter-objects': { kind: 'counter-objects', count: 3 },
      'ten-frame': { kind: 'ten-frame', value: 0 },
      shape2d: { kind: 'shape2d', name: 'triangle', showCorners: true, tap: 'corners' },
      'number-line': { kind: 'number-line', min: 0, max: 10, value: null },
    };
    for (const kinds of Object.values(ACTION_VISUALS)) {
      for (const kind of kinds) {
        const visual = samples[kind];
        expect(visual, `tidak ada contoh visual "${kind}"`).toBeTruthy();
        const onValue = vi.fn();
        const { unmount } = render(
          <LearnVisualView visual={visual!} value={0} onValue={onValue} interactive />,
        );
        if (kind === 'number-line') {
          // Garis bilangan digeser, bukan ditekan: `role="slider"` hanya muncul
          // kalau layar benar-benar memberinya onChange. Itu buktinya.
          expect(screen.getByRole('slider'), 'garis bilangan tidak bisa digeser').toBeTruthy();
        } else {
          const controls = screen.queryAllByRole('button');
          expect(controls.length, `visual "${kind}" tidak punya kontrol apa pun`).toBeGreaterThan(0);
          fireEvent.click(controls[0]!);
          expect(onValue, `visual "${kind}" tidak mengirim nilai balik`).toHaveBeenCalled();
        }
        unmount();
      }
    }
  });
});

/**
 * Bug nyata (audit usability Grade 1–6): di modul dengan gambar tinggi (balok 3D,
 * jaring bangun) isi layar soal melebihi tinggi layar. Karena tinggi layarnya tidak
 * dibatasi, HALAMAN yang memanjang — tombol Check ikut turun sampai separuhnya di
 * bawah layar 393×873, dan anak harus menggulung halaman yang tidak terlihat bisa
 * digulung untuk mengirim jawabannya.
 *
 * jsdom tidak punya tata letak, jadi yang dikunci di sini adalah keputusan CSS-nya:
 * layar dibatasi tinggi layar, isinya yang menggulung, dan tombol jawaban tinggal
 * di luar area gulung itu.
 */
describe('layar soal & materi tidak boleh melebihi tinggi layar', () => {
  const shell = (c: HTMLElement) => c.firstElementChild as HTMLElement;

  it('layar soal: badan menggulung, keypad tetap di tempatnya', () => {
    const s = createSession(moduleById(pathOrder[0] as string), 'practice', 1, 0);
    const { container } = render(
      <QuestionScreen session={s} onSession={() => {}} onFinish={() => {}} onExit={() => {}} />,
    );
    expect(shell(container).className).toContain('h-full');
    expect(shell(container).className).not.toContain('min-h-full');

    const main = container.querySelector('main') as HTMLElement;
    expect(main.className).toContain('overflow-y-auto');
    expect(main.className).toContain('min-h-0');
    // `justify-end` mendorong bagian atas isi keluar batas gulung dan tidak bisa
    // digulung balik — ruang kosongnya harus dibuat dengan margin auto.
    expect(main.className).not.toContain('justify-end');
    expect((main.firstElementChild as HTMLElement).className).toContain('mt-auto');
  });

  it('layar materi: sama, dan isinya dipusatkan lewat margin auto', () => {
    const { container } = render(
      <LearnScreen module={moduleById('g1-u6-m1')} onDone={() => {}} onExit={() => {}} />,
    );
    expect(shell(container).className).toContain('h-full');
    const main = container.querySelector('main') as HTMLElement;
    expect(main.className).not.toContain('justify-center');
    expect((main.firstElementChild as HTMLElement).className).toContain('m-auto');
  });

  it('kotak jawaban ketik menempel pada keypad, bukan ikut menggulung', () => {
    // Modul berjawaban ketik yang sungguhan — kalau tidak, test ini lulus
    // hanya karena kotaknya memang tidak pernah dirender.
    const typedId = pathOrder.find((id) =>
      moduleById(id).questionTypes.some((t) => t === 'keypad' || t === 'missing-number'),
    );
    expect(typedId).toBeTruthy();
    const s = createSession(moduleById(typedId as string), 'practice', 3, 0);
    const { container } = render(
      <QuestionScreen session={s} onSession={() => {}} onFinish={() => {}} onExit={() => {}} />,
    );
    const box = container.querySelector('[aria-live="polite"]');
    expect(box).not.toBeNull();
    expect(box?.closest('main')).toBeNull();
  });
});
