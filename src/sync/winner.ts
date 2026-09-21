/**
 * Siapa yang menang saat dua HP menulis progress.
 *
 * Menggabungkan dua riwayat penguasaan menghasilkan data yang tidak bisa dipercaya
 * (docs/tech/storage.md). Jadi cloud sync = ganti total, pemenangnya yang
 * `updatedAt`-nya lebih baru. Satu anak, dua HP: yang terakhir menutup sesi menang.
 */
export function winningSide(
  localAt: string,
  cloudAt: string,
): 'local' | 'cloud' | 'same' {
  if (localAt === cloudAt) return 'same';
  return localAt > cloudAt ? 'local' : 'cloud';
}
