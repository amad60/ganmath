import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UnitIntroModal } from './UnitIntroModal';
import {
  GRADE_1_INTROS,
  GRADE_2_INTROS,
  GRADE_3_INTROS,
  GRADE_4_INTROS,
  GRADE_5_INTROS,
  GRADE_6_INTROS,
  READ_INTROS,
  SCIENCE_INTROS,
} from './unitIntroData';

describe('UnitIntroModal — animasi dan panduan unit', () => {
  it('semua unit Grade 1 (g1-u1 s.d. g1-u8) punya data animasi intro', () => {
    for (let u = 1; u <= 8; u++) {
      const unitId = `g1-u${u}`;
      const intro = GRADE_1_INTROS[unitId];
      expect(intro).toBeDefined();
      expect(intro?.title).toContain(`Unit ${u}`);
      expect(intro?.concept.length).toBeGreaterThan(10);
    }
  });

  it('semua unit Grade 2 (g2-u1 s.d. g2-u7) punya data animasi intro', () => {
    for (let u = 1; u <= 7; u++) {
      const unitId = `g2-u${u}`;
      const intro = GRADE_2_INTROS[unitId];
      expect(intro).toBeDefined();
      expect(intro?.title).toContain(`Unit ${u}`);
      expect(intro?.concept.length).toBeGreaterThan(10);
    }
  });

  it('semua unit Grade 3 (g3-u1 s.d. g3-u7) punya data animasi intro', () => {
    for (let u = 1; u <= 7; u++) {
      const unitId = `g3-u${u}`;
      const intro = GRADE_3_INTROS[unitId];
      expect(intro).toBeDefined();
      expect(intro?.title).toContain(`Unit ${u}`);
      expect(intro?.concept.length).toBeGreaterThan(10);
    }
  });

  it('semua unit Grade 4 (g4-u1 s.d. g4-u7) punya data animasi intro', () => {
    for (let u = 1; u <= 7; u++) {
      const unitId = `g4-u${u}`;
      const intro = GRADE_4_INTROS[unitId];
      expect(intro).toBeDefined();
      expect(intro?.title).toContain(`Unit ${u}`);
      expect(intro?.concept.length).toBeGreaterThan(10);
    }
  });

  it('semua unit Grade 5 (g5-u1 s.d. g5-u7) punya data animasi intro', () => {
    for (let u = 1; u <= 7; u++) {
      const unitId = `g5-u${u}`;
      const intro = GRADE_5_INTROS[unitId];
      expect(intro).toBeDefined();
      expect(intro?.title).toContain(`Unit ${u}`);
      expect(intro?.concept.length).toBeGreaterThan(10);
    }
  });

  it('semua unit Grade 6 (g6-u1 s.d. g6-u7) punya data animasi intro', () => {
    for (let u = 1; u <= 7; u++) {
      const unitId = `g6-u${u}`;
      const intro = GRADE_6_INTROS[unitId];
      expect(intro).toBeDefined();
      expect(intro?.title).toContain(`Unit ${u}`);
      expect(intro?.concept.length).toBeGreaterThan(10);
    }
  });

  it('semua unit Read Track punya data animasi intro (r1 sampai r4)', () => {
    const readUnitIds = [
      'r1-u1', 'r1-u2', 'r1-u3', 'r1-u4',
      'r2-u1', 'r2-u2', 'r2-u3', 'r2-u4',
      'r3-u1', 'r3-u2', 'r3-u3', 'r3-u4',
      'r4-u1', 'r4-u2', 'r4-u3', 'r4-u4',
    ];
    for (const unitId of readUnitIds) {
      const intro = READ_INTROS[unitId];
      expect(intro).toBeDefined();
      expect(intro?.title).toBeDefined();
      expect(intro?.concept.length).toBeGreaterThan(10);
    }
  });

  it('semua unit Science Level 1 sampai 6 punya intro', () => {
    for (const level of [1, 2, 3, 4, 5, 6]) {
      for (let n = 1; n <= 10; n++) {
        const intro = SCIENCE_INTROS[`s${level}-u${n}`];
        expect(intro?.title).toContain('Unit');
        expect(intro?.concept.length).toBeGreaterThan(10);
      }
    }
  });

  it('merender modal intro Read dengan animasi dan tombol', () => {
    render(<UnitIntroModal unitId="r1-u1" onClose={() => {}} />);
    expect(screen.getByText(/Who, Where & What/)).toBeInTheDocument();
    expect(screen.getByText(/Characters & Settings/)).toBeInTheDocument();
    expect(screen.getByText(/Spot who is in the story/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Let's Go! 🚀" })).toBeInTheDocument();
  });

  it('merender intro unit baru Level 2 dan Level 4', () => {
    const { unmount } = render(<UnitIntroModal unitId="r2-u4" onClose={() => {}} />);
    expect(screen.getByText(/Which Detail Fits/)).toBeInTheDocument();
    unmount();
    render(<UnitIntroModal unitId="r4-u1" onClose={() => {}} />);
    expect(screen.getByText(/Same and Different/)).toBeInTheDocument();
    expect(screen.getByText(/Read both texts/)).toBeInTheDocument();
  });

  it('merender modal intro dengan benar saat unitId aktif', () => {
    let closed = false;
    render(
      <UnitIntroModal
        unitId="g1-u1"
        onClose={() => {
          closed = true;
        }}
      />,
    );

    expect(screen.getByText(/Unit 1 · Numbers to 10/)).toBeInTheDocument();
    expect(screen.getByText(/Counting & Subitizing/)).toBeInTheDocument();
    expect(screen.getByText(/Tap and count things one by one/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Let's Go! 🚀" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(closed).toBe(true);
  });

  it('tombol Replay memicu refresh animasi', () => {
    render(<UnitIntroModal unitId="g1-u2" onClose={() => {}} />);
    const replayBtn = screen.getByRole('button', { name: /Replay/i });
    expect(replayBtn).toBeInTheDocument();
    fireEvent.click(replayBtn);
  });
});
