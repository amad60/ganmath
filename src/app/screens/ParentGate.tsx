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
      {/* Kotak jawaban, bukan teks telanjang: sebelumnya menampilkan em-dash yang
          terbaca sebagai garis nyasar di bawah soal. */}
      <div
        className="mb-3 flex h-12 w-28 items-center justify-center rounded-[var(--r-sm)] text-2xl font-black"
        style={{
          background: 'var(--c-surface)',
          border: '2px solid var(--c-line)',
          color: typed ? 'var(--c-ink)' : 'var(--c-locked)',
        }}
        aria-live="polite"
      >
        {typed || '?'}
      </div>
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
