import { migrate } from '../store/migrations';
import type { ProgressState } from '../store/schema';
import { supabase } from './client';
import { PAIRING_TTL_MS, randomPairingCode } from './pairing';
import { winningState } from './winner';

export type ReconcileResult =
  | { ok: true; action: 'applied-cloud'; state: ProgressState }
  | { ok: true; action: 'pushed' | 'same' | 'signed-out' | 'disabled' }
  | { ok: false; error: string };

type CloudRow = { state: unknown; updated_at: string };

async function currentUserId(): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user.id;
}

function parseState(raw: unknown): ProgressState | null {
  const migrated = migrate(raw);
  return migrated.ok ? migrated.state : null;
}

export async function pushCloud(state: ProgressState): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!supabase) return { ok: false, error: 'Cloud sync is not set up.' };
  const userId = await currentUserId();
  if (!userId) return { ok: false, error: 'Not signed in.' };
  const { error } = await supabase.from('progress').upsert({
    user_id: userId,
    state,
    updated_at: state.updatedAt,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function reconcile(local: ProgressState): Promise<ReconcileResult> {
  if (!supabase) return { ok: true, action: 'disabled' };
  const userId = await currentUserId();
  if (!userId) return { ok: true, action: 'signed-out' };

  const { data, error } = await supabase
    .from('progress')
    .select('state, updated_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) return { ok: false, error: error.message };

  const row = data as CloudRow | null;
  if (!row) {
    const pushed = await pushCloud(local);
    return pushed.ok ? { ok: true, action: 'pushed' } : { ok: false, error: pushed.error };
  }

  const cloudState = parseState(row.state);
  if (!cloudState) return { ok: false, error: 'Cloud copy could not be read.' };

  const side = winningState(local, cloudState);
  if (side === 'cloud') return { ok: true, action: 'applied-cloud', state: cloudState };
  if (side === 'local') {
    const pushed = await pushCloud(local);
    return pushed.ok ? { ok: true, action: 'pushed' } : { ok: false, error: pushed.error };
  }
  return { ok: true, action: 'same' };
}

export async function sendSignInCode(email: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!supabase) return { ok: false, error: 'Cloud sync is not set up.' };
  const redirect =
    typeof window !== 'undefined' ? window.location.origin : 'https://ganmath.netlify.app';
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true, emailRedirectTo: redirect },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function verifySignInCode(
  email: string,
  token: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!supabase) return { ok: false, error: 'Cloud sync is not set up.' };
  const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function signOutCloud(): Promise<void> {
  await supabase?.auth.signOut();
}

export async function signedInEmail(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.email ?? null;
}

/** Kode 6 digit tampil di HP yang sudah masuk — diketik di PWA HP baru. */
export async function createPairingCode(): Promise<
  { ok: true; code: string; expiresAt: string } | { ok: false; error: string }
> {
  if (!supabase) return { ok: false, error: 'Cloud sync is not set up.' };
  const userId = await currentUserId();
  if (!userId) return { ok: false, error: 'Not signed in.' };
  await supabase.from('pairing_codes').delete().eq('user_id', userId);
  const expiresAt = new Date(Date.now() + PAIRING_TTL_MS).toISOString();
  for (let i = 0; i < 5; i++) {
    const code = randomPairingCode();
    const { error } = await supabase.from('pairing_codes').insert({
      code,
      user_id: userId,
      expires_at: expiresAt,
    });
    if (!error) return { ok: true, code, expiresAt };
    if (error.code !== '23505') return { ok: false, error: error.message };
  }
  return { ok: false, error: 'Could not make a code. Try again.' };
}

export async function redeemPairingCode(
  code: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!supabase) return { ok: false, error: 'Cloud sync is not set up.' };
  const digits = code.replace(/\D/g, '').slice(0, 6);
  if (digits.length !== 6) return { ok: false, error: 'Type the 6-digit code.' };
  const { data, error } = await supabase.functions.invoke('redeem-pairing', {
    body: { code: digits },
  });
  if (error) {
    let message = error.message;
    try {
      const ctx = 'context' in error ? (error as { context: Response }).context : null;
      if (ctx && typeof ctx.json === 'function') {
        const body = (await ctx.json()) as { error?: string };
        if (body.error) message = body.error;
      }
    } catch {
      /* keep Functions error text */
    }
    return { ok: false, error: message };
  }
  const payload = data as { error?: string; token_hash?: string } | null;
  if (!payload || payload.error || !payload.token_hash) {
    return { ok: false, error: payload?.error ?? 'That code is wrong or expired.' };
  }
  const verified = await supabase.auth.verifyOtp({
    token_hash: payload.token_hash,
    type: 'email',
  });
  if (verified.error) return { ok: false, error: verified.error.message };
  return { ok: true };
}
