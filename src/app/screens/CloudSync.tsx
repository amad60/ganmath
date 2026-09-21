import { useEffect, useState } from 'react';
import { Button } from '../../components/ui';
import { useProgress } from '../../store/progress';
import { cloudEnabled } from '../../sync/client';
import {
  reconcile,
  sendSignInCode,
  signOutCloud,
  signedInEmail,
  verifySignInCode,
} from '../../sync/cloud';

/**
 * Masuk akun orang tua. Anak tidak pernah melihat layar ini — gerbang perkalian
 * sudah di depannya. Satu email = progress yang sama di Poco dan iPhone.
 */
export function CloudSyncPanel() {
  const data = useProgress((s) => s.data);
  const replaceAll = useProgress((s) => s.replaceAll);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [signedIn, setSignedIn] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    setSignedIn(await signedInEmail());
  };

  useEffect(() => {
    void refresh();
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
        Same progress on every phone. Sign in with your email — the child never sees
        this.
      </p>

      {signedIn ? (
        <>
          <p className="text-[16px] font-bold">Signed in as {signedIn}</p>
          {status ? <p className="text-ink-soft text-[15px]">{status}</p> : null}
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
                setStatus(null);
              })
            }
          >
            Sign out
          </Button>
        </>
      ) : (
        <>
          <label className="text-[16px] font-bold">
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="bg-surface mt-1 w-full rounded-[var(--r-sm)] border-2 border-[var(--c-line)] px-3 py-3 text-[18px] font-bold"
              placeholder="you@email.com"
            />
          </label>
          <Button
            full
            disabled={busy || !email.includes('@')}
            onClick={() =>
              void run(async () => {
                const result = await sendSignInCode(email);
                if (!result.ok) {
                  setError(result.error);
                  return;
                }
                setSent(true);
                setStatus('Code sent. Check your email.');
              })
            }
          >
            Send sign-in code
          </Button>
          {sent ? (
            <>
              <label className="text-[16px] font-bold">
                6-digit code
                <input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="bg-surface mt-1 w-full rounded-[var(--r-sm)] border-2 border-[var(--c-line)] px-3 py-3 text-center text-2xl font-black tracking-[0.4em]"
                  placeholder="000000"
                />
              </label>
              <Button
                full
                disabled={busy || code.length !== 6}
                onClick={() =>
                  void run(async () => {
                    const verified = await verifySignInCode(email, code);
                    if (!verified.ok) {
                      setError(verified.error);
                      return;
                    }
                    const result = await reconcile(data);
                    if (result.ok && result.action === 'applied-cloud') {
                      replaceAll(result.state);
                      setStatus('Loaded progress from the other phone.');
                    } else if (result.ok) {
                      setStatus('This phone is now the cloud copy.');
                    } else {
                      setError(result.error);
                    }
                    await refresh();
                    setCode('');
                  })
                }
              >
                Sign in
              </Button>
            </>
          ) : null}
        </>
      )}

      {error ? (
        <p className="text-[15px] font-bold" style={{ color: 'var(--c-retry)' }}>
          {error}
        </p>
      ) : null}
    </section>
  );
}
