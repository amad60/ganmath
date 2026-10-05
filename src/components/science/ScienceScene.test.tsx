import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { ScienceScene, SCENE_SETTLE_MS } from './ScienceScene';
import type { ScienceSceneVisual } from '../../engine/types';

const change: ScienceSceneVisual = {
  mode: 'change',
  base: [{ icon: '🌱', x: 50, y: 60 }],
  options: [
    { icon: '💧', label: 'Water', caption: 'With water, the plant grows.', result: [{ icon: '🌿', x: 50, y: 60, fx: 'grow' }] },
    { icon: '🚫', label: 'No water', caption: 'No water, so it dries up.', result: [{ icon: '🥀', x: 50, y: 60, fx: 'droop' }] },
  ],
};

const predict: ScienceSceneVisual = {
  mode: 'predict',
  base: [{ icon: '☀️', x: 80, y: 20 }, { icon: '🍫', x: 50, y: 60 }],
  options: [
    { icon: '🧊', label: 'It gets hard', caption: 'It gets hard.' },
    { icon: '🫠', label: 'It melts', caption: 'The sun melts the chocolate.', result: [{ icon: '🫠', x: 50, y: 60 }] },
    { icon: '🌱', label: 'It grows', caption: 'It grows.' },
  ],
  correct: 1,
};

const parts: ScienceSceneVisual = {
  mode: 'tap-part',
  base: [
    { icon: '🌸', x: 50, y: 20, part: 0 },
    { icon: '', x: 50, y: 55, bar: { w: 3, h: 50, color: 'green' }, part: 1 },
  ],
  options: [
    { icon: '🌸', label: 'Flower', caption: 'A flower makes seeds.' },
    { icon: '🟩', label: 'Stem', caption: 'The stem holds the plant up.' },
  ],
};

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const settle = () =>
  act(() => {
    vi.advanceTimersByTime(SCENE_SETTLE_MS + 50);
  });

describe('ScienceScene — anak mengubah satu hal lalu melihat akibatnya', () => {
  it('change: keterangan muncul SETELAH gerak, dan nilai = pilihan berbeda yang dicoba', () => {
    const onValue = vi.fn();
    render(<ScienceScene visual={change} interactive onValue={onValue} />);
    fireEvent.click(screen.getByRole('button', { name: /No water/ }));
    // Gambarnya sudah berubah, tapi kalimatnya belum: mata anak ke gambar dulu.
    expect(screen.queryByText('No water, so it dries up.')).toBeNull();
    expect(onValue).not.toHaveBeenCalled();
    settle();
    expect(screen.getByText('No water, so it dries up.')).toBeTruthy();
    expect(onValue).toHaveBeenLastCalledWith(1);

    // Mengetuk tombol yang SAMA tidak menambah apa pun.
    fireEvent.click(screen.getByRole('button', { name: /No water/ }));
    settle();
    expect(onValue).toHaveBeenLastCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: /^💧/ }));
    settle();
    expect(onValue).toHaveBeenLastCalledWith(2);
    expect(screen.getByText('With water, the plant grows.')).toBeTruthy();
  });

  it('predict: tebakan salah tetap memutar hasil yang BENAR, dengan "Let\'s see!" bukan silang merah', () => {
    const onValue = vi.fn();
    render(<ScienceScene visual={predict} interactive onValue={onValue} />);
    fireEvent.click(screen.getByRole('button', { name: 'It grows' }));
    expect(screen.getByText("Let's see!")).toBeTruthy();
    settle();
    expect(screen.getByText('The sun melts the chocolate.')).toBeTruthy();
    expect(onValue).toHaveBeenCalledWith(1);
    // Sekali tebak: kartunya terkunci, tidak bisa mencoba sampai kena.
    expect(screen.getByRole('button', { name: 'It melts' })).toBeDisabled();
  });

  it('predict: tebakan benar diberi "Yes!"', () => {
    render(<ScienceScene visual={predict} interactive onValue={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'It melts' }));
    expect(screen.getByText('Yes!')).toBeTruthy();
  });

  it('tap-part: bagian yang disentuh menyala dan namanya muncul', () => {
    const onValue = vi.fn();
    render(<ScienceScene visual={parts} interactive onValue={onValue} />);
    const stem = screen.getByRole('button', { name: 'Stem' });
    fireEvent.click(stem);
    expect(stem.getAttribute('aria-pressed')).toBe('true');
    settle();
    expect(screen.getByText(/The stem holds the plant up/)).toBeTruthy();
    expect(onValue).toHaveBeenLastCalledWith(1);
    fireEvent.click(screen.getByRole('button', { name: 'Flower' }));
    settle();
    expect(onValue).toHaveBeenLastCalledWith(2);
  });

  it('still: gambar soal tanpa tombol dan tanpa memutar hasilnya', () => {
    render(<ScienceScene visual={predict} still />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(screen.queryByText('The sun melts the chocolate.')).toBeNull();
  });

  it('tidak interaktif: memutar setiap pilihan sekali, sendiri', () => {
    render(<ScienceScene visual={change} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    act(() => {
      vi.advanceTimersByTime(900 + SCENE_SETTLE_MS + 50);
    });
    expect(screen.getByText('With water, the plant grows.')).toBeTruthy();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText('No water, so it dries up.')).toBeTruthy();
  });
});
