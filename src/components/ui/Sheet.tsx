import type { ReactNode } from 'react';

export type SheetProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

/** Lembar bawah untuk konfirmasi (mis. menimpa progress saat impor file). */
export function Sheet({ open, title, onClose, children, footer }: SheetProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
        role="presentation"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="bg-surface safe-bottom relative w-full max-w-[430px] rounded-t-[var(--r-lg)] p-5 shadow-[var(--shadow-card)]"
      >
        <h2 className="mb-3 text-2xl font-black">{title}</h2>
        <div className="text-ink-soft text-[18px]">{children}</div>
        {footer ? <div className="mt-5 flex flex-col gap-3">{footer}</div> : null}
      </div>
    </div>
  );
}
