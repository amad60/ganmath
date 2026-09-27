import { useState } from 'react';

export type SequenceCardItem = {
  text: string;
  icon?: string;
};

export type SequenceCardsProps = {
  cards: SequenceCardItem[];
  order?: number[];
  onChange?: (newOrder: number[]) => void;
  interactive?: boolean;
};

/**
 * Mekanik 2 Literasi: Pengurut Alur Waktu (Sequence Sorter - Beginning, Middle, End).
 *
 * Anak menyusun urutan peristiwa dengan menukar/memilih kartu 1, 2, 3.
 */
export function SequenceCards({
  cards,
  order: controlledOrder,
  onChange,
  interactive = true,
}: SequenceCardsProps) {
  const [internalOrder, setInternalOrder] = useState<number[]>(() => cards.map((_, i) => i));
  const order = controlledOrder ?? internalOrder;

  const move = (fromIdx: number, toIdx: number) => {
    if (!interactive || toIdx < 0 || toIdx >= cards.length) return;
    const next = [...order];
    const [moved] = next.splice(fromIdx, 1);
    if (moved != null) {
      next.splice(toIdx, 0, moved);
      setInternalOrder(next);
      onChange?.(next);
    }
  };

  const STAGE_LABELS = ['First (Awal)', 'Next (Tengah)', 'Last (Akhir)'];

  return (
    <div className="flex w-full max-w-[390px] flex-col gap-2.5">
      {order.map((cardIndex, slotIdx) => {
        const card = cards[cardIndex];
        if (!card) return null;

        return (
          <div
            key={`${cardIndex}-${slotIdx}`}
            className="flex items-center gap-3 rounded-[var(--r-md)] border-2 border-[var(--c-line)] bg-white p-3 shadow-xs"
          >
            <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-[var(--c-primary-soft)] font-black text-[var(--c-primary)]">
              <span className="text-xs">{slotIdx + 1}</span>
            </div>

            <div className="flex flex-1 flex-col">
              <span className="text-[11px] font-black tracking-wide text-ink-soft uppercase">
                {STAGE_LABELS[slotIdx] ?? `Step ${slotIdx + 1}`}
              </span>
              <p className="text-[15px] font-bold text-[var(--c-ink)]">{card.text}</p>
            </div>

            {card.icon ? <span className="text-2xl">{card.icon}</span> : null}

            {interactive && cards.length > 1 ? (
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  disabled={slotIdx === 0}
                  onClick={() => move(slotIdx, slotIdx - 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--c-surface-sunk)] text-xs font-bold text-ink-soft disabled:opacity-20"
                  aria-label="Move up"
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={slotIdx === cards.length - 1}
                  onClick={() => move(slotIdx, slotIdx + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--c-surface-sunk)] text-xs font-bold text-ink-soft disabled:opacity-20"
                  aria-label="Move down"
                >
                  ▼
                </button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
