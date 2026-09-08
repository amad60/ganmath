import { BADGES, type BadgeId } from '../../engine/gamification';
import { Icon } from './Icon';

export type BadgeCardProps = { id: BadgeId; owned: boolean; size?: 'sm' | 'lg' };

/** Badge terkunci ditampilkan sebagai siluet bertanda tanya — memberi target tanpa membocorkan. */
export function BadgeCard({ id, owned, size = 'sm' }: BadgeCardProps) {
  const badge = BADGES[id];
  const box = size === 'lg' ? 'h-24 w-24 text-[44px]' : 'h-16 w-16 text-[30px]';
  return (
    <div className="flex w-[88px] flex-col items-center gap-1">
      <div
        className={`flex items-center justify-center rounded-[var(--r-md)] ${box}`}
        style={{
          background: owned ? 'var(--c-primary-soft)' : 'var(--c-surface-sunk)',
          filter: owned ? undefined : 'grayscale(1)',
          opacity: owned ? 1 : 0.55,
        }}
        aria-label={owned ? badge.title : 'Locked badge'}
      >
        {owned ? badge.icon : <Icon name="lock" size={size === 'lg' ? 30 : 22} color="var(--c-locked)" />}
      </div>
      {/* Tinggi label dikunci dua baris supaya kartu badge tidak naik-turun
          hanya karena judulnya lebih panjang. */}
      <span
        className="flex items-start justify-center text-center text-[13px] leading-tight font-bold"
        style={{ height: 30 }}
      >
        {owned ? badge.title : 'Locked'}
      </span>
    </div>
  );
}
