import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'answer' | 'ghost' | 'danger';
type Feedback = 'idle' | 'correct' | 'retry';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  feedback?: Feedback;
  full?: boolean;
  children: ReactNode;
};

/**
 * Tombol bergaya "tebal 3D": garis bawah gelap 4px yang hilang saat ditekan.
 * Umpan balik sentuh yang jelas tanpa animasi mahal, dan terasa mainan bukan formulir.
 * Tinggi 64px = ukuran wajib tombol jawaban (docs/design/design-system.md §6).
 */
const base =
  'relative inline-flex select-none items-center justify-center gap-2 rounded-[var(--r-pill)] ' +
  'font-black transition-[transform,box-shadow] duration-100 ease-out ' +
  'active:translate-y-[3px] disabled:opacity-40 disabled:active:translate-y-0 ' +
  'focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[var(--c-primary)]';

const variants: Record<Variant, string> = {
  primary: 'h-16 px-6 text-xl bg-primary text-primary-ink',
  answer: 'h-16 w-full text-[40px] leading-none bg-surface text-ink border-2 border-[var(--c-line)]',
  ghost: 'h-12 px-4 text-[15px] bg-transparent text-ink-soft',
  danger: 'h-12 px-4 text-[15px] bg-danger text-white',
};

const feedbacks: Record<Feedback, string> = {
  idle: '',
  correct: 'bg-correct text-white border-[var(--c-correct)]',
  // salah = oranye "try again", tidak pernah merah (docs/design/design-system.md §3)
  retry: 'bg-retry text-white border-[var(--c-retry)] animate-[shake_300ms_ease-out]',
};

const shadow = 'shadow-[0_4px_0_rgb(0_0_0/0.18)] active:shadow-[var(--shadow-press)]';

export function Button({
  variant = 'primary',
  feedback = 'idle',
  full,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const shadowCls = variant === 'ghost' ? '' : shadow;
  return (
    <button
      type="button"
      {...rest}
      className={`${base} ${variants[variant]} ${feedbacks[feedback]} ${shadowCls} ${full ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
