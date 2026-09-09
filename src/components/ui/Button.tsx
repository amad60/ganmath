import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

type Variant = 'primary' | 'answer' | 'ghost' | 'danger';
export type Feedback = 'idle' | 'selected' | 'correct' | 'retry' | 'reveal';

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> & {
  variant?: Variant;
  feedback?: Feedback;
  full?: boolean;
  /**
   * Ukuran huruf dalam px. WAJIB lewat prop ini, bukan className: `text-[21px]`
   * di className akan bertabrakan dengan ukuran bawaan varian, dan pemenangnya
   * ditentukan urutan di file CSS — bukan urutan className. Ini bug yang sama
   * yang dulu membuat warna umpan balik jawaban tidak pernah muncul.
   */
  textSize?: number;
  children: ReactNode;
};

/**
 * Warna ditulis lewat `style`, BUKAN utility Tailwind.
 *
 * Versi pertama memakai `bg-surface` untuk varian dan `bg-correct` untuk umpan balik.
 * Keduanya utility background yang saling bertabrakan, dan pemenangnya ditentukan
 * urutan di file CSS — bukan urutan di className. Akibatnya warna benar/salah
 * sering tidak muncul sama sekali: anak menekan jawaban dan layar terlihat diam.
 */
const SIZES: Record<Variant, string> = {
  primary: 'h-16 px-6 text-xl',
  // min-h, bukan h: label tiga baris ("the right number of faces") terpotong
  // di dalam pil setinggi tetap. Tombol boleh tumbuh; yang tidak boleh adalah
  // teks yang tidak terbaca.
  answer: 'min-h-[66px] w-full py-2 text-[36px] leading-none',
  ghost: 'h-12 px-4 text-[15px]',
  danger: 'h-12 px-4 text-[15px]',
};

function colorsFor(variant: Variant, feedback: Feedback): CSSProperties {
  if (feedback === 'correct') {
    return { background: 'var(--c-correct)', color: '#fff', borderColor: 'var(--c-correct)' };
  }
  if (feedback === 'retry') {
    return { background: 'var(--c-retry)', color: '#fff', borderColor: 'var(--c-retry)' };
  }
  // `reveal` = jawaban benar yang ditunjukkan setelah anak salah. Bukan perayaan,
  // jadi warnanya lembut: mengajar, bukan menyorot kegagalan.
  if (feedback === 'reveal') {
    return {
      background: 'var(--c-correct-soft)',
      color: 'var(--c-ink)',
      borderColor: 'var(--c-correct)',
    };
  }
  if (feedback === 'selected') {
    return {
      background: 'var(--c-primary-soft)',
      color: 'var(--c-ink)',
      borderColor: 'var(--c-primary)',
    };
  }
  switch (variant) {
    case 'primary':
      return { background: 'var(--c-primary)', color: 'var(--c-primary-ink)', borderColor: 'transparent' };
    case 'danger':
      return { background: 'var(--c-danger)', color: '#fff', borderColor: 'transparent' };
    case 'ghost':
      // Tombol hantu tetap sebuah AKSI. Warna abu-abu membuatnya terbaca sebagai
      // keterangan, bukan sesuatu yang bisa ditekan.
      return { background: 'transparent', color: 'var(--c-primary)', borderColor: 'transparent' };
    default:
      return { background: 'var(--c-surface)', color: 'var(--c-ink)', borderColor: 'var(--c-line)' };
  }
}

export function Button({
  variant = 'primary',
  feedback = 'idle',
  full,
  textSize,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const active = feedback !== 'idle';
  const style: CSSProperties = {
    ...colorsFor(variant, feedback),
    borderWidth: variant === 'answer' || active ? 3 : 0,
    borderStyle: 'solid',
    boxShadow: variant === 'ghost' ? undefined : '0 4px 0 rgb(0 0 0 / 0.18)',
    transform: feedback === 'selected' ? 'translateY(3px)' : undefined,
    animation: feedback === 'retry' ? 'shake 300ms ease-out' : undefined,
    ...(textSize ? { fontSize: textSize, lineHeight: 1.1 } : {}),
  };

  return (
    <button
      type="button"
      data-feedback={feedback}
      {...rest}
      style={style}
      className={
        'relative inline-flex items-center justify-center gap-2 rounded-[var(--r-pill)] font-black ' +
        'transition-[transform,box-shadow,background-color] duration-100 ease-out select-none ' +
        'active:translate-y-[3px] active:shadow-[var(--shadow-press)] ' +
        'disabled:opacity-40 disabled:active:translate-y-0 ' +
        'focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[var(--c-primary)] ' +
        `${SIZES[variant]} ${full ? 'w-full' : ''} ${className}`
      }
    >
      {children}
    </button>
  );
}
