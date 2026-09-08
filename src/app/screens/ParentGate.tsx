import { useState } from 'react';
import { Button, Keypad, Sheet } from '../../components/ui';

export type ParentGateProps = {
  open: boolean;
  onPass: () => void;
  onClose: () => void;
};

/**
 * Gerbang sederhana: soal perkalian dewasa. Bukan keamanan sungguhan — tujuannya
 * hanya memastikan yang menekan "Reset progress" bukan anak 6 tahun.
 */
export function ParentGate({ open, onPass, onClose }: ParentGateProps) {
  const [a] = useState(() => 12 + Math.floor(Math.random() * 8));
  const [b] = useState(() => 3 + Math.floor(Math.random() * 6));
  const [typed, setTyped] = useState('');
  const [wrong, setWrong] = useState(false);

  const submit = () => {
    if (Number(typed) === a * b) return onPass();
    setWrong(true);
    setTyped('');
  };

  return (
    <Sheet open={open} title="For grown-ups" onClose={onClose}>
      <p className="mb-3 text-2xl font-black" style={{ color: 'var(--c-ink)' }}>
        {a} × {b} = ?
      </p>
      <p className="mb-3 text-[18px]">{typed || '—'}</p>
      {wrong ? (
        <p className="mb-3 text-[18px] font-bold" style={{ color: 'var(--c-retry)' }}>
          Not quite.
        </p>
      ) : null}
      <Keypad value={typed} onChange={setTyped} onSubmit={submit} maxLength={4} />
      <div className="mt-3">
        <Button variant="ghost" full onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Sheet>
  );
}
