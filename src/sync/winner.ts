/**
 * Siapa yang menang saat dua HP menulis progress.
 *
 * Menggabungkan dua riwayat penguasaan menghasilkan data yang tidak bisa dipercaya
 * (docs/tech/storage.md). Jadi cloud sync = ganti total, pemenangnya yang
 * `updatedAt`-nya lebih baru. Satu anak, dua HP: yang terakhir menutup sesi menang.
 *
 * Kecuali HP baru yang baru diisi nama: `updatedAt`-nya selalu lebih baru, tapi
 * modulnya kosong. Itu tidak boleh menimpa Grade 1 yang sudah di cloud.
 */
export function winningSide(
  localAt: string,
  cloudAt: string,
): 'local' | 'cloud' | 'same' {
  if (localAt === cloudAt) return 'same';
  return localAt > cloudAt ? 'local' : 'cloud';
}

export function looksFresh(modules: Record<string, unknown>): boolean {
  return Object.keys(modules).length === 0;
}

export function winningState(
  local: { updatedAt: string; modules: Record<string, unknown> },
  cloud: { updatedAt: string; modules: Record<string, unknown> },
): 'local' | 'cloud' | 'same' {
  const localFresh = looksFresh(local.modules);
  const cloudFresh = looksFresh(cloud.modules);
  if (localFresh && !cloudFresh) return 'cloud';
  if (!localFresh && cloudFresh) return 'local';
  return winningSide(local.updatedAt, cloud.updatedAt);
}
