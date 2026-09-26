import { useState } from 'react';
import { Button } from '../../components/ui';
import { useProgress } from '../../store/progress';
import { reconcile, redeemPairingCode } from '../../sync/cloud';

export type CloudSignInProps = {
  /** Setelah masuk: progress cloud sudah diterapkan kalau ada. */
  onRestored?: () => void;
  submitLabel?: string;
};

const FIELD =
  'bg-surface mt-1 w-full rounded-[var(--r-sm)] border-2 border-[var(--c-line)] px-3 py-3 text-[18px] font-bold';

/**
 * HP baru mengetik kode yang tampil di Parent Area HP lama.
 * Jangan ketuk tautan email: di iOS itu membuka Chrome/Safari, bukan PWA.
 */
export function CloudSignIn({ onRestored, submitLabel = 'Load progress' }: CloudSignInProps) {
  const replaceAll = useProgress((s) => s.replaceAll);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-ink-soft text-[15px]">
        On the other phone: Parent Area → Show a code. Type that code here. Do
        not tap email links — they open the wrong browser.
      </p>
      <label className="text-[16px] font-bold">
        6-digit code
        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className={`${FIELD} text-center text-2xl font-black tracking-[0.4em]`}
          placeholder="000000"
          aria-label="6-digit code"
        />
      </label>
      <Button
        full
        disabled={busy || code.length !== 6}
        onClick={() => {
          setBusy(true);
          setError(null);
          void (async () => {
            try {
              const verified = await redeemPairingCode(code);
              if (!verified.ok) {
                setError(verified.error);
                return;
              }
              const local = useProgress.getState().data;
              const result = await reconcile(local);
              if (!result.ok) {
                setError(result.error);
                return;
              }
              if (result.action === 'applied-cloud') replaceAll(result.state);
              setCode('');
              onRestored?.();
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Something went wrong.');
            } finally {
              setBusy(false);
            }
          })();
        }}
      >
        {submitLabel}
      </Button>
      {error ? (
        <p className="text-[15px] font-bold" style={{ color: 'var(--c-retry)' }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
