import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UnitIntroModal } from './UnitIntroModal';
import { GRADE_1_INTROS, GRADE_2_INTROS, GRADE_3_INTROS } from './unitIntroData';

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
