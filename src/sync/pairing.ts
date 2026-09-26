/** Kode 6 digit yang diketik orang tua di HP baru. */
export function randomPairingCode(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0]! % 1_000_000;
  return String(n).padStart(6, "0");
}

export const PAIRING_TTL_MS = 10 * 60 * 1000;
