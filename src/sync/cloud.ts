import { migrate } from '../store/migrations';
import type { ProgressState } from '../store/schema';
import { supabase } from './client';
import { winningSide } from './winner';

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

  const side = winningSide(local.updatedAt, cloudState.updatedAt);
  if (side === 'cloud') return { ok: true, action: 'applied-cloud', state: cloudState };
  if (side === 'local') {
    const pushed = await pushCloud(local);
    return pushed.ok ? { ok: true, action: 'pushed' } : { ok: false, error: pushed.error };
  }
  return { ok: true, action: 'same' };
}

export async function sendSignInCode(email: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!supabase) return { ok: false, error: 'Cloud sync is not set up.' };
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
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
