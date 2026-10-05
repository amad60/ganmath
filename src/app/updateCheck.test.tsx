import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { checkForUpdate, type UpdateStatus } from './updateCheck';
import { ParentScreen } from './screens/ParentScreen';
import { createInitialState } from '../store/schema';

/** Service worker tiruan: cukup `state` + event `statechange`. */
function fakeWorker(state: ServiceWorkerState) {
  const target = new EventTarget() as EventTarget & { state: ServiceWorkerState };
  target.state = state;
  return target as unknown as ServiceWorker & { state: ServiceWorkerState };
}

function fakeReg(over: { waiting?: ServiceWorker | null; afterUpdate?: (r: Reg) => void; fail?: boolean } = {}) {
  const reg: Reg = {
    waiting: over.waiting ?? null,
    installing: null,
    update: vi.fn(async () => {
      if (over.fail) throw new Error('network');
      over.afterUpdate?.(reg);
    }),
  };
  return reg;
}
type Reg = { waiting: ServiceWorker | null; installing: ServiceWorker | null; update: () => Promise<void> };
const asReg = (r: Reg) => r as unknown as ServiceWorkerRegistration;

describe('checkForUpdate — menjawab "sudah terbaru?" dengan jujur', () => {
  it('tanpa service worker: unsupported, bukan "terbaru"', async () => {
    expect(await checkForUpdate(null, true)).toBe('unsupported');
  });

  it('versi yang sudah menunggu langsung available, tanpa ke jaringan', async () => {
    const reg = fakeReg({ waiting: fakeWorker('installed') });
    expect(await checkForUpdate(asReg(reg), false)).toBe('available');
    expect(reg.update).not.toHaveBeenCalled();
  });

  it('offline tidak pura-pura sudah terbaru', async () => {
    expect(await checkForUpdate(asReg(fakeReg()), false)).toBe('offline');
  });

  it('server tidak punya versi baru → latest', async () => {
    const reg = fakeReg();
    expect(await checkForUpdate(asReg(reg), true)).toBe('latest');
    expect(reg.update).toHaveBeenCalledOnce();
  });

  it('versi baru sedang diunduh → ditunggu sampai siap, lalu available', async () => {
    const worker = fakeWorker('installing');
    const reg = fakeReg({ afterUpdate: (r) => (r.installing = worker) });
    const result = checkForUpdate(asReg(reg), true);
    await Promise.resolve();
    await Promise.resolve();
    worker.state = 'installed';
    worker.dispatchEvent(new Event('statechange'));
    expect(await result).toBe('available');
  });

  it('unduhan yang macet berakhir error, tidak menggantung selamanya', async () => {
    const reg = fakeReg({ afterUpdate: (r) => (r.installing = fakeWorker('installing')) });
    expect(await checkForUpdate(asReg(reg), true, 10)).toBe('error');
  });

  it('jaringan gagal → error', async () => {
    expect(await checkForUpdate(asReg(fakeReg({ fail: true })), true)).toBe('error');
  });
});

describe('Parent Area — versi app dan tombol cek update', () => {
  const show = (status: UpdateStatus, needRefresh = false) => {
    const check = vi.fn();
    const apply = vi.fn();
    render(
      <ParentScreen
        data={createInitialState()}
        onGrade={() => {}}
        onSettings={() => {}}
        onImport={() => {}}
        onReset={() => {}}
        onBack={() => {}}
        appUpdate={{ status, needRefresh, check, apply }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Settings/i }));
    return { check, apply };
  };

  it('menampilkan versi build dan tombol cek', () => {
    const { check } = show('idle');
    expect(screen.getByText(new RegExp(`Version ${__APP_BUILD__.sha}`))).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Check for updates' }));
    expect(check).toHaveBeenCalledOnce();
  });

  it('sedang mengecek: tombol terkunci', () => {
    show('checking');
    expect(screen.getByRole('button', { name: 'Checking…' })).toBeDisabled();
  });

  it('sudah terbaru: dijawab terang', () => {
    show('latest');
    expect(screen.getByRole('status')).toHaveTextContent('You have the latest version.');
  });

  it('ada versi baru: tombol Update now memasangnya', () => {
    const { apply } = show('idle', true);
    expect(screen.getByText('A new version is ready.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Update now' }));
    expect(apply).toHaveBeenCalledOnce();
  });
});
