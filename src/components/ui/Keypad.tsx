import { MAX_ANSWER_DIGITS } from '../../engine/types';
import { Button } from './Button';

export type KeypadProps = {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  /**
   * Lebar input, dalam digit. WAJIB diisi: default diam-diam adalah cara bug ini
   * lahir pertama kali — keypad berhenti di 3 digit sementara soalnya berjawaban
   * 9990, jadi soalnya buntu dan tidak ada yang tahu sampai anak mencobanya.
   */
  maxLength: number;
  disabled?: boolean;
};

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

/** Keypad besar di layar — anak tidak pernah memakai keyboard sistem untuk angka. */
export function Keypad({ value, onChange, onSubmit, maxLength, disabled }: KeypadProps) {
  const cap = Math.min(MAX_ANSWER_DIGITS, Math.max(1, Math.trunc(maxLength)));
  const push = (d: string) => {
    if (value.length >= cap) return;
    onChange(value === '0' ? d : value + d);
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {KEYS.map((k) => (
        <Button key={k} variant="answer" aria-label={k} disabled={disabled} onClick={() => push(k)}>
          {k}
        </Button>
      ))}
      <Button
        variant="answer"
        aria-label="Delete"
        disabled={disabled || value.length === 0}
        onClick={() => onChange(value.slice(0, -1))}
      >
        ⌫
      </Button>
      <Button variant="answer" aria-label="0" disabled={disabled} onClick={() => push('0')}>
        0
      </Button>
      <Button
        variant="primary"
        aria-label="Check"
        className="h-16 w-full text-2xl"
        disabled={disabled || value.length === 0}
        onClick={onSubmit}
      >
        ✓
      </Button>
    </div>
  );
}
