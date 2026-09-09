import type { CSSProperties, ReactNode } from 'react';
import { MAX_ANSWER_DIGITS } from '../../engine/types';
import { MINUS, isCompleteInput } from '../../engine/answer';
import { Button } from './Button';

export type KeypadProps = {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  /**
   * Lebar input, dalam digit. WAJIB diisi: default diam-diam adalah cara bug ini
   * lahir pertama kali — keypad berhenti di 3 digit sementara soalnya berjawaban
   * 9990, jadi soalnya buntu dan tidak ada yang tahu sampai anak mencobanya.
   *
   * Hanya DIGIT yang dihitung. Titik desimal dan tanda minus punya tombolnya
   * sendiri dan tidak memakan jatah lebar.
   */
  maxLength: number;
  /**
   * Tombol titik desimal / minus ditampilkan.
   *
   * Keduanya diturunkan per ATURAN SOAL, bukan per soal (lihat `answerCaps` di
   * `engine/generator.ts`). Kalau tombol minus hanya muncul pada soal yang
   * jawabannya kebetulan negatif, tombol itu sendiri sudah menjawab soalnya
   * sebelum anak sempat berpikir.
   */
  allowDecimal?: boolean;
  allowNegative?: boolean;
  disabled?: boolean;
};

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

/** Digit yang sudah diketik — tanda dan titik tidak memakan jatah lebar. */
export function digitsIn(value: string): number {
  return value.replace(MINUS, '').replace('.', '').length;
}

/**
 * Menambah satu digit.
 *
 * `0` di depan diganti, bukan ditumpuk: anak yang menekan 0 lalu 5 bermaksud "5",
 * bukan "05". Tapi `0.` harus tetap utuh — di sana nol-nya bermakna.
 */
export function pushDigit(value: string, digit: string, cap: number): string {
  if (digitsIn(value) >= cap) return value;
  if (value === '0') return digit;
  if (value === MINUS + '0') return MINUS + digit;
  return value + digit;
}

/**
 * Menambah titik desimal. Maksimal SATU per jawaban, dan tidak pernah menganggur
 * di depan: menekan titik pada input kosong menghasilkan `0.`, supaya yang dibaca
 * anak selalu berbentuk angka utuh dan bukan `.5`.
 */
export function pushDot(value: string, cap: number): string {
  if (!canDot(value, cap)) return value;
  if (value === '' || value === MINUS) return value + '0.';
  return value + '.';
}

/**
 * Titik hanya berguna kalau masih ada jatah digit untuk angka di belakangnya.
 * Tanpa syarat itu anak bisa terjebak pada `12.` yang tidak akan pernah sah.
 */
export function canDot(value: string, cap: number): boolean {
  return !value.includes('.') && digitsIn(value) + (value === '' || value === MINUS ? 1 : 0) < cap;
}

/**
 * Menyalakan/mematikan tanda minus. Ditulis sebagai sakelar, bukan sisipan:
 * minus dengan begitu SELALU berada di posisi paling depan, apa pun urutan
 * tombol yang ditekan anak — termasuk kalau dia baru teringat setelah mengetik.
 */
export function toggleMinus(value: string): string {
  return value.startsWith(MINUS) ? value.slice(MINUS.length) : MINUS + value;
}

/** Satu sel grid. Tombolnya sendiri tidak menerima `style` — lihat `Button`. */
function Cell({ at, children }: { at: CSSProperties; children: ReactNode }) {
  return <div style={at}>{children}</div>;
}

/** Keypad besar di layar — anak tidak pernah memakai keyboard sistem untuk angka. */
export function Keypad({
  value,
  onChange,
  onSubmit,
  maxLength,
  allowDecimal = false,
  allowNegative = false,
  disabled,
}: KeypadProps) {
  const cap = Math.min(MAX_ANSWER_DIGITS, Math.max(1, Math.trunc(maxLength)));
  const extras = (allowNegative ? 1 : 0) + (allowDecimal ? 1 : 0);
  const complete = isCompleteInput(value);

  const del = (
    <Button
      variant="answer"
      aria-label="Delete"
      disabled={disabled || value.length === 0}
      onClick={() => onChange(value.slice(0, -1))}
    >
      ⌫
    </Button>
  );
  const zero = (
    <Button
      variant="answer"
      aria-label="0"
      disabled={disabled}
      onClick={() => onChange(pushDigit(value, '0', cap))}
    >
      0
    </Button>
  );
  const check = (
    <Button
      variant="primary"
      aria-label="Check"
      className="h-16 w-full text-2xl"
      // Tidak cukup "ada isinya": `5.` dan `−` sendirian bukan angka. Mengirimnya
      // hanya menghasilkan salah yang bukan soal matematika.
      disabled={disabled || !complete}
      onClick={onSubmit}
    >
      ✓
    </Button>
  );

  // Tanpa tombol tambahan, tata letaknya tetap 3 kolom persis seperti dulu.
  if (extras === 0) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {DIGITS.map((k) => (
          <Button
            key={k}
            variant="answer"
            aria-label={k}
            disabled={disabled}
            onClick={() => onChange(pushDigit(value, k, cap))}
          >
            {k}
          </Button>
        ))}
        {del}
        {zero}
        {check}
      </div>
    );
  }

  /**
   * Dengan tombol tambahan, kolom keempat jadi RAK samping, disusun dari bawah
   * ke atas menurut seberapa sering dipakai: ✓ di pojok kanan bawah (tempat
   * jempol berhenti), ⌫ tepat di atasnya, lalu `.` dan `−` lebih tinggi lagi —
   * jauh dari zona jempol karena memang jarang ditekan, tapi tetap terlihat.
   *
   * Angka tetap utuh sebagai blok 3×3 di kiri: bentuk itu sudah dihafal jempol,
   * dan menggesernya demi dua tombol baru akan memperlambat semua soal lain.
   * `0` melebar mengisi sisa baris terakhir. Di layar 390px (padding 24px, gap
   * 12px) tiap kolom masih ±76px — jauh di atas target tap 44px.
   */
  const rail: ReactNode[] = [];
  if (allowNegative) {
    rail.push(
      <Button
        key="minus"
        variant="answer"
        aria-label="Minus"
        disabled={disabled}
        onClick={() => onChange(toggleMinus(value))}
      >
        {MINUS}
      </Button>,
    );
  }
  if (allowDecimal) {
    rail.push(
      <Button
        key="dot"
        variant="answer"
        aria-label="Point"
        disabled={disabled || !canDot(value, cap)}
        onClick={() => onChange(pushDot(value, cap))}
      >
        .
      </Button>,
    );
  }
  rail.push(del);

  return (
    <div className="grid grid-cols-4 gap-3">
      {DIGITS.map((k, i) => (
        <Cell key={k} at={{ gridRow: Math.floor(i / 3) + 1, gridColumn: (i % 3) + 1 }}>
          <Button
            variant="answer"
            aria-label={k}
            disabled={disabled}
            onClick={() => onChange(pushDigit(value, k, cap))}
          >
            {k}
          </Button>
        </Cell>
      ))}
      {rail.map((node, i) => (
        <Cell key={i} at={{ gridRow: 3 - (rail.length - 1 - i), gridColumn: 4 }}>
          {node}
        </Cell>
      ))}
      <Cell at={{ gridRow: 4, gridColumn: '1 / span 3' }}>{zero}</Cell>
      <Cell at={{ gridRow: 4, gridColumn: 4 }}>{check}</Cell>
    </div>
  );
}
