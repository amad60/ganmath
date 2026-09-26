import { useEffect, useState } from 'react';
import { Button } from '../../components/ui';
import { useProgress } from '../../store/progress';
import { cloudEnabled } from '../../sync/client';
import { createPairingCode, reconcile, signOutCloud, signedInEmail } from '../../sync/cloud';
import { CloudSignIn } from './CloudSignIn';

/**
 * Masuk akun orang tua. Anak tidak pernah melihat layar ini di peta — gerbang
 * perkalian sudah di depannya. HP baru juga bisa masuk dari layar nama.
 */
export function CloudSyncPanel() {
  const data = useProgress((s) => s.data);
  const replaceAll = useProgress((s) => s.replaceAll);

  const [signedIn, setSignedIn] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pairCode, setPairCode] = useState<string | null>(null);

  const refresh = async () => {
    setSignedIn(await signedInEmail());
  };

  useEffect(() => {
    void refresh();
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  const run = async (work: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await work();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  if (!cloudEnabled) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-black">Cloud sync</h2>
        <p className="text-ink-soft text-[15px]">
          Not set up on this build. File backup below still works.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-black">Cloud sync</h2>
      <p className="text-ink-soft text-[15px]">
        Same progress on every phone. The app saves after each lesson and loads
        the newest copy when you open it.
      </p>

      {signedIn ? (
        <>
          <p className="text-[16px] font-bold">Signed in as {signedIn}</p>
          {status ? <p className="text-ink-soft text-[15px]">{status}</p> : null}
          {pairCode ? (
            <div className="rounded-[var(--r-sm)] p-3 text-center" style={{ background: 'var(--c-primary-soft)' }}>
              <p className="text-[15px] font-bold">Type this on the other phone</p>
              <p className="mt-1 text-4xl font-black tracking-[0.3em]">{pairCode}</p>
              <p className="text-ink-soft mt-1 text-[14px]">Good for 10 minutes. Do not tap email links.</p>
            </div>
          ) : null}
          <Button
            full
            disabled={busy}
            onClick={() =>
              void run(async () => {
                const made = await createPairingCode();
                if (!made.ok) {
                  setError(made.error);
                  return;
                }
                setPairCode(made.code);
                setStatus(null);
              })
            }
          >
            Show a code
          </Button>
          <Button
            full
            disabled={busy}
            onClick={() =>
              void run(async () => {
                const result = await reconcile(data);
                if (!result.ok) {
                  setError(result.error);
                  return;
                }
                if (result.action === 'applied-cloud') {
                  replaceAll(result.state);
                  setStatus('Loaded newer progress from the cloud.');
                } else if (result.action === 'pushed') {
                  setStatus('Saved this phone to the cloud.');
                } else {
                  setStatus('Already in sync.');
                }
              })
            }
          >
            Sync now
          </Button>
          <Button
            variant="ghost"
            full
            disabled={busy}
            onClick={() =>
              void run(async () => {
                await signOutCloud();
                setSignedIn(null);
                setPairCode(null);
                setStatus(null);
              })
            }
          >
            Sign out
          </Button>
        </>
      ) : (
        <CloudSignIn
          submitLabel="Sign in"
          onRestored={() => {
            setStatus('This phone is now signed in.');
            void refresh();
          }}
        />
      )}

      {error ? (
        <p className="text-[15px] font-bold" style={{ color: 'var(--c-retry)' }}>
          {error}
        </p>
      ) : null}
    </section>
  );
}
